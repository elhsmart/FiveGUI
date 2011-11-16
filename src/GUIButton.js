/////////////////////////////////////////
//////////// BUTTON /////////////////////
/////////////////////////////////////////

FiveGUI.GUIButton = function () {
    this.eventListeners = { }
}
FiveGUI.GUILib.extend(FiveGUI.GUIButton, FiveGUI.GUIElement);

// SETTERS
FiveGUI.GUIButton.prototype.setCaption = function(caption) {
    this.caption = caption; 
    return this;
}

FiveGUI.GUIButton.prototype.setTextHoverColor = function(c) {
    this.textHoverColor = c;
    return this;
}

FiveGUI.GUIButton.prototype.setTextClickColor = function(c) {
    this.textClickColor = c;
    return this;
}

FiveGUI.GUIButton.prototype.setHoverBackground = function(b) {
    this.hoverBackground = b;
    return this;
}

FiveGUI.GUIButton.prototype.setClickBackground = function(b) {
    this.clickBackground = b;
    return this;
}

FiveGUI.GUIButton.prototype.setHoverBorder = function(b) {
    this.hoverBorder = b;
    return this;
}

FiveGUI.GUIButton.prototype.setClickBorder = function(b) {
    this.clickBorder = b;
    return this;
}

// GETTERS
FiveGUI.GUIButton.prototype.getCaption = function() {
    return this.caption;
}

FiveGUI.GUIButton.prototype.getHoverBackground = function() {
    return this.hoverBackground;
}

FiveGUI.GUIButton.prototype.getClickBackground = function() {
    return this.clickBackground;
}

FiveGUI.GUIButton.prototype.getHoverBorder = function() {
    return this.hoverBackground;
}

FiveGUI.GUIButton.prototype.getClickBorder = function() {
    return this.clickBackground;
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

//METHODS
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
        obj.draw(obj.getContext());
    });
    this.addEventListener("mouseout", function(e, obj){
        obj.changeState("normal");
        obj.draw(obj.getContext());
    });    
    this.addEventListener("mousedown", function(e, obj){
        obj.changeState("clicked");
        obj.draw(obj.getContext());
    });    
    this.addEventListener("mouseup", function(e, obj){
        obj.changeState("hovered");
        obj.draw(obj.getContext());
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

FiveGUI.GUIButton.prototype.draw = function(c) {
    var ctx = this.ctx;
    ctx.clearRect (this.getX()-1, this.getY()-1, this.getWidth()+2, this.getHeight()+2);
    
    ctx.save();
    
    if(this.getX() == undefined || this.getY() == "undefined") {
        throw new Error("Position coordinates not set - x:" + this.getX() + ", y:"+this.getY());
    }
    
    if(this.getWidth() == undefined || this.getHeight() == undefined) {
        throw new Error("Button dimensions not set - width:" + this.getWindth() + ", height:"+this.getHeight());
    }
    
    var border = this.getBorder();
    if(typeof border != "undefined") {
        ctx.strokeStyle = border;
        ctx.lineWidth = 2;
    }
    
    var background = this.getBackground();
    if(typeof background != "undefined") {
        ctx.fillStyle = background;
    }    
    
    ctx.beginPath();
    ctx.moveTo(this.getX(), this.getY());
    ctx.lineTo(this.getX()+this.getWidth(), this.getY());
    ctx.lineTo(this.getX()+this.getWidth(), this.getY()+this.getHeight());
    ctx.lineTo(this.getX(), this.getY()+this.getHeight());
    ctx.lineTo(this.getX(), this.getY()-1);
    
    if(typeof border != "undefined") {
        ctx.stroke();
    }
    
    if(typeof background != "undefined") {
        ctx.fill();
    }
    
    var caption = this.getCaption();
    if(caption != undefined) {
        var color = this.getTextColor();
        if(color == undefined) {
            color = "#000";
        }
        
        var font = this.getTextFont();
        if(font == undefined) {
            font = "Arial";
        }
        
        var size = this.getTextSize();
        if(size == undefined) {
            size = 14;
        }
        
        ctx.fillStyle = color;
        ctx.font = size+"px "+font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText(caption, this.getX()+(this.getWidth()/2), this.getY()+(this.getHeight()/2));
//        ctx.fillText(caption, this.getX(), this.getY());
    }
    ctx.restore();
    
    this.getContext().drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
}
