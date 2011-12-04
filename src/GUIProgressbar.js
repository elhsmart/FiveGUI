"use strict";
FiveGUI.GUIProgressbar = function (parameters) {
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        backgroundColor:"#555",
        borderColor:"#999",
        foregroundColor:"#777",
        borderWidth: 2,
        value:0
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

FiveGUI.GUIProgressbar.prototype.getForegroundColor = function() {
    return this.foregroundColor;
}

FiveGUI.GUIProgressbar.prototype.getValue = function() {
    return this.value;
}
FiveGUI.GUIProgressbar.prototype.getForegroundImage = function() {
    return this.foregroundImage;
}

//SETTERS
FiveGUI.GUIProgressbar.prototype.setForegroundColor = function(fc) {
    this.foregroundColor = fc;
    return this;
}
FiveGUI.GUIProgressbar.prototype.setForegroundImage = function(fi) {
    this.foregroundImage = fi;
    return this;
}
FiveGUI.GUIProgressbar.prototype.setValue = function(v) {
    this.value = v;
    return this;
}

//PROPERTIES

//METHODS

FiveGUI.GUIProgressbar.prototype.initialize = function(parent) {    
    this.parent = parent;
            
    if(this.getWidth() == 0 || this.getHeight() == 0) {
        throw new Error("Please provide valid dimensions for element GUI Progressbar");
    }

    var a = null;
    for(a in this.defaults) {
        var methodName = "get"+FiveGUI.GUILib.capitalize(a);
        if(typeof this[methodName]() == "undefined") {
            this["set"+FiveGUI.GUILib.capitalize(a)](this.defaults[a]);
        }
    }  
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
    
    if(this.getBackgroundImage() instanceof Image) {
        this.drawBackgroundImage();
    } else {
        this.drawContour();
    }
    
    if(this.getForegroundImage() instanceof Image) {
        this.drawForegroundImage();        
    } else {
        this.drawForeground();
    }    
    
    return this.drawCanvas;
}

FiveGUI.GUIProgressbar.prototype.drawBackgroundImage = function() {
    var dCtx = this.drawCtx;
    dCtx.drawImage(this.getBackgroundImage(), 0, 0);    
}

FiveGUI.GUIProgressbar.prototype.drawForegroundImage = function() {
    
    var dCtx = this.drawCtx;
    dCtx.save();

    if(this.getValue() > 0) {
        dCtx.save();
        dCtx.drawImage(this.getForegroundImage(), 0, this.getWidth());
                
        var border = this.getBorderWidth();
        var lineWidthAmplifier = 0;

        if(typeof border != "undefined" && border != 0) {
            dCtx.strokeStyle     = this.getBorderColor();
            dCtx.lineWidth       = border;
            lineWidthAmplifier  = border/2;
        } 
        
        var width = ((this.getWidth()-(lineWidthAmplifier*2)) / 100) * this.getValue();

        dCtx.drawImage(this.getForegroundImage(), lineWidthAmplifier, lineWidthAmplifier, width, this.getHeight()-lineWidthAmplifier*2);
        dCtx.restore();
    }
    
}


FiveGUI.GUIProgressbar.prototype.drawContour = function() {
    var dCtx = this.drawCtx;
    dCtx.save();
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

    dCtx.restore();        
}

FiveGUI.GUIProgressbar.prototype.drawForeground = function() {
    var dCtx = this.drawCtx;
    if(this.getValue() > 0) {
        var width = (this.getWidth() / 100) * this.getValue();

        var border = this.getBorderWidth();
        var lineWidthAmplifier = 0;

        if(typeof border != "undefined" && border != 0) {
            dCtx.strokeStyle     = this.getBorderColor();
            dCtx.lineWidth       = border;
            lineWidthAmplifier  = border/2;
        } 
        
        dCtx.beginPath();
        dCtx.moveTo(lineWidthAmplifier, lineWidthAmplifier);
        dCtx.lineTo(width-lineWidthAmplifier, lineWidthAmplifier);
        dCtx.lineTo(width-lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
        dCtx.lineTo(lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
        dCtx.lineTo(lineWidthAmplifier, lineWidthAmplifier);
        dCtx.closePath();    
        
        var background = this.getForegroundColor();
        if(typeof background != "undefined") {
            dCtx.fillStyle = background;
            dCtx.fill();
        }

        dCtx.restore();  
    }
    
}