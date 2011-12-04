"use strict";
FiveGUI.GUIRegion = function (parameters) {    
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    
    this.elements = new Array();
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
FiveGUI.GUILib.extend(FiveGUI.GUIRegion, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUIRegion.prototype.getContext = function() {
    return this.drawCtx;
}

FiveGUI.GUIRegion.prototype.getEventX = function() {
    return this.getX() + this.parent.getEventX();
}

FiveGUI.GUIRegion.prototype.getEventY = function() {
    return this.getY() + this.parent.getEventY();
}

//SETTERS

//PROPERTIES
FiveGUI.GUIRegion.prototype.setFocused = function(id) {
    this.parent.setFocused(id);
}
//METHODS

FiveGUI.GUIRegion.prototype.findElementById = function(id) {
    var a = null;
    for(a in this.elements) {
        if(this.elements[a].id == id) {
            return this.elements[a];
        }
        
        if(typeof this.elements[a].elements == "object") {
            var obj = this.elements[a].findElementById(id);
            if(typeof obj == "object") {
                return obj;
            }
        }
    }
    return false;
}

FiveGUI.GUIRegion.prototype.update = function() {
    if(typeof this.parent.drawGUI == "function") {
        this.parent.drawGUI();
    } else {
        this.parent.update();
    }
}

FiveGUI.GUIRegion.prototype.initialize = function(parent) {    
    this.parent = parent;
    
    if(this.getWidth() == 0 || this.getHeight() == 0) {
        throw new Error("Please provide valid dimensions for element GUI Region");
    }
    
    this.drawCanvas.width = this.getWidth();
    this.drawCanvas.height = this.getHeight();
    this.drawCanvas.style.position = 'absolute';    
        
    var a = null;
    for(a in this.defaults) {
        methodName = "get"+FiveGUI.GUILib.capitalize(a);
        if(typeof this[methodName]() == "undefined") {
            this["set"+FiveGUI.GUILib.capitalize(a)](this.defaults[a]);
        }
    }
    this.initializePathPoints();
    
}

FiveGUI.GUIRegion.prototype.addElement = function(element) {
    this.elements.push(element);
}

FiveGUI.GUIRegion.prototype.setMousePosition = function(evt){
    var mouseX = evt.clientX + window.pageXOffset;
    var mouseY = evt.clientY + window.pageYOffset;
    
    this.mousePos = {
        x: mouseX,
        y: mouseY
    };
};

FiveGUI.GUIRegion.prototype.handleEvent = function(evt){
   FiveGUI.GUI.prototype.handleMouseEvent.call(this, evt);
}

FiveGUI.GUIRegion.prototype.bindSubElements = function(defaults) {
    var a, b = null;
    for(b in this.elements) {
        for(a in defaults) {
            var methodName = "set"+a.capitalize();
            if(typeof this.elements[b][methodName] == "function") {
                if(
                    this.elements[b]["get"+a.capitalize()]() == undefined &&
                    typeof this.elements[b]["get"+a.capitalize()]() == "undefined"
                ) {
                    this.elements[b][methodName](defaults[a]);
                }
            }
        }

        this.elements[b].initialize(this);
        
        if(typeof this.elements[b].elements == "object") {
            this.elements[b].bindSubElements(defaults);
        }        
    }
}

FiveGUI.GUIRegion.prototype.draw = function() {
    
    var dCtx = this.drawCtx;
    
    if(!this.isMountFilled()) {
        this.fillMount( this.parent.getContext().getImageData(
            this.getX(), this.getY(), this.getX()+this.getWidth(), this.getY()+this.getHeight()
        ));
    }
    
    if(this.getX() == undefined || this.getY() == "undefined") {
        throw new Error("Position coordinates not set - x:" + this.getX() + ", y:"+this.getY());
    }
    
    if(this.getWidth() == undefined || this.getHeight() == undefined) {
        throw new Error("Region dimensions not set - width:" + this.getWindth() + ", height:"+this.getHeight());
    }
    
    if(this.getBackgroundImage() instanceof Image) {
        this.drawBackgroundImage();
    } else {
        this.drawContour();
    }       
    
    this.bind();
    
    var a = null;
    for(a in this.elements) {
        var drawData = this.elements[a].draw();
        if(drawData instanceof HTMLCanvasElement) {
            dCtx.drawImage(drawData, this.elements[a].getX(), this.elements[a].getY()); 
        }
    }
    
    return this.drawCanvas;
}

FiveGUI.GUIRegion.prototype.drawBackgroundImage = function() {
    var dCtx = this.drawCtx;
    dCtx.drawImage(this.getBackgroundImage(), 0, 0);
    
}

FiveGUI.GUIRegion.prototype.drawContour = function() {
    var dCtx = this.drawCtx;

    var border = this.getBorderWidth();
    var lineWidthAmplifier  = 0;
    
    if(typeof border != "undefined" && border > 0) {
        dCtx.strokeStyle = this.getBorderColor();
        dCtx.lineWidth = border;
        lineWidthAmplifier  = border/2;
    }
    
    var background = this.getBackgroundColor();
    if(typeof background != "undefined") {
        dCtx.fillStyle = background;
    }    
    
    dCtx.beginPath();
    dCtx.moveTo(lineWidthAmplifier, lineWidthAmplifier);
    dCtx.lineTo(this.getWidth()-lineWidthAmplifier, lineWidthAmplifier);
    dCtx.lineTo(this.getWidth()-lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, lineWidthAmplifier);
    dCtx.closePath();
    
    if(typeof border != "undefined" && border > 0) {
        dCtx.stroke();
    }
    
    if(typeof background != "undefined") {
        dCtx.fill();
    }
    
    dCtx.restore();    
}
