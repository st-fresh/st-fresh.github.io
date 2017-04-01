var p1 = 0;
var p2 = 0;
var fx = 0;
var fy = 0;
var u = 0;
var d = 0;
var min_d = Number.MAX_VALUE;
var dx = 0;
var dy = 0;
var min_index = 0;
bx = 105;
by = spectrum_r.height >> 1; //spectrum_r.height = 238px

for (var i = 0; i < 6; i++)
	{
		orderNames[i] = labels[0 + i];
	}

for (var i = 0; i < controls.length; i++) {
	p1 = controls[i][0];
	p2 = controls[i][1];
	dx = p2.x - p1.x;
	dy = p2.y - p1.y;
	d = Math.sqrt(dx * dx + dy * dy);
	u = ( (bx - p1.x) * (p2.x - p1.x) + (by - p1.y) * (p2.y - p1.y) ) / (d * d);
	fx = p1.x + u * (p2.x - p1.x);
	fy = p1.y + u * (p2.y - p1.y);

	if (fx >= 0 && fx < 572) { //spectrum_r.width is width of spectrum image
		dx = bx - fx;
		dy = by - fy;
		d = Math.sqrt(dx * dx + dy * dy);
		if (d < min_d) {
			min_d = d;
			min_index = i;
		}
	}
}

var order_index = 0;

for (var i = 0; i < colorBoundaries.length - 1; i++) { //colorBoundaries is array from your current js
	if (bx >= colorBoundaries[i] && bx <= colorBoundaries[i + 1]) {
		order_index = i;
		break;
	}
}

var thickness_index = 0;

for (var i = thickness.length -1; i > 0; i--) { //thickness is array from your current js
		if (by <= thickness[i].x && by >= thickness[i + 1].x) {
			thickness_index = i;
			break;
		}
}

var thick_value = thickness[thickness_index].y 
	+ (thickness)[thickness_index - 1].y - thickness[thickness_index].y)
	* (by - thickness[thickness_index].x) / (thickness[thickness_index - 1].x - thickness[thickness_index].x);

bireLABEL.innerHTML = birefringence[min_index] * 1000) / 1000; // ,t ??
if (thick_value < 0.01) {
	thicknessLABEL.innerHTML = ((thick_value * 1000) / 1000) + " mm"; 
} else {
	thicknessLABEL.innerHTML =(thick_value * 100) / 100 + " mm";
}

var path_index = 0;

for (var i = 0; i < pathDifference.length - 1; i++) {
	if (bx >= pathDifference[i].x && bx <= pathDifference[i + 1].x) {
		path_index = i;
		break;
	}
}

var path_value = pathDifference[path_index].y 
	+ (pathDifference[path_index + 1].y - pathDifference[path_index].y) 
	* (bx - pathDifference[path_index].x) / (pathDifference[path_index + 1].x -pathDifference[path_index].x);

pdiff.LABEL.innerHTML = path_value + " nm";
order.LABEL.innerHTML = orderNames[order_index] + " Order";









