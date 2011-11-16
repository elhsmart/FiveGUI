"use strict";
var FiveGUI = FiveGUI = FiveGUI || {};

FiveGUI.GUI = function(parameters) {
    this.defaults = {};
    
    // desktop flags
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    
    if(typeof parameters == "string") {
        this.canvas = $("#"+parameters).get(0);
    } else if(typeof parameters == "object") {
        var a = null;
        for(a in parameters) {
            switch(a) {
                case "canvasId": {
                    this.canvas =  $("#"+parameters[a]).get(0);
                    break;
                }
                default: {
                    this.defaults[a] = parameters[a];
                }
            }
        }
    }
    
    if(this.canvas != undefined) {
        this.ctx = this.canvas.getContext("2d");
    }
    
    this.elements = new Array();
    this.listen();
}

FiveGUI.GUI.prototype.getContext = function() {
    return this.ctx;
}

FiveGUI.GUI.prototype.listen = function(){
    var that = this;
    
    // desktop events
    this.canvas.addEventListener("mousedown", function(evt){
        that.mouseDown = true;
        that.handleEvent(evt);
    }, false);
    
    this.canvas.addEventListener("mousemove", function(evt){
        that.mouseUp = false;
        that.mouseDown = false;
        that.handleEvent(evt);
    }, false);
    
    this.canvas.addEventListener("mouseup", function(evt){
        that.mouseUp = true;
        that.mouseDown = false;
        that.handleEvent(evt);
    }, false);
    
    this.canvas.addEventListener("mouseover", function(evt){
        that.handleEvent(evt);
    }, false);
    
    this.canvas.addEventListener("mouseout", function(evt){
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

FiveGUI.GUI.prototype.handleEvent = function(evt){
    if (!evt) {
        evt = window.event;
    }
    
    this.setMousePosition(evt);
    
    for (var n = this.elements.length - 1; n >= 0; n--) {
        var element     = this.elements[n];
        var pos         = this.mousePos;
        var el          = element.eventListeners;
        var a           = null;

        if(typeof el != "undefined" && element.isVisible()) {
            if (pos !== null && element.ctx.isPointInPath(pos.x, pos.y)) {
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

FiveGUI.GUI.prototype.addElement = function(element) {
    var a = null;
    for(a in this.defaults) {
        var methodName = "set"+a.capitalize();
        if(typeof element[methodName] == "function") {
            if(element["get"+a.capitalize()]() == undefined) {
                element[methodName](this.defaults[a]);
            }
        }
    }
    
    if(typeof element['bindListeners'] == "function") {
        element.bindListeners();
    }
    
    element.parent = this;
    
    element.canvas                  = document.createElement('canvas');
    element.ctx                     = element.canvas.getContext('2d');
    
    element.canvas.width            = this.canvas.width;
    element.canvas.height           = this.canvas.height;
    element.canvas.style.position   = 'absolute';
    
    if(typeof element.elements == "object") {
        element.bindSubElements(this.defaults);
    }
    
    this.elements[this.elements.length] = element;
}

FiveGUI.GUI.prototype.drawGUI = function() {
    if(this.data == undefined) {
        this.data = this.ctx.getImageData (
            0, 0, 
            this.canvas.width, this.canvas.height
        );
    }
    
    for(a in this.elements) {
        this.elements[a].draw(this.ctx);
    }
}
