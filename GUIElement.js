/////////////////////////////////////////
//////////// ELEMENT ////////////////////
/////////////////////////////////////////

FiveGUI.GUIElement = function () {
    this.eventListeners = { }
    return this;
}

// SETTERS
FiveGUI.GUIElement.prototype.setWidth = function(w) {
    this.w = w;
    return this;
}
FiveGUI.GUIElement.prototype.setHeight = function(h) {
    this.h = h;
    return this;
}
FiveGUI.GUIElement.prototype.setX = function(x) {
    this.x = x;
    return this;
}
FiveGUI.GUIElement.prototype.setY = function(y) {
    this.y = y;
    return this;
}
FiveGUI.GUIElement.prototype.setBackground = function(background) {
    this.background = background;
    return this;
}
FiveGUI.GUIElement.prototype.setBorder = function(border) {
    this.border = border;
    return this;
}
FiveGUI.GUIElement.prototype.setTextColor = function(color) {
    this.textColor = color;
    return this;
}
FiveGUI.GUIElement.prototype.setTextFont = function(font) {
    this.textFont = font;
    return this;
}
FiveGUI.GUIElement.prototype.setTextSize = function(size) {
    this.textSize = size;
    return this;
}

//GETTERS
FiveGUI.GUIElement.prototype.getWidth = function() {
    return this.w;
}
FiveGUI.GUIElement.prototype.getHeight = function() {
    return this.h;
}
FiveGUI.GUIElement.prototype.getX = function() {
    return this.x + this.getOffsetLeft();
}
FiveGUI.GUIElement.prototype.getY = function() {
    return this.y + this.getOffsetTop();
}
FiveGUI.GUIElement.prototype.getOffsetTop = function() {
    if(typeof this.parent.getY == "function") {
        return this.parent.getY(); 
    }
    return 0;
}
FiveGUI.GUIElement.prototype.getOffsetLeft = function() {
    if(typeof this.parent.getX == "function") {
        return this.parent.getX(); 
    }
    return 0;
}
FiveGUI.GUIElement.prototype.getBackground = function() {
    if(typeof this['getState'] != "function") {
        return this.background;
    } else {
        switch(this['getState']()) {
            case "clicked":{
                return this.getClickBackground();
            }
            case "hovered":{
                return this.getHoverBackground();
            }
            case "normal":
            default: {
                return this.background;
            }
        }
    }
}
FiveGUI.GUIElement.prototype.getBorder = function() {
    if(typeof this['getState'] != "function") {
        return this.border;
    } else {
        switch(this['getState']()) {
            case "clicked":{
                return this.getClickBorder();
            }
            case "hovered":{
                return this.getHoverBorder();
            }
            case "normal":
            default: {
                return this.border;
            }
        }
    }
}
FiveGUI.GUIElement.prototype.getTextColor = function() {
    return this.textColor;
}
FiveGUI.GUIElement.prototype.getTextFont = function() {
    return this.textFont;
}
FiveGUI.GUIElement.prototype.getTextSize = function() {
    return this.textSize;
}
FiveGUI.GUIElement.prototype.getContext = function() {
    return this.parent.getContext();
}


//PROPETRIES
FiveGUI.GUIElement.prototype.isVisible = function(visible) {
    // as getter
    if(visible == undefined) {
        if(this.visible == undefined) {
            this.visible = true;
        }
    } else {    
        switch(visible) {
            case true:
            case false: {
                this.visible = visible;
                break;
            }
            default: {
                this.visible = true;
            }
        }    
    }
    return this.visible;    
}

//METHODS
FiveGUI.GUIElement.prototype.draw = function() {
    /* DUMMY METHOD */
}
