function startTutorial() {
  var _specImg = document.getElementById("specImg");
  var _specImg2 = document.getElementById("specImgC");
  var _imagePaths = [];
  var _dropDown = document.getElementById("selectWrap");
  var _ColorToggle = new OlyButton("btn", true);
  var paths = ["appletree", "scarkeloid",
               "puccinia", "tuber", "testes"];
  var _suffixes = ["colorlow", "colorhigh", "low", "high"];
  (function() {
    for(var i = 0, l = paths.length; i < l; i++) {
      var ll = _suffixes.length;
      while(ll) {
        _imagePaths.push("images/samples/" + paths[i] + 
                         _suffixes[--ll] + ".jpg");
      }
    } 
  })(); 
  var _splash = OlySplash(initialize, _imagePaths);
  var _slider = new OlySlider("slider");
   
  function initialize() {
    drawGrid();
    MEUtil.upscaleCanvas("drawBW");
    MEUtil.upscaleCanvas("drawColor");
  
    loaddata(function() {
      adListeners();
      var startIndex = Math.round(Math.random()*4);
      _dropDown.selectedIndex = startIndex;
      changeImage();
      _slider.setPosition(0);
      MEUtil.raf(enterFrameHandler);
      _splash.fadeOut();
    });
  }

  function drawGrid() {
    var grid = MEUtil.upscaleCanvas("gridScreen");
    var ctx = grid.getContext('2d');
  
    for(var x = 10.5; x < 160; x += 10) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 375);
      ctx.moveTo(0, x);
      ctx.lineTo(160, x);
    }

    ctx.strokeStyle = "#E9E9E9";
    ctx.stroke();
  }

  function mix() {
    var factor = _slider.getPosition(0,1);
    mixer(factor);        
  }
  
  function mixer(f) {
    var lowGamma = document.getElementById("specImgC");
    var lowAlpha = lowGamma.style.opacity = f;
  }

  function loaddata(callback) {
    $.ajax({
      type: "GET",
      url: "data/specimen-data.xml",
      dataType: "xml",
      success: function(xml) {
        parsexml(xml);
  
        if(callback) {
          callback();
        }
      }
    });
  }
  
  function parsexml(xml) {
    $(xml).find ("image").each(function() {
      var option = document.createElement("option");
      var $this = $(this);
      option.text = $this.find("name").text();
      option.value = $this.find("specimenpath").text();
      _dropDown.appendChild(option);
    })
  }
  
  function drawLine(ctx, x, y, xx, yy) {
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
  }

  function curveHandler() {
    var x1 = 0;
    var y1 = 50;
    var ww = 185;
    var hh = 182;
    var factor = _slider.getPosition();
    var graphBW = document.getElementById("drawBW");
    var graphColor = document.getElementById("drawColor");
    var btx = graphBW.getContext('2d');
    var ctx = graphColor.getContext('2d');
  
    if(!_ColorToggle.getToggleState()) {
      btx.beginPath();
      
      for(var i = 0; i < 109 && y1 > 25; i++) {
        var x = 50 + i;
        var y = hh - 30 - factor*15 - i*i*_slider.getPosition(.12,1.12)/40;     
        
        if(y < 25) y = 25;
        
        if(i !=0) {
          drawLine(btx, x, y, x1, y1);
        }
        
        x1 = x;
        y1 = y;
      }
      ctx.clearRect(0,0,185,182);
    btx.lineWidth = 2;
    btx.strokeStyle = "red";
    btx.clearRect(0,0,185,182);
    btx.stroke();
    }
  
    else {
      ctx.beginPath(); 

      for(var j = 0; j < 147; j++) {
        var x = 35 + j;
        var y = 85 - (45 + factor*25)*Math.cos(j*Math.PI/147);
        
        if(j != 0) {
          drawLine(ctx, x, y, x1, y1);
        }
        
        x1 = x;
        y1 = y;
      }
       btx.clearRect(0,0,185,182);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.clearRect(0,0,185,182);
    ctx.stroke();
    }
  }

  function enterFrameHandler(timeStamp) {
    MEUtil.raf(enterFrameHandler);

    if(_slider.hasChanged) {
      mix();
      curveHandler();
      _slider.hasChanged = false;
    }
  }

  function changeImage() {
    var path = _dropDown.value;
    var prefix = _ColorToggle.getToggleState() ? "color" : "";
    _specImg.style.backgroundImage = "url("+path + prefix + "low.jpg)";
    _specImg2.style.backgroundImage = "url("+path + prefix + "high.jpg)";
  }
  
  function adListeners() {
    _ColorToggle.ontouch = function() {
      changeImage();
      curveHandler();
    };
    
    _dropDown.onchange = changeImage;
  }
}
// \/ NO TOUCHY \/
$(document).ready(startTutorial);