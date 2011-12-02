"use strict";
FiveGUI.GUIProgressbar = function (parameters) {
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 2
    }
        
    this.eventListeners = { };
    this.drawCanvas = document.createElement("canvas");
    this.eventCanvas = document.createElement("canvas");

    this.drawCtx = this.drawCanvas.getContext('2d');
    this.eventCtx = this.eventCanvas.getContext('2d');
    
    this.mount = null;

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    
    if(typeof parameters == "object") {
        var a = null;
        for(a in parameters) {
            if(typeof this["set"+FiveGUI.GUILib.capitalize(a)] == "function") {
                this["set"+FiveGUI.GUILib.capitalize(a)](parameters[a]);
            }
        }
    } else if(typeof parameters == "string") {
        this.setCaption(parameters);
    }
    return this;
}
FiveGUI.GUILib.extend(FiveGUI.GUIProgressbar, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUIProgressbar.prototype.getPrivateContext = function() {
    return this.privateCtx;
}

FiveGUI.GUIProgressbar.prototype.getParentContext = function() {
    return this.parent.getContext();
}

FiveGUI.GUIProgressbar.prototype.getCaption = function() {
    return this.caption;
}

FiveGUI.GUIProgressbar.prototype.getHoverBackgroundColor = function() {
    return this.hoverBackgroundColor;
}

FiveGUI.GUIProgressbar.prototype.getClickBackgroundColor = function() {
    return this.clickBackgroundColor;
}

FiveGUI.GUIProgressbar.prototype.getHoverBorderColor = function() {
    return this.hoverBorderColor;
}

FiveGUI.GUIProgressbar.prototype.getClickBorderColor = function() {
    return this.clickBorderColor;
}

FiveGUI.GUIProgressbar.prototype.getTextHoverColor = function() {
    return this.textHoverColor;
}

FiveGUI.GUIProgressbar.prototype.getTextClickColor = function() {
    return this.textClickColor;
}

FiveGUI.GUIProgressbar.prototype.getState = function() {
    if(this.state == undefined) {
        this.state = "normal";
    }
    return this.state;
}


//SETTERS
FiveGUI.GUIProgressbar.prototype.setCaption = function(caption) {
    this.caption = caption; 
    return this;
}

FiveGUI.GUIProgressbar.prototype.setTextHoverColor = function(thc) {
    this.textHoverColor = thc;
    return this;
}

FiveGUI.GUIProgressbar.prototype.setTextClickColor = function(tcc) {
    this.textClickColor = tcc;
    return this;
}

FiveGUI.GUIProgressbar.prototype.setHoverBackgroundColor = function(hbc) {
    this.hoverBackgroundColor = hbc;
    return this;
}

FiveGUI.GUIProgressbar.prototype.setClickBackgroundColor = function(cbc) {
    this.clickBackgroundColor = cbc;
    return this;
}

FiveGUI.GUIProgressbar.prototype.setHoverBorderColor = function(hb) {
    this.hoverBorderColor = hb;
    return this;
}

FiveGUI.GUIProgressbar.prototype.setClickBorderColor = function(cb) {
    this.clickBorderColor = cb;
    return this;
}

//PROPERTIES

//METHODS

FiveGUI.GUIProgressbar.prototype.initialize = function(parent) {    
    this.parent = parent;
            
    if(this.getWidth() == 0 || this.getHeight() == 0) {
        throw new Error("Please provide valid dimensions for element GUI Progressbar");
    }
    
    this.eventCanvas.width = this.getX() + this.getWidth();
    this.eventCanvas.height = this.getY() + this.getHeight();
    this.eventCanvas.style.position = 'absolute';    
    
    this.eventCanvas.width = this.getWidth();
    this.eventCanvas.height = this.getHeight();
    this.eventCanvas.style.position = 'absolute';    
        
    var a = null;
    for(a in this.defaults) {
        var methodName = "get"+FiveGUI.GUILib.capitalize(a);
        if(typeof this[methodName]() == "undefined") {
            this["set"+FiveGUI.GUILib.capitalize(a)](this.defaults[a]);
        }
    }
    
    this.initializePathPoints();
    this.bindListeners();    
}

FiveGUI.GUIProgressbar.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUIProgressbar.prototype.bindListeners = function() {
    this.addEventListener("mouseover", function(e, obj){
        obj.changeState("hovered");
        obj.update(obj);
    });
    this.addEventListener("mouseout", function(e, obj){
        obj.changeState("normal");
        obj.update(obj);
    });    
    this.addEventListener("mousedown", function(e, obj){
        obj.changeState("clicked");
        obj.parent.setFocused(this.id);
        obj.update(obj);
    });    
    this.addEventListener("mouseup", function(e, obj){
        obj.changeState("hovered");
        obj.update(obj);
    });        
}

FiveGUI.GUIProgressbar.prototype.changeState = function(state) {
    switch(state) {
        case "hovered":
        case "clicked":
        case "normal": {
            this.state = state;break;
        }
        default: {
            this.state = "normal";
        }
    }
    
    return this;
}

FiveGUI.GUIProgressbar.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUIProgressbar.prototype.draw = function() {
    
    if(this.getX() == undefined || this.getY() == "undefined") {
        throw new Error("Position coordinates not set - x:" + this.getX() + ", y:"+this.getY());
    }
    
    if(this.getWidth() == undefined || this.getHeight() == undefined) {
        throw new Error("Progressbar dimensions not set - width:" + this.getWindth() + ", height:"+this.getHeight());
    }
    
    if(!this.isMountFilled()) {
        this.fillMount( this.parent.getContext().getImageData(
            this.getX(), this.getY(), this.getX()+this.getWidth(), this.getY()+this.getHeight()
        ));
    }
  
    var dCtx = this.drawCtx;
    dCtx.putImageData(this.mount, 0, 0);

    // Contour drawing
    var border = this.getBorderWidth();
    var lineWidthAmplifier = 0;
        
    if(typeof border != "undefined" && border != 0) {
        dCtx.strokeStyle     = this.getBorderColor();
        dCtx.lineWidth       = border;
        lineWidthAmplifier  = border/2;
    } 
    dCtx.save();
        
    dCtx.beginPath();
    dCtx.moveTo(lineWidthAmplifier, lineWidthAmplifier);
    dCtx.lineTo(this.getWidth()-lineWidthAmplifier, lineWidthAmplifier);
    dCtx.lineTo(this.getWidth()-lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, lineWidthAmplifier);
    dCtx.closePath();

    if(typeof border != "undefined" && border != 0) {    
        dCtx.stroke();
    }
    
    // Inner Fill
    var background = this.getBackgroundColor();
    if(typeof background != "undefined") {
        dCtx.fillStyle = background;
        dCtx.fill();
    }
    
    // Inner Text
    var caption = this.getCaption();
    if(caption != undefined) {
        var color           = this.getFontColor();        
        var font            = this.getFontName();        
        var size            = this.getFontSize();
        
        dCtx.fillStyle      = color;
        dCtx.font           = size+"px "+font;
        dCtx.textAlign      = "center";
        dCtx.textBaseline   = "middle";
        
        dCtx.fillText(caption, this.getWidth()/2, this.getHeight()/2);
    }
    dCtx.restore();    
    this.bind();
    
    return this.drawCanvas;
}