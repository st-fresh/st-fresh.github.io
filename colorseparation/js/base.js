function CanvasImage(canvas, src) {
  // load image in canvas
  var context = canvas.getContext('2d');
  var i = new Image();
  var that = this;
  i.onload = function(){
    canvas.width = i.width;
    canvas.height = i.height;
    context.drawImage(i, 0, 0, i.width, i.height);

    // remember the original pixels
    that.original = that.getData();
  };
  i.src = src;
  
  // cache these
  this.context = context;
  this.image = i;
}

CanvasImage.prototype.getData = function() {
  return this.context.getImageData(0, 0, this.image.width, this.image.height);
};

CanvasImage.prototype.setData = function(data) {
  return this.context.putImageData(data, 0, 0);
};

CanvasImage.prototype.reset = function() {
  this.setData(this.original);
}

CanvasImage.prototype.transform = function(fn, factor) {
  var olddata = this.original;
  var oldpx = olddata.data;
  var newdata = this.context.createImageData(olddata);
  var newpx = newdata.data
  var res = [];
  var len = newpx.length;
  for (var i = 0; i < len; i += 4) {
   res = fn.call(this, oldpx[i], oldpx[i+1], oldpx[i+2], oldpx[i+3], factor, i);
   newpx[i]   = res[0]; // r
   newpx[i+1] = res[1]; // g
   newpx[i+2] = res[2]; // b
   newpx[i+3] = res[3]; // a
  }
  this.setData(newdata);
};

var transformador = new CanvasImage(
  $('canvas'),
  '/wp-content/uploads/2008/05/zlati-nathalie.jpg'
);


var manipuladors = [
  {
    name: 'rgb -> brg',
    cb: function(r, g, b) {
      return [b, r, g, 255];
    }
  },
  {
    name: 'rgb -> rbg',
    cb: function(r, g, b) {
      return [r, b, g, 255];
    }
  },
  {
    name: 'rgb -> gbr',
    cb: function(r, g, b) {
      return [g, b, r, 255];
    }
  },
  {
    name: 'rgb -> grb',
    cb: function(r, g, b) {
      return [g, r ,b, 255];
    }
  },
  {
    name: 'rgb -> bgr',
    cb: function(r, g, b) {
      return [b, g, r, 255];
    }
  },
  {
    name: 'transparent',
    cb: function(r, g, b, a, factor) {
      return [r, g, b, factor];
    },
    factor: "value (0-255)"
  },
  {
    name: 'gradient',
    cb: function(r, g, b, a, factor, i) {
      var total = this.original.data.length;  
      return [r, g, b, factor + 255 * (total - i) / total];
    },
    factor: "value (0-255)"
  },
  {
    name: 'greyscale',
    cb: function(r, g, b) {
      var avg = 0.3  * r + 0.59 * g + 0.11 * b;
      return [avg, avg, avg, 255];
    }
  },
  {
    name: 'sepia (lazy)',
    cb: function(r, g, b) {
      var avg = 0.3  * r + 0.59 * g + 0.11 * b;
      return [avg + 100, avg + 50, avg, 255];
    }
  },
  {
    name: 'sepia 2',
    cb: function(r, g, b) {
      return [
        (r * 0.393 + g * 0.769 + b * 0.189 ) / 1.351,
        (r * 0.349 + g * 0.686 + b * 0.168 ) / 1.203,
        (r * 0.272 + g * 0.534 + b * 0.131 ) / 2.140,
        255
      ];
    }
  },
  {
    name: 'gamma correct',
    cb: function(r, g, b, a, factor) {
      return [
        Math.pow(r / 255, factor) * 255,
        Math.pow(g / 255, factor) * 255,
        Math.pow(b / 255, factor) * 255,
        255
      ];
    },
    factor: 'value(2-10), decimal OK'
  },
  {
    name: 'negative',
    cb: function(r, g, b) {
      return [255 - r, 255 - g, 255 - b, 255];
    }
  },
  {
    name: 'no green: rgb(r, 0, b)',
    cb: function(r, g, b) {
      return [r, 0, b, 255];
    }
  },
  {
    name: 'max green: rgb (r, 255, b)',
    cb: function(r, g, b) {
      return [r, 255, b, 255];
    }
  },
  {
    name: 'only green: rgb(0, g, 0)',
    cb: function(r, g, b) {
      return [0, g, 0, 255];
    }
  },
  {
    name: 'max all but green: rgb (255, g, 255)',
    cb: function(r, g, b) {
      return [255, g, 255, 255];
    }
  },
  {
    name: 'brightness',
    cb: function(r, g, b, a, factor) {
      return [r + factor, g + factor, b + factor, 255];
    },
    factor: '(0-255)'
  },
  {
    name: 'noise',
    cb: function(r, g, b, a, factor) {
      var rand =  (0.5 - Math.random()) * factor;
      return [r + rand, g + rand, b + rand, 255];
    },
    factor: '(0 - 500+)'
  }
];

