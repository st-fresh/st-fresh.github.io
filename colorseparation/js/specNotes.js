//~ is 1 space//
VAR.canvas_docget_"jjCan"
 .mtx_canvas_getCont
  .sepCan_docget_"canvas"
   .imageData
//canvas//
VAR.width_316
VAR.height_346
//images//
VAR.WI_150
VAR.HI_105
VAR._stX
VAR._stY
VAR.rect, pixels, pix, blankPix____[]
VAR.canvasState_null

//CUTSHEET[callback]//
//STARTUP calls CANVASSTATE and INITIMAGES//
INITIALIZE[]_
INITRECTANGLES()
CUTSHEET[function(STARTUP())]_

INITRECTANGLES[]_
rect[0-4]_new RECTANGLE(#,#,WI,HI, "path")_

//CUTSHEET call in INITIALIZE: CUTSHEET[function(STARTUP())]//
CUTSHEET[callback]_
VAR.sprite_newImage() 
//this_sprite so this.width_sprite.width and this.height_sprite.height//
sprite.ONLOAD_function_ 
sepCan.width_this.width 
sepCan.height_this.height
VAR.stx_sepCan_getCont
stx_drawIm(this 0 0)
imageData_stx_getImD(0 0 sepCan.width sepCan.height)
            callback()_
 sprite.src_"path"_ 

//width_150 height_105 from INITRECTANGLES_WI AND _HI//
RECTANGLE[x,y,width,height,src]_
this.x_x
 .y_y
  .w_width
   .h_height
    .can_createCanvas(width, height)_

RECTANGLE.PRO.CONTAINS[mx, my]_
return this.x<=mx&&this.x+this.w>=mx&&this.y<=my&&this.y+this.h>=my_

//this.w_150 this.x_105 from RECTANGLE .w_width and .h_height//
//width_316 height_346 from globals for _canvas//
RECTANGLE.PRO.CHECKBOUND[]_
VAR.px_this.x+this.w
VAR.py_this.y+this.h
if_this.x<0_
this.x=0
 _elseif_px>width
  this.x_width-this.w_
if_this.y<0_
this.y=0
 _elseif_py<height
  this.y=height-this.h_

//..DRAW[ctx] call in INITIMAGES: DRAW[mtx]//
RECTANGLE.PRO.DRAW[ctx]_
this.CHECKBOUND()
ctx.drawIm(this.can, .x, .y, .w, .h)_

//INITIMAGES call in STARTUP//
//STARTUP call in INITIALIZE//
//mtx context for _canvas and _canvas docgets jjCan//
//DRAW is RECTANGLE.PRO.DRAW[ctx]
INITIMAGES[]_
for_VAR.i_0_i<CANVASSTATE.shapes.length_i++_
//CANVASSTATE has .shapes_[] and .DRAW[mtx] called on content of .shapes[i]
VAR.shapes_CANVASSTATE.shapes[i]
CANVASSTATE.shapes[i].DRAW[mtx]__

//CANVASSTATE call in STARTUP: CANVASSTATE_new~CANVASSTATE[_canvas]//
CANVASSTATE[canvas]_
this.canvas_canvas 
 .width_canvas.width 
  .height_canvas.height 
   .ctx_canvas.getCon
    .valid_false
     .shapes_[]
      .dragging_false
       .selection_null
        .dragoffx_0
         .dragoffy_0
//function[e] creates VAR.e//
_canvas.addEList_selectstart_function[e]_
e.preventDefault()
return false, false__
_canvas.addEList_mousedown_function[e]_
ONDOWN[e.pageX, e.pageY], true__
_canvas.addEList_mousemove_function[e]_
ONMOVE[e.pageX, e.pageY], true__
_canvas.addEList_mouseup_function[e]_
ONUP[], true__

//ADDSHAPE call in STARTUP: CANVASSTATE.ADDSHAPE[rect[0-4]]//>>
//>> this.shapes is .shapes_[] and push shape_rect[0-4] to shape_[]
CANVASSTATE.PRO.ADDSHAPE[shape]_
this.shapes.push(shape)
 .valid_false_

//this.width_canvas.width__canvas.width and this.height_canvas.height__canvas.height//>>
//>> b/c in STARTUP: CANVASSTATE_new~CANVASSTATE[_canvas] passes in _canvas
 CANVASSTATE.PRO.CLEAR[]_
 this.ctx.clearR(0,0,this.width, this.height)_

//CANVASSTATE.DRAW[] call in enterFrameHandler: CANVASSTATE.DRAW[]//
CANVASSTATE.PRO.DRAW[]_
this.CLEAR[]
PREPAREPAINT[]
 .valid_true
 //this.selection_null in CANVASSTATE[canvas]//>>
 //>> set in ONDOWN: VAR.mySel_shapes[i] and CANVASSTATE.selection_mySel//>>
 //>> also in ONDOWN: VAR.shapes_CANVASSTATE.shapes_[] w/ values from ADDSHAPE call in STARTUP//>>
 //>> so when ONDOWN called mySel set//
 if_.selection!=null_
 VAR.mySel_.selection__

 CANVASSTATE.PRO.GETRELATIVELOCATION[x,y]_
 










