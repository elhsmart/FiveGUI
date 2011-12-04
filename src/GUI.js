"use strict";
var FiveGUI = FiveGUI = FiveGUI || {};

FiveGUI.GUI = function(parameters) {
    
    this.id         = FiveGUI.GUILib.uniq();
    this.defaults   = { };
    this.mainCanvas = null;
    this.mainCtx    = null;
    this.elements   = new Array();
    this.eventCoords= new Array();
    
    this.mousePos   = null;
    this.mouseDown  = false;
    this.mouseUp    = false;
    
    if(typeof parameters == "object") {
        var a = null;
        for(a in parameters) {
            switch(a) {
                case "canvas": {
                    this.mainCanvas = document.getElementById(parameters[a]);
                    break;
                }
                default: {
                    this.defaults[a] = parameters[a];
                }
            }
        }        
    }
    
    if(typeof parameters == "string") {
        this.mainCanvas = document.getElementById(parameters);
    }
    
    if(typeof this.mainCanvas != "object" || !(this.mainCanvas instanceof HTMLCanvasElement)) {
        throw new Error("Please provide valid HTMLCanvasElement for GUI");
    }
    
    this.mainCtx = this.mainCanvas.getContext("2d");    
    this.listen();
}

FiveGUI.GUI.prototype.getX = function() {
    return 0;
}

FiveGUI.GUI.prototype.getY = function() {
    return 0;
}

FiveGUI.GUI.prototype.getEventX = function() {
    return 0;
}

FiveGUI.GUI.prototype.getEventY = function() {
    return 0;
}

FiveGUI.GUI.prototype.getContext = function() {
    return this.mainCtx;
}

FiveGUI.GUI.prototype.setFocused = function(id) {
    if(typeof this.focused != "undefined" &&
        this.focused != id) {
        var oldId = this.focused;
        var element = this.findElementById(oldId);
        element.isFocused(false);
        element.update();
    }
    this.focused = id;
}

FiveGUI.GUI.prototype.listen = function(){
    var that = this;
    
    // desktop events
    window.addEventListener("keydown", function(evt){
        that.handleKeyboardEvent("keydown", evt);
    }, false);
    
    window.addEventListener("keyup", function(evt){
        that.handleKeyboardEvent("keyup", evt);
    }, false);   
    
    window.addEventListener("keypress", function(evt){
        that.handleKeyboardEvent("keypress", evt);
    }, false);       
    
    this.mainCanvas.addEventListener("mousedown", function(evt){
        that.mouseDown = true;
        that.handleMouseEvent(evt);
    }, false);
    
    this.mainCanvas.addEventListener("mousemove", function(evt){
        that.mouseUp = false;
        that.mouseDown = false;
        that.handleMouseEvent(evt);
    }, false);
    
    this.mainCanvas.addEventListener("mouseup", function(evt){
        that.mouseUp = true;
        that.mouseDown = false;
        that.handleMouseEvent(evt);
        
        if(typeof that.focused != "undefined") {
            var el = that.findElementById(that.focused);
            el.focus();
        }
    }, false);
    
    this.mainCanvas.addEventListener("mouseover", function(evt){
        that.handleMouseEvent(evt);
    }, false);
    
    this.mainCanvas.addEventListener("mouseout", function(evt){
        that.mousePos = null;
    }, false);
};

FiveGUI.GUI.prototype.setMousePosition = function(evt){
    var mouseX = evt.clientX + window.pageXOffset;
    var mouseY = evt.clientY + window.pageYOffset;
    
    this.mousePos = {
        x: mouseX,
        y: mouseY
    };
};

