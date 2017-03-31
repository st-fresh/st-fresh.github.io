function startTutorial() {
    var _btn           = new OlyButton("btnReset");
    var _grey          = document.getElementById("greyImage");
    var _specimenImage = document.getElementById("round-image");
    // var _ringImage     = document.getElementById("round-ring");
    var _dropDown      = document.getElementById("sampleDrop");
    var vRead          = document.getElementById("voltageRead");
    var _sliderX     = new OlySlider("sliderX", {orientation:"vertical"}); //x
    var _sliderY     = new OlySlider("sliderY", {orientation:"vertical"}); //y
    var _sliderF     = new OlySlider("sliderF", {orientation:"vertical"}); //focus
    var _sliderV     = new OlySlider("sliderV", {orientation:"vertical"}); //voltage
    var _outInGroup  = new HaRadioGroup("haVGroup", {orientation: "vertical"});
    var _objGroup    = new HaRadioGroup("haHGroup"); //magnification buttons
    var _imagePaths  = [];
    var _mags        = ["4x0","10x0","20x0","40x0"];
    var _splash      = OlySplash(initialize, _imagePaths);
    var _specimen    = [];
    // var ring         = $(_ringImage);
    var phaseMode    = 0; //starts at 0 because tut initializes with "Out" toggled
    var srcData      = [];
    var _rings       = [];
    var _ringsBack   = [];
    var _ringsFore   = [];
    var start        = 1; //controls dropHandler's first execution
    var hW           = 70; // half width of ring range
    var blur         = 0;
    var blurString   = 0;
    var vPos         = 0;
    var light        = 0;
    var x            = 0;
    var y            = 0;
    var x2           = 0;
    var y2           = 0;
    var vRead        = 0;
    var sabs         = 0;
    var brightString = 0;
    var choice       = "";
    var filters      = {};
    var topCan       = document.getElementById("top");
    var toptx        = topCan.getContext("2d");
    var btmCan       = document.getElementById("bottom");
    var btmtx        = btmCan.getContext("2d");
    var counter      = 0;
    var ringShader   = false;
    var _colorImgData = toptx.getImageData(0, 0, topCan.width, topCan.height);
    var _greyImgData = btmtx.getImageData(0, 0, btmCan.width, btmCan.height);
    var _currentImageData = toptx.getImageData(0, 0, topCan.width, topCan.height);
    var once       = true;
    var ctr        = 0;
    var focusArray = [];
    var selector   = true;
    var ran        = false;
    var fVal;
    var startUp    = true;
    var cloneData  = [];
    var handStart  = true;
    var phaseStart = true;
    var _WIDTH_HEIGHT = 208;
    var _blurImageDataObjectColor;
    var _blurImageDataObjectGrey;
    // var _hasBlured = false;


    function initialize() {
        _sliderF.setPosition(Math.random());
        fVal = _sliderF.getPosition();
        _sliderV.setPosition(Math.random());
        _sliderX.setPosition(Math.random());
        _sliderY.setPosition(Math.random());
        MEUtil.upscaleCanvas("top", 1);
        MEUtil.upscaleCanvas("bottom", 1);

        loadData(function() {
            adListeners();
            _outInGroup.setSelectedIndex(0);
            _objGroup.setSelectedIndex(3);  
            magChange();
            MEUtil.raf(enterFrameHandler);
            _splash.fadeOut();
        })
    }

    function initPxData(){
        _colorImgData = toptx.getImageData(0, 0, topCan.width, topCan.height);
        _greyImgData = btmtx.getImageData(0, 0, btmCan.width, btmCan.height);
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
            _specimen.push(new SpecimenPath(option.value, ".jpg"));
            _rings.push(new SpecimenPath($this.find("ringpath").text(), ".png"));
            _dropDown.appendChild(option);
        });
            _ringsBack = _rings.splice(0, 4);
            _ringsFore = _rings.splice(2, 9);
    }

    function checkImageCounter(numImages, callback) {
        counter++;
        if (numImages == counter) {
            callback();
        }
    }

    function adListeners() {
        //DROPDOWN SELECTION
        _dropDown.onchange = function() {
            magChange();
            randomizer();
        };

        //RESET BUTTON
        _btn.ontouch = randomizer;

        //MAG BUTTON GROUP
        _objGroup.onchange = function() {
            if (!startUp) {
                magChange();
            }
            startUp = false;
        };
        
        _sliderF.ontouchend = function(event) {
            blurCanvases();
            // if (phaseMode == 0) {
            //     choice = "A";
            //     slider = 3;
            //     checkPhase(choice);
            // }else {
            //     choice = "B";
            //     slider = 3;
            //     checkPhase(choice);
            // }
        };

        //OUT IN BUTTON GROUP
        _outInGroup.onchange = function() {
            if (_outInGroup.getSelectedIndex() == 1) { //"In"
                phaseMode = 1;
                toptx.clearRect(0, 0, topCan.width, topCan.height);
                toptx.drawImage(_ringImage, 0, 0);
                btmtx.clearRect(0, 0, btmCan.width, btmCan.height);
                btmtx.drawImage(_grey, 0, 0);
            } else { //"Out"
                phaseMode = 0;
                toptx.clearRect(0, 0, topCan.width, topCan.height);
                toptx.drawImage(_specimenImage, 0, 0);
                btmtx.clearRect(0, 0, btmCan.width, btmCan.height);
                btmtx.drawImage(_grey, 0, 0);
            }
            magChange();
        };
    }

    function mix(vx, vy, setting) {
        initPxData();
        ctr++;
        focusArray.push(fVal);
        var length = focusArray.length;

        if (ctr == 2) {                                 //if 2 then they're 2 values to compare
                ctr = 0;
            if (focusArray[length-1] != focusArray[length-2]) {
                focusArray = [];
                selector   = true;  
                ran        = true;
            }
        }else {  //if focus slider doesn't change and fVal = previous fVal then don't run blur.. (selector = false)
            selector = false;  
            if (ran) {                              //only pass cloned blur data to the topCan if the blurred canvas has recently been updated
                toptx.putImageData(cloneData, 0, 0); //putting new blurred image data to the topCan which now includes blurred data
                ran = false;
            }
        }

        var posX   = (1 - vx);
        var posY   = (1 - vy);
        var opctX  = 0;
        var opctY  = 0;

        var colorWeightVal = posX/2 + posY/2;
        var outputImageData = toptx.createImageData(topCan.width, topCan.height); //the new image data created should be also based on the if (ran) above

        var colorData = _colorImgData.data;
        var greyData  = _greyImgData.data;
        var outData   = outputImageData.data;

        for(var i = 0; i < outData.length; i+=4){
            var rc = colorData[i];
            var gc = colorData[i+1];
            var bc = colorData[i+2];

            var rg = greyData[i];
            var gg = greyData[i+1];
            var bg = greyData[i+2];

            var r_out = rc*colorWeightVal + rg*(1 - colorWeightVal);
            var g_out = gc*colorWeightVal + gg*(1 - colorWeightVal);
            var b_out = bc*colorWeightVal + bg*(1 - colorWeightVal);

            outData[i]   = r_out + setting;
            outData[i+1] = g_out + setting;
            outData[i+2] = b_out + setting;
            outData[i+3] = 255;
        }
        _currentImageData = outputImageData;
        toptx.putImageData(outputImageData, 0, 0);
        cloneNblur(outputImageData, selector);
    }

    function cloneNblur(data, sel) {
        // blur = Math.abs(_sliderF.getPosition(4, -4));

        // if (once) { //once is global = true;
        //     var cloneCan            = MEUtil.createCanvas(208, 208);
        //     cloneCan.style.position = "absolute";
        //     cloneCan.style.top      = 1 + "px";
        //     cloneCan.style.left     = 0 + "px";
        //     cloneCan.id             = "cloned";
        //     // cloneCan.style.zIndex   = 99;
        //     var specWrap            = document.getElementsByTagName("div")[2];
        //     specWrap.appendChild(cloneCan);
        //     clonetx = cloneCan.getContext("2d");
        //     once = false;
        // }

        // var clone = document.getElementById("cloned");
        // if (sel) { //l = selector
        //     // clone.style.zIndex = 99;
        //     clonetx.putImageData(data, 0, 0);
        //     stackBlurCanvasRGB("cloned", 0, 0, topCan.width, topCan.height, blur);
        //     cloneData = clonetx.getImageData(0, 0, topCan.width, topCan.height);
        // }else {
        //     // clone.style.zIndex = 0;
        // }
    } 

    function randomizer() {
        var xnew = Math.random(); 
        var ynew = Math.random(); 
        var vnew = Math.random();
        var fnew = Math.random(); 
        _sliderX.setPosition(xnew);
        _sliderY.setPosition(ynew);
        _sliderV.setPosition(vnew);
        _sliderF.setPosition(fnew);
    }

    function magChange() { //add to objGroup.onchange
        counter = 0;
        _specimenImage.onload = _grey.onload = function() {
            checkImageCounter(2, imagesComplete);
        };

        if (phaseMode == 0 && start == 1) {
            start = "started"; //alters start var to a string which keeps magChange from running this first if ever again
            var startIndex          = Math.round(Math.random()*9);
            _dropDown.selectedIndex = startIndex;
            var firstPath           = _dropDown.value;
            _specimenImage.src      = firstPath + "40x0.jpg";
            _grey.src               = firstPath + "40x1.jpg";
        }else if (phaseMode == 0)  {
            var index          = _dropDown.selectedIndex;
            var mag            = _objGroup.getSelectedIndex();
            var newPath        = _specimen[index].getPath(mag); //_specimen[index] chooses a SpecimenPath object from the 8 created in parsexml 
            _specimenImage.src = newPath.toString();     //and mag chooses an index in an array
            _grey.src          = _specimen[index].greyPath(mag);
        }else if (phaseMode == 1) {
            var mag        = _objGroup.getSelectedIndex();
            var backPath   = _ringsBack[mag].getPath(mag); //could i do: SpecimenPath("images/background").getRpath(mag); ??
            var ringPath   = _ringsFore[mag].getPath(mag); 
            _grey.src      = backPath.toString();
            _ringImage.src = ringPath.toString();
        } 
    }

    function imagesComplete() {
        console.log("magChange");

        btmtx.drawImage(_grey, 0, 0);
        toptx.drawImage(_specimenImage, 0, 0);
        _blurImageDataObjectColor = toptx.getImageData(0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT);
        _blurImageDataObjectGrey = btmtx.getImageData(0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT);
        blurCanvases();

        // if (phaseMode == 1) {
        //     toptx.clearRect(0, 0, topCan.width, topCan.height);
        //     toptx.drawImage(_ringImage, 0, 0);
        //     btmtx.clearRect(0, 0, btmCan.width, btmCan.height);
        //     btmtx.drawImage(_grey, 0, 0);
        //     // initPxData();
        //     checkPhase("B"); 
        // }else { //"Out"
        //     toptx.clearRect(0, 0, topCan.width, topCan.height);
        //     toptx.drawImage(_specimenImage, 0, 0);
        //     btmtx.clearRect(0, 0, btmCan.width, btmCan.height);
        //     btmtx.drawImage(_grey, 0, 0);
        //     // initPxData();
        //     checkPhase("A"); 
        // }
    }
    // function changeLight(s) {
    //     s = (0.75 - s * 2) / 42;
    
    //     if (s > 0) {
    //         s *= 3;
    //         s *= (2/3);
    //     }
    
    //     s += 1;
    //     sabs = Math.abs(s);
    //     return sabs;
    // }

    function checkPhase(str) { //t = scope setting Out or In is True, or False for terinary to draw to canvas correctly and later get correct data
        // blur   = Math.abs(_sliderF.getPosition(4, -4));
        // vPos   = _sliderV.getPosition(180, -140); //brightness range

        // switch (str)
        // {
        //     case "A":
        //         topCan.style.left = -2+"px";
        //         topCan.style.top  = -2+"px";
        //         valX = Math.abs(_sliderX.getPosition(-1, 1));
        //         valY = Math.abs(_sliderY.getPosition(-1, 1));
        //         phaseStart ? stackBlurCanvasRGB("top", 0, 0, topCan.width, topCan.height, blur) : mix(valX, valY, vPos); //makes it blur once on start
        //         phaseStart = false; //makes it run mix only after 1st run
        //     break;

        //     // case "B":
        //     //     var spix     = toptx.getImageData(0, 0, topCan.width, topCan.height);
        //     //     var sImgData = filters.ringDimmer(spix, vPos);
        //     //     toptx.putImageData(sImgData, 0, 0);

        //     //     var gpix     = btmtx.getImageData(0, 0, btmCan.width, btmCan.height);
        //     //     var gImgData = filters.backDimmer(gpix, vPos);
        //     //     btmtx.putImageData(gImgData, 0, 0);

        //     //     stackBlurCanvasRGBA("top", 0, 0, topCan.width, topCan.height, blur2);
        //     //     stackBlurCanvasRGB("bottom", 0, 0, btmCan.width, btmCan.height, blur);

        //     //     x  = _sliderX.getPosition(hW, 0);
        //     //     y  = _sliderX.getPosition(0, hW);
        //     //     x2 = _sliderY.getPosition(0, hW);
        //     //     y2 = _sliderY.getPosition(0, hW);
        //     //     topCan.style.left    = (x+x2) + "px";
        //     //     topCan.style.top     = (y+y2) + "px";
        //     //     topCan.style.opacity = 1.0;
        //     // break;
        // }
    }

    // function enterFrameHandler(timeStamp) {
    //     _sliderF.onchange = function(event) { 
    //         fVal = _sliderF.getPosition(); //FEED THIS VALUE TO YOUR MIX FUNCTION
    //     }; 

    //    switch (phaseMode) 
    //    {
    //     case 0: //OUT
    //         if (_sliderX.hasChanged || _sliderY.hasChanged || _sliderV.hasChanged) { 
    //                 choice = "A";
    //                 checkPhase(choice); //checkPhase(choice, slider);
    //                 _sliderV.hasChanged = false;
    //                 _sliderX.hasChanged = false; 
    //                 _sliderY.hasChanged = false; 
    //             }
    //     break;
        
    //     case 1: //IN
    //         if (_sliderV.hasChanged || _sliderX.hasChanged || _sliderY.hasChanged) {
    //             choice = "B";
    //             checkPhase(choice);
    //             _sliderV.hasChanged = false;
    //             _sliderX.hasChanged = false;
    //             _sliderY.hasChanged = false;
    //         }
    //     break;
    //    }
    //     MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
    // }

    function enterFrameHandler(timeStamp) {
        // _sliderF.onchange = function(event) { 
        //     fVal = _sliderF.getPosition(); //FEED THIS VALUE TO YOUR MIX FUNCTION
        // }; 

       switch (phaseMode) 
       {
        case 0: //OUT
            if (_sliderX.hasChanged || _sliderY.hasChanged) { 
                blendCanvases();
                _sliderX.hasChanged = false;
                _sliderY.hasChanged = false;
            }
            // else if(_sliderF.hasChanged){
            //     blurCanvases();
            //     _sliderF.hasChanged = false;
            // }
            else if(_sliderV.hasChanged){
                adjustCanvasesBrightness();
                _sliderV.hasChanged = false;
            }
        break;
        
        case 1: //IN
            if (_sliderV.hasChanged || _sliderX.hasChanged || _sliderY.hasChanged) {
            }
        break;
       }
        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
    }

    function blendCanvases(){
        // console.log("BLEND");
        var vx = Math.abs(_sliderX.getPosition(-1, 1));
        var vy = Math.abs(_sliderY.getPosition(-1, 1));
        var posX   = (1 - vx);
        var posY   = (1 - vy);
        var colorCanvasOpacity = posX/2 + posY/2;
        topCan.style.opacity = colorCanvasOpacity;
    }

    function blurCanvases(){
        // console.log("blur")
        var blur   = Math.abs(_sliderF.getPosition(4, -4));

        btmtx.clearRect(0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT);
        toptx.clearRect(0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT);
        
        btmtx.drawImage(_grey, 0, 0);
        toptx.drawImage(_specimenImage, 0, 0);

        stackBlurCanvasRGB("top", 0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT, blur);
        stackBlurCanvasRGB("bottom", 0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT, blur);

        _blurImageDataObjectColor = toptx.getImageData(0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT);
        _blurImageDataObjectGrey = btmtx.getImageData(0, 0, _WIDTH_HEIGHT, _WIDTH_HEIGHT);

        adjustCanvasesBrightness();
    }

    function adjustCanvasesBrightness(){
        var setting = _sliderV.getPosition(180, -140);
        var outputImageDataColor = toptx.createImageData(_WIDTH_HEIGHT, _WIDTH_HEIGHT);
        var outputImageDataGrey = btmtx.createImageData(_WIDTH_HEIGHT, _WIDTH_HEIGHT);

        var colorData = _blurImageDataObjectColor.data;
        var greyData  = _blurImageDataObjectGrey.data;

        var outDataColor = outputImageDataColor.data;
        var outDataGrey = outputImageDataGrey.data;

        for(var i = 0; i < outDataColor.length; i+=4){
            outDataColor[i]   = colorData[i] + setting;
            outDataColor[i+1] = colorData[i+1] + setting;
            outDataColor[i+2] = colorData[i+2] + setting;
            outDataColor[i+3] = 255;

            outDataGrey[i]   = greyData[i] + setting;
            outDataGrey[i+1] = greyData[i+1] + setting;
            outDataGrey[i+2] = greyData[i+2] + setting;
            outDataGrey[i+3] = 255;
        }

        toptx.putImageData(outputImageDataColor, 0, 0);
        btmtx.putImageData(outputImageDataGrey, 0, 0);
    }

    function SpecimenPath(basePath, ext) {   //specName param removed  //basePath = all specimen names from parsexml and specimenpaths too
        this.basePath  = basePath;
        this.ext       = ext;
        this.specPaths = {
            grey  :  this._createPaths("1"), //function returns an array
            color :  this._createPaths("0") //therefore color = the array in _createPaths
        };
    }
    
    SpecimenPath.prototype.getPath = function(magIndex) {
        return this.specPaths.color[magIndex]; //b/c color is array you can access it's values which are full paths
    };

    SpecimenPath.prototype.greyPath = function(magIndex) {
        return this.specPaths.grey[magIndex];
    };
    
    SpecimenPath.prototype._createPaths = function(suffix) {
        return [
            this.basePath + "4x" + suffix  + this.ext,
            this.basePath + "10x" + suffix + this.ext,
            this.basePath + "20x" + suffix + this.ext,
            this.basePath + "40x" + suffix + this.ext
        ];
    };
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);