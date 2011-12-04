FiveGUI.GUILabel = function (parameters) { 
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 0
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
}
FiveGUI.GUILib.extend(FiveGUI.GUILabel, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUILabel.prototype.getCaption = function() {
    return this.caption;
}
//SETTERS
FiveGUI.GUILabel.prototype.setCaption = function(caption) {
    this.caption = caption; 
    return this;
}

//PROPERTIES

//METHODS
FiveGUI.GUILabel.prototype.initialize = function(parent) {    
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
    this.initializePathPoints();    
}

FiveGUI.GUILabel.prototype.draw = function() {
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
    if(typeof background != "undefined" && background != null) {
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