FiveGUI.GUI.prototype.handleKeyboardEvent = function(type, evt) {
    if (!evt) {
        evt = window.event;
    }
    
    if(typeof this.focused != "undefined") {
        var element = this.findElementById(this.focused);
        if(typeof element != "undefined") {
            var listeners = element.eventListeners;
            
            if(type == "keydown") {
                if (listeners.onkeydown !== undefined) {
                    if(typeof listeners.onkeydown == "function") {
                        listeners.onkeydown(evt, element);
                    } else if(typeof listeners.onkeydown == "object"){
                        for( a in listeners.onkeydown) {
                            listeners.onkeydown[a](evt, element);                        
                        }
                    }
                }
            }
            
            if(type == "keyup") {
                if (listeners.onkeyup !== undefined) {
                    if(typeof listeners.onkeyup == "function") {
                        listeners.onkeyup(evt, element);
                    } else if(typeof listeners.onkeyup == "object"){
                        for( a in listeners.onkeyup) {
                            listeners.onkeyup[a](evt, element);                        
                        }
                    }
                }
            }      
            
            if(type == "keypress") {
                if (listeners.onkeypress !== undefined) {
                    if(typeof listeners.onkeypress == "function") {
                        listeners.onkeypress(evt, element);
                    } else if(typeof listeners.onkeypress == "object"){
                        for( a in listeners.onkeypress) {
                            listeners.onkeypress[a](evt, element);                        
                        }
                    }
                }
            }              
        }
    }
}

FiveGUI.GUI.prototype.handleMouseEvent = function(evt){
    if (!evt) {
        evt = window.event;
    }
    
    this.setMousePosition(evt);
    
    for (var n = this.elements.length - 1; n >= 0; n--) {
        var element     = this.elements[n];
        if(typeof element == "undefined") {
            break;
        }
        
        var pos         = this.mousePos;
        var el          = element.eventListeners;
        var a           = null;
        var k           = null;

        
        if(typeof el != "undefined" && element.isVisible()) {
            if (pos !== null 
                && element.eventCtx.isPointInPath(pos.x, pos.y)
                && !( element instanceof FiveGUI.GUIRegion ||
                        element instanceof FiveGUI.GUILabel
                    )) {
                
                // Overlaping with top elements
                for(k = element.id+1; k <= FiveGUI.GUILib.uniqId; k++) {                    
                    var obj = this.findElementById(k);
                    if(obj != false && 
                        // Check of instancing added in case of overlaping dropdowned options over all elements.
                        !(element instanceof FiveGUI.GUIOption 
                            && this.findElementById(element.parentId) instanceof FiveGUI.GUIDropdown)) {
                        if(obj.eventCtx.isPointInPath(pos.x, pos.y) ) {
                            element.mouseOver = false;
                            if (el.onmouseout !== undefined) {
                                if(typeof el.onmouseout == "function") {
                                    el.onmouseout(evt, element);
                                } else if(typeof el.onmouseout == "object"){
                                    for( a in el.onmouseout) {
                                        el.onmouseout[a](evt, element);                        
                                    }
                                }
                            }                        
                            return false;
                        }
                    }
                }
                
                // Overlaping with Region canvas
                if(element.parent instanceof FiveGUI.GUIRegion
                    && !element.parent.eventCtx.isPointInPath(pos.x, pos.y)) {
                    element.mouseOver = false;
                    if (el.onmouseout !== undefined) {
                        if(typeof el.onmouseout == "function") {
                            el.onmouseout(evt, element);
                        } else if(typeof el.onmouseout == "object"){
                            for( a in el.onmouseout) {
                                el.onmouseout[a](evt, element);                        
                            }
                        }
                    }                        
                    return false;                        
                }
                
                // handle onmousedown	
                if (this.mouseDown) {
                    this.mouseDown = false;
                    if (el.onmousedown !== undefined) {
                        if(typeof el.onmousedown == "function") {
                            el.onmousedown(evt, element);
                        } else if(typeof el.onmousedown == "object") {
                            for(a in el.onmousedown) {
                                 el.onmousedown[a](evt, element);
                            }
                        }
                    }
                }
                // handle onmouseup
                else if (this.mouseUp) {
                    this.mouseUp = false;
                    if (typeof el.onmouseup !== undefined) {
                        if(typeof el.onmouseup == "function") {
                            el.onmouseup(evt, element);
                        } else if(typeof el.onmouseup == "object") {
                            for (a in el.onmouseup) {
                                el.onmouseup[a](evt, element);
                            }
                        }
                    }
                }

                // handle onmouseover
                else if (!element.mouseOver) {
                    element.mouseOver = true;
                    if (el.onmouseover !== undefined) {
                        if(typeof el.onmouseover == "function") {
                            el.onmouseover(evt, element);
                        } else if(typeof el.onmouseover == "object") {
                            for(a in el.onmouseover) {
                                 el.onmouseover[a](evt, element);
                            }                        
                        }
                    }
                }

                // handle onmousemove
                else if (el.onmousemove !== undefined) {
                    if(typeof el.onmousemove == "function") {
                        el.onmousemove(evt, element);
                    } else if(typeof el.onmousemove == "object") {
                        for(a in el.onmouseomve) {
                            el.onmousemove[a](evt, element);
                        }
                    }                
                }
            }
            // handle mouseout condition
            else if (element.mouseOver) {
                element.mouseOver = false;
                if (el.onmouseout !== undefined) {
                    if(typeof el.onmouseout == "function") {
                        el.onmouseout(evt, element);
                    } else if(typeof el.onmouseout == "object"){
                        for( a in el.onmouseout) {
                            el.onmouseout[a](evt, element);                        
                        }
                    }
                }
            }
        }
        
        if(typeof element.handleEvent == "function") {
            element.mouseDown = this.mouseDown;
            element.mouseUp = this.mouseUp;
            element.handleEvent(evt);
        }
    }
};

