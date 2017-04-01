function addListeners() {
	_slider.onchange = function {
		calculate();
		update();
	}
	_slider2.onchange = function {
		calculate();
		update();
	}
	medium.onchange = function {
		calculate();
		updateMedium();
		update();
		
	}
}

function calculate() {
	incidentRange = _slider.getPosition(0, 80);
    if (incidentRange < 1) {
      incidentRange = Math.floor(incidentRange);
    }
index = parseFloat(labArray2[medium.selectedIndex]);
    rangle = Math.asin(Math.sin(Math.floor(incidentRange)*PI/180) / index) * 180 / PI;
timeMod();
    updateLabels();
    updateColor();
ctx2.lineWidth = 1;
    ctx.lineWidth = 1;
if (index == 1.0 && incidentRange != 0) {
      rangle += 0.0000001;
    }

    var k = wavelength*30/700;
    var c = Math.cos((incidentRange-90) / 180.0 * PI);
    var s = Math.sin((incidentRange-90) / 180.0 * PI);
wavelength = Math.floor(_slider2.getPosition(400,700));

}

enterFrameHandler(timeStamp) {
	update();
}

function update() {
	ctx.clearRect(0,0,330,325);
    ctx2.clearRect(0,0,330,325);
	draw();

}

////////////////////////

