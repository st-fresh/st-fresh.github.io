	// Graphics gr;
	// protected Thread thread;
	var _draw;
	var _loading; //booleans
	var _width;
	var _height; //numbers
	// FontMetrics fm;
	// JavaSplash splash;

// Image screen; //replaced with canvas element declarations
//Image e_pic, w_pic1, w_pic2;
 var e_pic = $("#electron"); //usage: e_pic = getImage(...images/sphere.gif)
 var w_pic1 = $("#wave1");
 var w_pic2 = $("#wave2");
//boolean up, labelson;
var _up, _labelson; //booleans
//Vector els; 
 var _els = new Array(10); //usage: else = new Vector(); Vector is array size 10? check docs.oracle.com
//Wave w1,w2; 
 var _w1; //objects of Wave class
 var _w2; 
 // var x, y, i; //from class Wave
 var _Integer = {
 	MIN_VALUE:Number.MIN_VALUE
 };
	var _activeE1, _activeE2;
	var _state; // 0 is spontaneous emission, 1 is stimulated emission, 2 is stimulated absorption
	var _he,_le; // high electrons, low electrons
	var _active, _activestate; // trackers for drawing labels

	var _screen_eCanvas = $('#eScreen'); //grab electron canvas
	var _screen_wCanvas = $('#wScreen'); //grab wave canvas
	var _eCtx = _screen_eCanvas.getContext('2d'); 
	var _wCtx = _screen_wCanvas.getContext('2d');
	var _labelA = $('#midTextA');
	var _labelB = $('#midTextB');
	var _labelC = $('#midTextC');

function run(){ //put in init
	//images already on canvas through html
		initEls();
		changeState();
		startWave(1);
		_active = 1;
		_activestate = _state;
		_w2 = new Wave(0,false);
		_w2.x = _Integer.MIN_VALUE; //that.x from Wave() which returns that{that.x:0}
		
}

function startWave(n) { //recieves int n
	var e = new Electron();
	var i = Math.floor((Math.random()*5)%5); //random number between 0 and 1
	var activeE = -1;
	var s = _els.length; //size()?? in java = length() in js?? also els is Vector in java
						//which is empty array size 10 according to docs.oracle.com
	if(_state == 2){
		do{
			e = _els[i % s];
			if((!e.falling) && !e.isMoving()) {
				activeE = i;
			}else {
				i = (i + 1)%5;
			}
		  }while(activeE == -1);
	}else {
		do {
			e = _els[i % s];
			if((e.falling) && !e.isMoving()) {
				activeE = i;
			}else {
				i = (i + 1)%5;
			}
		   }while(activeE == -1); 
	}

	e = _els[activeE];
	var stim = (_state != 0); //terinary if-statement

	if(n == 1) {
		_w1 = new Wave(e.y + 3, stim);
		_w1.x -= 15; //gets the height of the image and sets it equal to _w1.x
		_activeE1 = activeE;
	}else {
		_w2 = new Wave(e.y + 3, stim);
		_w2.x -= 15;
		_activeE2 = activeE;
	}
}

function update() { //no g param because g used for drawImage
	if(_draw) {   //is true
		calculate();
		if(_w1.isShowing()) {
			drawWave(_w1);
		if(_w2.isShowing()) {
			drawWave(_w2);
		drawElectrons();
		drawLabels();
		_draw = false:
		}
		}
	}
}

function drawLabels() {
	var a = "";
	var h = 
	var l, ei;
    //              //water.css("visibility", "visible");

	if(_labelson) {
		switch(_activestate) {
		case 0:	
			_labelB.css("visibility", "hidden");
			_labelC.css("visibility", "hidden");
			_labelA.css("visibility", "visible");  //abs pos LBL1,LBL2, and LBL3
			break;
		case 1:
			_labelA.css("visibility", "hidden");
			_labelC.css("visibility", "hidden");
			_labelB.css("visibility", "visible");  //visibility: starts hidden for all
			break;
		case 2:
			_labelA.css("visibility", "hidden");
			_labelB.css("visibility", "hidden");
			_labelC.css("visibility", "visible");
			break;
		}
	}
}

