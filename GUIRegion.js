/////////////////////////////////////////
//////////// REGION /////////////////////
/////////////////////////////////////////
FiveGUI.GUIRegion = function () {    
    
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    
    this.elements = new Array();
}
extend(FiveGUI.GUIRegion, FiveGUI.GUIElement);

FiveGUI.GUIRegion.prototype.addElement = function(element) {
    this.elements.push(element);
}

FiveGUI.GUIRegion.prototype.setMousePosition = function(evt){
    var mouseX = evt.clientX + window.pageXOffset;
    var mouseY = evt.clientY + window.pageYOffset;
    
    this.mousePos = {
        x: mouseX,
        y: mouseY
    };
};

FiveGUI.GUIRegion.prototype.handleEvent = function(evt){
   FiveGUI.GUI.prototype.handleEvent.call(this, evt);
}

FiveGUI.GUIRegion.prototype.bindSubElements = function(defaults) {
    var a,b = null;
    for(b in this.elements) {
        for(a in defaults) {
            var methodName = "set"+a.capitalize();
            if(typeof this.elements[b][methodName] == "function") {
                if(this.elements[b]["get"+a.capitalize()]() == undefined) {
                    this.elements[b][methodName](defaults[a]);
                }
            }
        }

        if(typeof this.elements[b]['bindListeners'] == "function") {
            this.elements[b].bindListeners();
        }

        this.elements[b].parent = this;

        this.elements[b].canvas                  = document.createElement('canvas');
        this.elements[b].ctx                     = this.elements[b].canvas.getContext('2d');

        this.elements[b].canvas.width            = this.canvas.width;
        this.elements[b].canvas.height           = this.canvas.height;
        this.elements[b].canvas.style.position   = 'absolute';      
        
        if(typeof this.elements[b].elements == "object") {
            this.elements[b].bindSubElements(defaults);
        }        
    }
}

FiveGUI.GUIRegion.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.clearRect (this.getX()-1, this.getY()-1, this.getWidth()+2, this.getHeight()+2);
    ctx.save();
    
    if(this.getX() == undefined || this.getY() == "undefined") {
        throw new Error("Position coordinates not set - x:" + this.getX() + ", y:"+this.getY());
    }
    
    if(this.getWidth() == undefined || this.getHeight() == undefined) {
        throw new Error("Region dimensions not set - width:" + this.getWindth() + ", height:"+this.getHeight());
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
    
    ctx.restore();
    this.getContext().drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);    
    
    for(a in this.elements) {
        this.elements[a].draw();
    }
}
