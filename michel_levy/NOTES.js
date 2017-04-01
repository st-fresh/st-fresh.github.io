//  var backPath = _rings[0].getRpath(0);
//  var ringPath = _rings[1].getRpath(0);
// ringset = ["back4x","ring4x"];

//  _specimenImage.src = ringSet[0].toString();
//  _ringImage.src = ringSet[1].toString();
//  srcBack = ringSet[0].toString();
//  srcRing = ringSet[1].toString();
//  

//HTML
<CANVAS ID="gridScreen" WIDTH="160" HEIGHT="160"></CANVAS> 
<CANVAS ID="drawBW" WIDTH="185" HEIGHT="182"></CANVAS>
<CANVAS ID="drawColor" WIDTH="185" HEIGHT="182"></CANVAS>

<DIV CLASS="contianer">
		<DIV CLASS="specimenWindow">
			<DIV CLASS="specimenTitle">Specimen Image</DIV>
			<DIV CLASS="specimenImage">
				<DIV CLASS="op" ID="specImg"></DIV>
				<DIV CLASS="specC" ID="specImgC"></DIV>
			</DIV>
		</DIV>
	</DIV>

//CSS
#drawBW {
	position: absolute;
	top: 78px;
	left: 37px;
	z-index: 99;
}

#drawColor {
	position: absolute;
	top: 78px;
	left: 37px;
	z-index: 99;
}

#gridScreen {
	position: absolute;
	top: 81px;
	left: 63px;
	background-color: #FFFFFF;
	border: solid 2px black;
}


//JS










function storeGrayData(canvasName, imageSRC) {
	return {
//blend to the grayscale images(which aren't completely gray scaled!!)
//use michellevy.js blend logic
	}
}

//call storeGrayData once for current image src each time _sliderX, or _sliderY is moved. 