function drawWave(w) {  //(Wave w)
	var wave1 = new Image();		//pull to global var section?
	var wave2 = new Image();		//pull to global var section?
	wave1.src = "images/wave1.gif";	//pull to global var section?
	wave2.src = "images/wave2.gif"; //pull to global var section?
	
	if(w.isDouble()) {
		var h = 5; 
		_wCtx.drawImage(_up ? wave1:wave2, w.x, w.y); //w_pic1 = wave1
		_wCtx.drawImage(_up ? wave1:wave2, w.x, w.y); //w_pic2 = wave2
	}else { 
		_wCtx.drawImage(_up ? wave1:wave2, w.x, w.y);
	}
}

function drawElectrons() {
	var e = new Electron();
	var etron = new Image();
	etron.src = "images/sphere.png"

	for(var i = 0;i < _els.length;i++) {
		e = _els[i];
		_eCtx.drawImage(etron, e.x, e.y + (_up ? -1:0));
	}
	_up =! _up;
}

function initEls(){
	var high, upper, found1=false,found2=false; //booleans
	var id, maxu, maxd, _up=0, down=0, ei; //numbers
	var e, etemp;
	var _he = _le = 0;

	for(var i = 0;i<5;i++){
		upper = Math.random()>0.5;
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

function getNextIndex(v, index) {
	v = new Array(10);
	var e = new Electron();
	var ok = true;

	for(var i=0;i<v.length;i++) {
		e = v[i];
		ok = false;
	}
	if(ok) {
		return index;
	}else {
		return getNextIndex(v, (index + 1)%5);
	}
}

function changeState() {
	var r = Math.random(); //all numbers in js are already doubles

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

function calculate() {
	var e = new Electrion();

	_w1.update(); //does this ad update to the _w1 instance of the Wave class?
				  //how again does calculate() know that _w1 has been assigned in startWave?
	e = _els[_activeE1];

	if(_w1.x >= e.x && !_w1.isDone()) {
		e.move();
		if(_state == 0) {
			_w1.show();
			_he--;
			_le++;
		}
		else if(_state == 1) {
			_w1.show();
			_w1.dbl();
			_he--;
			_le++;
		}
		else if(_state == 2) {
			_w1.hide();
			_he++;
			_le--;
		}
		changeState(); //not defined yet as of 12/12
		startWave(2);
	}

	if(_w2.x != _Integer.MIN_VALUE) {
		_w2.update();  //since it keeps calling this, it must be redrawing
					  //is this equivalent to clearing my canvas?
		e = _els[_activeE2];

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
			else if(state == 2) {
				_w2.hide();
				_he++;
				_le--;
			}
			changeState(); //not defined yet as of 12/12
			startWave(1);
		}
		
		for(var i = 0;i<_els.length;i++) {
			e = _els[i];
			e.update(); //calls update() again, clear canvas?
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

function Wave(y_, stim_){
	var that = {};
	that.x = 0;
	that.y = y_;

	var showing = stim_;  
	var showdbl = false;
	var done = false;
	var hidden != stim_;

	that.update = function(){
		that.x+=5;
	}

	that.hide = function(){   //adds hide to the that object, hide : functionion(){};
		showing = false;
		hidden = true;
		done = true;
	}

	that.show = function(){
		hidden = false;
		showing = true;
		done = true;
	}

	that.dbl = function(){
		showdbl = true;
		done = true;
	}

	that.isShowing = function(){  
		return showing;
	}

	that.isHidden = function(){
		return hidden;
	}

	that.isDouble  = function(){
		return showdbl;
	}

	that.isDone = function(){
		return done;
	}

	return that;
} 

function Electron(number, xoffset, _i, high, d){
	var that = {};
	that.x = xoffset+(d+5)*number;
	that.y = 15 + (i+1)*5;
	that.n = _i; //n = i, b/c i in JS causes issues in for loops
	that.falling = false;

	var moving = false;
	var step = 0;
	
	if (high) { 				//is true 
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
		if(moving) { 				//is true
			if(that.falling) { 		//is true
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

