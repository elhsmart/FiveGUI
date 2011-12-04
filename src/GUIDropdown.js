FiveGUI.GUIDropdown = function (parameters) { 
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 2,
        selectedOption: 0
    }
        
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

FiveGUI.GUILib.extend(FiveGUI.GUIDropdown, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUIDropdown.prototype.getEventX = function() {
    return this.getX() + this.parent.getEventX();
}

FiveGUI.GUIDropdown.prototype.getEventY = function() {
    return this.getY() + this.parent.getEventY();
}

FiveGUI.GUIDropdown.prototype.getContext = function() {
    return this.drawCtx;
}

FiveGUI.GUIDropdown.prototype.getPrivateContext = function() {
    return this.privateCtx;
}

FiveGUI.GUIDropdown.prototype.getParentContext = function() {
    return this.parent.getContext();
}

FiveGUI.GUIDropdown.prototype.getHoverBackgroundColor = function() {
    return this.hoverBackgroundColor;
}

FiveGUI.GUIDropdown.prototype.getHoverBackgroundImage = function() {
    return this.hoverBackgroundImage;
}

FiveGUI.GUIDropdown.prototype.getClickBackgroundColor = function() {
    return this.clickBackgroundColor;
}

FiveGUI.GUIDropdown.prototype.getHoverBorderColor = function() {
    return this.hoverBorderColor;
}

FiveGUI.GUIDropdown.prototype.getClickBorderColor = function() {
    return this.clickBorderColor;
}

FiveGUI.GUIDropdown.prototype.getTextHoverColor = function() {
    return this.textHoverColor;
}

FiveGUI.GUIDropdown.prototype.getTextClickColor = function() {
    return this.textClickColor;
}

FiveGUI.GUIDropdown.prototype.getSelectedOption = function() {
    return this.selectedOption;
}

FiveGUI.GUIDropdown.prototype.getState = function() {
    if(this.state == undefined) {
        this.state = "normal";
    }
    return this.state;
}


//SETTERS
FiveGUI.GUIDropdown.prototype.setTextHoverColor = function(thc) {
    this.textHoverColor = thc;
    return this;
}

FiveGUI.GUIDropdown.prototype.setHoverBackgroundColor = function(hbc) {
    this.hoverBackgroundColor = hbc;
    return this;
}

FiveGUI.GUIDropdown.prototype.setHoverBackgroundImage = function(hbi) {
    this.hoverBackgroundImage = hbi;
    return this;
}

FiveGUI.GUIDropdown.prototype.setHoverBorderColor = function(hb) {
    this.hoverBorderColor = hb;
    return this;
}

FiveGUI.GUIDropdown.prototype.setClickBorderColor = function(cb) {
    this.clickBorderColor = cb;
    return this;
}

FiveGUI.GUIDropdown.prototype.setSelectedOption = function(o) {
    this.selectedOption = o;
    return this;
}

//PROPERTIES

FiveGUI.GUIDropdown.prototype.findElementById = function(id) {
    return false;
}

FiveGUI.GUIDropdown.prototype.isClicked = function(isClicked) {
    if(typeof this.clicked == "undefined") {
        this.clicked = false;
    }
    
    if(typeof isClicked != "undefined") {
        switch(isClicked) {
            case true:
            case false: {
                this.clicked = isClicked;
                break;
            }
            default: {
                this.clicked = false;
            }
        }
    }
    return this.clicked;    
}

//METHODS

FiveGUI.GUIDropdown.prototype.addElement = function(element) {
    element.parentId = this.id;
    this.elements.push(element);
}

FiveGUI.GUIDropdown.prototype.changeState = function(state) {
    switch(state) {
        case "hovered":
        case "normal": {
            this.state = state;
            break;
        }
        /*default: {
            this.state = "normal";
        }*/
    }
    
    return this;
}

FiveGUI.GUIDropdown.prototype.initialize = function(parent) {    
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
FiveGUI.GUIDropdown.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUIDropdown.prototype.bindListeners = function() {
    this.addEventListener("mouseover", function(e, obj){
        obj.changeState("hovered");
        obj.update(obj);
    });
    this.addEventListener("mouseout", function(e, obj){
        obj.changeState("normal");
        obj.update(obj);
    });    
    this.addEventListener("mousedown", function(e, obj){
        if(!obj.isClicked()) {
        // Do not touch dropdown while select boxes listed
        //    obj.isClicked(false);
        //} else {
            obj.isClicked(true);
        }
        obj.update(obj);
    });    
    this.addEventListener("mouseup", function(e, obj){
        obj.changeState("hovered");
        obj.update(obj);
    });        
}

FiveGUI.GUIDropdown.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUIDropdown.prototype.bindSubElements = function(defaults) {
    var a, b = null;
    for(b in this.elements) {
        for(a in defaults) {
            var methodName = "set"+a.capitalize();
            if(typeof this.elements[b][methodName] == "function") {
                if(this.elements[b]["get"+a.capitalize()]() == undefined) {
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

FiveGUI.GUIDropdown.prototype.draw = function() {
    if(this.getX() == undefined || this.getY() == "undefined") {
        throw new Error("Position coordinates not set - x:" + this.getX() + ", y:"+this.getY());
    }
    
    if(this.getWidth() == undefined || this.getHeight() == undefined) {
        throw new Error("Button dimensions not set - width:" + this.getWindth() + ", height:"+this.getHeight());
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
    
    if(this.isClicked()) {
        var GUI = this.parent;
        while(!(GUI instanceof FiveGUI.GUI)) {
            GUI = GUI.parent;
        }
        
        var optionX = this.getX()+this.parent.getEventX();
        var optionY = this.getY() + this.getHeight()+this.parent.getEventY();
        
        for(a in this.elements) {
            if(this.elements[a].isVisible() == false) {
                this.elements[a]
                    .setX(optionX)
                    .setY(optionY)
                    .isVisible(true);
                    
                GUI.addElement(this.elements[a]);
            }
            this.elements[a].initializePathPoints();                   
            optionY = this.elements[a].getHeight() + optionY;
        }
    } else {
        if(typeof this.elements[this.getSelectedOption()] != "undefined") {
            var caption = this.elements[this.getSelectedOption()].getCaption();
            var color           = this.getFontColor();        
            var font            = this.getFontName();        
            var size            = this.getFontSize();

            dCtx.fillStyle      = color;
            dCtx.font           = size+"px "+font;
            dCtx.textAlign      = "left";
            dCtx.textBaseline   = "middle";

            dCtx.fillText(caption, 0, this.getHeight()/2);
        }    
    }
    
    dCtx.restore();    
    this.bind();
    
    return this.drawCanvas;
}

FiveGUI.GUIDropdown.prototype.drawContour = function() {
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
    
    // dropdown icon
    var iconStart = this.getWidth()-this.getHeight();
    var correction = lineWidthAmplifier%1==0?0.5:0;
    var segment = this.getHeight()/4;
    
    dCtx.lineWidth = lineWidthAmplifier;
    dCtx.beginPath();
    dCtx.moveTo(iconStart+correction, 0);
    dCtx.lineTo(iconStart+correction, this.getHeight());
    dCtx.closePath();
    dCtx.stroke();
    
    dCtx.beginPath();
    dCtx.moveTo(iconStart+segment, Math.floor(segment)+0.5);
    dCtx.lineTo(iconStart+(segment*3), Math.floor(segment)+0.5);
    dCtx.lineTo(iconStart+(segment*2), segment*3);
    dCtx.closePath();
    dCtx.stroke();    
}

FiveGUI.GUIDropdown.prototype.drawBackgroundImage = function() {
    var dCtx = this.drawCtx;
    dCtx.drawImage(this.getBackgroundImage(), 0, 0);
}