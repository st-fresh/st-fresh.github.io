function startTutorial() {
  var _imagePaths = ["images/arrowthin2.gif", "images/compShape3.png"];
  var _splash = OlySplash(initialize, _imagePaths);
  var _lineP = Point(parseInt($('.line').css('left'),10), parseInt($('.line').css('top'),10));
  var _lineP = Point(parseInt("25",10), parseInt("107",10));
  var _lineCanvas = MEUtil.upscaleCanvas("lineCan");
  var _smallArrow = {
    can : document.getElementById("arrowCan"),
    img : new Image(),
    width : 9,
    height : 90,
    headHeight : 9,
    tailHeight : 2
  };

  var _compShape = new Image();
  
  var _keyPoints = {
    f : Point(_lineP.x + 245, _lineP.y),
    lens : Point(_lineP.x + 180, _lineP.y - 81),
    c : Point(_lineP.x + 315, _lineP.y),
    arrow : Point(_lineP.x + 90, _lineP.y - 81)
  };

  var _arrowPoints = {
    startX : _lineP.x + 10, 
    endX : _lineP.x + 139,
    offset : $('.arrow').width()/2
  };

  var _slider = new OlySlider("slider");
  var _$arrow = $('.arrow');
  
  function initialize() {
    initCan();
    _slider.setPosition(0.4);
  	MEUtil.raf(enterFrameHandler);
    _splash.fadeOut();
  }
  
  function initCan () {
    var p = _keyPoints;
    var ctx = _lineCanvas.getContext('2d');
    _smallArrow.img.src = "images/arrowthin2.gif";
    _compShape.src = "images/compShape3.png";
  }
  
  function enterFrameHandler(timeStamp) {
    if (_slider.hasChanged) {
      _slider.hasChanged = false;
      updateArrowPosition();
      drawLines();
      var point = checkLineIntersection();
      updateSmallArrow(point);
      movingText(point);
    }
    MEUtil.raf(enterFrameHandler);
  }
  
  function checkLineIntersection(p, d, a, b, n1, n2, x, y) {
    p = _keyPoints;
    d = ((p.f.y - p.lens.y)*(p.c.x - p.arrow.x)) - ((p.f.x - p.lens.x)*(p.c.y - p.arrow.y));
    a = p.arrow.y - p.lens.y;
    b = p.arrow.x - p.lens.x;
    n1 = ((p.f.x - p.lens.x)*a) - ((p.f.y - p.lens.y)*b);
    n2 = ((p.c.x - p.arrow.x)*a) - ((p.c.y - p.arrow.y)*b);
    a = n1/d;
    b = n2/d;
    x = p.arrow.x + (a*(p.c.x - p.arrow.x));
    y = p.arrow.y + (a*(p.c.y - p.arrow.y));
    return Point(x,y);
  }
  
  function updateArrowPosition () {
    var pos = _slider.getPosition(_arrowPoints.startX, _arrowPoints.endX);
    var canBig = document.getElementById("arrow");
    _keyPoints.arrow.x = pos;
    canBig.style[MEUtil.getPrefixedProp("transform")] = "translate("+(pos-87 - _arrowPoints.offset)+"px, 0px)";
  }
  
  function updateSmallArrow (point) {
    var h = _lineP.y - point.y + 10;
    var sa = _smallArrow;
    var ctx = sa.can.getContext("2d");
    var bodyHeight = h - sa.headHeight - sa.tailHeight;
    var canY = sa.height - h;
    var pr = MEUtil.PIXEL_RATIO;
    ctx.clearRect(0, 0, sa.width, sa.height);
    ctx.drawImage(sa.img, 0, 0, sa.img.width, sa.headHeight*4,
      0, canY, sa.width, sa.headHeight); //drawing arrwhead
    ctx.drawImage(sa.img, 0, sa.headHeight*4, sa.img.width, bodyHeight*4,
      0, canY + sa.headHeight, sa.width, bodyHeight); //drawing body
    ctx.drawImage(sa.img, 0, (sa.img.height - sa.tailHeight)*4, sa.img.width, sa.tailHeight*4,
      0, sa.height - sa.tailHeight, sa.width, sa.tailHeight); //drawing tail
    var can = document.getElementById("arrowCan");
    var canOffset = can.width/2;
    can.style[MEUtil.getPrefixedProp("transform")] = "translate("+(point.x - canOffset)+"px, 0px)";
  }
  
  function movingText(point) {
    var p = _keyPoints;
    var x = point.x;
    var y = point.y;
    var $objtxtDiv = $('#object');
    if (p.arrow.x > 113) {
      $objtxtDiv.css('left', p.arrow.x - 50);
      $objtxtDiv.css('top', p.arrow.y + 40);
    } else {
        $objtxtDiv.css('left', p.arrow.x + 18);
        $objtxtDiv.css('top', p.arrow.y + 40);    
      }

    var $vitxtDiv = $('#vImage');
    $vitxtDiv.css('left', x - 2);
    $vitxtDiv.css('top', y - 27);
  }
  
  function drawLines() {
    var p = _keyPoints;
    var ctx = _lineCanvas.getContext('2d');
    ctx.clearRect(0,0,400,215);
    ctx.beginPath();
    ctx.moveTo(p.c.x, p.c.y);
    ctx.lineTo(p.arrow.x, p.arrow.y);
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.moveTo(p.arrow.x, p.arrow.y);
    ctx.lineTo(p.lens.x, p.lens.y);
    ctx.lineTo(p.f.x, p.f.y);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.save();
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(_compShape, 0, 0, 259, 89, 26, 21, 379, 89);
    ctx.restore();
  }
  
   function Point(x,y) {
    return {
      x : x,
      y : y
    };
  }
}
// \/ NO TOUCHY \/
$(document).ready(startTutorial);