/////////////////////////////////////////
//////////// BUTTON /////////////////////
/////////////////////////////////////////

FiveGUI.GUIButton = function (parameters) {
    
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
FiveGUI.GUILib.extend(FiveGUI.GUIButton, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUIButton.prototype.getPrivateContext = function() {
    return this.privateCtx;
}

FiveGUI.GUIButton.prototype.getParentContext = function() {
    return this.parent.getContext();
}

FiveGUI.GUIButton.prototype.getCaption = function() {
    return this.caption;
}

FiveGUI.GUIButton.prototype.getHoverBackgroundColor = function() {
    return this.hoverBackgroundColor;
}

FiveGUI.GUIButton.prototype.getClickBackgroundColor = function() {
    return this.clickBackgroundColor;
}

FiveGUI.GUIButton.prototype.getHoverBorderColor = function() {
    return this.hoverBorderColor;
}

FiveGUI.GUIButton.prototype.getClickBorderColor = function() {
    return this.clickBorderColor;
}

FiveGUI.GUIButton.prototype.getTextHoverColor = function() {
    return this.textHoverColor;
}

FiveGUI.GUIButton.prototype.getTextClickColor = function() {
    return this.textClickColor;
}

FiveGUI.GUIButton.prototype.getState = function() {
    if(this.state == undefined) {
        this.state = "normal";
    }
    return this.state;
}


//SETTERS
FiveGUI.GUIButton.prototype.setCaption = function(caption) {
    this.caption = caption; 
    return this;
}

FiveGUI.GUIButton.prototype.setTextHoverColor = function(thc) {
    this.textHoverColor = thc;
    return this;
}

FiveGUI.GUIButton.prototype.setTextClickColor = function(tcc) {
    this.textClickColor = tcc;
    return this;
}

FiveGUI.GUIButton.prototype.setHoverBackgroundColor = function(hbc) {
    this.hoverBackgroundColor = hbc;
    return this;
}

FiveGUI.GUIButton.prototype.setClickBackgroundColor = function(cbc) {
    this.clickBackgroundColor = cbc;
    return this;
}

FiveGUI.GUIButton.prototype.setHoverBorderColor = function(hb) {
    this.hoverBorderColor = hb;
    return this;
}

FiveGUI.GUIButton.prototype.setClickBorderColor = function(cb) {
    this.clickBorderColor = cb;
    return this;
}

//PROPERTIES

//METHODS

FiveGUI.GUIButton.prototype.initialize = function(parent) {    
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
        methodName = "get"+FiveGUI.GUILib.capitalize(a);
        if(typeof this[methodName]() == "undefined") {
            this["set"+FiveGUI.GUILib.capitalize(a)](this.defaults[a]);
        }
    }
    
    this.initializePathPoints();
    this.bindListeners();    
}

FiveGUI.GUIButton.prototype.initializePathPoints = function() {
    this.pathPoints = new Array (
        {x:this.getX() + this.parent.getEventX(), y:this.getY() + this.parent.getEventY()},
        {x:this.getX() + this.getWidth() + this.parent.getEventX(), y:this.getY() + this.parent.getEventY()},
        {x:this.getX() + this.getWidth() + this.parent.getEventX(), y:this.getY() + this.getHeight() + this.parent.getEventY()},
        {x:this.getX() + this.parent.getEventX(), y:this.getY() + this.getHeight()+this.parent.getEventY()}
    );
}

FiveGUI.GUIButton.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUIButton.prototype.bindListeners = function() {
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
        obj.update(obj);
    });    
    this.addEventListener("mouseup", function(e, obj){
        obj.changeState("hovered");
        obj.update(obj);
    });        
}

FiveGUI.GUIButton.prototype.changeState = function(state) {
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

FiveGUI.GUIButton.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUIButton.prototype.bind = function() {
    // Path for event binding
    var t = this.id;
    
    for (t = this.id+1; t < FiveGUI.GUILib.uniqId; t++) {
        this.intersectPaths(this.parent.findElementById(t));
    }
    
    var k = null;
    eCtx = this.eventCtx;
    eCtx.save();
    eCtx.beginPath();
    eCtx.moveTo(this.pathPoints[0].x, this.pathPoints[0].y);
    
    for(k in this.pathPoints) {
        eCtx.lineTo(this.pathPoints[k].x, this.pathPoints[k].y);        
    }
    
    eCtx.closePath();
    eCtx.restore();
}

FiveGUI.GUIButton.prototype.intersectPaths = function(object) {
    
    var tPoint = null;
    var oPoint = null;
    var iPoints = 0;
    var intersectPoints = new Array();
    
    for(tPoint in this.pathPoints) {
        var tStart = this.pathPoints[tPoint];
        if(parseInt(tPoint)+1 == this.pathPoints.length) {
            tPoint = -1;
        }
        var tEnd = this.pathPoints[parseInt(tPoint)+1];
        
        intersectPoints.push (tStart);
        for(oPoint in object.pathPoints) {
            
            var oStart = object.pathPoints[oPoint];
            if(parseInt(oPoint)+1 == object.pathPoints.length) {
                oPoint = -1;
            }
            var oEnd = object.pathPoints[parseInt(oPoint)+1];
            intersectPoint = FiveGUI.GUILib.intersect(tStart, tEnd, oStart, oEnd);
            
            if(intersectPoint) {
                intersectPoints.push (intersectPoint);
                iPoints++
            }
        }        
    }
    
    var a = null;
    var k = 0;
    var kStart = 0;
    var kEnd = 0;
    
    for(a in intersectPoints) {
        if(typeof intersectPoints[a].i != "undefined") {
            k = k+1;
            if(k == 1) {
                kStart = a;
            }
            if(k == 2) {
                kEnd = a;
            }
            continue;
        }
    }
    if(intersectPoints[kStart].x != intersectPoints[kEnd].x &&
        intersectPoints[kStart].y != intersectPoints[kEnd].y) {
        intersectPoints.splice(parseInt(kStart)+1, 
        kEnd-1-kStart, {
            x:intersectPoints[kEnd].x, 
            y:intersectPoints[kStart].y
        });
    } else {
        intersectPoints.splice(parseInt(kStart)+1, kEnd-1-kStart);
    }
    this.pathPoints = intersectPoints;
}

FiveGUI.GUIButton.prototype.draw = function() {
    
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
  
    dCtx = this.drawCtx;
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