var sCanData = ctx.getImageData(0,0,150,150);
var sData = canData.data;

var w = 150;

for (var i = 1; i < sData.length; i++) {
	blur(sData[i - 1], sData[i], w, i); //	blur(dna_src[i - 1].getPixels(), dna_src[i].getPixels(), dna_w, i);
}

function blur(sdat, ddat, w, amount) {

// for (var i = 0; i < sdat.length; i+=4) {
// 	var r = data[i];
// 	var g = data[i+1];
// 	var b = data[i+2];
// 	var a = data[i+3];
// }

for (var y = 1; y < (sdat.length/w) - 1; y++) {
	var offset = y*w +2;

	var p2 = ddat[offset - w - 2];
	var p3 = ddat[offset - w - 1];
	var p5 = ddat[offset - 2];
	var p6 = ddat[offset - 1];
	var p8 = ddat[offset + w - 2];
	var p9 = ddat[offset + w - 1];
	offset--;

	for(var x = 1; x < w - 1; x++); {
		var distance_sq = (x - w / 2) * (x - w / 2) + (y - sdat.length / w / 2) * (y - sdat.length / w / 2);

		var p1 = p2;
		p2 = p3;
		p3 = ddat[offset - w + 1];
		var p4 = p5;
		p5 = p6;
		p6 = ddat[offset + 1];
		var p7 = p8;
		p8 = p9;
		p9 = ddat[offset + w + 1];

		var rsum = (p1 & 0xff0000) + (p2 & 0xff0000) + (p3 & 0xff0000) + 
	   			   (p4 & 0xff0000) + (p5 & 0xff0000) + (p6 & 0xff0000) +
	   			   (p7 & 0xff0000) + (p8 & 0xff0000) + (p9 & 0xff0000);
		var gsum = (p1 & 0x00ff00) + (p2 & 0x00ff00) + (p3 & 0x00ff00) + 
	   			   (p4 & 0x00ff00) + (p5 & 0x00ff00) + (p6 & 0x00ff00) +
	   			   (p7 & 0x00ff00) + (p8 & 0x00ff00) + (p9 & 0x00ff00);
        var bsum = (p1 & 0x0000ff) + (p2 & 0x0000ff) + (p3 & 0x0000ff) + 
	   			   (p4 & 0x0000ff) + (p5 & 0x0000ff) + (p6 & 0x0000ff) +
	   			   (p7 & 0x0000ff) + (p8 & 0x0000ff) + (p9 & 0x0000ff);

	    var div = distance_sq / 80000 + 9;
	    rsum /= div;
	    gsum /= div;
	    bsum /= div;

	    if ( distance_sq < ((amount - 1) * 1000) ) {
	    	ddat[offset] = sData[amount - 1];
	    }else {
	    	ddat[offset++] = 0xff000000 | (rsum & 0xff0000) | (gsum & 0xff00) | (bsum & 0xff);
	    }
	}

 }

}