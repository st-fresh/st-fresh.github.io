function startTutorial() {
    var btn           = new OlyButton("btnReset");
    var grey          = document.getElementById("greyImage");
    var specimenImage = document.getElementById("round-image");
    var dropDown      = document.getElementById("sampleDrop");
    var vRead          = document.getElementById("voltageRead");
    var mask           = document.getElementById("maskRing");
    var mtx            = mask.getContext("2d");
    var sliderX       = new OlySlider("sliderX", {orientation:"vertical"}); //x
    var sliderY       = new OlySlider("sliderY", {orientation:"vertical"}); //y
    var sliderF       = new OlySlider("sliderF", {orientation:"vertical"}); //focus
    var sliderV       = new OlySlider("sliderV", {orientation:"vertical"}); //voltage
    var outInGroup    = new HaRadioGroup("haVGroup", {orientation: "vertical"});
    var objGroup      = new HaRadioGroup("haHGroup"); //magnification buttons
    var maskIndex      = ["images/background4.png", "images/background10.png", "images/background20.png", "images/background40.png"];
    var imagePaths    = [];
    var mags          = ["4x0","10x0","20x0","40x0"];
    var splash        = OlySplash(initialize, imagePaths);
    var specimen      = [];
    var phaseMode      = 0; //starts at 0 because tut initializes with "Out" toggled
    var srcData        = [];
    var rings         = [];
    var ringsBack     = [];
    var ringsFore     = [];
    var start          = 1; //controls dropHandler's first execution
    var hW             = 70; // half width of ring range
    var blur           = 0;
    var light          = 0;
    var x              = 0;
    var y              = 0;
    var x2             = 0;
    var y2             = 0;
    var vRead          = 0;
    var choice         = "";
    var filters        = {};
    var topCan         = document.getElementById("top");
    var toptx          = topCan.getContext("2d");
    var btmCan         = document.getElementById("bottom");
    var btmtx          = btmCan.getContext("2d");
    var counter        = 0;
    var startUp        = true;
    var handStart      = true;
    var phaseStart     = true;
    var WIDTHHEIGHT  = 208;
    var once           = true;
    var blurImageDataObjectColor;
    var blurImageDataObjectGrey;
    var scopeIndex;
    var maskImg = new Image();

    function initialize() {
        sliderF.setPosition(Math.random());
        sliderV.setPosition(Math.random());
        sliderX.setPosition(Math.random());
        sliderY.setPosition(Math.random());
        MEUtil.upscaleCanvas("top", 1);
        MEUtil.upscaleCanvas("bottom", 1);
        MEUtil.upscaleCanvas("maskRing", 1);
        

        loadData(function() {
            adListeners();
            outInGroup.setSelectedIndex(0);
            objGroup.setSelectedIndex(3);  
            initData();
            magChange();
            MEUtil.raf(enterFrameHandler);
            splash.fadeOut();
        })
    }

    function loadData(callback) {
        $.ajax({
            type: "GET", url: "data/tutdata.xml", dataType: "xml", 
            success: function(xml) {
                parsexml(xml);
                if (callback) {
                    callback();
                }
            }
        });
    }

    function parsexml(xml) {
        $(xml).find ("image").each(function() {
            var option = document.createElement("option");
            var $this  = $(this);
            var s1, s2;
            option.text  = $this.find("name").text();
            option.value = $this.find("specimenpath").text();
            specimen.push(new SpecimenPath(option.value, ".jpg"));
            rings.push(new SpecimenPath($this.find("ringpath").text(), ".png"));
            dropDown.appendChild(option);
        });
            ringsBack = rings.splice(0, 4);
            ringsFore = rings.splice(2, 9);
    }

    function checkImageCounter(numImages, callback) {
        counter++;
        if (numImages == counter) {
            callback();
        }
    }

    function adListeners() {
        //DROPDOWN SELECTION
        dropDown.onchange = function() {
            magChange();
            randomizer(phaseMode);
        };

        //RESET BUTTON
        btn.ontouch = function() {
            randomizer(phaseMode);
        } 

        //MAG BUTTON GROUP
        objGroup.onchange = function() {
            // if (!startUp) {
                magChange();
            // }
            // startUp = false;
        };
        //BLUR ONTOUCHEND
        sliderF.ontouchend = function(event) {
            blurCanvases(phaseMode);
        };

        //OUT IN BUTTON GROUP
        outInGroup.onchange = function() {
            scopeIndex = outInGroup.getSelectedIndex();
            switch (scopeIndex) 
            {
                case 0:
                    phaseMode = 0;
                    topCan.style.top  = -2 + "px";
                    topCan.style.left = -2 + "px";
                break;

                case 1:
                    phaseMode = 1;
                break;
            }
            mask.style.visibility = !phaseMode ? "hidden" : "visible";
            magChange();
        };
    }

    function randomizer(pm) {
        var xnew = Math.random(); 
        var ynew = Math.random(); 
        var vnew = Math.random();
        var fnew = Math.random(); 
        sliderX.setPosition(xnew);
        sliderY.setPosition(ynew);
        sliderV.setPosition(vnew);
        sliderF.setPosition(fnew);
        if (pm == 0) {
            blendCanvases();
            blurCanvases(pm);
            mask.visibility = "hidden";
        }else if (pm == 1) {  
            mask.visibility = "visible";
            translateCanvases();  
        }
    }

    function magChange() { //add to objGroup.onchange
        counter = 0;
        if (phaseMode == 0) {
            specimenImage.onload = grey.onload = function() {
                checkImageCounter(2, imagesComplete);
            };
        }else {
            specimenImage.onload = grey.onload = maskImg.onload = function() {
                checkImageCounter(3, imagesComplete);
            };
        }

        if (phaseMode == 0 && start == 1) {
            start = "started"; //alters start var to a string which keeps magChange from running this first if ever again
            var startIndex          = Math.round(Math.random()*9);
            dropDown.selectedIndex = startIndex;
            var firstPath           = dropDown.value;
            specimenImage.src      = firstPath + "40x0.jpg";
            grey.src               = firstPath + "40x1.jpg";
        }else if (phaseMode == 0)  {
            var index          = dropDown.selectedIndex;
            var mag            = objGroup.getSelectedIndex();
            var newPath        = specimen[index].getPath(mag); //specimen[index] chooses a SpecimenPath object from the 8 created in parsexml 
            specimenImage.src = newPath.toString();     //and mag chooses an index in an array
            grey.src          = specimen[index].greyPath(mag);
        }else if (phaseMode == 1) {
            var mag            = objGroup.getSelectedIndex();
            var maskPath       = maskIndex[mag];
            var backPath       = ringsBack[mag].getPath(mag); //could i do: SpecimenPath("images/background").getRpath(mag); ??
            var ringPath       = ringsFore[mag].getPath(mag); 
            grey.src          = backPath.toString();
            specimenImage.src = ringPath.toString();
            maskImg.src        = maskPath;
        } 
    }

    function imagesComplete() {
        mtx.drawImage(maskImg, 0, 0);
        toptx.drawImage(specimenImage, 0, 0);
        btmtx.drawImage(grey, 0, 0);
        blurImageDataObjectColor = toptx.getImageData(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        blurImageDataObjectGrey  = btmtx.getImageData(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        blurCanvases(phaseMode);
        if (phaseMode == 1){
            translateCanvases();
        }
    }
    function changeLight(s) {
        s = (0.75 - s * 2) / 42;
    
        if (s > 0) {
            s *= 3;
            s *= (2/3);
        }
    
        s += 1;
        sabs = Math.abs(s);
        return sabs;
    }

    function translateCanvases() {
        topCan.style.opacity = 1.0;
        x  = sliderX.getPosition(hW, 0);
        y  = sliderX.getPosition(0, hW);
        x2 = sliderY.getPosition(0, hW);
        y2 = sliderY.getPosition(0, hW);
        topCan.style.left = (x+x2-60) + "px";
        topCan.style.top  = (y+y2-75) + "px";
    }

    function blendCanvases(){
        var vx   = Math.abs(sliderX.getPosition(-1, 1));
        var vy   = Math.abs(sliderY.getPosition(-1, 1));
        var posX = (1 - vx);
        var posY = (1 - vy);
        var colorCanvasOpacity = posX/2 + posY/2;
        topCan.style.opacity   = colorCanvasOpacity;
    }

    function blurCanvases(pm){ //pm = phaseMode
        //whenever magChange runs it will reblur the image and this function is ran when that happens so that new blur data is obtained.
        var blur  = Math.abs(sliderF.getPosition(4, -4));
        var blur2 = Math.abs(sliderF.getPosition(-1, 1));
        btmtx.clearRect(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        toptx.clearRect(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        mtx.clearRect(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        mtx.drawImage(maskImg, 0, 0);
        btmtx.drawImage(grey, 0, 0);
        toptx.drawImage(specimenImage, 0, 0);


        switch(pm)
        {
            case 0: //OUT
                stackBlurCanvasRGB("top", 0, 0, WIDTHHEIGHT, WIDTHHEIGHT, blur);
                stackBlurCanvasRGB("bottom", 0, 0, WIDTHHEIGHT, WIDTHHEIGHT, blur);
            break;

            case 1: //IN
                // btmtx.drawImage(grey, 0, 0);
                // toptx.drawImage(specimenImage, 0, 0);
                stackBlurImage("round-image", "top", blur, true);
                stackBlurImage("greyImage", "bottom", blur, true);
//targetCanvasID, topx, topy, width, height, radius 
                stackBlurCanvasRGBA("maskRing", 0, 0, 208, 208, blur);
            break;
        }

        blurImageDataObjectColor = toptx.getImageData(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        blurImageDataObjectGrey  = btmtx.getImageData(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
        adjustCanvasesBrightness();
         
    }

    function adjustCanvasesBrightness(){
        vRead      = Math.round(Math.abs(sliderV.getPosition(-12,0)));
        voltageRead.innerHTML = "Voltage: " + vRead + "V";

        if (phaseMode == 1) {
            var setting = sliderV.getPosition(160, -100);
        }else {
            var setting = sliderV.getPosition(180, -140);
        }
        var outputImageDataColor = toptx.createImageData(WIDTHHEIGHT, WIDTHHEIGHT);
        var outputImageDataGrey  = btmtx.createImageData(WIDTHHEIGHT, WIDTHHEIGHT);
        
        var colorData = initData();
        colorData     = blurImageDataObjectColor.data;
        var greyData  = blurImageDataObjectGrey.data;

        var outDataColor = outputImageDataColor.data;
        var outDataGrey  = outputImageDataGrey.data;

        for(var i = 0; i < outDataColor.length; i+=4){

            if (phaseMode == 1 && setting < 54) { //if slider below 7V according to label 0-12V, make it darker as it gets continues to be lower than 54getPos
                outDataColor[i]   = colorData[i]   + setting - 90;
                outDataColor[i+1] = colorData[i+1] + setting - 90;
                outDataColor[i+2] = colorData[i+2] + setting - 90;
            }
            else{
                outDataColor[i]   = colorData[i]   + setting;
                outDataColor[i+1] = colorData[i+1] + setting;
                outDataColor[i+2] = colorData[i+2] + setting;
            }
            
            // outDataColor[i+3] = 255;

            // x = phaseMode == true ? 5 : 3;

            if (phaseMode == 1 && colorData[i+3] > 0) { //if the alpha is greater than 0 then white is visible, therefore add that alpha pixel to the final alpha array only
                outDataColor[i+3] = colorData[i+3];
            }
            else{
                outDataColor[i+3] = !phaseMode ? 255 : 0;
            }


            // if (phaseMode == 1 && setting < 54) { //if slider below 7V according to label 0-12V, make it darker as it gets continues to be lower than 54getPos
            //     outDataColor[i]   = colorData[i]   + setting - 90;
            //     outDataColor[i+1] = colorData[i+1] + setting - 90;
            //     outDataColor[i+2] = colorData[i+2] + setting - 90;
            // }
            // if (phaseMode == 1 && greyData[i]<=65 && greyData[i+1]<=65 && greyData[i+2]<=65) { //if pixels are near black
            //     // outDataGrey[i]   = greyData[i]; //keep r, g, b pixels the same and so don't apply brightness manips
            //     // outDataGrey[i+1] = greyData[i+1];
            //     // outDataGrey[i+2] = greyData[i+2];
            //     var ringAdjust = true; //used to alter whether setting is applied or not
            // }
            // if (ringAdjust) {
            //     // console.log("in");
            //     outDataGrey[i]   = greyData[i];
            //     outDataGrey[i+1] = greyData[i+1];
            //     outDataGrey[i+2] = greyData[i+2];
            //     outDataGrey[i+3] = 255;
            //     ringAdjust = false;
            // }else {
            //     // console.log("out");
            // }
                outDataGrey[i]   = greyData[i]   + setting;
                outDataGrey[i+1] = greyData[i+1] + setting;
                outDataGrey[i+2] = greyData[i+2] + setting;
                outDataGrey[i+3] = 255;
        }

        //IF

        toptx.putImageData(outputImageDataColor, 0, 0);
        btmtx.putImageData(outputImageDataGrey, 0, 0);
    }

    function initData() { // attempts to initialize colorData's type before colorData is used
        var hCan = document.getElementById("hid");
        var htx = hCan.getContext("2d");
        htx.drawImage(grey, 0,0);
        var someData = htx.getImageData(0,0, 2, 2);
        var toReturn = someData.data;
        //colorData var must be init as .data or it can't function later: cannot read property 'data' of undef
        return toReturn;
    }

    // darkest 115, brightest 255

    function SpecimenPath(basePath, ext) {   //specName param removed  //basePath = all specimen names from parsexml and specimenpaths too
        this.basePath  = basePath;
        this.ext       = ext;
        this.specPaths = {
            grey  :  this.createPaths("1"), //function returns an array
            color :  this.createPaths("0") //therefore color = the array in createPaths
        };
    }
    
    SpecimenPath.prototype.getPath = function(magIndex) {
        return this.specPaths.color[magIndex]; //b/c color is array you can access it's values which are full paths
    };

    SpecimenPath.prototype.greyPath = function(magIndex) {
        return this.specPaths.grey[magIndex];
    };
    
    SpecimenPath.prototype.createPaths = function(suffix) {
        return [
            this.basePath + "4x" + suffix  + this.ext,
            this.basePath + "10x" + suffix + this.ext,
            this.basePath + "20x" + suffix + this.ext,
            this.basePath + "40x" + suffix + this.ext
        ];
    };

    function enterFrameHandler(timeStamp) {
       switch (phaseMode) 
       {
        case 0: //OUT
            if (sliderX.hasChanged || sliderY.hasChanged) { 
                blendCanvases();
                sliderX.hasChanged = false;
                sliderY.hasChanged = false;
            }
            else if(sliderV.hasChanged){
                adjustCanvasesBrightness();
                sliderV.hasChanged = false;
            }
        break;
        
        case 1: //IN
            if (sliderX.hasChanged || sliderY.hasChanged) {
                translateCanvases();
                sliderX.hasChanged = false;
                sliderY.hasChanged = false;
            }else if(sliderV.hasChanged) {
                // mtx.clearRect(0, 0, WIDTHHEIGHT, WIDTHHEIGHT);
                // mtx.drawImage(maskImg, 0, 0);
                adjustCanvasesBrightness();
                sliderV.hasChanged = false;
            }
        break;
       }
        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
    }
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);