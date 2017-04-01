function startTutorial() {
    var testImagePaths = "images/samples/appletreelow.jpg";
    var _imagePaths = [testImagePaths];
    var _dropDown = document.getElementById("selectWrap");
    var _ColorToggle = new OlyButton("btn", true);
    // var _samples = {};
    // var paths = ["appletree", "scarkeloid",
    //         "puccinia", "tuber", "testes"];
    // var _suffixes = ["colorlow", "colorhigh", "low", "high"];
    var _splash = OlySplash(initialize, _imagePaths);
    var _slider = new OlySlider("slider");
    var original = null;
    var speCanvas = document.getElementById("destCan");


    // function initSampleObj() {
    //     for (var i = 0, l = paths.length; i < l; i++) {
    //         var ll = suffixes.length;
    //         // _samples[paths[i]] = createSampleObj(paths[i]);
    //         _samples[paths[i]] = Samples(paths[i], document.getElementById("destCan")); //add to canvas html
    //     }
    // }      
   
    function initialize() {
        _ColorToggle.toggleText = ["Color On", "Color Off"];
    
    
        loaddata(function(){
             // adListeners();
             var startIndex = Math.round(Math.random()*5);
             _dropDown.selectedIndex = startIndex;
             // resetImage();
             var path = _dropDown.value; //value set in xml (= specimenpath)
             var ctx = speCanvas.getContext('2d');
             var _imgObj = new Image();
             _imgObj.src = testImagePaths;
                 console.log(_imgObj.src);
             // _imgObj.onload = function() {
            ctx.drawImage(_imgObj,0,0);
            original = ctx.getImageData(0, 0, 175, 175);
        
    
            _ColorToggle.ontouchstart = function() {
                console.log("TouchStarted");
            };
    
            _ColorToggle.ontouch = function() {
                console.log("Touched");
            };
    
    
            _slider.tickCount = 10;
            _slider.setPosition(Math.random());
    
            MEUtil.raf(enterFrameHandler);
            _splash.fadeOut();
        });
    }

    function gammaConverter(r, g, b, f) {
               return [
                   Math.pow(r / 255, f) * 255,
                   Math.pow(g / 255, f) * 255,
                   Math.pow(b / 255, f) * 255
               ];
           }

    function gammaHandler() {
        //grab original image data
        var ctx = speCanvas.getContext('2d');

        var oldpx = original.data; //olddata = old
        var newData = ctx.createImageData(175,175);
        var newpx = newData.data;
        var replace = [];
        var newLength = newpx.length;
        var factor = _slider.getPosition(1,10); //1+pos*9 // Min + (pos * (Max - Min))
        //transform original data
        for (var i = 0; i < newLength; i += 4) {
            replace = gammaConverter(oldpx[i], oldpx[i+1], oldpx[i+2], factor);
            newpx[i]   = replace[0];    
            newpx[i+1] = replace[1];    
            newpx[i+2] = replace[2];    
            newpx[i+3] = 255;    //a
        } 

        ctx.putImageData(newData, 0, 0);

        //store converted original data
        
        //swap original data with new stored image data
    }

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
        gammaHandler();

            _slider.hasChanged = false;

            // console.log(_slider.getPosition(-420, 420));
            // console.log(_slider.getElement());
        }

    }

    // function adListeners() {
    //    _ColorToggle.onchange = imagesStart; //ChangeHandler
    //    _dropDown.onchange = function() {
    //        imagesStart(); //ChangeHandler
    //      };
    // }

    // function imagesStart() {
    //     var path = _dropDown.value; //value set in xml (= specimenpath)
    //     _imgObj.src = path + "low.jpg";
    //     ctx.drawImage(_imgObj, 175, 175);

    //     _ColorToggle.addEventListener("Touched", function(event) {
    //         // b.onclick = function() {
    //         // var factor = null;
    //         // if (b.nextSibling.nodeName.toUpperCase() === 'INPUT') {
    //         //   factor = parseInt(b.nextSibling.value, 10);
    //         //   if (isNaN(factor)) {
    //         //     factor = 0;
    //         //   }
    //         // }
    //   transformador.transform(m.cb, factor);
    //   $('fn').innerHTML = m.cb.toString();
    // };


    //     })
        //draw to canvas path + "low.jpg";
    


    // function Samples(sampleName, destCan) {
    //     var path = "images/samples/" + sampleName;


    //     this.imageData = {
    //         colors : { 
    //             low : this._getImageData(path +  "colorlow.jpg"),
    //             high : this._getImagedata(path +  "colorhigh.jpg")
    //         },            
    //         greyscale : { 
    //             low : this._getImageData(path +  "low.jpg"),
    //             high : this._getImagedata(path +  "high.jpg")
    //         }
    //     };

    //     this.destCan = destCan;
    //     this.pixelStorage = [];
    //     this.isColor = false;
    // }

    // Samples.prototype._getImageData = function(path) {
 
    //     var can = document.createElement("canvas");
    //     var ctx = can.getContext("2d");
    //     var img = new Image();

    //     img.src = path;

    //     can.width = img.width;
    //     can.height = img.height;

    //     ctx.drawImage(img, 0, 0);
    //     return ctx.getImageData(0, 0, can.width, can.height).data;

    // };

    // Samples.prototype.setColor = function(isColor) {
    //         if(isColor !== this.isColor) {
    //             this.isColor = isColor;
    //             this.mixPixels();
    //         }
    // };

    // Samples.prototype._render = function(newPixels) {
    //         var ctx = this.destCan.getContext("2d");
    //         var destData = ctx.getImageData(0, 0, this.destCan.width, this.destCan.height);
    //         destData.data = newPixels;
    //         ctx.putImageData(destData);
    // };

    // Samples.prototype.mixPixels = function(sliderPosition) {
    //         var pix = Samples.prototype._getImageData(); //set pix to what above prototype returns
            
    //         var newPixels = [];

    //         //BLACK & WHITE
    //         for(var i =0; i < pix.length; i++) {
    //             var grayscale = pix[i]*.3 + pix[i+1]*.59 + pix[i+2]*.11;
    //             pix[i] = grayscale;
    //             pix[i + 1] = grayscale;
    //             pix[i + 2] = grayscale;
    //         }

    //         dtx.putImageData(pix, 0, 0);
            
    //         //logic for mixing
    //         this._render(newPixels);

    // };               

   
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);