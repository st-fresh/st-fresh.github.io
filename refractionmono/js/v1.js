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
	var light = "";
	var med = [255, 255, 255]; //of floating values
	var wavelength = 700;
	var angle = 60;
	// var width = 330;
	// var height = 420;
	var h = 360;
	var stX = 165;
	var stY = 180;
	var pix = [81];
	var rangle = 0;
	var ALPHA = -10&360;
	var alfa = (-10%360) / 180.0 * Math.PI;
	var k = 0.0;
	var c = 0.0;
	var s = 0.0; 
	var x1 = 0.0;
	var y1 = 0.0;
	var y = 0.0;
	var x2 = 0.0;
	var y2 = 0.0;
	var pix = []; 
	var index = 1.333;

	function initialize() {
		initPixArray();
		pix = initPixArray(); //pix is equal to the array that is returned by the initPixArray() function
		MEUtil.upscaleCanvas("mainCan");
	
		loaddata(function() {
			_slider.setPosition(0.75); //initializes it for Water angle = 60 deg
			_slider2.setPosition(1); //initializes it for Water at 700 nm
			events();
			<initial canvas clip here>
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
	    
	    //put options in dropdown(aka 'medium' for now)	
	     	var option = document.createElement("option");
	     	var $this = $(this);
	     	option.text = $this.find("name").text();
	     	medium.appendChild(option);
	     	medium.setSelectedIndex(4);
		//
	
		//pushes all label names to array as strings
			labArray1.push($this.find("name").text().substring(0,5)); 
		// 
	
		//pushes all label values to array as strings
			labArray2.push($this.find("index").text());
		//
	
	      // option.value = $this.find("specimenpath").text(); = 0, 1, 2, numbers
	    }) return labArray1, labArray2; //?? can use these if returned here??
	}
	
	// labArray1 = ["Vacuum -", "Air -", ...]
	// labArray2 = ["1.0", "1.0002",...]
	
	function update(arr1, arr2) {
		rangle = Math.asin(Math.sin(_slider.getPosition(0,80);*Math.PI/180) / index) * 180 / Math.PI;
	
		ctx.fillStyle = arrayToColor([255, 255, 255 - medium.selectedIndex()/40.0]); //sets gray shade
		ctx.fillRect(0, stY, 320, 147); 
	
		_labelName.innerHTML = labArray1[medium.selectedIndex()]; //sets label
		_labelInc.innerHTML = "Incident Angle = " + _slider.getPosition(0,80) + "&deg"; //sets label
		_labelRef.innerHTML = "Refracted Angle = " + rangle + "&deg"; //sets label
		
		_equLabelA.innerHTML = "1.00 sin " + _slider.getPosition(0,80) + " = "  + labArray2[medium.selectedIndex()] + "sin(&#Thetar)"; //or &#920??
		//sets label
		_equLabelB.innerHTML = rangle + "= (&#Thetar)"; //sets label
		
		//double x1 = 0, y1 = 0; //made global
		_regSlideLabel.innerHTML = "Incident Angle: " + _slider.getPosition(0,80) + "&deg"; //sets slider label
		_colorSlideLabel.innerHTML = "Wavelength: " + _slider2.getPosition(400,700) + "nm"; //sets slider label
	
		light = getColor();
	
		ctx.strokeStyle = light;
		ctx.beginPath();
		// gc.setColor(light);
		// gctop.setColor(light);
	
		// <= Refraction!!!		--That's really exciting...
		if (index==1.0 && _slider.getPosition(0,80)!=0) {
			rangle += 0.0000001;
		}
	
		k = wavelength*30.0/700;
		c = Math.cos((_slider.getPosition(0,80)-90) / 180.0 * Math.PI);
		s = Math.sin((_slider.getPosition(0,80)-90) / 180.0 * Math.PI);
	
		for (var i =- Math.round(stY-60); i < stY+60; i++) {
			if (i == 0) {
				k /= index;
				c = Math.cos((rangle-90) / 180.0 * Math.PI);
				s = Math.sin((rangle-90) / 180.0 * Math.PI);
			}
		
			y = Math.sin(i*Math.PI/k+alfa) * 30.0;
		
			x2 = (i*c + y*s);
			y2 = (y*c - i*s);
		
			if (index != 1.0) {
				if(i==-1) { x2=0; y2=0; }
				if(i== 1) { x1=0; y1=0; }
			}
		
			if (i != -stY - 60) {
				if (i < 0) {
					ctx.moveTo(Math.round(x1+stX, y1+stY));
					ctx.lineTo(Math.round(x2+stX, y2+stY));
					ctx.moveTo(Math.round(x1+stX+1, y1+stY));
					ctx.lineTo(Math.round(x2+stX+1, y2+stY));
	
					// gctop.drawLine((int)x1+stX, (int)y1+stY, (int)x2+stX, (int)y2+stY);
					// gctop.drawLine((int)x1+stX+1, (int)y1+stY, (int)x2+stX+1, (int)y2+stY);
					if (i % 5 == 0) {
						ctx.moveTo(Math.round(x1+stX, y1+stY));
						ctx.lineTo(Math.round((i*c)+stX, (-i*s)+stY));
						// gctop.drawLine((int)x1+stX, (int)y1+stY, (int)(i*c)+stX, (int)(-i*s)+stY);
					}
				}else {
					ctx.moveTo(Math.round(x1+stX, y1+stY));
					ctx.lineTo(Math.round(x2+stX, y2+stY));
					ctx.moveTo(Math.round(x1+stX+1, y1+stY));
					ctx.lineTo(Math.round(x2+stX+1, y2+stY));
	
					// gc.drawLine((int)x1+stX, (int)y1+stY, (int)x2+stX, (int)y2+stY);
					// gc.drawLine((int)x1+stX+1, (int)y1+stY, (int)x2+stX+1, (int)y2+stY);
					if (i % 5 == 0) {
						ctx.moveTo(Math.round(x1+stX, y1+stY));
						ctx.lineTo(Math.round((i*c)+stX, (-i*s)+stY));
						// gc.drawLine((int)x1+stX, (int)y1+stY, (int)(i*c)+stX, (int)(-i*s)+stY);
					}
				}
			}
		
			x1 = x2;
			y1 = y2;
		}
		ctx.stroke();
	}
	
	function initPixArray() {
	    var a = [];
	    var l = 81
	    var i;
	    for (i = 0; i < 61; i++)
	    {
	        a[20 + i] = "hsl(" + Math.round((i / 68) * 360) + ", 50%, 50%)"; 
	    }
	    for(i = 61; i < 81; i++)
	    {
	        a[80 - i] = "red";
	    }
	    console.log(a);
	    return a; //returns array full of "hsl(#,#,#)" color strings
	}
	
	function getColor() { //this function returns the slider value as a color value located in the pix array
	    return pix[Math.round(_slider2.getPosition(0, pix.length - 1))];
	}
	
	function arrayToColor(arr) {
	    return "rgb(" + arr.join(",") + ")";
	}
	
	function events() {
		medium.onchange = function() {
			update(labArray1, labArray2);
		}
	}
	
	function enterFrameHandler(timeStamp) {
		if (_slider.hasChanged || _slider2.hasChanged) {
			_slider.hasChanged = false;
			_slider2.hasChanged = false;
			update(labArray1, labArray2);
		}
		MEUtil.raf(enterFrameHandler); 
	}
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);