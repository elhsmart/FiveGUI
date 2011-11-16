FiveGUI.GUILib = {
    extend: function(child, parent){
        var F = function() { }
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        child.superclass = parent.prototype;          
    }
}