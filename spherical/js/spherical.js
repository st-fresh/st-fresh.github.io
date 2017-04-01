function startTutorial() {
    var _dropDown   = document.getElementById("sampleDrop");
    var specImg     = document.getElementById("specImg");
    var discPlane   = document.getElementById("discPlane");
    var dimPlane    = document.getElementById("dimPlane");
    var lens        = document.getElementById("lens");
    var specCan     = document.getElementById("specCanvas");
    var rimLine     = document.getElementById("rimLine");
    var dlcLine     = document.getElementById("dlcLine");
    var pfpLine     = document.getElementById("pfpLine");
    
    var testCan = document.getElementById("testCan");
    var txt     = testCan.getContext("2d");

    
    // var staticRayCan  = document.getElementById("staticRayCan");
    var stx         = specCan.getContext("2d");
    var _slider     = new OlySlider("slider");
    var _imagePaths = ["images/samples/bovine.jpg","images/samples/crownwart.jpg","images/samples/diatoms.jpg","images/samples/dinobone.jpg","images/samples/pinus.jpg","images/samples/tickmouth.jpg","images/samples/tiliastem.jpg","images/samples/tongue.jpg"];
    var _splash     = OlySplash(initialize, _imagePaths);
    var specIndex   = Math.round(Math.random() * (7 - 0) + 0);
    var value       = "";
    var values      = [];
    
    //drawLine vars
    var outerMostRayA = [];
    var outerMostRayB = [];
    var innerMostRayA = [];
    var innerMostRayB = [];
    var middlMostRayA = [];
    var middlMostRayB = [];
    var ray = (function() {
        var can = MEUtil.upscaleCanvas("rayCan");
        var h = $(can).height();

        return {
            can    : MEUtil.upscaleCanvas("rayCan"),
            ctx    : can.getContext("2d"), //THIS RIGHT IMPLEMENTATION??
            top    : 0,
            base   : h,
            offset : h - 40
        };
    }());
    //end

    function initialize() {
        MEUtil.upscaleCanvas("specCanvas");
        discPlane.src = "images/disc16.jpg";
        dimPlane.src  = "images/02.jpg";
        lens.style.height = 40 + "px";
        lens.style.width  = 72 + "px";
// var H2 = 188;
    // var H3 = 40;
    // var H4 = 0;
        //drawLine inits
        outerMostRayA[0] = Point( 7.5,  ray.offset);
        outerMostRayB[0] = Point(71.5,  ray.offset);

        outerMostRayA[1] = Point(  51,  ray.top);
        outerMostRayB[1] = Point(27.5,  ray.top);


        middlMostRayA[0] = Point(21.5,  ray.offset);
        middlMostRayB[0] = Point(57.5,  ray.offset);

        middlMostRayA[1] = Point(  43,  ray.top);
        middlMostRayB[1] = Point(  36,  ray.top);

        innerMostRayA[0] = Point(33.5,  ray.offset);
        innerMostRayB[0] = Point(45.5,  ray.offset);

        innerMostRayA[1] = Point(39.5,  ray.top);
        innerMostRayB[1] = Point(39.5,  ray.top);
        //end
        loadData(function() {
            addListeners();
            initControls();
            console.log(specIndex);
            specImg.src = _imagePaths[specIndex];
            // drawStaticLines();
            drawLines(0,0);
            MEUtil.raf(enterFrameHandler);
            _splash.fadeOut();
        })
    }

    function loadData(callback) {
        $.ajax({
            type: "GET", url: "data/specimens.xml", dataType: "xml",
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
            var option   = document.createElement("option");
            var $this    = $(this);
            option.text  = $this.find("name").text();
            option.value = $this.find("specimenpath").text();
            value = option.value;
            values.push(value);
            _dropDown.appendChild(option);
        })
            console.log(values, "index", specIndex);
            _dropDown.value = values[specIndex];
    }

    function addListeners() {
        _dropDown.onchange = function() {
            changeHandler();
        }
    }

    function changeHandler() {
        var path = _dropDown.value;
        specImg.src = path;
        compoundBlur();
    }

    function initControls() {
        _slider.setPosition(0);        
    }

    function compoundBlur() {
        //NEW BLUR START-------//
            // txt = testCan.getContext("2d");
            // txt.drawImage(specImg, 0,0);
            // var sCanData = txt.getImageData(0,0,150,150);
            // console.log(sCanData.data);
            // // var sData = sCanData.data;
            // var w = 150;
    
            // for (var i = 1; i < 10; i++) {//sData.length
            //     // var dat1 = sData[i - 1];
            //     // var dat2 = sData[i];
            //     var amnt = i;
            //     sCanData = blur(sCanData, w, amnt);
            // }

            // txt.putImageData(sCanData, 0, 0);


        //NEW BLUR END--------//

        //PREVIOUS BLUR START------//
            stx.clearRect(0, 0, 150, 150);
            if (specImg.src == "http://java/html5/Olympus/source/java/aberrations/spherical_JonJames/mobile/images/samples/diatoms.jpg") {
                var radius    = 38;
                var specBlur  = true;
                var drkRange  = _slider.getPosition(0, 0.14);
                var minRadius = 3.34;
            }else {
                var radius    = 60;
                var drkRange  = _slider.getPosition(0, 0.12);
                var minRadius = 7;
            }

            var lensRead   = _slider.getPosition(0, minRadius);
            // console.log(lensRead);
            var lensRead2  = _slider.getPosition(0, 1.8);
            var rData      = getRadialGradientMap(150, 150, 75, 75, 30, radius); 
            
            if (lensRead2 > 0.16) {
                lensRead2  = 1.99;
            }

            // if (specBlur == true) {
            //     stackBlurCanvasRGB("specCanvas", 0, 0, 150, 150, 1.8);
            //     var sData = specCan.getImageData(0,0,150,150);
            //     var forBlurData = sData.data;
            //     specCan.putImageData(forBlurData, 0, 0);
            //     specBlur = false;
            // }
    
            compoundBlurImage( "specImg", "specCanvas", rData, lensRead, 1, 1.90, false );
            stackBlurCanvasRGB("specCanvas", 0, 0, 150, 150, lensRead2);
            if (specBlur == true) { stackBlurCanvasRGB("specCanvas", 0, 0, 150, 150, 0.5); specBlur = false; }
            stx.fillStyle = "rgba(0, 0, 0," + drkRange + ")";
            stx.fillRect(0, 0, 150, 150);

        // compoundBlurImage( imageID, canvasID, radiusData, minRadius, increaseFactor, blurLevels, blurAlphaChannel );
        // getRadialGradientMap( width, height, centerX, centerY, innerRadius, outerRadius ) 
        //PREVIOUS BLUR END--------//
    }

    function blur(sDatObject, w, amount) {
        var sdat = sDatObject.data;
        var dDatObject = txt.createImageData(150, 150);
        var ddat = dDatObject.data;
        // txt.clearRect(0,0,150,150); //WHERE TO CLEAR RECT??
        // console.log(sdat);
        // console.log(ddat);
        for (var y = 1; y < (sdat.length/w) - 1; y++) {
            var offset = y*w +2;

            var p2 = sdat[offset - w - 2];
            var p3 = sdat[offset - w - 1];
            var p5 = sdat[offset - 2];
            var p6 = sdat[offset - 1];
            var p8 = sdat[offset + w - 2];
            var p9 = sdat[offset + w - 1];
            offset--;
        
            for(var x = 1; x < w - 1; x++); {
                var distance_sq = (x - w / 2) * (x - w / 2) + (y - sdat.length / w / 2) * (y - sdat.length / w / 2);
        
                var p1 = p2;
                p2 = p3;
                p3 = sdat[offset - w + 1];
                var p4 = p5;
                p5 = p6;
                p6 = sdat[offset + 1];
                var p7 = p8;
                p8 = p9;
                p9 = sdat[offset + w + 1];
        
                var rsum = (p1 ) + (p2 ) + (p3 ) + 
                           (p4 ) + (p5 ) + (p6 ) +
                           (p7 ) + (p8 ) + (p9 );
                var gsum = (p1 ) + (p2 ) + (p3 ) + 
                           (p4 ) + (p5 ) + (p6 ) +
                           (p7 ) + (p8 ) + (p9 );
                var bsum = (p1 ) + (p2 ) + (p3 ) + 
                           (p4 ) + (p5 ) + (p6 ) +
                           (p7 ) + (p8 ) + (p9 );
        
                var div = distance_sq / 80000 + 9;
                rsum /= div;
                gsum /= div;
                bsum /= div;
        
                if( distance_sq < ((amount-1) * 1000) )
                {
                    ddat[offset] = sdat[offset];
                    offset++;
                }
                else
                {
                    ddat[offset] = rsum;
                    ddat[offset+1] = gsum;
                    ddat[offset+2] = bsum;
                    ddat[offset+3] = 255;
                    // dst[offset++] = 0xff000000 | (rsum & 0xff0000) | (gsum & 0xff00) | (bsum & 0xff);
                }
    }

             }
            return dDatObject;
}

    function drawLines(out, mid) { //DRY NOT MET, H2, AND H4 REPEATED
        // var ray.ctx         = ray.can.getContext("2d");
        ray.ctx.strokeStyle = "#ed0707";
        ray.ctx.lineWidth   = 2; //LINES LOOK BETTER ON IPAD WITH THIS .1 > IT'S VALUE IN drawStaticLines()
        ray.ctx.clearRect(0,0,78,228);

        ray.ctx.beginPath();
        // var rayCan = {
        //     base : ray.can.height,
        //     offset : ray.can.height - 40
        // };

        //DRAW OUTER-MOST LINES A&B, A's increase x vals, B's decrease x vals
        ray.ctx.moveTo(outerMostRayA[0].x, ray.base);
        ray.ctx.lineTo(outerMostRayA[0].x, ray.offset);
        ray.ctx.lineTo((outerMostRayA[1].x + out), ray.top); //end   1

        ray.ctx.moveTo(outerMostRayB[0].x, ray.base);
        ray.ctx.lineTo(outerMostRayB[0].x, ray.offset);
        ray.ctx.lineTo((outerMostRayB[1].x - out), ray.top); //end   1
        
        //DRAW MIDDLE-MOST LINES A&B
        ray.ctx.moveTo(middlMostRayA[0].x, ray.base);
        ray.ctx.lineTo(middlMostRayA[0].x, ray.offset);
        ray.ctx.lineTo((middlMostRayA[1].x + mid), ray.top); //end   1

        ray.ctx.moveTo(middlMostRayB[0].x, ray.base);
        ray.ctx.lineTo(middlMostRayB[0].x, ray.offset);
        ray.ctx.lineTo((middlMostRayB[1].x - mid), ray.top); //end   1

        //DRAW INNER-MOST LINES A&B
        ray.ctx.moveTo(innerMostRayA[0].x, ray.base);
        ray.ctx.lineTo(innerMostRayA[0].x, ray.offset);
        ray.ctx.lineTo(innerMostRayA[1].x, ray.top); //end   1

        ray.ctx.moveTo(innerMostRayB[0].x, ray.base);
        ray.ctx.lineTo(innerMostRayB[0].x, ray.offset);
        ray.ctx.lineTo(innerMostRayB[1].x, ray.top); //end   1

        ray.ctx.stroke();
    }

    function Point(x,y) {
        return {
                 x : x,
                 y : y
               };
    }


    function discChange() {
        //change the discPlane image based on new _slider pos'
    }

    function dimChange() {
        //change the dimPlane image based on new _slider pos'
    }

    function translateLens() {
        //change the lens location when _slider changes
    }

    function translateBars() {
        //change the label bar locations when _slider changes
    }

    function translateLabels() {
        //change label locations when _slider changes
    }


    function enterFrameHandler(timeStamp) {
        var lensPos = _slider.getPosition(40,72);
        var lensVarFactor = 202 - (lensPos/2); //THIS IS NOT MAKING EXPANDING OF LENS SMOOTHER
        var discPos = Math.round(_slider.getPosition(1,8));
        var dimPos  = Math.round(_slider.getPosition(1,10));
        var outerLineRange = _slider.getPosition(0, 25);
        var middlLineRange = _slider.getPosition(0, 5);
        var dlcLineRange   = _slider.getPosition(55, 99);
        var rimLineRange   = _slider.getPosition(62, 114);
        var pfpLineRange   = _slider.getPosition(13, 23);
// rimLine
// dlcLine
// pfpLine

        if (_slider.hasChanged) {
            compoundBlur();
            drawLines(outerLineRange, middlLineRange);

            lens.style.height = lensPos + "px";
            lens.style.width  = 72 + "px";
            lens.style.top = lensVarFactor + "px";

            //labels & lines
            dlcLine.style.top = dlcLineRange + "px";
            rimLine.style.top = rimLineRange + "px";
            pfpLine.style.top = pfpLineRange + "px";

        switch(discPos) { //PULL SWITCH INTO A FUNCTION??
            case 1:
            discPlane.src = "images/disc16.jpg";
            break;
            case 2:
            discPlane.src = "images/disc15.jpg";
            break;
            case 3:
            discPlane.src = "images/disc14.jpg";
            break;
            case 4:
            discPlane.src = "images/disc13.jpg";
            break;
            case 5:
            discPlane.src = "images/disc10.jpg";
            break;
            case 6:
            discPlane.src = "images/disc8.jpg";
            break;
            case 7:
            discPlane.src = "images/disc4.jpg";
            break;
            case 8:
            discPlane.src = "images/disc2.jpg";
            break;
        }

        switch(dimPos) { //PULL SWITCH INTO A FUNCTION
            case 1:
            dimPlane.src = "images/02.jpg";
            break;
            case 2:
            dimPlane.src = "images/03.jpg";
            break;
            case 3:
            dimPlane.src = "images/04.jpg";
            break;
            case 4:
            dimPlane.src = "images/05.jpg";
            break;
            case 5:
            dimPlane.src = "images/06.jpg";
            break;
            case 6:
            dimPlane.src = "images/08.jpg";
            break;
            case 7:
            dimPlane.src = "images/10.jpg";
            break;
            case 8:
            dimPlane.src = "images/12.jpg";
            break;
            case 9:
            dimPlane.src = "images/14.jpg";
            break;
            case 10:
            dimPlane.src = "images/16.jpg";
            break;
        }

            _slider.hasChanged = false;
        }


        MEUtil.raf(enterFrameHandler); // DO NOT MOVE; LEAVE AS LAST STATEMENT
    }
}

// \/ NO TOUCHY \/
$(document).ready(startTutorial);