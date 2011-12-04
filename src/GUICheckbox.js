FiveGUI.GUICheckbox = function (parameters) { 
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 0,
        backgroundColor: "#fff"
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
}
FiveGUI.GUILib.extend(FiveGUI.GUICheckbox, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUICheckbox.prototype.getHoverBackgroundColor = function() {
    return this.hoverBackgroundColor;
}

FiveGUI.GUICheckbox.prototype.getHoverBorderColor = function() {
    return this.hoverBorderColor;
}

FiveGUI.GUICheckbox.prototype.getHoverBackgroundImage = function() {
    return this.hoverBackgroundImage;
}

FiveGUI.GUICheckbox.prototype.getCheckedBackgroundImage = function() {
    return this.checkedBackgroundImage;
}

FiveGUI.GUICheckbox.prototype.getHoverCheckedBackgroundImage = function() {
    return this.hoverCheckedBackgroundImage;
}

FiveGUI.GUICheckbox.prototype.getState = function() {
    return this.state;
}
FiveGUI.GUICheckbox.prototype.getCheckedBackgroundImage = function() {
    if(typeof this['getState'] != "function") {
        return this.checkedBackgroundImage;
    } else {
        switch(this['getState']()) {
            case "clicked":{
                return this.getClickCheckedBackgroundImage();
            }
            case "hovered":{
                return this.getHoverCheckedBackgroundImage();
            }
            case "normal":
            default: {
                return this.checkedBackgroundImage;
            }
        }
    }    
}

//SETTERS
FiveGUI.GUICheckbox.prototype.setHoverBackgroundColor = function(hbc) {
    this.hoverBackgroundColor = hbc;
    return this;
}

FiveGUI.GUICheckbox.prototype.setHoverBorderColor = function(hbc) {
    this.hoverBorderColor = hbc;
    return this;
}

FiveGUI.GUICheckbox.prototype.setHoverBackgroundImage = function(hbi) {
    this.hoverBackgroundImage = hbi;
    return this;
}

FiveGUI.GUICheckbox.prototype.setHoverCheckedBackgroundImage = function(hcbi) {
    this.hoverCheckedBackgroundImage = hcbi;
    return this;
}

FiveGUI.GUICheckbox.prototype.setCheckedBackgroundImage = function(cbi) {
    this.checkedBackgroundImage = cbi;
    return this;
}


//PROPERTIES
FiveGUI.GUICheckbox.prototype.isChecked = function(isChecked) {
    if(typeof this.checked == "undefined") {
        this.checked = false;
    }
    
    if(typeof isChecked != "undefined") {
        switch(isChecked) {
            case true:
            case false: {
                this.checked = isChecked;
                break;
            }
            default: {
                this.checked = false;
            }
        }
    }
    return this.checked;
}

FiveGUI.GUICheckbox.prototype.changeState = function(state) {
    switch(state) {
        case "hovered":
        case "clicked":
        case "normal": {
            this.state = state;
            break;
        }
        default: {
            this.state = "normal";
        }
    }
    
    return this;
}

//METHODS
FiveGUI.GUICheckbox.prototype.bindListeners = function() {
    this.addEventListener("mousedown", function(e, obj){
        if(obj.isChecked() == false) {
            obj.isChecked(true);
        } else {
            obj.isChecked(false);
        }
        obj.parent.setFocused(this.id);
        obj.update(obj);
    });
    this.addEventListener("mouseover", function(e, obj){
        obj.changeState("hovered");
        obj.update(obj);
    });    
    this.addEventListener("mouseout", function(e, obj){
        obj.changeState("normal");
        obj.update(obj);
    });        
}

FiveGUI.GUICheckbox.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUICheckbox.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUICheckbox.prototype.initialize = function(parent) {    
    this.parent = parent;
            
    if(this.getWidth() == 0 || this.getHeight() == 0) {
        throw new Error("Please provide valid dimensions for element GUI Button");
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

FiveGUI.GUICheckbox.prototype.draw = function() {
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

    // Contour drawing

    if(this.getBackgroundImage() instanceof Image) {
        this.drawBackgroundImage();
    } else {
        this.drawContour();
    }

    this.bind();
    return this.drawCanvas;    
}

FiveGUI.GUICheckbox.prototype.drawBackgroundImage = function() {
    var dCtx = this.drawCtx;
    if(this.isChecked()) {
        dCtx.drawImage(this.getCheckedBackgroundImage(), 0, 0);
    } else {
        dCtx.drawImage(this.getBackgroundImage(), 0, 0);
    }
}

FiveGUI.GUICheckbox.prototype.drawContour = function() {
    var dCtx = this.drawCtx;
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
    
    if(this.isChecked()) {
        dCtx.beginPath();
        dCtx.moveTo(lineWidthAmplifier+4, lineWidthAmplifier+4);
        dCtx.lineTo(this.getWidth()-lineWidthAmplifier-4, lineWidthAmplifier+4);
        dCtx.lineTo(this.getWidth()-lineWidthAmplifier-4, this.getHeight()-lineWidthAmplifier-4);
        dCtx.lineTo(lineWidthAmplifier+4, this.getHeight()-lineWidthAmplifier-4);
        dCtx.lineTo(lineWidthAmplifier+4, lineWidthAmplifier+4);
        dCtx.closePath();    
        dCtx.fill();
        dCtx.stroke();
    }
    
    dCtx.restore();    
}