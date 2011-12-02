FiveGUI.GUISelect = function (parameters) {    
    
    this.id = FiveGUI.GUILib.uniq();
    
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    
    this.elements = new Array();
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
    this.nextOptionY = 0;
    
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
FiveGUI.GUILib.extend(FiveGUI.GUISelect, FiveGUI.GUIRegion);

//GETTERS

//SETTERS

//PROPERTIES

//METHODS

FiveGUI.GUISelect.prototype.bindSubElements = function(defaults) {
    var a, b = null;
    for(b in this.elements) {
        for(a in defaults) {
            var methodName = "set"+a.capitalize();
            if(typeof this.elements[b][methodName] == "function") {
                if(this.elements[b]["get"+a.capitalize()]() == undefined) {
                    this.elements[b][methodName](defaults[a]);
                }
            }
        }

        this.elements[b].initialize(this, true);              
    }
}

FiveGUI.GUISelect.prototype.optionClick = function(option){
    
    for(a in this.elements) {
        if(this.elements[a] instanceof FiveGUI.GUIOption) {
            this.elements[a].isSelected(false);
            this.elements[a].changeState("normal");
        }

        if(option.id == this.elements[a].id) {
            this.elements[a].isSelected(true);
            this.elements[a].changeState("clicked");
        }
        
        this.elements[a].update();
    }
}

FiveGUI.GUISelect.prototype.addElement = function(element) {
    if(!(element instanceof FiveGUI.GUIOption)) {
        throw new Error("Sorry, only FiveGUI.GUIOptions allowed in FiveGUI.GUISelect Element.");
    }
    
    element.isVisible(true);
    
    element.setX(1);
    element.setY(this.nextOptionY+1);
    
    this.nextOptionY += element.getHeight();
    
    this.elements.push(element);
}