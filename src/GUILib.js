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
    },
    
    intersect: function(a1, a2, b1, b2) {
        var result;

        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if ( u_b != 0 ) {
            var ua = ua_t / u_b;
            var ub = ub_t / u_b;

            if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {                    
                return {
                        x: a1.x + ua * (a2.x - a1.x),
                        y: a1.y + ua * (a2.y - a1.y),
                        i: true
                       };
            } else {
                return false;
            }
        } else {
            if ( ua_t == 0 || ub_t == 0 ) {
                return false;
            } else {
                return false;
            }
        }

        return result;
    }
}