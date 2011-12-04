FiveGUI.GUISlider = function (parameters) { 
    
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
    this.caretPosition = 0;
    
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
FiveGUI.GUILib.extend(FiveGUI.GUISlider, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUISlider.prototype.getCaretPosition = function() {
    return this.caretPosition;
}
FiveGUI.GUISlider.prototype.getHoverBackgroundColor = function() {
    return this.hoverBackgroundColor;
}
FiveGUI.GUISlider.prototype.getClickBackgroundColor = function() {
    return this.clickBackgroundColor;
}
FiveGUI.GUISlider.prototype.getHoverBorderColor = function() {
    return this.hoverBorderColor;
}
FiveGUI.GUISlider.prototype.getClickBorderColor = function() {
    return this.clickBorderColor;
}
FiveGUI.GUISlider.prototype.getTextHoverColor = function() {
    return this.textHoverColor;
}
FiveGUI.GUISlider.prototype.getTextClickColor = function() {
    return this.textClickColor;
}
FiveGUI.GUISlider.prototype.getBasisImage = function() {
    return this.basisImage;
}
FiveGUI.GUISlider.prototype.getHoverCaretImage = function() {
    return this.hoverCaretImage;
}
FiveGUI.GUISlider.prototype.getClickCaretImage = function() {
    return this.clickCaretImage;
}
FiveGUI.GUISlider.prototype.getCaretImage = function() {
    return this.caretImage;
}


//SETTERS
FiveGUI.GUISlider.prototype.setCaretPosition = function(pos) {
    this.caretPosition = pos;
    return this;
}
FiveGUI.GUISlider.prototype.setTextHoverColor = function(thc) {
    this.textHoverColor = thc;
    return this;
}
FiveGUI.GUISlider.prototype.setTextClickColor = function(tcc) {
    this.textClickColor = tcc;
    return this;
}
FiveGUI.GUISlider.prototype.setHoverBackgroundColor = function(hbc) {
    this.hoverBackgroundColor = hbc;
    return this;
}
FiveGUI.GUISlider.prototype.setClickBackgroundColor = function(cbc) {
    this.clickBackgroundColor = cbc;
    return this;
}
FiveGUI.GUISlider.prototype.setHoverBorderColor = function(hb) {
    this.hoverBorderColor = hb;
    return this;
}
FiveGUI.GUISlider.prototype.setClickBorderColor = function(cb) {
    this.clickBorderColor = cb;
    return this;
}
FiveGUI.GUISlider.prototype.setBasisImage = function(bi) {
    this.basisImage = bi;
    return this;
}
FiveGUI.GUISlider.prototype.setHoverCaretImage = function(hci) {
    this.hoverCaretImage = hci;
    return this;
}
FiveGUI.GUISlider.prototype.setClickCaretImage = function(cci) {
    this.clickCaretImage = cci;
    return this;
}
FiveGUI.GUISlider.prototype.setCaretImage = function(ci) {
    this.caretImage = ci;
    return this;
}


//PROPERTIES
FiveGUI.GUISlider.prototype.getState = function() {
    if(this.state == undefined) {
        this.state = "normal";
    }
    return this.state;
}

//METHODS

FiveGUI.GUISlider.prototype.initializePathPoints = function() {
    if(this.getState() != "clicked") {
        var caretWidth = 0;
        var caretHeight = 0;
        
        var img = this.getCaretImage();
        if(img instanceof Image && img.complete) {
            caretWidth = img.width;
            caretHeight = img.height;
            this.effectiveWidth = this.getWidth() - caretWidth;
        } else {
            caretWidth = this.getHeight();
            caretHeight = this.getHeight();
            this.effectiveWidth = this.getWidth() - this.getHeight();
        }
        
        this.pathPoints = new Array (
            {x:this.getX() + this.parent.getEventX() + this.caretPosition, y:this.getY() + this.parent.getEventY()},
            {x:this.getX() + caretWidth + this.parent.getEventX() + this.caretPosition, y:this.getY() + this.parent.getEventY()},
            {x:this.getX() + caretWidth + this.parent.getEventX() + this.caretPosition, y:this.getY() + caretHeight + this.parent.getEventY()},
            {x:this.getX() + this.parent.getEventX() + this.caretPosition, y:this.getY() + caretHeight + this.parent.getEventY()}
        );
    } else {
        this.pathPoints = new Array (
            {x:10000, y:0},
            {x:10000, y:10000},
            {x:0, y:10000},
            {x:0, y:0}
        );
    }
}

FiveGUI.GUISlider.prototype.initialize = function(parent) {    
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

FiveGUI.GUISlider.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUISlider.prototype.bindListeners = function() {
    this.addEventListener("mouseover", function(e, obj){
        
        var img = obj.getCaretImage();
        var caretWidth = 0;
        
        if(img instanceof Image && img.complete) {
            caretWidth = img.width/2;
        } else {
            caretWidth = obj.getHeight()/2;
        }
        
        if(e.pageX >= obj.parent.getEventX() + obj.getX() + caretWidth
        && e.pageX <=  obj.parent.getEventX() + obj.getX() + caretWidth + obj.effectiveWidth) {
            obj.changeState("hovered");
        } else {
            obj.changeState("normal");            
            obj.initializePathPoints();
            obj.bind();             
        }
        
        obj.update(obj);
    });
    this.addEventListener("mouseout", function(e, obj){
        obj.changeState("normal");
        obj.update(obj);
    });    
    this.addEventListener("mousedown", function(e, obj){
        obj.changeState("clicked");
        obj.update(obj);
    });    
    this.addEventListener("mousemove", function(e, obj){
        var img = obj.getCaretImage();
        var caretWidth = 0;
        
        if(img instanceof Image && img.complete) {
            caretWidth = img.width/2;
        } else {
            caretWidth = obj.getHeight()/2;
        }        
        
        if(obj.getState() == "clicked") {
            if(e.pageX >= obj.parent.getEventX() + obj.getX() + caretWidth
            && e.pageX <=  obj.parent.getEventX() + obj.getX() + caretWidth + obj.effectiveWidth) {
                var delta = e.pageX - (obj.parent.getEventX() + obj.getX() + caretWidth);
                obj.caretPosition = delta;
            } else if(e.pageX > obj.parent.getEventX() + obj.getX() + caretWidth + obj.effectiveWidth) {
                obj.caretPosition = obj.effectiveWidth;         
            } else if(e.pageX < obj.parent.getEventX() + obj.getX() + caretWidth) {
                obj.caretPosition = 0;             
            }
        }
        
        obj.initializePathPoints();
        obj.bind();     
        
        obj.update(obj);
    });  
    this.addEventListener("mouseup", function(e, obj){
        obj.changeState("hovered");
        obj.initializePathPoints();
        obj.bind();
        obj.update(obj);
    });        
}

FiveGUI.GUISlider.prototype.changeState = function(state) {
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

FiveGUI.GUISlider.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUISlider.prototype.draw = function() {
    
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

    this.drawBasis();
    this.drawCaret();
 
    dCtx.restore();    
    this.bind();
    
    return this.drawCanvas;
}

FiveGUI.GUISlider.prototype.drawBasis = function() {
    if(this.getBasisImage() instanceof Image) {
        this.drawBasisImage();
    } else {
        this.drawBasisContour();
    }
}

FiveGUI.GUISlider.prototype.drawBasisImage = function() {
    var dCtx = this.drawCtx;
    var height = this.getHeight()/3+1;
    if((this.getHeight()/3)%1 > 0) {
        height = (this.getHeight()/3 - (this.getHeight()/3)%1)+1;
    }

    dCtx.drawImage(this.getBasisImage(), 0, height);
}

FiveGUI.GUISlider.prototype.drawBasisContour = function() {
    var dCtx = this.drawCtx;

    // Contour drawing
    var border = this.getBorderWidth();
    var lineWidthAmplifier = 0;
        
    if(typeof border != "undefined" && border != 0) {
        dCtx.strokeStyle     = this.borderColor;
        dCtx.lineWidth       = border;
        lineWidthAmplifier   = border/2;
    } 
    dCtx.save();
        
    dCtx.beginPath();
    
    var height = this.getHeight()/3+1;
    if((this.getHeight()/3)%1 > 0) {
        height = (this.getHeight()/3 - (this.getHeight()/3)%1)+1;
    }
    
    dCtx.moveTo(lineWidthAmplifier,height);
    dCtx.lineTo(this.getWidth(), height);
    dCtx.lineTo(this.getWidth(), height*2+lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, height*2+lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier, height);
    
    dCtx.closePath();

    if(typeof border != "undefined" && border != 0) {    
        dCtx.stroke();
    }
    
    // Inner Fill
    var background = this.backgroundColor;
    if(typeof background != "undefined") {
        dCtx.fillStyle = background;
        dCtx.fill();
    }    
    dCtx.restore();
}

FiveGUI.GUISlider.prototype.drawCaret = function() {
    if(this.getCaretImage() instanceof Image) {
        this.drawCaretImage();
    } else {
        this.drawCaretContour();
    }    
}

FiveGUI.GUISlider.prototype.drawCaretImage = function() {
    var dCtx = this.drawCtx;
    dCtx.drawImage(this.getCaretImage(), this.caretPosition, 0);
}

FiveGUI.GUISlider.prototype.getCaretImage = function() {
    if(typeof this['getState'] != "function") {
        return this.caretImage;
    } else {
        switch(this['getState']()) {
            case "clicked":{
                return this.getClickCaretImage();
            }
            case "hovered":{
                return this.getHoverCaretImage();
            }
            case "normal":
            default: {
                return this.caretImage;
            }
        }
    }    
}

FiveGUI.GUISlider.prototype.drawCaretContour = function() {
    var dCtx = this.drawCtx;

    // Contour drawing
    var border = this.getBorderWidth();
    var lineWidthAmplifier = 0;
        
    if(typeof border != "undefined" && border != 0) {
        dCtx.strokeStyle     = this.getBorderColor();
        dCtx.lineWidth       = border;
        lineWidthAmplifier   = border/2;
    } 
    dCtx.save();
        
    dCtx.beginPath();
    
    dCtx.moveTo(lineWidthAmplifier+this.caretPosition, lineWidthAmplifier);
    dCtx.lineTo(this.getHeight()+lineWidthAmplifier+this.caretPosition, lineWidthAmplifier);
    dCtx.lineTo(this.getHeight()+lineWidthAmplifier+this.caretPosition, this.getHeight()+lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier+this.caretPosition, this.getHeight()+lineWidthAmplifier);
    dCtx.lineTo(lineWidthAmplifier+this.caretPosition, lineWidthAmplifier);
    
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
