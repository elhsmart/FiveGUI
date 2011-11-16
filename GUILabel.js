/////////////////////////////////////////
//////////// LABEL //////////////////////
/////////////////////////////////////////

FiveGUI.GUILabel = function () { }
extend(FiveGUI.GUILabel, FiveGUI.GUIElement);
//SETTERS
FiveGUI.GUILabel.prototype.setCaption = function(caption) {
    this.caption = caption; 
    return this;
}
//GETTERS
FiveGUI.GUILabel.prototype.getCaption = function() {
    return this.caption;
}
//PROPETRIES

//METHODS

FiveGUI.GUILabel.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.clearRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    
    ctx.save();
    
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
        ctx.textAlign = "right";
        ctx.textBaseline = "alphabetic";
        
        ctx.fillText(caption, this.getX()+(this.getWidth()/2), this.getY()+(this.getHeight()/2));
//        ctx.fillText(caption, this.getX(), this.getY());
    }
    ctx.restore();
    
    this.getContext().drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
}