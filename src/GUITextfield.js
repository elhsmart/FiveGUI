FiveGUI.GUITextfield = function (parameters) { 
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 0,
        backgroundColor: "#fff",
        text: ''
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
    this.textPosition = 0;
    
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
FiveGUI.GUILib.extend(FiveGUI.GUITextfield, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUITextfield.prototype.getFocused = function() {
    return this.focused;
}
FiveGUI.GUITextfield.prototype.getText = function() {
    return this.text;
}
FiveGUI.GUITextfield.prototype.getTextPosition = function() {
    return this.textPosition;
}
FiveGUI.GUITextfield.prototype.getCaretPosition = function() {
    return this.caretPosition;
}


//SETTERS
FiveGUI.GUITextfield.prototype.setTextPosition = function(pos) {
    this.textPosition = pos;
    return this;
}
FiveGUI.GUITextfield.prototype.setCaretPosition = function(pos) {
    this.caretPosition = pos;
    return this;
}
FiveGUI.GUITextfield.prototype.setFocused = function(focused) {
    this.focused = focused;
    return this;
}
FiveGUI.GUITextfield.prototype.setText = function(text) {
    this.text = text;
    return this;
}

//PROPETRIES
FiveGUI.GUITextfield.prototype.isFocused = function(isFocused) {
    if(typeof this.focused == "undefined") {
        this.focused = false;
    }
    
    if(typeof isFocused != "undefined") {
        switch(isFocused) {
            case true:
            case false: {
                this.focused = isFocused;
                this.parent.setFocused(this.id);
                break;
            }
            default: {
                this.focused = false;
            }
        }
    }
    if(this.focused == true) {
        // Workaround for Chrome for backspace button
        if(!document.getElementById("input_"+this.id)) {
            input = document.createElement("input");
            input.style.position = "absolute";
            input.style.top = "-1000px";
            form = document.createElement("form");
            input.setAttribute("value", this.getText());
            input.setAttribute("id", "input_"+this.id);
            document.body.appendChild(input);               
            
            document.getElementById("input_"+this.id).focus();
            
            if(typeof input.createTextRange != "undefined") {
                var range = input.createTextRange(); 
                range.collapse(true); 
                range.moveEnd('character', this.getText().length); 
                range.moveStart('character', this.getText().length); 
                range.select();                          
            } else if (typeof input.setSelectionRange != "undefined") {
                input.setSelectionRange(this.getText().length,this.getText().length + 1);
            }
        }
    } else {
        if(document.getElementById("input_"+this.id)) {
            document.body.removeChild(document.getElementById("input_"+this.id));
        }
    }
    return this.focused;    
}

FiveGUI.GUITextfield.prototype.focus = function() {
    if(document.getElementById("input_"+this.id)) {
        document.getElementById("input_"+this.id).focus();
    }    
}

//METHODS
FiveGUI.GUITextfield.prototype.bindListeners = function() {
    this.addEventListener("mousedown", function(e, obj){
        if(obj.isFocused() == false) {
            obj.isFocused(true);
        }
        obj.update(obj);
    });       
    
    this.addEventListener("keypress", function(e, obj){
        switch(e.keyCode) {
            default: {
                var charCode = e.which || e.keyCode;
                var charTyped = String.fromCharCode(charCode);
                
                var leftPart = obj.getText().substr(0, obj.getCaretPosition());
                var rightPart = obj.getText().substr(obj.getCaretPosition(), obj.getText().length - obj.getCaretPosition());
                
                obj.setText(leftPart+charTyped+rightPart);
                obj.setCaretPosition(obj.getCaretPosition()+1);
                
                var textWidth = obj.drawCtx.measureText(obj.getText()).width + 4;
                
                if(textWidth + obj.getTextPosition() > obj.getWidth()) {
                    obj.setTextPosition(textWidth - obj.getWidth());
                }
                break;
            }
        }
        obj.update(obj);
    });
    
    this.addEventListener("keyup", function(e, obj){ 
        obj.update(obj);
    });
    
    this.addEventListener("keydown", function(e, obj){
        switch(e.keyCode) {
            case 38: { //TOP
                obj.setCaretPosition(0);
                obj.setTextPosition(0);
                break;
            }
            case 37: { //LEFT
                if(obj.getCaretPosition() > 0) {
                    obj.setCaretPosition(obj.getCaretPosition()-1);
                }
                
                var leftPart = obj.drawCtx.measureText(
                    obj.getText().substr(0, obj.getCaretPosition())
                ).width;
                    
                if(leftPart < obj.getTextPosition()) {
                    var amplifier = obj.getWidth()/2;
                    if((obj.getTextPosition() - amplifier) < 0) {
                        obj.setTextPosition(0);
                    } else {
                        obj.setTextPosition(obj.getTextPosition() - amplifier);
                    }
                }

                break;
            }
            case 39: { //RIGHT
                if(obj.getCaretPosition() < obj.getText().length) {
                    obj.setCaretPosition(obj.getCaretPosition()+1);
                } else {
                    obj.setCaretPosition(obj.getText().length)
                }
                
                var leftPart = obj.drawCtx.measureText(
                    obj.getText().substr(0, obj.getCaretPosition())
                ).width;
                    
                var textWidth = obj.drawCtx.measureText(obj.getText()).width;
                
                if(leftPart > (obj.getTextPosition() + obj.getWidth())) {
                    var amplifier = obj.getWidth()/2;
                    if(leftPart + amplifier > textWidth) {
                        obj.setTextPosition(textWidth - obj.getWidth()+4);
                    } else {
                        obj.setTextPosition(obj.getTextPosition() + amplifier);
                    }
                }                
                break;
            }
            case 40: { //BOTTOM
                obj.setCaretPosition(obj.getText().length);
                var textWidth = obj.drawCtx.measureText(obj.getText()).width + 4;
                if(textWidth > obj.getWidth()) {
                    obj.setTextPosition(textWidth - obj.getWidth());
                } else {
                    obj.setTextPosition(0);
                }
                break;
            }
            
            case 8: { //BACKSPACE
                if(obj.getCaretPosition() > 0) {
                    var leftPart = obj.getText().substr(0, obj.getCaretPosition()-1);
                    var rightPart = obj.getText().substr(obj.getCaretPosition(), obj.getText().length - obj.getCaretPosition());
                    
                    obj.setCaretPosition(obj.getCaretPosition()-1);
                    obj.setText(leftPart+rightPart);
                    var textWidth = obj.drawCtx.measureText(obj.getText()).width + 4;

                    if(textWidth + obj.getTextPosition() > obj.getWidth()) {
                        obj.setTextPosition((textWidth-obj.getWidth()));
                    } else {
                        obj.setTextPosition(0);
                    }
                }
                break;
            }
        }               
        obj.update(obj);
    });       
}

FiveGUI.GUITextfield.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUITextfield.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUITextfield.prototype.initialize = function(parent) {    
    this.parent = parent;
            
    if(this.getWidth() == 0 || this.getHeight() == 0) {
        throw new Error("Please provide valid dimensions for element GUI Button");
    }
    
    this.eventCanvas.width = this.getX() + this.getWidth();
    this.eventCanvas.height = this.getY() + this.getHeight();
    this.eventCanvas.style.position = 'absolute';    
    
    this.drawCanvas.width = this.getWidth();
    this.drawCanvas.height = this.getHeight();
    this.drawCanvas.style.position = 'absolute';
    
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

FiveGUI.GUITextfield.prototype.draw = function() {
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

    if(this.getBackgroundImage() instanceof Image) {
        this.drawBackgroundImage();
    } else {
        this.drawContour();
    }   
    this.drawCarret(); 
    
    this.bind();
        
    return this.drawCanvas;    
}

FiveGUI.GUITextfield.prototype.drawBackgroundImage = function() {
    var dCtx = this.drawCtx;
    dCtx.drawImage(this.getBackgroundImage(), 0, 0);
}

FiveGUI.GUITextfield.prototype.drawContour = function() {
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
    
    dCtx.restore();
}

FiveGUI.GUITextfield.prototype.getTextWidth = function() {
    var dCtx = this.drawCtx;
    
    var textWidth = dCtx.measureText(
            this.getText().substr(0, this.getCaretPosition())
        ).width + (dCtx.measureText(
            this.getText().substr(this.getCaretPosition(), 1)
        ).width/2) - 2 + this.getTextPosition();       
    
    return textWidth;
}

FiveGUI.GUITextfield.prototype.drawCarret = function() {
    var dCtx = this.drawCtx;
    dCtx.save();
    
    var color           = this.getFontColor();        
    var font            = this.getFontName();        
    var size            = this.getFontSize();

    dCtx.fillStyle      = color;
    dCtx.font           = size+"px "+font;
    dCtx.textAlign      = "left";
    dCtx.textBaseline   = "middle";

    dCtx.fillText(this.getText(), 2-this.getTextPosition(), this.getHeight()/2);
    var textWidth = 0;

    if(this.isFocused()) {        
        textWidth = dCtx.measureText(
            this.getText().substr(0, this.getCaretPosition())
        ).width - this.getTextPosition() + 2;
            
        if(textWidth+3 > this.getWidth()) {
            textWidth = this.getWidth()-3;
        }
        
        if(textWidth%1 == 0) {
            textWidth = textWidth+0.5;
        }
        
        dCtx.lineWidth = 1;
        dCtx.strokeStyle = '#fff';
        dCtx.beginPath();
        dCtx.moveTo(textWidth, 2);
        dCtx.lineTo(textWidth, this.getHeight()-2);
        dCtx.closePath();
        
        dCtx.fill();
        dCtx.stroke();
    }    
}