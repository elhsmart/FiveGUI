FiveGUI.GUITextarea = function (parameters) { 
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.defaults = {
        // Font settings
        fontSize: 14,
        fontColor: "#fff",
        fontName: "Arial",
        borderWidth: 0,
        backgroundColor: "#fff",
        text: '',
        virtualText: new Array()
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
    
    this.caretVerticalPosition = 0;
    this.textVerticalPosition = 0;
    
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
FiveGUI.GUILib.extend(FiveGUI.GUITextarea, FiveGUI.GUIElement);

//GETTERS
FiveGUI.GUITextarea.prototype.getFocused = function() {
    return this.focused;
}
FiveGUI.GUITextarea.prototype.getText = function() {
    return this.text;
}
FiveGUI.GUITextarea.prototype.getCurrentTextLine = function() {
    if(typeof this.virtualText[this.getCaretVerticalPosition()] != "undefined") {
        return this.virtualText[this.getCaretVerticalPosition()];
    }
    return '';
}
FiveGUI.GUITextarea.prototype.getTextPosition = function() {
    return this.textPosition;
}
FiveGUI.GUITextarea.prototype.getCaretPosition = function() {
    return this.caretPosition;
}
FiveGUI.GUITextarea.prototype.getVirtualText = function() {
    return this.virtualText;
}
FiveGUI.GUITextarea.prototype.getTextVerticalPosition = function() {
    return this.textVerticalPosition;
}
FiveGUI.GUITextarea.prototype.getCaretVerticalPosition = function() {
    return this.caretVerticalPosition;
}

//SETTERS
FiveGUI.GUITextarea.prototype.setTextPosition = function(pos) {
    this.textPosition = pos;
    return this;
}
FiveGUI.GUITextarea.prototype.setCaretPosition = function(pos) {
    this.caretPosition = pos;
    return this;
}
FiveGUI.GUITextarea.prototype.setTextVerticalPosition = function(pos) {
    this.textVerticalPosition = pos;
    return this;
}
FiveGUI.GUITextarea.prototype.setCaretVerticalPosition = function(pos) {
    this.caretVerticalPosition = pos;
    return this;
}
FiveGUI.GUITextarea.prototype.setFocused = function(focused) {
    this.focused = focused;
    return this;
}
FiveGUI.GUITextarea.prototype.setText = function(text) {
    this.text = text;
    return this;
}
FiveGUI.GUITextarea.prototype.setVirtualText = function(text) {
    this.virtualText = text;
    return this;
}

//PROPETRIES
FiveGUI.GUITextarea.prototype.isFocused = function(isFocused) {
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
            input = document.createElement("textarea");
            
            input.style.width = "170px";
            input.style.height = "70px";
            input.style.fontSize = "14px";
            input.style.fontFamily = "Arial";
            
            input.style.position = "absolute";
            input.style.top = "-1000px";
            
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

FiveGUI.GUITextarea.prototype.focus = function() {
    if(document.getElementById("input_"+this.id)) {
        document.getElementById("input_"+this.id).focus();
    }    
}

FiveGUI.GUITextarea.prototype.normalizeText = function(obj) {
    for(a in obj.virtualText) {
        var width = obj.drawCtx.measureText(obj.virtualText[a]).width + 4;
        if(width > obj.getWidth()) {
            var result = obj.virtualText[a];
            var drop = '';
            while(width > obj.getWidth()) {
                drop = result.substr(result.length-1, 1) + drop;
                result = result.substr(0, result.length-1);
                width = obj.drawCtx.measureText(result).width;
            }
            obj.virtualText[a] = result;
            if(drop.length > 0) {
                if(typeof obj.virtualText[parseInt(a)+1] == "undefined") {
                    obj.virtualText[parseInt(a)+1] = drop;
                } else {
                    obj.virtualText[parseInt(a)+1] = drop+obj.virtualText[parseInt(a)+1];
                }
            }
        }
    }

    for(a in obj.virtualText) {
        var lineBreak = false;
        parts = obj.virtualText[a].split("\n");
        for(b in parts) {
            if(b > 0 && parts[b].length > 0) {
                lineBreak = true;
            }
        }
        if(lineBreak) {
            obj.virtualText.splice(parseInt(a), 1, parts[0]+"\n", parts[1]);
        }
    }           
}

//METHODS
FiveGUI.GUITextarea.prototype.bindListeners = function() {
    this.addEventListener("mousedown", function(e, obj){
        if(obj.isFocused() == false) {
            obj.isFocused(true);
        }
        obj.update(obj);
    });       
    
    this.addEventListener("keypress", function(e, obj){
        switch(e.keyCode) {
            default: {
                // PREVENT REACTION TO ENTER KEY
                if(e.keyCode == 13) {
                    break;
                }
                
                var i = 0;
                var charCode = e.which || e.keyCode;
                var charTyped = String.fromCharCode(charCode);
                
                var leftPart = obj.getCurrentTextLine().substr(0, obj.getCaretPosition());
                var rightPart =obj.getCurrentTextLine().substr(
                    obj.getCaretPosition(), 
                    obj.getCurrentTextLine().length - obj.getCaretPosition()
                );
                
                var resultText = leftPart + charTyped + rightPart;
                
                obj.virtualText[obj.getCaretVerticalPosition()] = resultText;
                obj.setCaretPosition(obj.getCaretPosition()+1);               
                
                obj.normalizeText(obj);
                
                if(obj.getCaretPosition() > obj.getCurrentTextLine().length) {
                    obj.setCaretPosition(1);
                    obj.setCaretVerticalPosition(obj.getCaretVerticalPosition()+1);
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
        var prevSymbol = '';
        switch(e.keyCode) {
            case 38: { //TOP
                if(obj.getCaretVerticalPosition() > 0) {
                    obj.setCaretVerticalPosition(parseInt(obj.getCaretVerticalPosition())-1);
                } else {
                    obj.setCaretPosition(0);
                }
                
                if(obj.getCaretPosition() > obj.getCurrentTextLine().length) {
                    obj.setCaretPosition(obj.getCurrentTextLine().length);
                }
                
                if(obj.getCaretPosition() > 0) {
                    prevSymbol = obj.virtualText[obj.getCaretVerticalPosition()].substr(obj.getCaretPosition()-1,1);
                    if(prevSymbol == "\n") {
                        obj.setCaretPosition(obj.getCaretPosition()-1);
                    }
                }                
                break;
            }
            case 37: { //LEFT
                if(obj.getCaretPosition() > 0) {
                    obj.setCaretPosition(obj.getCaretPosition()-1);
                } else {
                    if(typeof obj.virtualText[obj.getCaretVerticalPosition()-1] != "undefined") {
                        obj.setCaretVerticalPosition(obj.getCaretVerticalPosition()-1);
                        obj.setCaretPosition(obj.virtualText[obj.getCaretVerticalPosition()].length-1);
                    } else {
                        obj.setCaretPosition(0);
                    }                    
                }
                
                if(obj.getCaretPosition() > 0) {
                    prevSymbol = obj.virtualText[obj.getCaretVerticalPosition()].substr(obj.getCaretPosition()-1,1);
                    if(prevSymbol == "\n") {
                        obj.setCaretPosition(obj.getCaretPosition()-1);
                    }
                }

                break;
            }
            case 39: { //RIGHT
                var nextSymbol = obj.virtualText[obj.getCaretVerticalPosition()].substr(obj.getCaretPosition(),1);
                if(nextSymbol == "\n") {
                    obj.setCaretPosition(obj.getCaretPosition()+1);
                }
                
                obj.setCaretPosition(obj.getCaretPosition()+1);
                if(obj.getCaretPosition() > obj.getCurrentTextLine().length) {
                    if(typeof obj.virtualText[obj.getCaretVerticalPosition()+1] != "undefined") {
                        obj.setCaretVerticalPosition(obj.getCaretVerticalPosition()+1);
                        obj.setCaretPosition(0);
                    } else {
                        obj.setCaretPosition(obj.getCaretPosition()-1);
                    }
                }

                break;
            }
            case 40: { //BOTTOM
                if(obj.getCaretVerticalPosition() < obj.virtualText.length-1) {
                    obj.setCaretVerticalPosition(parseInt(obj.getCaretVerticalPosition())+1);
                } else {
                    obj.setCaretPosition(obj.getCurrentTextLine().length);
                }
                
                if(obj.getCaretPosition() > obj.getCurrentTextLine().length) {
                    obj.setCaretPosition(obj.getCurrentTextLine().length);
                }
                
                if(obj.getCaretPosition() > 0) {
                    prevSymbol = obj.virtualText[obj.getCaretVerticalPosition()].substr(obj.getCaretPosition()-1,1);
                    if(prevSymbol == "\n") {
                        obj.setCaretPosition(obj.getCaretPosition()-1);
                    }
                }                
                break;
            }
            
            case 8: { //BACKSPACE
                if(obj.getCaretPosition() == 0) {
                    if(obj.getCaretVerticalPosition() == 0) {
                        break;
                    }
                }
                
                var backspaceSymbol = '';
                var changeText = '';
                if(obj.getCaretPosition() == 0) {
                    backspaceSymbol = obj.virtualText[obj.getCaretVerticalPosition()-1].substr(obj.virtualText[obj.getCaretVerticalPosition()-1].length-1,1);
                    if(backspaceSymbol == "\n") {
                        obj.virtualText[obj.getCaretVerticalPosition()-1] = obj.virtualText[obj.getCaretVerticalPosition()-1].substr(0, obj.virtualText[obj.getCaretVerticalPosition()-1].length-1);
                    }

                    var caretPosition = obj.virtualText[obj.getCaretVerticalPosition()-1].length;
                    obj.virtualText.splice(
                        obj.getCaretVerticalPosition()-1, 
                        2, 
                        obj.virtualText[obj.getCaretVerticalPosition()-1]+obj.virtualText[obj.getCaretVerticalPosition()]
                    );
                        
                    obj.setCaretVerticalPosition(obj.getCaretVerticalPosition()-1);
                    obj.setCaretPosition(caretPosition);
                } else {
                    var leftPart = obj.getCurrentTextLine().substr(0, obj.getCaretPosition()-1);
                    var rightPart =obj.getCurrentTextLine().substr (
                        obj.getCaretPosition(), 
                        obj.getCurrentTextLine().length - obj.getCaretPosition()
                    );              
                    obj.virtualText[obj.getCaretVerticalPosition()] = leftPart + rightPart;
  
                    obj.setCaretPosition(obj.getCaretPosition()-1);
                    changeText = obj.virtualText[obj.getCaretVerticalPosition()];
                    if(typeof obj.virtualText[obj.getCaretVerticalPosition()+1] != "undefined") {
                        changeText += obj.virtualText[obj.getCaretVerticalPosition()+1];
                    }
                    obj.virtualText.splice(obj.getCaretVerticalPosition(), 2, changeText);
                }
                
                obj.normalizeText(obj);
                
                break;
            }
            case 13: { //ENTER
                    
                var leftPart = obj.getCurrentTextLine().substr(0, obj.getCaretPosition());
                var rightPart =obj.getCurrentTextLine().substr (
                    obj.getCaretPosition(), 
                    obj.getCurrentTextLine().length - obj.getCaretPosition()
                );                

                obj.virtualText[obj.getCaretVerticalPosition()] = leftPart+"\n";
                
                lineBreakText = '';
                if(typeof obj.virtualText[obj.getCaretVerticalPosition()+1] != "undefined") {
                    lineBreakText = obj.virtualText[obj.getCaretVerticalPosition()+1];
                }
                
                obj.virtualText[obj.getCaretVerticalPosition()+1] = rightPart+lineBreakText;
                
                obj.normalizeText(obj);
                
                obj.setCaretVerticalPosition(obj.getCaretVerticalPosition()+1);
                obj.setCaretPosition(0);
                break;
            }
        }       
        obj.update(obj);
    });       
}

FiveGUI.GUITextarea.prototype.update = function() {
    if(this.parent.drawCanvas) {
        this.parent.update();
    } else {
        this.parent.getContext().drawImage(this.draw(), this.getX(), this.getY());
    }
}

FiveGUI.GUITextarea.prototype.addEventListener = function(type, func){
    var event = 'on' + type;
    if(typeof this.eventListeners[event] == "function") {
        this.eventListeners[event] = new Array(this.eventListeners[event], func);
    } else if (typeof this.eventListeners[event] == "object") {
        this.eventListeners[event].push(func);
    } else {
        this.eventListeners[event] = func;
    }
}

FiveGUI.GUITextarea.prototype.initialize = function(parent) {    
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

FiveGUI.GUITextarea.prototype.getTextWidth = function() {
    var dCtx = this.drawCtx;
    
    var textWidth = dCtx.measureText(
            this.getText().substr(0, this.getCaretPosition())
        ).width + (dCtx.measureText(
            this.getText().substr(this.getCaretPosition(), 1)
        ).width/2) - 2 + this.getTextPosition();       
    
    return textWidth;
}

FiveGUI.GUITextarea.prototype.draw = function() {
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
 
    var textVerticalPosition = (this.getCaretVerticalPosition()+1)*this.getFontSize() - this.getTextVerticalPosition();
    if(textVerticalPosition > this.getHeight()) {
        this.setTextVerticalPosition(this.getTextVerticalPosition() + this.getFontSize());
    } else if(textVerticalPosition - this.getFontSize() < 0) {
        this.setTextVerticalPosition(this.getTextVerticalPosition() - this.getFontSize());
    }
 
    if(this.getBackgroundImage() instanceof Image) {
        this.drawBackgroundImage();
    } else {
        this.drawContour();
    }   
    this.drawCarret();
    this.drawText();
    
    this.bind();
        
    return this.drawCanvas;    
}
FiveGUI.GUITextarea.prototype.drawBackgroundImage = function() {
    var dCtx = this.drawCtx;
    
    dCtx.drawImage(this.getBackgroundImage(), 0, 0);    
}
FiveGUI.GUITextarea.prototype.drawText = function() {
    
    var textWidth = 0;
    var textHeight = this.getTextVerticalPosition()*-1;
    
    var dCtx = this.drawCtx;
    var virtualStrings = this.getVirtualText();
    for(string in virtualStrings) {
        dCtx.fillText(virtualStrings[string], 2-this.getTextPosition(), textHeight + parseInt(string) * this.getFontSize() + this.getFontSize()/2);
    }
    
}

FiveGUI.GUITextarea.prototype.drawContour = function() {
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

FiveGUI.GUITextarea.prototype.drawCarret = function() {
    
    var dCtx = this.drawCtx;
    
    var color           = this.getFontColor();        
    var font            = this.getFontName();        
    var size            = this.getFontSize();
    
    var textWidth = 0;
    var textHeight = 0;
    if(this.virtualText.length > 1) {
        textHeight = (this.getCaretVerticalPosition()) * this.getFontSize()-this.getTextVerticalPosition();
    }

    dCtx.fillStyle      = color;
    dCtx.font           = size+"px "+font;
    dCtx.textAlign      = "left";
    dCtx.textBaseline   = "middle";

    if(this.isFocused()) {        
        textWidth = dCtx.measureText(
            this.getCurrentTextLine().substr(0, this.getCaretPosition())
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
        dCtx.moveTo(textWidth, textHeight+2);
        dCtx.lineTo(textWidth, textHeight+this.getFontSize()+2);
        dCtx.closePath();
        
        dCtx.fill();
        dCtx.stroke();
    }    
}