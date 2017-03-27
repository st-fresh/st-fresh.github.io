function startTutorial() {

    var _slider = new OlySlider("slider");
    var _imagePaths = [];
    var _splash = OlySplash(initialize);
    var _angle = document.getElementById("angleRead");
    var _canvas = document.getElementById("mainCan");
    var ctx = _canvas.getContext("2d");
    var width = 330;
    var filter_x = 80;
    var filter_y = 15;
    var x0 = filter_x + 12; 
    var x1 = filter_x + 38;
    var y1 = filter_y + 60;
    var ia = 0.0;
    var phase = 0;
    var nm_pass; 
    var waveVector = []; 
    var RADIANS = Math.PI/180.0; 
    var prct = 0.0;
    var rgb = null;
    var hue = 0;
    var red = null;
    var r = 0;
    var g = 0;
    var b = 0;
    var p1 = 0;
    var _lastTime = Date.now();
    var CALC_INTERVAL = 42;
    var peakWave = document.getElementById("peak"); 
    
    function initialize() {
        MEUtil.upscaleCanvas("mainCan");
        _slider.setPosition(1);
        setInterval(calculate, 16);
        MEUtil.raf(enterFrameHandler);
        _splash.fadeOut();
    }
    
    function enterFrameHandler(timeStamp) {
        if (_slider.hasChanged) {
            _slider.hasChanged = false;
            _angle.innerHTML = ("Incident Angle:  " + Math.round(_slider.getPosition(0, 20)) + "&deg");
            updatePositions();
        }
        update();
        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
    }
    
    function updatePositions() {
        var yLocA = _slider.getPosition(93, 180);
        var yLocB = _slider.getPosition(93, 233);
        var ref = document.getElementById("reflected").style;  
        var trans = document.getElementById("transmitted").style; 
        ref.top = yLocA + 'px';
        trans.top = yLocB + 'px'; 
    }

    function update() {
        ctx.clearRect(0, 0, 330, 290);
        drawRays();

        if(_slider.getPosition != 1 || _slider.getPosition != 0) {
            peakWave.innerHTML = nm_pass + " nm";
        }else { 
            peakWave.innerHTML = nm_pass-1 + " nm";
        }
    }
    
    function Wave(_p0, _p1, _size, _freq, _phase, _color) {
        var waveData = {};
        waveData.p0 = _p0;
        waveData.p1 = _p1;
        waveData.size = _size;
        waveData.freq = _freq;
        waveData.phase = _phase;
        waveData.color = _color;
        return waveData;
    }
    
    function Point(_x, _y) { 
        return {
            x : _x,
            y : _y
        };
    }
    
    function calculate() {
        var now = Date.now();
        var dt = now - _lastTime;
        var mod = dt / CALC_INTERVAL;
        _lastTime = now;
        ia = _slider.getPosition()*20; 
        phase = (phase - (10 * mod)) % 360;
        var n = 1.7;
        var t = 140;
        var m = 1;
        var p = (ia * 0.065) / (2 * Math.PI);
        nm_pass = Math.floor((2 * n * t * myCos(ia)) / (m - p)); //filled
        nm_pass += 150; 
    }
    
    function drawRays() {
        var size = 10; 
        var freq = 8;
        var white = [240, 238, 72]; 
        var pass = getColor(nm_pass);
        var myBlue = [0, 0, 255]; 
        var lx_inside = 0; 
        var lx_top = 0; 
        var lx_bottom = 0; 
        var ty = Math.floor(y1 - x0 * myTan(ia));
     
        ctx.strokeStyle = arrayToColor(white);
        drawSine(x0, y1, 0, ty, size, freq, -phase);
    
        var ly_top = (y1 + (x1 - x0) * myTan(ia));
        var p1 = drawSine(x0, y1, x1, ly_top, size, freq, phase);
        var p2 = 0;
        var y = ly_top;
        var dy = ly_top - y1;

        ctx.strokeStyle = arrayToColor(pass);
        
        p1 = drawSine(x1, y, width, y + ((width - x1) * myTan(ia)), size, freq, phase);
        waveVector.push(Wave(Point(x1, y), Point(width, y + ((width - x1) * myTan(ia))), 
            size, freq, phase, arrayToColor(pass)));
        ctx.strokeStyle = arrayToColor(white);
    
        for (var i = 0; i < 3; i++) {
            p1 += drawSine(x1, y, x0, y += dy, size, freq, phase + p1);
            var white2 = [255, 255, 255]; 
            var nextWhite = colorMix(white, white2, 0.65); 
            var nextBlue = colorMix(myBlue, white2, 0.65);
            ctx.strokeStyle = arrayToColor(nextBlue);
            drawSine(x0, y, 0, y + Math.floor(x0 * myTan(ia)), size, freq, 
                phase + Math.floor(i * (dy + 4) * Math.tan(ia * RADIANS) / (0.52 * RADIANS)));
            ctx.strokeStyle = arrayToColor(white);
    
            p1 += drawSine(x0, y, x1, y += dy, size, freq, phase + p1);
            white = nextWhite;
            myBlue = nextBlue;
            pass = colorMix(pass, white2, 0.5);
            waveVector.push(Wave(Point(x1, y), Point(width, y + Math.floor((width - x1) * myTan(ia))), size, freq, 
                phase + Math.floor((i + 1) * dy * Math.tan(ia * RADIANS) / (4 * RADIANS)), arrayToColor(pass)));
        }

        for (i = waveVector.length - 1; i >= 0; i--) {
            var wave = waveVector[i]; 
            ctx.strokeStyle = wave.color; 
            drawSine(wave.p0.x, wave.p0.y, wave.p1.x, wave.p1.y, wave.size, wave.freq, wave.phase);
        } 

        waveVector = []; 
    }
    
    function colorMix(a, b, v) {
        var color = [];

        for (var i = 0, l = a.length; i < l; i++) {
            color[i] = Math.round(a[i] * v + b[i] * (1-v));
        }

        return color;
    }
    
    function getColor(nm) {
        if (nm < 380) {
            if(nm < 130) {
                nm = 130;
            }

            prct = Math.floor((nm - 130) / 250);
            r = Math.floor((-130 * prct *prct) + (385 * prct));
            g = 0;
            b = Math.floor((-142 * prct * prct) + (371 * prct));
            rgb = [r, g, b];
                
            return rgb;
        }
    
        else if (nm < 626) {
            prct = Math.floor((nm - 380) / (630 - 380));
            hue = Math.floor(prct * (1 - 0.15) + 0.15);
            hue = 1 - hue; 

            return hslToRgb(hue,1,1); 
        }
    
        else if (nm < 700) {
            red = [255, 0, 0];

            return red;
        }
        

        if (nm > 1500) {
            nm = 1500;
        }
        
        prct = Math.floor((nm - 700) / 800);
        r = Math.floor(255 * (1 - prct));
        g = Math.floor((0.5 - Math.abs(prct - 0.5)) * 2 * 50);
        b = 0;
        rgb = [r, g, b];

        return rgb;
        }
    
    
    
    function myTan(deg) {
    
        return Math.tan(deg * Math.PI / 180);
    }
    
    function mySin(deg) {
            
        return Math.sin(deg * Math.PI / 180);
    }
    
    function myCos(deg) {
        return Math.cos(deg * Math.PI / 180);
    }
    
    function hslToRgb(h, s, l) {
        var r = 0;
        var g = 0;
        var b = 0;
        
        if (s == 0) {
            r = g = b = l; 
        }else {
            function hue2rgb(p, q, t) {
                if (t < 0) {t = t + 1;}
                if (t > 1) {t = t - 1;}
                if (t < 1/6) {return p + (q - p) * 6 * t;}
                if (t < 1/2) {return q;}
                if (t < 2/3) {return p + (q - p) * (2/3 - t) * 6;}
        
                return p;
        }
        
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
     
      return [ r * 255, g * 255, b * 255 ];
    }
    
    function drawSine(x1, y1, x2, y2, yscale, wavelength, phase) {
        var startx = 0.0;
        var starty = 0.0;
        var prev_x = -9.0;
        var prev_y = 0.0;
        var rot_ang = Math.atan(-(y2 - y1) / (x2 - x1)) * 180 / Math.PI; 
        
        if (x2 < x1) {
            rot_ang += 180;
        }
        
        var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var xpos =  0.0;
        var ypos =  0.0;
        var basex = 0.0;
        var basey = 0.0;
        var newx =  0.0;
        var newy =  0.0;
        var newbx = 0.0;
        var newby = 0.0;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.moveTo(x1, y1 + 1);
        ctx.lineTo(x2, y2 + 1);
    
        var cosAng = myCos(rot_ang);
        var sinAng = mySin(rot_ang);

        for (var i = 0; i < dist; i += 3) {
            xpos = i;
            ypos = yscale * mySin(phase + xpos * wavelength);
            basex = xpos;
            basey = 0;
            newx = xpos * cosAng - ypos * sinAng;
            newy = xpos * sinAng + ypos * cosAng;
            newbx = basex * cosAng - basey * sinAng;
            newby = basex * sinAng + basey * cosAng;
            
            if (prev_x != -9) {
                ctx.moveTo((x1 + newx), (y1 - newy));
                ctx.lineTo((x1 + prev_x), (y1 - prev_y));
            }else{
                startx = x1 + newbx;
                starty = y1 - newby;
            }

            prev_x = newx;
            prev_y = newy;
            
            if (i % 3 == 0) {
                ctx.moveTo((x1 + newx), (y1 - newy));
                ctx.lineTo((x1 + newbx), (y1 - newby));
            }            
        }
        ctx.stroke();

        return wavelength * i;    
    }
    
    function arrayToColor(arr) {
        return "rgb(" + arr.join(",") + ")";
    }
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);