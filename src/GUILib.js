FiveGUI.GUILib = {
    
    uniqId: 0,
    
    extend: function(child, parent){
        var F = function() { }
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        child.superclass = parent.prototype;          
    },
    
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    uniq: function() {
        FiveGUI.GUILib.uniqId++;
        return FiveGUI.GUILib.uniqId;
    }
}