function startTutorial() {
    var _imagePaths = ["images/sprite.png", "images/sepMain.png", "images/cMain.png", "images/mMain.png", "images/yMain.png", "images/kMain.png"];
    var _splash = OlySplash(initialize, _imagePaths);
    var _canvas = MEUtil.upscaleCanvas("jjCan", 1);
    var _blankCan = null;
    var mtx = _canvas.getContext("2d");
    var sepCan = document.createElement("canvas");
    var imageData;

    var CW = 315;
    var CH = 345;
    var WI = 150;
    var HI = 105;
    var _stX = [1, 155, 1, 155, 155]; 
    var _stY = [0, 0, 110, 110, 220];
    var rect = [];
    var pixels = [];
    var blankPix  = [];
    var canvasState = null;

    function initialize() {
        initRectangles();

        cutSheet(function() {
            startUp();            
            MEUtil.raf(enterFrameHandler);
            _splash.fadeOut();
        });
    }

    function initRectangles() {
        rect[4] = new Rectangle(1, 0, WI, HI, "images/sepMain.png");
        rect[3] = new Rectangle(CW - 155, 0, WI, HI, "images/cMain.png");
        rect[0] = new Rectangle(1, (CH - 111)/2, WI, HI, "images/mMain.png");
        rect[1] = new Rectangle(CW - 155, (CH - 111)/2, WI, HI, "images/yMain.png");
        rect[2] = new Rectangle((CW - 155)/2, CH - (106 + 5), WI, HI, "images/kMain.png");
    }

    function cutSheet(callback) {
        var sprite = new Image();

        sprite.onload = function() {
            sepCan.width = this.width;
            sepCan.height = this.height;
            var stx = sepCan.getContext("2d");
            stx.drawImage(this,0,0);
            imageData = stx.getImageData(0, 0, sepCan.width, sepCan.height);
            callback();
        }
        sprite.src = "images/separation.jpg";
    }

    function Rectangle(x, y, width, height, src) {
        this.x   = x; 
        this.y   = y; 
        this.w   = width;
        this.h   = height;
        this.can = MEUtil.createCanvas(width, height, 1);
    }

    Rectangle.prototype.contains = function(mx, my) {
        return (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
    }       
    
    function CanvasState(canvas) {
        this.canvas = canvas;
        this.width  = canvas.width;
        this.height = canvas.height;
        this.ctx    = canvas.getContext("2d");
        var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

        if (document.defaultView && document.defaultView.getComputedStyle) {
            this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
            this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
            this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
            this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
        }

        var html      = document.body.parentNode;
        this.htmlTop  = html.offsetTop;
        this.htmlLeft = html.offsetLeft;

        this.valid     = false;
        this.shapes    = [];
        this.dragging  = false;
        this.selection = null
        this.dragoffx  = 0; 
        this.dragoffy  = 0;

        _canvas.addEventListener('selectstart',
            function(e) {
                e.preventDefault(); 
                return false; 
            }, false);
    
        _canvas.addEventListener('mousedown', 
            function(e) {
             onDown(e.pageX, e.pageY);
            }, true);

        _canvas.addEventListener('mousemove', 
            function(e) {
             onMove(e.pageX, e.pageY);
            }, true);

        _canvas.addEventListener('mouseup', 
            function(e) {
                onUp();
            }, true);
    }

    CanvasState.prototype.addShape = function(shape) {
        this.shapes.push(shape);
        this.valid = false;
    }

    CanvasState.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    CanvasState.prototype.draw = function() {
        this.clear();

        preparePaint();
        
        this.valid = true;

        if (this.selection != null) {
            var mySel = this.selection;
        }
    }

    CanvasState.prototype.getRelativeLocation = function(x, y) { 
        var element = this.canvas;
        var offsetX = 0;
        var offsetY = 0;
        var mx      = 0;
        var my      = 0;

        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
        offsetY += this.stylePaddingTop  + this.styleBorderLeft + this.htmlTop;
        mx = x - offsetX;
        my = y - offsetY;

        return {x: mx, y: my};
    }

    function initImages() {
        for (var i = 0; i < canvasState.shapes.length; i++) {
            var shape = canvasState.shapes[i];
            canvasState.shapes[i].draw(mtx);
        }
    }

    function onDown(x, y) { 
        var mouse  = canvasState.getRelativeLocation(x, y); //returns object {x: mx, y:my}, so mouse.x = mx, and mouse.y = my
        var mx     = mouse.x;
        var my     = mouse.y;
        var shapes = canvasState.shapes;
        var l      = shapes.length;
    
        for (var i = l - 1; i >= 0; i--) {
            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i]; 
                canvasState.dragoffx  = mx - mySel.x;                    
                canvasState.dragoffy  = my - mySel.y;
                canvasState.dragging  = true;
                canvasState.selection = mySel;
                canvasState.valid     = false;

                return;
            }
        }

        if (canvasState.selection) {
            canvasState.selection = null;
            canvasState.valid = false;
        }
    }

    function onMove(x, y) {
        if (canvasState.dragging) {
           var mouse = canvasState.getRelativeLocation(x, y);
           canvasState.selection.x = mouse.x - canvasState.dragoffx;
           canvasState.selection.y = mouse.y - canvasState.dragoffy;
           var csx = mouse.x - canvasState.dragoffx;
           var csy = mouse.y - canvasState.dragoffy;

            for (var i = 0; i < 4; i++) {
                if (Math.abs(canvasState.selection.x - rect[i].x) <= 5) {
                    canvasState.selection.x = rect[i].x;
                }
                if (Math.abs(canvasState.selection.y - rect[i].y) <= 5) {
                    canvasState.selection.y = rect[i].y;
                }
    
                if (csx < 0) {
                    csx = 0;
                    canvasState.selection.x = csx;
                } else if (csx > 165) {
                    csx = 165;
                    canvasState.selection.x = csx;
                }          
                if (csy < 0) {
                    csy = 0;
                    canvasState.selection.y = csy;
                } else if (csy > 240) {
                    csy = 240;
                    canvasState.selection.y = csy;
                }   
            
                canvasState.valid = false;     
            }
        }
    }

    function onUp() {
        canvasState.dragging = false;
    }

    function startUp() {
        canvasState = new CanvasState(_canvas);

        canvasState.addShape(rect[0]);
        canvasState.addShape(rect[1]);
        canvasState.addShape(rect[2]);
        canvasState.addShape(rect[4]);
        canvasState.addShape(rect[3]);

        _blankCan     = MEUtil.createCanvas(CW, CH, 1);
        var ctx       = _blankCan.getContext("2d");
        ctx.fillStyle = 'white';

        ctx.fillRect(0, 0, CW, CH);

        pixels = imageData.data;

        _canvas.addEventListener("touchstart", touchDown, false);
        _canvas.addEventListener("touchmove", touchMove, true);
        _canvas.addEventListener("touchend", touchUp, false);
        document.body.addEventListener("touchcancel", touchUp, false);
    }
  
    function touchUp() { 
        onUp();
    }

    function touchDown(e) {
        onDown(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        touchMove();
    }

    function touchMove(e) {
        if (!e) {
            var e = event;
        }

        e.preventDefault();
        onMove(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }

    function preparePaint() {
        var w = sepCan.width;
        var h = sepCan.height;

        var blankPix = _blankCan.getContext("2d").getImageData(0, 0, CW, CH);
        var data     = blankPix.data;

        for (var n = 0; n < 5; n++) {
            var y_offst  = _stY[n]*4;
            var x_offst  = _stX[n]*4;
            var y_offst2 = Math.round(rect[n].y*4);
            var x_offst2 = Math.round(rect[n].x*4);

            for (var i = 0; i < HI*4; i += 4) {
                for (var j = 0; j < WI*4; j += 4) {
                    var m  = (y_offst + i)*w + (x_offst + j);
                    var r1 = pixels[m];
                    var g1 = pixels[m + 1];
                    var b1 = pixels[m + 2];

                    var k  = (y_offst2 + i)*CW + (x_offst2 + j);
                    var r2 = data[k];
                    var g2 = data[k + 1];
                    var b2 = data[k + 2];

                    var r = (r1 * r2) >> 8; // or /256
                    var g = (g1 * g2) >> 8; 
                    var b = (b1 * b2) >> 8;

                    data[k]     = r;
                    data[k + 1] = g;
                    data[k + 2] = b;
                    data[k + 3] = 255;//pixels[m + 3];
                }
            }
        }
        mtx.putImageData(blankPix, 0, 0, 0, 0, 315, 345);
    }

    function enterFrameHandler(timeStamp) {
        if (!canvasState.valid) {
            canvasState.draw();
        }
        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
    }
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);