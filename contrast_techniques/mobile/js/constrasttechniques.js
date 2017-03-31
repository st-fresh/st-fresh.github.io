function startTutorial() {
 var _imagePaths = [];
 var _splash = OlySplash(initialize, _imagePaths);
 var _buttons = [];
 var _labels = [];
 var _gridCan = document.getElementById("gridCanvas");
 var _plotCan = document.getElementById("plotCanvas");
 var _S = new Array(6);

 function initialize() {  
  drawGrid();
  initBezierCurve();
  drawSpline(0);  ////0 = incoherent, 1 = coherent
  initButtons();
  MEUtil.raf(enterFrameHandler);
  _splash.fadeOut(); 
 }

 function initButtons() {
  for (var i = 1; i < 7; i++) {
   _buttons.push(new OlyButton("btn" + i, true));
   
   _labels.push(document.getElementById("L" + i));
  
   _buttons[i - 1].addEventListener("touch", Updater);
  }
   //console.log(_labels[0], _labels[1], _labels[2], _labels[3], _labels[4], _labels[5]);

  _buttons[0].setToggleState(true);
 }

 function createBtnListener(index) {
  return function() {
   drawSpline(index);
  };
 }

 function drawGrid() {
  var ctx = _gridCan.getContext('2d');
  var w = _gridCan.offsetWidth;
  var h = _gridCan.offsetHeight;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#e0e0e0';
  ctx.lineWidth    = '1';

  for (var i = 30; i < w; i += 30) {
   ctx.fillRect(i, 0, 1, h);
  }
  for (i = 25; i < h; i += 25) {
   ctx.fillRect(0, i, w, 1);
  }

  ctx.strokesStyle = '#000';
  ctx.strokeRect(0, 0, w, h);
 }

 function pointF (x,y) {          
  return {                                  
   x : x,       
   y : y
  };
 }

 function bez_spline (segs, resolution) {   
  this.nSegments = segs;
  this.controls = new Array(segs);          
  this.output = new Array(segs);              

  for (var i = 0; i < segs; i++) {
   this.output[i] = new Array(resolution);
   for (var j = 0; j < resolution; j++) {
    this.output[i][j] = pointF(0, 0);
   }
  }
}

 function initBezierCurve () {
  _S[0] = new bez_spline(1, 150);   ////INCOHERENT (1) - 0
  //_S[0].controls[0] = new Array(3);  ///THIS LINE WAS MISSING BEFORE!
  _S[0].controls[0] = [pointF(0,0), pointF(201,183), pointF(283,201)];
  //console.log(_S[0].controls[0]);

  _S[1] = new bez_spline(1, 200);    ////COHERENT  (2) - 1
  for (var i = 0; i < 100; i++) {
   _S[1].output[0][i] = pointF((i/99) * 145, 0);
  }
  for(var i = 100; i < 200; i++) {
   _S[1].output[0][i] = pointF(148, ((i-100)/99) * 200);
  }

  _S[2] = new bez_spline(1, 150);    ///OBLIQUE   (3) -  2
  _S[2].controls[0] = [pointF(0, 100), pointF(253, 109), pointF(294, 200)];

  _S[3] = new bez_spline(3, 100);   ///PHASE CONTRAST  (4)  - 3
  _S[3].controls[0] = [pointF(0, 200), pointF(25, 134), pointF(17, 14), pointF(65, 0)];
  _S[3].controls[1] = [pointF(65, 0), pointF(91, 20), pointF(81, 70),
   pointF(113, 92), pointF(121, 124), pointF(137, 128)];
  _S[3].controls[2] = [pointF(135, 128), pointF(155, 126), pointF(159, 80),
   pointF(201, 166), pointF(223, 202)];

  _S[4] = new bez_spline(2, 100);   ///DIC   (5)   - 4
  _S[4].controls[0] = [pointF(1, 189), pointF(45, 2), pointF(89, 0)];
  _S[4].controls[1] = [pointF(89, 0), pointF(147, 0), pointF(183, 180), pointF(265, 202)];

  _S[5] = new bez_spline(2, 100);  ///SINGLE SIDEBAND   (6)   - 5
  _S[5].controls[0] = [pointF(1, 198), pointF(89, 0), pointF(133, 0)];
  _S[5].controls[1] = [pointF(133, 0), pointF(153, 2), pointF(195, 138), pointF(285, 202)];

  for (var i = 0; i < _S.length; i++) {
   if (i != 1) {
    for (var j = 0; j < _S[i].nSegments; j++) {  //i < 
     bezierCurve(_S[i].controls[j], _S[i].output[j]); 
     //console.log(_S[i].controls[j], _S[i].output[j]); 
    } 
   }
  }
 }

 function bezierCurve (control, curve) {
  var coeff = new Array(control.length);
  //console.log(coeff);
  bezierCC(coeff, control.length);
  for (var i = 0; i < curve.length; i++) {
   var diff = i/curve.length;
   bezierCP(diff, curve, i, control, coeff);  
   //console.log(diff);
  }
 }

 function bezierCC (c, n) {
  for (var k = 0; k < n; k++) {
   c[k] = 1;
   for (var i = n - 1; i >= k + 1; i--) {
    c[k] *= i;  
    //console.log(i);
   }
   for (var i = n - 1 - k; i >= 2; i--) {
    c[k] /= i;
    //console.log(i);
   }
  }
 }

 function bezierCP (u, curve, i, control, coeff) {
  var n = control.length - 1;
  //console.log(n);
  var blend = null;

  curve[i].x = 0;
  curve[i].y = 0;
  for (var k = 0; k < control.length; k++) {
   blend = coeff[k] * Math.pow(u, k) * Math.pow(1 - u, n - k);
   curve[i].x += control[k].x * blend;
   curve[i].y += control[k].y * blend;
   //console.log(blend);
  }
 }

 function Updater() {
  var ctx = _plotCan.getContext('2d');
  ctx.clearRect(0,0,_plotCan.width,_plotCan.height);

  for (var i = 0; i < _buttons.length; i++) {
   
   if (_buttons[i].getToggleState()) {
    var val = parseInt($(_buttons[i].getElement()).attr("value"), 10);
    drawSpline(val);
    _labels[i].style.visibility = "visible";
   } else {
    _labels[i].style.visibility = "hidden";
   }
  }
 }

 function drawSpline (who) {
  var lastX = 0;
  var lastY = 0;
  var dist = 5;
  var ctx = _plotCan.getContext('2d');

  // ctx.clearRect(0,0,_plotCan.width,_plotCan.height);
  var p = _S[who].nSegments; ///THIS PARSES /who SO THAT _S RECEIVES A WHOLE INTEGER
  for (var i = 0; i < p; i++) { //WAS PASSING _S[who].nSegments IN AS p, BUT IT'S A FLOAT, SO PASS PARSED VERSION B/C NEED INTEGER
   for (var j = 0; j < _S[who].output[i].length; j++) {
    var sep = Math.sqrt(Math.pow(_S[who].output[i][j].x - lastX, 2) + 
     Math.pow(_S[who].output[i][j].y - lastY, 2));    
    if (sep < dist) {
     continue;
    }
    ctx.fillRect(Math.floor(_S[who].output[i][j].x), Math.floor(_S[who].output[i][j].y), 2, 2);     
    lastX = _S[who].output[i][j].x;
    lastY = _S[who].output[i][j].y;
   }
  }
 }

 function enterFrameHandler(timeStamp) {
  MEUtil.raf(enterFrameHandler);
 }
}
// \/ NO TOUCHY \/
$(document).ready(startTutorial);