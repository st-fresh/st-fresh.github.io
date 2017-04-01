function startTutorial() {
    var _specImg = document.getElementById("specImg");
    var _specImg2 = document.getElementById("specImgC");
    var _imagePaths = [];
    var _dropDown = document.getElementById("selectWrap");
    var _ColorToggle = new OlyButton("btn", true);
    // var _samples = {};
    var paths = ["appletree", "scarkeloid",
            "puccinia", "tuber", "testes"];
    var _suffixes = ["colorlow", "colorhigh", "low", "high"];
    var _splash = OlySplash(initialize, _imagePaths);
    var _slider = new OlySlider("slider");
    // var original = null;
    // var speCanvas = document.getElementById("destCan");
     (function () {
        for (var i = 0, l = paths.length; i < l; i++) {
            var ll = _suffixes.length;
            while (ll) {
                _imagePaths.push("images/samples/" + paths[i] + 
                    _suffixes[--ll] + ".jpg");
            } console.log(_imagePaths);
        } 
    })(); 
    var x1 = 0;
    var y1 = 50;
    var ww = 185;
    var hh = 182;


    // function initSampleObj() {
    //     for (var i = 0, l = paths.length; i < l; i++) {
    //         var ll = suffixes.length;
    //         // _samples[paths[i]] = createSampleObj(paths[i]);
    //         _samples[paths[i]] = Samples(paths[i], document.getElementById("destCan")); //add to canvas html
    //     }
    // }      
   
    function initialize() {
        _ColorToggle.toggleText = ["Color On", "Color Off"];
        //curveHandler
        
       
        drawGrid();
    
    
        loaddata(function(){
             adListeners();
             var startIndex = Math.round(Math.random()*4);
             _dropDown.selectedIndex = startIndex;
             changeImage();
             // _specImg.style.backgroundImage = "url("+_dropDown.value+"low.jpg)";
             // _specImg2.style.backgroundImage = "url("+_dropDown.value+"high.jpg)";
             // _specImg.src = _dropDown.value;
             // _specImg2.src = _imagePaths[specArray[startIndex]];
            
        
    
            
    
    
            _slider.tickCount = .1;
            _slider.setPosition(0);
    
            MEUtil.raf(enterFrameHandler);
            _splash.fadeOut();
        });
    }

    function drawGrid() {
        var grid = document.getElementById("gridScreen");
        var ctx = grid.getContext('2d');

        for(var x = 0.5; x < 150; x += 10) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 375);
            ctx.moveTo(0, x);
            ctx.lineTo(150, x);
        }
        ctx.strokeStyle = "#E9E9E9";
        ctx.stroke();
    }
