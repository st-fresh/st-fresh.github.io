function startTutorial() {
    var INTERVAL = 50;
    var _imagePaths = ["images/wave1.png", "images/wave2.png"];
    var _splash = OlySplash(initialize, _imagePaths);
    var _draw = false;
    var _up = 0;
    var _labelson;
    var _els = [];
    var _w1;
    var _w2;
    var _Integer = {
        MIN_VALUE:Number.MIN_VALUE
    };
    var _lastTimeStamp = 0;
    var _he = 0;
    var _le = 0;
    var _activeE1;
    var _activeE2;
    var activeE;
    var _state;
    var _active;
    var _activestate;
    var _screenEcanvas = MEUtil.upscaleCanvas("eScreen");
    var _screenWcanvas = MEUtil.upscaleCanvas("wScreen");
    var _eCtx = _screenEcanvas.getContext('2d');
    var _wCtx = _screenWcanvas.getContext('2d');
    var _labelA = document.getElementById("midTextA");
    var wave1 = new Image();
    var etron = new Image();
    var wave2 = new Image();

    function initialize() {
        imageInit();
        run();
    	MEUtil.raf(enterFrameHandler);
        _splash.fadeOut();
    }

    function run() { 
        initEls();
        changeState();
        startWave(1);
        
        _active = 1;
        _activestate = _state;
        _w2 = new Wave(0,false);
        _w2.x = _Integer.MIN_VALUE;
    }

    function initEls() {
        var upper = false;
        var found1 = false;
        var found2 = false; 
        var id = 0;
        var maxu = 0;
        var maxd = 0;
        var _up = 0;
        var down = 0;
        var ei = 0; 
        var e = null;
        var etemp = null;
        var activeE = 0;
    
        for(var i = 0;i < 5;i++) {
            upper = Math.random() > 0.5 ? true : false; 

            if(upper) { 
                _he++;
            }else {
                _le++;
            }
            
            id = Math.floor(Math.random()*4);
            ei = getNextIndex(_els,id);
            e = new Electron(i,90,ei,upper,20);
            _els.push(e); 
        } 
    }    

    function enterFrameHandler(timeStamp) { 
        if(timeStamp >= INTERVAL + _lastTimeStamp - 4) {
            update();
            _lastTimeStamp = timeStamp; 
        }                           
                                    
        MEUtil.raf(enterFrameHandler); 
    }

    function getNextIndex(v, index) {
        var e = null; 
        var ok = true;
    
        for(var i = 0;i < v.length;i++) {
            e = v[i];
            if(e.n == index) {
                ok = false;
            }
        }

        if(ok) {
            return index;
        }else {
            return getNextIndex(v, (index + 1)%5);
        } 
    }    

    function imageInit() {
        wave1.src = "images/wave1.png";
        wave2.src = "images/wave2.png";
        etron.src = "images/sphere.png";
    }

    function update() {
        if(!_draw) {   
            _draw = true;
            calculate();
            clearCanvas(); 

            if(_w1.isShowing()) {  
                drawWave(_w1);
            }
            if(_w2.isShowing()) {
                drawWave(_w2);
            }

            drawElectrons();
            drawLabels();
            _draw = false;
        }
    }

    function startWave(n) {
        var v = _els;
        var e = _els;
        var s = v.length; 
        var i = Math.floor((Math.random()*s)%s); 
        
        if(_state == 2) {
            for(j = 0;j < s;j++) {
                e = v[i % s];
                if((!e.falling) && !e.isMoving()) {
                    activeE = i;
                }else {
                    i = (i + 1)%s;
                }
            }
        }else {
            for(k = 0;k < s;k++) {
                e = v[i % s];
                if((e.falling) && !e.isMoving()) {
                    activeE = i;
                }else {
                    i = (i + 1)%s;
                }
            }
        } 

        e = v[activeE];             
        var stim = (_state != 0);   

        if (n == 1) {
            _w1 = new Wave(e.y + 3, stim); 
            _w1.x -= 15;                   
            _activeE1 = activeE;
        }else {
            _w2 = new Wave(e.y + 3, stim);
            _w2.x -= 15;
            _activeE2 = activeE;
        }
    }

    function clearCanvas() {
        _eCtx.clearRect(0, 0, _screenEcanvas.width, _screenEcanvas.height);
        _wCtx.clearRect(0, 0, _screenWcanvas.width, _screenWcanvas.height);
    }

    function drawLabels() {
        if(_labelson) {
            switch(_activestate) {
                case 0: 
                    _labelA.innerHTML = "Spontaneous Emission (Decay)";
                    break;
                case 1:
                    _labelA.innerHTML = "Stimulated Emission";
                    break;
                case 2:
                    _labelA.innerHTML = "Stimulated Absorption";
                    break;
            }

            TweenLite.set(_labelA, {alpha: 1});
            
        }else {
            TweenLite.set(_labelA, {alpha: 0});
        }
    }

    function drawWave(w) {  
        if(w.isDouble()) {
            var h = 5; 
            _wCtx.drawImage(_up ? wave1:wave2, 0, 0, wave1.width, wave1.height, w.x, w.y - h, 35, 15); 
            _wCtx.drawImage(_up ? wave1:wave2, 0, 0, wave1.width, wave1.height, w.x, w.y + h, 35, 15); 
        }else { 
            _wCtx.drawImage(_up ? wave1:wave2, 0, 0, wave1.width, wave1.height, w.x, w.y, 35, 15);
        }
    }

    function drawElectrons() {
        for(var i = 0;i < _els.length;i++) {
            e = _els[i];
            _eCtx.drawImage(etron,0, 0,etron.width, etron.height,
                e.x, e.y + (_up ? -1:0), 20, 20);
        }
        _up =! _up;
    }

    function calculate() {
        var v = _els;
        var e = _els;
        var s = _els.length;
        _w1.update();    
        e = v[_activeE1];

        if(_w1.x >= e.x && !_w1.isDone()) {
            e.move();
            if(_state == 0) {
                _w1.show();
                _he--;
                _le++;
            }else if(_state == 1) {
                _w1.show();
                _w1.dbl();
                _he--;
                _le++;
            }else if(_state == 2) {
                _w1.hide();
                _he++;
                _le--;
            }

            changeState(); 
            startWave(2);
        }
    
        if(_w2.x != _Integer.MIN_VALUE) {
            _w2.update();       
                                
            e = v[_activeE2];
    
            if(_w2.x >= e.x && !_w2.isDone()) {
                e.move();
                if(_state == 0) {
                    _w2.show();
                    _he--;
                    _le++;
                }
                
                else if(_state == 1) {
                    _w2.show();
                    _w2.dbl();
                    _he--;
                    _le++;
                }
                
                else if(_state == 2) {
                    _w2.hide();
                    _he++;
                    _le--;
                }
               
                changeState(); 
                startWave(1);
            }

            for(var j = 0;j < s;j++) {
                e = v[j];
                e.update(); 
            }
            
            if(_active == 1) {
                if(_w2.x == 95) {
                    _active = 2;
                    _activestate = _state;
                }
            }else {
                if(_w1.x == 95) {
                    _active = 1;
                    _activestate = _state;
                }
            }
        }

        if((_w2.x >= 100 && _w2.x <= 200) || (_w1.x >= 100 && _w1.x <= 200)) {
            _labelson = true;
        }else {
            _labelson = false;
        }
    }

    function changeState() {
        var r = Math.random(); 
   
        if(_he > _le) {
            if(r < 0.85 || _le <= 1) {
                _state = 1;
            }else {
                _state = 2;
            }
        }
        
        else if(_he <= 1) {
            _state = 2;
        }else {
            if(r < 0.6) {
                _state = 2;
            }else {
                _state = 0;
            }
        }
    }

    function Wave(y, stim) {
        var thatW = {};
        thatW.x = 0;
        thatW.y = y;
        var showing = stim;  
        var hidden =! stim;
        var showdbl = false;
        var done = false;
    
        thatW.update = function() {
            thatW.x+=5;
        }
    
        thatW.hide = function() {   
            showing = false;
            hidden = true;
            done = true;
        }
    
        thatW.show = function() {
            hidden = false;
            showing = true;
            done = true;
        } 

        thatW.dbl = function() {
            showdbl = true;
            done = true;
        }
    
        thatW.isShowing = function() {  
            return showing;
        }
    
        thatW.isHidden = function() {
            return hidden;
        }
    
        thatW.isDouble  = function() {
            return showdbl;
        }
    
        thatW.isDone = function() {
            return done;
        }
    
        return thatW;
    } 
    
    function Electron(number, xoffset, _i, high, d) {
        var that = {};
        that.x = xoffset + (d + 5)*number;
        that.y = 15 + (_i + 1)*5;
        that.n = _i;
        that.falling = false;
        var moving = false;
        var step = 0;
        
        if (high) {                
            that.falling = true;
        }else {
            that.y+=125;
        }
    
        that.move = function(){
            moving = true;
        }
    
        that.isMoving = function(){
            return moving;
        }
    
        that.isFalling = function(){
            return that.falling;
        }
    
        that.update = function() {
            if(moving) {               
                if(that.falling) {     
                    that.y += 5;
                    if(step >= 24) { 
                        moving = false;
                        that.falling = false;
                        step = 0;
                    }               
                }else {
                    that.y -= 5;
                    if(step >= 24){
                        moving = false;
                        that.falling = true;
                        step = 0;
                    }
                }
    
                if(moving) {
                    step++;
                }
            }   
        }
    
        return that;    
    }
}
// \/ NO TOUCHY \/
$(document).ready(startTutorial);