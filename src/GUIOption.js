FiveGUI.GUIOption = function (parameters) { 
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 0,
        x: 0,
        y: 0,
        visible: false
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
    this.parentId = 0;
    
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
}
FiveGUI.GUILib.extend(FiveGUI.GUIOption, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUIOption.prototype.getCaption = function() {
    return this.caption;
}
FiveGUI.GUIOption.prototype.getVisible = function() {
    return this.visible;
}
FiveGUI.GUIOption.prototype.getHoverBackgroundColor = function() {
    return this.hoverBackgroundColor;
}
FiveGUI.GUIOption.prototype.getHoverBorderColor = function() {
    return this.hoverBorderColor;
}
FiveGUI.GUIOption.prototype.getTextHoverColor = function() {
    return this.textHoverColor;
}
FiveGUI.GUIOption.prototype.getState = function() {
    if(this.state == undefined) {
        this.state = "normal";
    }
    return this.state;
}


//SETTERS
FiveGUI.GUIOption.prototype.setCaption = function(caption) {
    this.caption = caption; 
    return this;
}
FiveGUI.GUIOption.prototype.setVisible = function(v) {
    this.visible = v; 
    return this;
}
FiveGUI.GUIOption.prototype.setTextHoverColor = function(thc) {
    this.textHoverColor = thc;
    return this;
}
FiveGUI.GUIOption.prototype.setHoverBackgroundColor = function(hbc) {
    this.hoverBackgroundColor = hbc;
    return this;
}
FiveGUI.GUIOption.prototype.setHoverBorderColor = function(hb) {
    this.hoverBorderColor = hb;
    return this;
}

//PROPERTIES

//METHODS
FiveGUI.GUIOption.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUIOption.prototype.changeState = function(state) {
    switch(state) {
        case "hovered":
        case "normal": {
            this.state = state;break;
        }
        default: {
            this.state = "normal";
        }
    }
    
    return this;
}

FiveGUI.GUIOption.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUIOption.prototype.bindListeners = function() {
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
        var selectedOption = null;
        var GUI = obj.parent;

        for(a in obj.parent.elements) {
            if(obj.parent.elements[a] instanceof FiveGUI.GUIOption) {
                obj.parent.elements[a].isVisible(false);
                obj.parent.elements[a].update(a);
            }
            
            if(obj.id == obj.parent.elements[a].id) {
                selectedOption = a;
            }
        }
        
        var Dropdown = obj.parent.findElementById(obj.parentId);
        if(Dropdown) {
            
            for(a in Dropdown.elements) {
                if(Dropdown.elements[a].id == obj.id) {
                    Dropdown.setSelectedOption(a);
                }
            }
            
            Dropdown
                .isClicked(false);
            Dropdown    
                .update();
                
            for(a in Dropdown.elements) {
                Dropdown.elements[a].isVisible(false);
            }
            
            var k = 0;
            for(k = 0; k < obj.parent.elements.length; k++) {
                if(obj.parent.elements[k] instanceof FiveGUI.GUIOption) {
                    obj.parent.elements.splice(k, 1);
                    k--;
                }
            }
        }
    });    
}

FiveGUI.GUIOption.prototype.initialize = function(parent) {    
    this.parent = parent;
    
    if(this.getWidth() == 0 || this.getHeight() == 0) {
        throw new Error("Please provide valid dimensions for element GUI Label");
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
    
    this.bindListeners();
}

FiveGUI.GUIOption.prototype.draw = function() {
    if(this.getX() == undefined || this.getY() == "undefined") {
        throw new Error("Position coordinates not set - x:" + this.getX() + ", y:"+this.getY());
    }
    
    if(this.getWidth() == undefined || this.getHeight() == undefined) {
        throw new Error("Label dimensions not set - width:" + this.getWindth() + ", height:"+this.getHeight());
    }
    
    if(!this.isMountFilled()) {
        this.fillMount( this.parent.getContext().getImageData(
            this.getX(), this.getY(), this.getX()+this.getWidth(), this.getY()+this.getHeight()
        ));
    }
  
    var dCtx = this.drawCtx;
    dCtx.putImageData(this.mount, 0, 0);
    
    if(!this.isVisible()) {
        return this.drawCanvas;
    }
    
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
    //dCtx.moveTo(lineWidthAmplifier, lineWidthAmplifier);
    dCtx.moveTo(this.getWidth()-lineWidthAmplifier, 0);
    dCtx.lineTo(this.getWidth()-lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, this.getHeight()-lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, 0);
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
        dCtx.textAlign      = "left";
        dCtx.textBaseline   = "middle";
        
        dCtx.fillText(caption, 0, this.getHeight()/2);
    }
    dCtx.restore();    
    this.bind();
    
    return this.drawCanvas;
}
