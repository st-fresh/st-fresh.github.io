function startTutorial() {
    var _btn           = new OlyButton("btnReset");
    var _grey          = document.getElementById("greyImage");
    var _specimenImage = document.getElementById("round-image");
    var _ringImage     = document.getElementById("round-ring");
    var _dropDown      = document.getElementById("sampleDrop");
    var vRead          = document.getElementById("voltageRead");
    var _sliderX     = new OlySlider("sliderX", {orientation:"vertical"}); //x
    var _sliderY     = new OlySlider("sliderY", {orientation:"vertical"}); //y
    var _sliderF     = new OlySlider("sliderF", {orientation:"vertical"}); //focus
    var _sliderV     = new OlySlider("sliderV", {orientation:"vertical"}); //voltage
    var _outInGroup  = new HaRadioGroup("haVGroup", {orientation: "vertical"});
    var _objGroup    = new HaRadioGroup("haHGroup"); //magnification buttons
    var _imagePaths  = ["images/background4x0.png", "images/background10x0.png", "images/background20x0.png", "images/background40x0.png", "images/ring4x0.png", "images/ring10x0.png", "images/ring20x0.png", "images/ring40x0.png"];
    var _mags        = ["4x0","10x0","20x0","40x0"];
    var _splash      = OlySplash(initialize, _imagePaths);
    var _specimen    = [];
    var ring         = $(_ringImage);
    var phaseMode    = 0; //starts at 0 because tut initializes with "Out" toggled
    var srcData      = [];
    var _rings       = [];
    var _ringsBack   = [];
    var _ringsFore   = [];
    var ringSet      = [];
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
    var cssSpec;
    var cssGrey;
    var style;
    var cssRing;

    function initialize() {

        _sliderF.setPosition(Math.random());
        _sliderV.setPosition(Math.random());
        _sliderX.setPosition(Math.random());
        _sliderY.setPosition(Math.random());

        loadData(function() {
            adListeners();
            _outInGroup.setSelectedIndex(0);
            _objGroup.setSelectedIndex(3);  
            magChange();
            MEUtil.raf(enterFrameHandler);
            _splash.fadeOut();
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
            _specimen.push(new SpecimenPath(option.value, ".jpg"));
            _rings.push(new SpecimenPath($this.find("ringpath").text(), ".png"));
            _dropDown.appendChild(option);
        });
            _ringsBack = _rings.splice(0, 4);
            _ringsFore = _rings.splice(2, 9);
    }

    function adListeners() {
        _dropDown.onchange = function() {
            magChange();
            randomizer();
        };

        //RESET BUTTON
        _btn.ontouch = randomizer;

        //MAG BUTTON GROUP
        _objGroup.onchange = magChange; //magChange starts starts on "Out" b/c phaseMode initialized at 0

        _outInGroup.onchange = function() {
            if (_outInGroup.getSelectedIndex() == 1) { //"In"
                phaseMode = 1;
                _ringImage.style.visibility = "visible";
            } else { //"Out"
                phaseMode = 0;
            }
            magChange();
            return phaseMode;
        };
    }

    function mix(vx, vy) {
        var posX  = (1 - vx);
        var posY  = (1 - vy);
        var opctX = 0;
        var opctY = 0;
        _specimenImage.style.opacity = posX/2 + posY/2;
    }

    function getRandom(min, max) {
       return Math.random() * (max - min) + min;
    }

    function randomizer() {
        //WHITE RING RANDOM
        var xnew = Math.random(); 
        var ynew = Math.random(); 
        var vnew = Math.random(); 
        var fnew = Math.random(); 
        _sliderX.setPosition(xnew);
        _sliderY.setPosition(ynew);
        _ringImage.style.webkitTransform = "translate(" + xnew + "px, " + ynew + "px)";
        
        //FOCUS AND BRIGHTNESS RANDOM
        _sliderV.setPosition(vnew);
        _sliderF.setPosition(fnew);
    }

    function magChange() { //add to objGroup.onchange 
        if (phaseMode == 0 && start == 1) {
            srcData = [];
            start = "started";
            var startIndex          = Math.round(Math.random()*9);
            _dropDown.selectedIndex = startIndex;
            var firstPath           = _dropDown.value;
            _specimenImage.src      = firstPath + "40x0.jpg";
            _grey.src               = firstPath + "40x1.jpg";
            srcData.push(firstPath + "40x0.jpg");
        }else if (phaseMode == 0)  {
            _specimenImage.style.visibility = "visible";
            _ringImage.style.zIndex = 10;
            srcData = [];
            var index          = _dropDown.selectedIndex;
            var mag            = _objGroup.getSelectedIndex();
            var newPath        = _specimen[index].getPath(mag); //_specimen[index] chooses a SpecimenPath object from the 8 created in parsexml 
                _specimenImage.src = newPath.toString();     //and mag chooses an index in an array
            _grey.src          = _specimen[index].greyPath(mag);
            srcData.push(newPath.toString());
        }else if (phaseMode == 1) {
            _specimenImage.style.visibility = "hidden";
            _ringImage.style.zIndex = 25;
            srcData = [];
            var mag             = _objGroup.getSelectedIndex();
            var backPath        = _ringsBack[mag].getPath(mag); //could i do: SpecimenPath("images/background").getRpath(mag); ??
            var ringPath        = _ringsFore[mag].getPath(mag); 
            _grey.src      = backPath.toString();
            _ringImage.src = ringPath.toString();
            srcData.push(_ringsBack[mag].getPath(mag), _ringsFore[mag].getPath(mag));
        } 
        return srcData[0];
    }

    function changeLight(s) {
        s = (0.75 - s * 2) / 42;
    
        if (s > 0) {
            s *= 3;
            s *= (2/3);
        }
    
        s += 1;
        sabs = Math.abs(s);
        // brightString = "brightness(" + sabs + ")";
        return sabs;
    }

    function checkPhase(str) {
        blur       = Math.abs(_sliderF.getPosition(3, -3));
        // blurString = "blur(" + blur + "px)";
        var isiPad = navigator.userAgent.match(/iPad/i) != null;
        console.log(isiPad);
        vPos       = _sliderV.getPosition(80, 40);
        if (isiPad) {
            light = _sliderV.getPosition(.72, -.48);
        } else if (!isiPad) {
            light = changeLight(vPos);
        }
        vRead      = Math.round(Math.abs(_sliderV.getPosition(-12,0)));
        voltageRead.innerHTML = "Voltage: " + vRead + "V";
        // light = _sliderV.getPosition();
        // console.log(light);
        // _specimenImage.style["webkitFilter"] = "blur(" + blur + "px)";
        // _specimenImage.style["webkitTransform"] = "rotate(45deg)"; //blur(10px)

        // console.log(MEUtil.getPrefixedProp("filter"));

        switch (str)
        {
            case "mix":
                valX = Math.abs(_sliderX.getPosition(-1, 1));
                valY = Math.abs(_sliderY.getPosition(-1, 1));
                mix(valX, valY); 
            break;

            case "blurBrightA":
                vRead    = Math.round(Math.abs(_sliderV.getPosition(-12,0)));
                voltageRead.innerHTML = "Voltage: " + vRead + "V";
                // cssSpec  = _specimenImage.getAttribute("style"); //declare last in initialize
                // cssGrey  = _grey.getAttribute("style"); //declare last in initialize
                // style    = "-webkit-filter: blur(" + blur + "px); -webkit-filter: brightness(" + light + "); -moz-filter: blur(" + blur + "px); -moz-filter:  brightness(" + light + "); filter: blur(" + blur + "px); filter: brightness(" + light + ");" //(border: solid 1px #0000ff; background-color: #ffff00;';
                // cssSpec += style;
                // cssGrey += style;
// console.log(style, "Out");
_specimenImage.style["webkitFilter"] = "blur(" + blur + "px) brightness(" + light + ")";
                // _specimenImage.setAttribute("style", cssSpec);
_grey.style["webkitFilter"] = "blur(" + blur + "px) brightness(" + light + ")";

                // _grey.setAttribute("style", cssGrey);
                // _specimenImage.style.webkitFilter = blurString + "" + light;
                // _specimenImage.style.mozFilter    = blurString + "" + light;
                // _specimenImage.style.filter       = blurString + "" + light;
                // _grey.style.webkitFilter          = blurString + "" + light;
                // _grey.style.mozFilter             = blurString + "" + light;
                // _grey.style.filter                = blurString + "" + light;
            break;

            case "blurBrightB":
                // cssRing  = _ringImage.getAttribute("style"); //declare last in initialize
                // cssGrey  = _grey.getAttribute("style"); //declare last in initialize
                // style    = "-webkit-filter: blur(" + blur + "px); -webkit-filter: brightness(" + light + "); -moz-filter: blur(" + blur + "px); -moz-filter:  brightness(" + light + "); filter: blur(" + blur + "px); filter: brightness(" + light + ");" //(border: solid 1px #0000ff; background-color: #ffff00;';
                // cssRing += style;
                // cssGrey += style;
// console.log(style, "In");
_ringImage.style["webkitFilter"] = "blur(" + blur + "px) brightness(" + light + ")";

                // _ringImage.setAttribute("style", cssRing);
_grey.style["webkitFilter"] = "blur(" + blur + "px) brightness(" + light + ")";

                // _grey.setAttribute("style", cssGrey);

                // _ringImage.style.webkitFilter = blurString + "" + light;
                // _ringImage.style.mozFilter    = blurString + "" + light;
                // _ringImage.style.filter       = blurString + "" + light;
                // _grey.style.webkitFilter      = blurString + "" + light;
                // _grey.style.mozFilter         = blurString + "" + light;
                // _grey.style.filter            = blurString + "" + light;
            break;

            case "xy":
                x     = _sliderX.getPosition(hW, 0);
                y     = _sliderX.getPosition(0, hW);
                x2    = _sliderY.getPosition(0, hW);
                y2    = _sliderY.getPosition(0, hW);
                _ringImage.style.webkitTransform = "translate(" + (x+x2) + "px, " + (y+y2) + "px)";
            break;
        }
    }

    function enterFrameHandler(timeStamp) {
       switch (phaseMode) 
       {
        case 0:
            if (_sliderX.hasChanged || _sliderY.hasChanged) { 
                choice = "mix";
                checkPhase(choice);
                _sliderX.hasChanged = false; 
                _sliderY.hasChanged = false; 
            }else if (_sliderF.hasChanged || _sliderV.hasChanged) {
                choice = "blurBrightA";
                checkPhase(choice);
                _sliderF.hasChanged = false;
                _sliderV.hasChanged = false;
            }
        break;
        
        case 1:
            choice = "blurBrightB"
            checkPhase(choice);
            
            if (_sliderX.hasChanged || _sliderY.hasChanged) {
                choice = "xy";
                checkPhase(choice);
                _sliderX.hasChanged = false;
                _sliderY.hasChanged = false;
            }
        break;
       }
        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
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