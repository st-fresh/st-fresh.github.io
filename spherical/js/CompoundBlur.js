/*

CompoundBlur - Blurring with varying radii for Canvas

Version: 	0.1
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Copyright (c) 2011 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [257, 257, 201, 257, 73, 201, 80, 257, 150, 73, 16, 201, 133, 80, 37, 257, 199, 150, 109, 73, 43, 16, 241, 201, 165, 133, 105, 80, 57, 37, 18, 257, 227, 199, 173, 150, 128, 109, 90, 73, 57, 43, 29, 16, 4, 241, 220, 201, 82, 165, 149, 133, 119, 105, 92, 80, 68, 57, 47, 37, 27, 18, 10, 257, 242, 227, 213, 199, 186, 173, 162, 150, 139, 128, 118, 109, 99, 90, 82, 73, 65, 57, 50, 43, 36, 29, 23, 16, 10, 4, 252, 241, 230, 220, 210, 201, 191, 182, 173, 165, 157, 149, 141, 133, 126, 119, 112, 105, 99, 92, 86, 80, 74, 68, 63, 57, 52, 47, 42, 37, 32, 27, 23, 18, 14, 10, 6, 257, 250, 242, 234, 227, 220, 213, 206, 199, 192, 186, 180, 173, 167, 162, 156, 150, 144, 139, 134, 128, 123, 118, 113, 109, 104, 99, 95, 90, 86, 82, 77, 73, 69, 65, 61, 57, 54, 50, 46, 43, 39, 36, 32, 29, 26, 23, 19, 16, 13, 10, 7, 4, 2, 252, 246, 241, 236, 230, 225, 220, 215, 210, 205, 201, 196, 191, 187, 182, 178, 173, 169, 165, 161, 157, 153, 149, 145, 141, 137, 133, 130, 126, 122, 119, 115, 112, 108, 105, 102, 99, 95, 92, 89, 86, 83, 80, 77, 74, 71, 68, 65, 63, 60, 57, 55, 52, 49, 47, 44, 42, 39, 37, 34, 32, 30, 27, 25, 23, 20, 18, 16, 14, 12, 10, 8, 6];
   
var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

		
function compoundBlurImage( imageID, canvasID, radiusData, minRadius, increaseFactor, blurLevels, blurAlphaChannel )
{
			
 	var img = document.getElementById( imageID );
	var w = img.naturalWidth;
    var h = img.naturalHeight;
       
	var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

	if ( isNaN(minRadius) || minRadius <= 0 || isNaN(increaseFactor) || increaseFactor == 0 ) return;
	
	if ( blurAlphaChannel )
		compundBlurCanvasRGBA( canvasID, 0, 0, w, h, radiusData, minRadius, increaseFactor, blurLevels );
	else 
		compundBlurCanvasRGB( canvasID, 0, 0, w, h, radiusData, minRadius, increaseFactor, blurLevels );
}

function getLinearGradientMap( width, height, centerX, centerY, angle, length, mirrored )
{
	var cnv = document.createElement('canvas');
	cnv.width  = width;
	cnv.height = height;
	
	var x1 = centerX + Math.cos( angle ) * length * 0.5;
	var y1 = centerY + Math.sin( angle ) * length * 0.5;
	
	var x2 = centerX - Math.cos( angle ) * length * 0.5;
	var y2 = centerY - Math.sin( angle ) * length * 0.5;
	
	var context = cnv.getContext("2d");
    var gradient = context.createLinearGradient(x1, y1, x2, y2);
	if ( !mirrored )
	{
		gradient.addColorStop(0, "white");
		gradient.addColorStop(1, "black");
	} else {
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.5, "black");
		gradient.addColorStop(1, "white");
	}
	context.fillStyle = gradient;
	context.fillRect(0, 0, width, height );
	return context.getImageData( 0, 0, width, height );
}

function getRadialGradientMap( width, height, centerX, centerY, radius1, radius2 )
{
	var cnv = document.createElement('canvas');
	cnv.width  = width;
	cnv.height = height;
	
	
	var context = cnv.getContext("2d");
    var gradient = context.createRadialGradient(centerX, centerY, radius1, centerX, centerY, radius2);
	
	gradient.addColorStop(1, "white");
	gradient.addColorStop(0, "black");
	
	context.fillStyle = gradient;
	context.fillRect(0, 0, width, height );
	return context.getImageData( 0, 0, width, height );
}

function compundBlurCanvasRGB( id, top_x, top_y, width, height, radiusData, minRadius, increaseFactor, blurLevels )
{
	if ( isNaN(minRadius) || minRadius <= 0 || isNaN(increaseFactor) || increaseFactor == 0 ) return;
	 
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
		
	renderCompundBlurRGB( imageData, radiusData, width, height, minRadius, increaseFactor, blurLevels );
	context.putImageData( imageData, top_x, top_y );	
}

function compundBlurCanvasRGBA( id, top_x, top_y, width, height, radiusData, minRadius, increaseFactor, blurLevels )
{
	if ( isNaN(minRadius) || minRadius <= 0 || isNaN(increaseFactor) || increaseFactor == 0 ) return;
	 
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
		
	renderCompundBlurRGBA( imageData, radiusData, width, height, minRadius, increaseFactor, blurLevels );
	context.putImageData( imageData, top_x, top_y );	
}
		
function renderCompundBlurRGB( imageData, radiusData, width, height, radius, increaseFactor, blurLevels )
{
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
	r_out_sum, g_out_sum, b_out_sum,
	r_in_sum, g_in_sum, b_in_sum,
	pr, pg, pb, rbs;
	
	var imagePixels = imageData.data;
	var radiusPixels = radiusData.data;
	
	var wh = width * height;
	var wh4 = wh << 2;
	var pixels = [];
	
	for ( var i = 0; i < wh4; i++ )
	{
		pixels[i] = imagePixels[i];
	}
	
	var currentIndex = 0;
	var steps = blurLevels;
	blurLevels -= 1;
	
	while ( steps-- >= 0 )
	{
		var iradius = ( radius + 0.5 ) | 0;
		if ( iradius == 0 ) continue;
		if ( iradius > 256 ) iradius = 256;
		
		var div = iradius + iradius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = iradius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		var mul_sum = mul_table[iradius];
		var shg_sum = shg_table[iradius];
	
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			}
		
		
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p =  ( yw + ( ( p = x + radiusPlus1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

	
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p]   = (r_sum * mul_sum) >> shg_sum;
				pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
	
		radius *= increaseFactor;
		
		for ( i = wh; --i > -1 ; )
		{
			var idx = i << 2;
			var lookupValue = (radiusPixels[idx+2] & 0xff) / 255.0 * blurLevels;
			var index = lookupValue | 0;
			
			if ( index == currentIndex )
			{
				var blend =  256.0 * ( lookupValue - (lookupValue | 0 ));
				var iblend = 256 - blend;
				
				 imagePixels[idx] = (  imagePixels[idx] * iblend + pixels[idx] * blend ) >> 8;
				 imagePixels[idx+1] = (  imagePixels[idx+1] * iblend + pixels[idx+1] * blend) >> 8;
				 imagePixels[idx+2] = (  imagePixels[idx+2] * iblend + pixels[idx+2] * blend) >> 8;
			
			} else if ( index == currentIndex + 1 )
			{
				imagePixels[idx] = pixels[idx];
				imagePixels[idx+1] = pixels[idx+1];
				imagePixels[idx+2] = pixels[idx+2];
				
			}
		}
		currentIndex++;
	}
}

function renderCompundBlurRGBA( imageData, radiusData, width, height, radius, increaseFactor, blurLevels )
{
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum,
	pa, pr, pg, pb, rbs;
	
	var imagePixels = imageData.data;
	var radiusPixels = radiusData.data;
	
	var wh = width * height;
	var wh4 = wh << 2;
	var pixels = [];
	
	for ( var i = 0; i < wh4; i++ )
	{
		pixels[i] = imagePixels[i];
	}
	
	var currentIndex = 0;
	var steps = blurLevels;
	blurLevels -= 1;
	
	while ( steps-- >= 0 )
	{
		var iradius = ( radius + 0.5 ) | 0;
		if ( iradius == 0 ) continue;
		if ( iradius > 256 ) iradius = 256;
		
		var div = iradius + iradius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = iradius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		var mul_sum = mul_table[iradius];
		var shg_sum = shg_table[iradius];
	
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
				if ( pa != 0 )
				{
					pa = 255 / pa;
					pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
				}
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p =  ( yw + ( ( p = x + radiusPlus1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				a_in_sum += ( stackIn.a = pixels[p+3]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
			   
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
				if ( pa > 0 )
				{
					pa = 255 / pa;
					pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
				} else {
					pixels[p] = pixels[p+1] = pixels[p+2] = 0;
				}
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
			   
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
			   
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
	
		radius *= increaseFactor;
		
		for ( i = wh; --i > -1 ; )
		{
			var idx = i << 2;
			var lookupValue = (radiusPixels[idx+2] & 0xff) / 255.0 * blurLevels;
			var index = lookupValue | 0;
			
			if ( index == currentIndex )
			{
				var blend =  256.0 * ( lookupValue - (lookupValue | 0 ));
				var iblend = 256 - blend;
				
				 imagePixels[idx]   = (imagePixels[idx]   * iblend + pixels[idx]   * blend) >> 8;
				 imagePixels[idx+1] = (imagePixels[idx+1] * iblend + pixels[idx+1] * blend) >> 8;
				 imagePixels[idx+2] = (imagePixels[idx+2] * iblend + pixels[idx+2] * blend) >> 8;
				 imagePixels[idx+3] = (imagePixels[idx+3] * iblend + pixels[idx+3] * blend) >> 8;
			
			} else if ( index == currentIndex + 1 )
			{
				imagePixels[idx]   = pixels[idx];
				imagePixels[idx+1] = pixels[idx+1];
				imagePixels[idx+2] = pixels[idx+2];
				imagePixels[idx+3] = pixels[idx+3];
			}
		}
		currentIndex++;
	}
}
	
function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}