FiveGUI.GUI.prototype.findElementById = function(id) {
    var a = null;
    for(a in this.elements) {
        if(this.elements[a].id == id) {
            return this.elements[a];
        }
        
        if(typeof this.elements[a].elements == "object") {
            var obj = this.elements[a].findElementById(id);
            if(typeof obj == "object") {
                return obj;
            }
        }
    }
    return false;
}

FiveGUI.GUI.prototype.addElement = function(element) {
    
    var a = null;
    for(a in this.defaults) {
        var methodName = "set"+FiveGUI.GUILib.capitalize(a);
        if(typeof element[methodName] == "function") {
            if(
                element["get"+FiveGUI.GUILib.capitalize(a)]() == undefined &&
                typeof element["get"+FiveGUI.GUILib.capitalize(a)]() == "undefined"
                ) {
                element[methodName](this.defaults[a]);
            }
        }
    }
    
    element.initialize(this);
    
    if(typeof element.elements == "object") {
        element.bindSubElements(this.defaults);
    }
    
    this.elements[this.elements.length] = element;
}

FiveGUI.GUI.prototype.drawGUI = function() {
    var a = null;
    for(a in this.elements) {
        this.mainCtx.drawImage(this.elements[a].draw(), this.elements[a].getX(), this.elements[a].getY());
    }
}

FiveGUI.GUI.prototype.optionClick = function(obj) {
    var selectedOption = null;
    var GUI = this;
    
    for(a in this.elements) {
        if(this.elements[a] instanceof FiveGUI.GUIOption) {
            this.elements[a].isVisible(false);
            this.elements[a].update(a);
        }

        if(obj.id == this.elements[a].id) {
            selectedOption = a;
        }
    }

    var Dropdown = this.findElementById(obj.parentId);

    if(Dropdown && Dropdown instanceof FiveGUI.GUIDropdown) {

        for(a in Dropdown.elements) {
            if(Dropdown.elements[a].id == obj.id) {
                Dropdown.setSelectedOption(a);
            }
        }

        Dropdown
            .isClicked(false);
        Dropdown    
            .update();

        for(a in Dropdown.elements) {
            Dropdown.elements[a].isVisible(false);
        }

        var k = 0;
        for(k = 0; k < this.elements.length; k++) {
            if(this.elements[k] instanceof FiveGUI.GUIOption) {
                this.elements.splice(k, 1);
                k--;
            }
        }
    }    
}