function startTutorial() {
  var _splash = OlySplash(initialize);
  var _slider = new OlySlider("slider");
  var _slider2 = new OlySlider("slider2", {isSpectrumSlider:true});
  var medium = document.getElementById("selectWrap");
  var _labelName = document.getElementById("name");
  var _labelRef = document.getElementById("refLabel");
  var _labelInc = document.getElementById("incLabel");
  var _equLabelA = document.getElementById("angleReadA");
  var _equLabelB = document.getElementById("angleReadB");
  var _regSlideLabel = document.getElementById("regSlide");
  var _colorSlideLabel = document.getElementById("colorSlide");
  var _mask = document.getElementById("med1Mask");
  var _med = document.getElementById("med")
  var _canvas = document.getElementById("med1");
  var ctx = _canvas.getContext("2d");
  var _canvas2 = document.getElementById("med2");
  var ctx2 = _canvas2.getContext("2d");
  var incidentRange = 0;
  var light = "";
  var med = [255, 255, 255];
  var wavelength = 700;
  var width = 330;
  var h = 360;
  var stX = 165;
  var stY = 180;
  var rangle = 0.0;
  var alpha = 0;
  var x1 = 0.0;
  var y1 = 0.0;
  var pix = []; 
  var index = 1.333;
  var labArray1 = [];
  var labArray2 = [];
  var _lastTime = Date.now();
  var now = 0;
  var dt = 0;
  var mod = 0;
  var CALC_INTERVAL = 6;
  var alfa = 0;
  var PI = Math.PI;

  function initialize() {
    initPixArray();
    pix = initPixArray(); //pix is equal to the array that is returned by the initPixArray() function
    MEUtil.upscaleCanvas("med1");
    MEUtil.upscaleCanvas("med2");

    loaddata(function() {
      _slider.setPosition(0.75); //initializes it for Water angle = 60 deg
      _slider2.setPosition(1); //initializes it at 700 nm
      events();
      MEUtil.raf(enterFrameHandler);
      _splash.fadeOut();
    });
  }
  
  function loaddata(callback) {
   $.ajax({
     type: "GET",
     url: "data/specimen-data.xml",
     dataType: "xml",
     success: function(xml) {
       parsexml(xml);
       if (callback){
         callback();
       }
     }
   });
  }
  
  function parsexml(xml) {
    $(xml).find ("material").each(function () {
    
      var option = document.createElement("option");
      var $this = $(this);
      option.text = $this.find("name").text();
      medium.appendChild(option);

      labArray1.push($this.find("name").text().replace(/\d+/g, ''));

      labArray2.push($this.find("index").text());
    });

    medium.selectedIndex = 4;
  }

  function updateLabels() {
    _labelName.innerHTML = labArray1[medium.selectedIndex].replace('.','');
    _labelInc.innerHTML = "Incident Angle = " + Math.floor(_slider.getPosition(0,80)) + "&deg"; 
    _labelRef.innerHTML = "Refracted Angle = " + (Math.floor(rangle * 100) / 100) + "&deg"; 
    _equLabelA.innerHTML = "1.00 sin " + Math.floor(_slider.getPosition(0,80))+"&deg" + " = "  + labArray2[medium.selectedIndex] + " sin(&#952r)"; 
    _equLabelB.innerHTML = (Math.floor(rangle* 100) / 100) + " = (&#952r)"; 
    _regSlideLabel.innerHTML = "Incident Angle: " + Math.floor(_slider.getPosition(0,80)) + "&deg"; 
    _colorSlideLabel.innerHTML = "Wavelength: " + Math.floor(_slider2.getPosition(400,700)) + " nm"; 
  }

  function updateColor() {
    light = getColor();
    ctx.strokeStyle = light;
    ctx2.strokeStyle = light;
  }
  
  function timeMod() {
    now = Date.now();
    dt = now - _lastTime;
    mod = dt / CALC_INTERVAL;
    _lastTime = now;
    alpha = (alpha - 10*mod)%360;
    alfa = alpha/ 180 * PI;
  }

  function draw() {
    // incidentRange = _slider.getPosition(0, 80);
    // if (incidentRange < 1) {
    //   incidentRange = Math.floor(incidentRange);
    // }
    // ctx.clearRect(0,0,330,325);
    // ctx2.clearRect(0,0,330,325);
    // index = parseFloat(labArray2[medium.selectedIndex]);
    // rangle = Math.asin(Math.sin(Math.floor(incidentRange)*PI/180) / index) * 180 / PI;

    // timeMod();
    // updateLabels();
    // updateColor();

    // ctx2.lineWidth = 1;
    // ctx.lineWidth = 1;
    ctx.beginPath();
    ctx2.beginPath();

    // if (index == 1.0 && incidentRange != 0) {
    //   rangle += 0.0000001;
    // }

    // var k = wavelength*30/700;
    // var c = Math.cos((incidentRange-90) / 180.0 * PI);
    // var s = Math.sin((incidentRange-90) / 180.0 * PI);

    for (var i = -stY - 60; i < stY + 60; i++) {
      if (i == 0) {
        k /= index;
        c = Math.cos((rangle-90) / 180.0 * PI);
        s = Math.sin((rangle-90) / 180.0 * PI);
      }
  
      var y = Math.sin(i*PI/k+alfa) * 30.0;
      var x2 = (i*c + y*s);
      var y2 = (y*c - i*s);
  
      if (index != 1.0) {
        if(i == -1) { 
          x2 = 0; 
          y2 = 0; 
        }
        if (i == 1) {
          x1 = 0; 
          y1 = 0; 
        }
      }
  
      if (i != -stY - 60) {
        if (i < 0) {
            ctx.moveTo((x1+stX), (y1+stY));
            ctx.lineTo((x2+stX), (y2+stY));
            ctx.moveTo((x1+stX+1), (y1+stY));
            ctx.lineTo((x2+stX+1), (y2+stY));

            if (i % 5 == 0) {
              ctx.moveTo((x1+stX), (y1+stY));
              ctx.lineTo(((i*c)+stX), ((-i*s)+stY));
            }
        }else {
            ctx2.moveTo((x1+stX), (y1+stY));
            ctx2.lineTo((x2+stX), (y2+stY));
            ctx2.moveTo((x1+stX+1), (y1+stY));
            ctx2.lineTo((x2+stX+1), (y2+stY));

            if (i % 5 == 0) {
                ctx2.moveTo((x1+stX), (y1+stY));
                ctx2.lineTo(((i*c)+stX), ((-i*s)+stY));
            }
        }
      }
    
      x1 = x2;
      y1 = y2;
    }
    ctx.stroke();
    ctx2.stroke();


    drawLine(stX+43, stY-35, stX, stY-10); //label line
    drawLine(70, stY+40, stX, stY+10, 2); //label line


    if(incidentRange > 0) {
      drawLine(stX, stY, 0, stY+((stX*Math.tan((incidentRange-90) / 180.0 * PI))));
      drawLine(stX, stY, width, stY - ((stX*Math.tan((rangle-90) / 180.0 * PI))),2);
    }
    else {
      drawLine(stX, 0, stX, stY*2, 2);
    }

    if (rangle != 0) {
      drawArc(stX, stY, 20, 90, (incidentRange), true);
      drawArc(stX, stY, 20, 270, (rangle), true);
      drawArc(stX, stY, 15, 270, (rangle), true);
    }

    // wavelength = Math.floor(_slider2.getPosition(400,700));

    ctx.stroke();
  }
  
  function drawArc(x, y, radius, startAngleRAD, endAngleRAD, clock) {
    startAngleRAD = -startAngleRAD;
    Math.radians = function(degrees) {
      return degrees * PI/180;
    };
    var startA = Math.radians(startAngleRAD);
    var endA = Math.radians(startAngleRAD  - endAngleRAD);
    ctx2.strokeStyle = "#000";
    ctx2.beginPath();
    ctx2.arc(x, y, radius, startA, endA , clock);
    ctx2.stroke();
  }

  function drawLine(sx, sy, ex, ey, canvas){
    if (canvas == 2) {
      ctx2.strokeStyle = "#000";
      ctx2.beginPath();
      ctx2.moveTo(sx, sy);
      ctx2.lineTo(ex, ey);
      ctx2.stroke();
      ctx2.lineWidth = 2;
    }
    else {
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.lineWidth = 2;
    }
  }

  function initPixArray() {
      var a = [];
      var l = 81
      var i;
      for (i = 0; i < 61; i++) {
        a[20 + i] = "hsl(" + Math.floor((i / 68) * 360) + ", 100%, 50%)"; 
      }
      for(i = 61; i < 81; i++) {
        a[80 - i] = "red";
      }
      return a; //returns array full of "hsl(#,#,#)" color strings
  }
  
  function getColor() { //this function returns the slider value as a color value located in the pix array
      return pix[Math.floor(_slider2.getPosition(pix.length - 1, 0))];
  }

  function updateMedium() {
    med[2] = 255 - medium.selectedIndex*11;
    var color = arrayToColor(rgbToHsl(255,255,med[2])); //sets gray shade
    _med.style.backgroundColor = color;
    _mask.style.backgroundColor = color;
  }

  function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
   
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
   
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
   
      h /= 6;
    }
   
    return [ h*0, s*0 + "%", l*100 + "%" ];
  }

  function arrayToColor(arr) {
      return "hsl(" + arr.join(",") + ")";
  }
  
  function events() {
      medium.onchange = function() {
        updateMedium();
        draw();
      }
  }

  function enterFrameHandler(timeStamp) {
        
      draw();

      MEUtil.raf(enterFrameHandler); 
  }
}
// \/ NO TOUCHY \/
$(document).ready(startTutorial);