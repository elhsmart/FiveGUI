/////////////////////////////////////////
//////////// ELEMENT ////////////////////
/////////////////////////////////////////

FiveGUI.GUIElement = function (parameters) {
    if(typeof parameters == "object") {
        var a = null;
        for(a in paramenters) {
            if(typeof this["set"+FiveGUI.GUILib.capitalize(a)] == "function") {
                this["set"+FiveGUI.GUILib.capitalize(a)](parameters[a]);
            }
        }
    }
    return this;
}

//GETTERS
FiveGUI.GUIElement.prototype.getBorderWidth = function() {
    return this.borderWidth;
}

FiveGUI.GUIElement.prototype.getBorderColor = function() {
    if(typeof this['getState'] != "function") {
        return this.borderColor;
    } else {
        switch(this['getState']()) {
            case "clicked":{
                return this.getClickBorderColor();
            }
            case "hovered":{
                return this.getHoverBorderColor();
            }
            case "normal":
            default: {
                return this.borderColor;
            }
        }
    }    
}

FiveGUI.GUIElement.prototype.getBackgroundColor = function() {
    if(typeof this['getState'] != "function") {
        return this.backgroundColor;
    } else {
        switch(this['getState']()) {
            case "clicked":{
                return this.getClickBackgroundColor();
            }
            case "hovered":{
                return this.getHoverBackgroundColor();
            }
            case "normal":
            default: {
                return this.backgroundColor;
            }
        }
    }    
}

FiveGUI.GUIElement.prototype.getBackgroundImage = function() {
    return this.backgroundImage;
}

FiveGUI.GUIElement.prototype.getFontColor = function() {
    return this.fontColor;
}

FiveGUI.GUIElement.prototype.getFontName = function() {
    return this.fontName;
}

FiveGUI.GUIElement.prototype.getFontSize = function() {
    return this.fontSize;
}

FiveGUI.GUIElement.prototype.getWidth = function() {
    return this.width;
}

FiveGUI.GUIElement.prototype.getHeight = function() {
    return this.height;
}


FiveGUI.GUIElement.prototype.getX = function() {
    return this.x;
}

FiveGUI.GUIElement.prototype.getY = function() {
    return this.y;
}


//SETTERS
FiveGUI.GUIElement.prototype.setBorderWidth = function(bw) {
    this.borderWidth = bw;
    return this;
}

FiveGUI.GUIElement.prototype.setBorderColor = function(bc) {
    this.borderColor = bc;
    return this;
}

FiveGUI.GUIElement.prototype.setBackgroundColor = function(bc) {
    this.backgroundColor = bc;
    return this;
}

FiveGUI.GUIElement.prototype.setBackgroundImage = function(bi) {
    this.backgroundImage = bi;
    return this;
}

FiveGUI.GUIElement.prototype.setFontColor = function(fc) {
    this.fontColor = fc;
    return this;
}

FiveGUI.GUIElement.prototype.setFontSize = function(fs) {
    this.fontSize = fs;
    return this;
}

FiveGUI.GUIElement.prototype.setFontName = function(fn) {
    this.fontName = fn;
    return this;
}

FiveGUI.GUIElement.prototype.setX = function(posX) {
    this.x = posX;
    return this;
}

FiveGUI.GUIElement.prototype.setY = function(posY) {
    this.y = posY;
    return this;
}

FiveGUI.GUIElement.prototype.setWidth = function(w) {
    this.width = w;
    return this;
}

FiveGUI.GUIElement.prototype.setHeight = function(h) {
    this.height = h;
    return this;
}


//PROPERTIES

FiveGUI.GUIElement.prototype.isMountFilled = function() {
    if(this.mount == null) {
        return false;
    }
    return true;
}

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

FiveGUI.GUIElement.prototype.fillMount = function(data) {
    if(this.mount == null) {
        this.mount = data;
    }
}

FiveGUI.GUIElement.prototype.initialize = function() {
    /* DUMMY METHOD */
}

FiveGUI.GUIElement.prototype.draw = function() {
    /* DUMMY METHOD */
}

FiveGUI.GUIElement.prototype.bindListeners = function() {
    /* DUMMY METHOD */
}