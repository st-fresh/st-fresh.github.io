function startTutorial() {
    var _imagePaths = ["images/spectrum.jpg"];
    var _gridWidth  = 572;
    var _gridHeight = 238;
    var _splash  = OlySplash(initialize, _imagePaths);
    var chart    = new Image();
    var spectrum = new Image();
    var strumCan = createCanObject("strumCan", "images/spectrum.jpg");
    var destCan  = createCanObject("cursor");
    var touchArea = document.getElementById("touchArea");
    var cursor   = {
        can       : MEUtil.createCanvas(12, 12),
        imageData : null
    };
    var linesCan       = createCanObject("linesCan");
    var ghostImageData = null;
    var data           = null;
    var isDragging = false;
    var cBox       = document.getElementById("colorBox");
    var bireLabel  = document.getElementById("bire");
    var thickLabel = document.getElementById("thick");
    var diffLabel  = document.getElementById("pdiff");
    var orderLabel = document.getElementById("order");
    var bx         = 105;
    var by         = 119;
    var colorBoundaries = [0, 93, 191, 290, 389, 487, 580];
    var birefringence   = [.001, .005, .01, .015, .02, .025, .03, .035, .04, .045, .05, .055, .065, .07, .08, .09, .12, .16];
    var orderNames      = [];
    var labels          = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];

    var controls = [
    [new Point(9, 0), new Point(5, 82)],          //.001
    [new Point(52, 0), new Point(34, 82)],        //.005
    [new Point(104, 0), new Point(68, 82)],       //.01
    [new Point(155, 0), new Point(102, 82)],      //.015
    [new Point(207, 0), new Point(137, 82)],      //.02
    [new Point(263, 0), new Point(174, 82)],      //.025
    [new Point(312, 0), new Point(206, 82)],      //.03
    [new Point(368, 0), new Point(243, 82)],      //.035
    [new Point(417, 0), new Point(278, 82)],      //.04
    [new Point(454, 0), new Point(301, 82)],      //.045
    [new Point(506, 0), new Point(335, 82)],      //.05
    [new Point(563, 0), new Point(370, 82)],      //.055
    [new Point(571, 41), new Point(455, 82)],     //.065
    [new Point(571, 78), new Point(451, 113)],    //.07
    [new Point(571, 97), new Point(451, 127)],    //.08
    [new Point(571, 111), new Point(206, 193)],   //.09
    [new Point(571, 153), new Point(206, 209)],   //.12
    [new Point(571, 175), new Point(101, 228)]];  //.16

    var thickness = [
    new Point(0, 0.06),
    new Point(41, 0.05),
    new Point(81, 0.04),
    new Point(119, 0.03),
    new Point(159, 0.02),
    new Point(200, 0.01),
    new Point(237, 0)];

    var pathDifference = [
    new Point(0, 0),
    new Point(16, 100),
    new Point(46, 300),
    new Point(76, 500),
    new Point(104, 565),
    new Point(131, 700),
    new Point(159, 900),
    new Point(190, 1130),
    new Point(224, 1300),
    new Point(259, 1500),
    new Point(293, 1690),
    new Point(330, 1900),
    new Point(365, 2100),
    new Point(401, 2265),
    new Point(437, 2500),
    new Point(472, 2700),
    new Point(509, 2820),
    new Point(546, 3100),
    new Point(571, 3300)];

    var drawToArray = [
    new   Point(9, 1),
    new  Point(22, 1),
    new  Point(31, 1),
    new  Point(43, 1),
    new  Point(53, 1),
    new  Point(65, 1),
    new  Point(74, 1),
    new  Point(84, 1),
    new  Point(95, 1),
    new Point(108, 1),
    new Point(118, 1),
    new Point(126, 1),
    new Point(136, 1),
    new Point(148, 1),
    new Point(158, 1),
    new Point(169, 1),
    new Point(179, 1),
    new Point(188, 1),
    new Point(200, 1),
    new Point(210, 1),
    new Point(220, 1),
    new Point(232, 1),
    new Point(244, 1),
    new Point(253, 1),
    new Point(265, 1),
    new Point(275, 1),
    new Point(285, 1),
    new Point(295, 1),
    new Point(307, 1),
    new Point(314, 1),
    new Point(326, 1),
    new Point(340, 1),
    new Point(350, 1),
    new Point(362, 1),
    new Point(371, 1),
    new Point(382, 1),
    new Point(390, 1),
    new Point(404, 1),
    new Point(411, 1),
    new Point(422, 1),
    new Point(435, 1),
    new Point(434, 1),
    new Point(444, 1),
    new Point(459, 1),
    new Point(469, 1),
    new Point(478, 1),
    new Point(488, 1),
    new Point(500, 1),
    new Point(510, 1),
    new Point(520, 1),
    new Point(532, 1),
    new Point(545, 1),
    new Point(553, 1),
    new Point(567, 1),
    new Point(572, 1),
    new Point(572, 9),
    new Point(572, 11),
    new Point(572, 19),
    new Point(572, 24),
    new Point(572, 28),
    new Point(572, 42),
    new Point(572, 59),
    new Point(572, 69),
    new Point(572, 81),
    new Point(572, 100),
    new Point(572, 115),
    new Point(572, 157),
    new Point(572, 180)
    ]; 

    function initialize() {
        spectrum.src = "images/spectrum.jpg";
        drawGrid();

        for (var i = 0; i < 6; i++) {
            orderNames[i] = labels[0 + i];  
        }

        updateLabels(114, 131);

        strumCan.initImageData();

        for (var i = 0; i < 6; i++) {
            orderNames[i] = labels[0 + i];
        }

        var circTX = cursor.can.getContext("2d");
        var cW = $(cursor.can).width();
        var cH = $(cursor.can).height();
        circTX.fillStyle = "white";
        circTX.beginPath();
        circTX.arc(cW/2, cH/2, MEUtil.PIXEL_RATIO > 1 ? 3.25 : 3, 0, Math.PI*2); 
        circTX.fill();
        circTX.globalCompositeOperation = 'xor';
        circTX.beginPath();
        circTX.arc(cW/2,cH/2, MEUtil.PIXEL_RATIO > 1 ? 1.25 : 1.5, 0, Math.PI*2); 
        circTX.fill();
        cursor.imageData = circTX.getImageData(0,0,cursor.can.width, cursor.can.height);
        var dctx = destCan.can.getContext("2d");
        dctx.putImageData(cursor.imageData, 0,0);

        setTimeout(function() {
            mixData(111, 131);
        }, 1000);
       
        touchArea.addEventListener("touchstart", touchDown, false);
        touchArea.addEventListener("touchmove", touchMove, true);
        touchArea.addEventListener("touchend", touchUp, false);
        document.body.addEventListener("touchcancel", touchUp, false);

        touchArea.addEventListener('mousedown',
            function(e) {
               onDown(e.pageX, e.pageY);
            }, true);

        touchArea.addEventListener('mousemove',
            function(e) {
                onMove(e.pageX, e.pageY);
            }, true);

        document.addEventListener('mouseup',
            function(e) {
                onUp();
            }, true);

    	MEUtil.raf(enterFrameHandler);
        _splash.fadeOut();
    }

    function drawGrid() {
        var ltx  = linesCan.can.getContext("2d");
        var offX = 6;
        var offY = 6;
        var lw = _gridWidth/33;
        var lh = _gridHeight/6;
        var weight = 1;
        var rad = 35;
        ltx.lineWidth = weight;
        ltx.save();
        ltx.translate(offX, offY);

        ///DRAW RAYS
        ltx.beginPath();
        for (var k = 0; k < drawToArray.length; k++) {
            ltx.moveTo(0, _gridHeight);
            ltx.lineTo(drawToArray[k].x, drawToArray[k].y); 
        }
        ltx.stroke();

        //MASK RAYS
        ltx.save();
        ltx.globalCompositeOperation = "destination-out";
        ltx.beginPath();
        ltx.arc(0, _gridHeight - (weight/2), rad, Math.PI, Math.PI*1.5, true);
        ltx.closePath();
        ltx.fill();
        ltx.restore();

        //FILL GRID LINES & BORDERS
        ltx.fillStyle = '#000000';
        for (var i = 0; i < _gridWidth; i += lw) {
            ltx.fillRect(Math.round(i), 0, weight, _gridHeight);
        }
        ltx.fillRect(_gridWidth, 0, weight, _gridHeight + weight);

        for (i = 0; i < _gridHeight; i += lh) {
            ltx.fillRect(0, Math.round(i), _gridWidth, weight);
        }
        ltx.fillRect(0, _gridHeight, _gridWidth, weight);

        //STROKE ARC
        ltx.beginPath();
        ltx.moveTo(rad, _gridHeight);
        ltx.arcTo(rad, _gridHeight - rad, 0, _gridHeight - rad, rad);
        ltx.stroke();
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    function mixData(x, y) {
        x > 576 ? x = 576 : x = x;
        x < 12  ? x = 12  : x = x;
        y > 242 ? y = 242 : y = y;
        y < 12  ? y = 12  : y = y;

        var w = cursor.can.width;
        var h = cursor.can.height;
        var dW = $(cursor.can).width();
        var dH = $(cursor.can).height();
        var rat = MEUtil.PIXEL_RATIO;
        var offset = {
            x : x * rat - 10 * rat,
            y : y * rat - 10 * rat,
        };
        var dctx = destCan.can.getContext("2d");
        var dImageData = dctx.createImageData(w, h); 
        var lImageData = linesCan.can.getContext("2d").getImageData(offset.x, offset.y, w, h);
        var sImageData = strumCan.can.getContext("2d").getImageData(offset.x, offset.y, w, h);
        var dData = dImageData.data;
        var sData = sImageData.data;
        var lData = lImageData.data;
        var cData = cursor.imageData.data;
        var l = sData.length;
        var r1, g1, b1;
        var ca;
        var la; 
       
        for (var j = 0; j < l; j += 4) {
            la = lData[j + 3];
            r1 = Math.abs(lData[j]*la/255 - sData[j]) | 0;
            g1 = Math.abs(lData[j + 1]*la/255 - sData[j + 1]) | 0;
            b1 = Math.abs(lData[j + 2]*la/255 - sData[j + 2]) | 0;
            ca = cData[j + 3];

            if (ca == 0) {
                sData[j + 3] = 0; //removed box forming behind circle
            }else if (la > 0) {
                sData[j] = sData[j + 1] = sData[j + 2] = la;

            }else  {
                sData[j]     = Math.abs(r1 - cData[j]    *ca/255) | 0;
                sData[j + 1] = Math.abs(g1 - cData[j + 1]*ca/255) | 0;
                sData[j + 2] = Math.abs(b1 - cData[j + 2]*ca/255) | 0;
            }
        }
        var icString = "rgb("+sData[l-4]+","+sData[l-3]+","+sData[l-2]+")";
        cBox.style.backgroundColor = icString;
        dctx.clearRect(0, 0, destCan.can.width, destCan.can.height);
        dctx.putImageData(sImageData, offset.x, offset.y);
    }

    function createCanObject(id, imagepath) { 
        return {
            can           : MEUtil.upscaleCanvas(id),
            imageData     : null,
            imagePath     : imagepath,
            initImageData : function() {
                var img  = new Image();
                var that = this;
                img.onload = function() {
                    var ctx = that.can.getContext("2d");
                    ctx.drawImage(this, 6, 6, this.width, this.height);
                    that.imageData = ctx.getImageData(0, 0, that.can.width, that.can.height);
                };

                img.src = this.imagePath;
                }
        };
    }

    function getRelativeLocation(x,y) { 
        var element = destCan.can;
        var offsetX = 0;
        var offsetY = 0;
        var mx      = 0;
        var my      = 0;
        var stylePaddingLeft = 0;
        var stylePaddingTop  = 0;
        var styleBorderLeft  = 0;
        var styleBorderTop   = 0;

        if (document.defaultView && document.defaultView.getComputedStyle) {
            stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(destCan.can, null)['paddingLeft'], 10)     || 0;
            stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(destCan.can, null)['paddingTop'], 10)      || 0;
            styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(destCan.can, null)['borderLeftWidth'], 10) || 0;
            styleBorderTop   = parseInt(document.defaultView.getComputedStyle(destCan.can, null)['borderTopWidth'], 10)  || 0;
        }

        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        offsetX += stylePaddingLeft + styleBorderLeft;
        offsetY += stylePaddingTop  + styleBorderLeft;
        mx = x - offsetX;
        my = y - offsetY;

        return {x: mx, y: my};
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

    function onDown(x, y) {
        var mouse  = getRelativeLocation(x,y);
        var mx     = mouse.x;
        var my     = mouse.y;
        if (mx > 580) { mx = 580; }
        updateLabels(mx, my);
        mixData(mx, my);
        isDragging = true;
    }

    function onMove(x, y) {
        if (!isDragging) { return; }
        var mouse  = getRelativeLocation(x,y);
        var mx     = mouse.x;
        var my     = mouse.y;
        if (mx > 580) { mx = 580; }
        updateLabels(mx, my);
        var dctx = destCan.can.getContext("2d");
        dctx.clearRect(0,0, destCan.can.width, destCan.can.height);
        mixData(mx, my);
    }

    function onUp() {
        isDragging = false;
    }

    function updateLabels(x,y) {
        bx = Math.min(580, Math.max(0, x - 41)) +32 ;
        by = Math.min(237, Math.max(0, y - 38)) +25 ;
        var p1;
        var p2;
        var fx;
        var fy;
        var u;
        var d;
        var min_d = Number.MAX_VALUE;
        var dx;
        var dy;
        var min_index = 0;

        for (var i = 0; i < controls.length; i++) {
            p1 = controls[i][0];
            p2 = controls[i][1];
            dx = p2.x - p1.x;
            dy = p2.y - p1.y;
            d = Math.sqrt(dx * dx + dy * dy);
            u = ( (bx - p1.x) * (p2.x - p1.x) + (by - p1.y) * (p2.y - p1.y) ) / (d * d);
            fx = p1.x + u * (p2.x - p1.x);
            fy = p1.y + u * (p2.y - p1.y);
        
            if (fx >= 0 && fx < 572) { 
                dx = bx - fx;
                dy = by - fy;
                d = Math.sqrt(dx * dx + dy * dy);
                
                if (d < min_d) {
                    min_d = d;
                    min_index = i;
                }
            }
        }
        
        var order_index = 0;

        for (var i = 0; i < colorBoundaries.length - 1; i++) { 
            if (bx >= colorBoundaries[i] && bx <= colorBoundaries[i + 1]) {
                order_index = i;
                break;
            }
        }
        
        var thickness_index = 0;
        
        for (var i = thickness.length - 1; i > 0; i--) { 
                if (by <= thickness[i].x && by >= thickness[i - 1].x) {
                    thickness_index = i; 
                    break;
                }
        }
        var thick_value = thickness[thickness_index].y 
            + (thickness[Math.abs(thickness_index - 1)].y - thickness[thickness_index].y)
            * (by - thickness[thickness_index].x) / (thickness[Math.abs(thickness_index - 1)].x - thickness[thickness_index].x);
        
        bireLabel.innerHTML = (birefringence[min_index] * 1000) / 1000; // ,t ??

        if (thick_value < 0.01) {
            thickLabel.innerHTML = (Math.floor(thick_value * 1000) / 1000).toFixed(2) + " mm"; 
        } else {
            thickLabel.innerHTML = (Math.floor(thick_value * 100) / 100).toFixed(2) + " mm";
        }
        
        var path_index = 0;
        
        for (var i = 0; i < pathDifference.length - 1; i++) {
            if (bx >= pathDifference[i].x && bx <= pathDifference[i + 1].x) {
                path_index = i;
                break;
            }
        }

        bx = Math.min(571, Math.max(0, x - 9));
        by = Math.min(237, Math.max(0, y - 38));
        var path_value = pathDifference[path_index].y 
            + (pathDifference[path_index + 1].y - pathDifference[path_index].y) 
            * (bx - pathDifference[path_index].x) / (pathDifference[path_index + 1].x - pathDifference[path_index].x);
        
        var newDiffVal = Math.floor(path_value);

        if (newDiffVal > 3300) {
            newDiffVal = 3300;   
        } else if (newDiffVal < 0) {
            newDiffVal = 0;
        }

        diffLabel.innerHTML = newDiffVal + " nm";
        orderLabel.innerHTML = orderNames[order_index] + " Order";
    }

    function enterFrameHandler(timeStamp) {
        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
        }
}

// \/ NO TOUCHY \
$(document).ready(startTutorial);