// for (var x = 0.5; x < 500; x += 10) {
//   context.moveTo(x, 0);
//   context.lineTo(x, 375);
// } Draw vertical linesfor (var y = 0.5; y < 375; y += 10) {
//   context.moveTo(0, y);
//   context.lineTo(500, y);
// }
    // ["images/samples/appletreehigh.jpg", 
    // "images/samples/appletreelow.jpg", 
    // "images/samples/appletreecolorhigh.jpg", 
    // "images/samples/appletreecolorlow.jpg", 
    // "images/samples/scarkeloidhigh.jpg", 
    // "images/samples/scarkeloidlow.jpg", 
    // "images/samples/scarkeloidcolorhigh.jpg", 
    // "images/samples/scarkeloidcolorlow.jpg", 
    // "images/samples/pucciniahigh.jpg", 
    // "images/samples/puccinialow.jpg", 
    // "images/samples/pucciniacolorhigh.jpg", 
    // "images/samples/pucciniacolorlow.jpg", 
    // "images/samples/tuberhigh.jpg", 
    // "images/samples/tuberlow.jpg", 
    // "images/samples/tubercolorhigh.jpg", 
    // "images/samples/tubercolorlow.jpg", 
    // "images/samples/testeshigh.jpg", 
    // "images/samples/testeslow.jpg", 
    // "images/samples/testescolorhigh.jpg", 
    // "images/samples/testescolorlow.jpg"]

    // function gammaConverter(r, g, b, f) {
    //            return [
    //                Math.pow(r / 255, f) * 255,
    //                Math.pow(g / 255, f) * 255,
    //                Math.pow(b / 255, f) * 255
    //            ];
    //        }

    function mix() {
        //get low by name
        //get slider position
        var factor = _slider.getPosition(0,1);
        //set alpha to slider
        mixer(factor);        
    }

    function mixer(f) {
        var lowGamma = document.getElementById("specImgC");
        var lowAlpha = lowGamma.style.opacity = f;
    }
    //     //grab original image data
        

    //     // var ctx = speCanvas.getContext('2d');

    //     // var oldpx = original.data; //olddata = old
    //     // var newData = ctx.createImageData(175,175);
    //     // var newpx = newData.data;
    //     // var replace = [];
    //     // var newLength = newpx.length;
    //     // var factor = _slider.getPosition(1,10); //1+pos*9 // Min + (pos * (Max - Min))
    //     // //transform original data
    //     // for (var i = 0; i < newLength; i += 4) {
    //     //     replace = gammaConverter(oldpx[i], oldpx[i+1], oldpx[i+2], factor);
    //     //     newpx[i]   = replace[0];    
    //     //     newpx[i+1] = replace[1];    
    //     //     newpx[i+2] = replace[2];    
    //     //     newpx[i+3] = 255;    //a
    //     // } 

    //     // ctx.putImageData(newData, 0, 0);

    //     //store converted original data
        
    //     //swap original data with new stored image data
    // }

    function loaddata(callback) {
        $.ajax({
            type: "GET",
            url: "data/specimen-data.xml",
            dataType: "xml",
            success: function(xml) {
                parsexml(xml);
                if (callback) {
                    callback();
                }
            }
        });
    }

    function parsexml(xml) {
        $(xml).find ("image").each(function () {
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
        
        !_ColorToggle.getToggleState() ? drawCurveA() : drawCurveB(); 
    }

        // if(!_ColorToggle.getToggleState()) {
        //     // ctx.moveTo(x,y);
        //     ctx.beginPath();

        function drawCurveA() {
            var graph = document.getElementById("gScreen");
            var gtx = graph.getContext('2d');
            gtx.beginpath();

            for (var i = 0; i < 100 && y1 > 25; i++) {
                var factor = _slider.getPosition();
                var x = 50 + i;
                var y = hh - 40 - factor*15 - i*i*_slider.getPosition(.12,1.12)/40;     //85=approx slider wix in px, 146 = graph width
                
                if(y < 25) y = 25;
                
                if(i !=0) {
                    drawLine(gtx, x, y, x1, y1);
                }

                x1 = x;
                y1 = y;
            }

            gtx.lineWidth = 2;
            gtx.strokeStyle = "red";
            gtx.clearRect(0,0,185,182);
            gtx.stroke();
        }

        // else {
        //     ctx.beginPath(); //remove?

        function drawCurveB() {
            var graph = document.getElementById("gScreen");
            var gtx = graph.getContext('2d');
            gtx.beginpath();

            for(var j = 0; j < 135; j++) {
                var x = 35 + j;
                var y = 80 - (40 + factor*25)*Math.cos(j*Math.PI/135);

                if(j != 0) {
                    drawLine(gtx, x, y, x1, y1);
                }
            
                x1 = x;
                y1 = y;
            }

            gtx.lineWidth = 2;
            gtx.strokeStyle = "red";
            gtx.clearRect(0,0,185,182);
            gtx.stroke();
        }
    // function dropDown() {
    //         //change current sample, mix pixels, then render
    // }

    // function sliderChange() {
    //         //mix pixels on current sample, and pass slider position
    // }

    // function checkBox() {
    //         //access current sample and change color
    // }

    function enterFrameHandler(timeStamp) {
        MEUtil.raf(enterFrameHandler);
        if (_slider.hasChanged) {
        mix();
        curveHandler();

            _slider.hasChanged = false;

            // console.log(_slider.getPosition(-420, 420));
            // console.log(_slider.getElement());
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
            changeImage();// console.log("Touched");

        };
    
        _dropDown.onchange = changeImage;
       
    }

}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);