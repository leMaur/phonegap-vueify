<script type="text/javascript">
//
// Go to app's homepage on a three-finger tap.
//
(function() {

    var currentTouches = {},
        eventName = { touchstart: 'touchstart', touchend: 'touchend' };

    if (window.navigator.msPointerEnabled) {
        eventName = { touchstart: 'MSPointerDown', touchend: 'MSPointerUp' };
    }

    document.addEventListener(eventName.touchstart, function(evt) {
        var touches = evt.touches || [evt],
            touch;
        for(var i = 0, l = touches.length; i < l; i++) {
            touch = touches[i];
            currentTouches[touch.identifier || touch.pointerId] = touch;
        }
    }, false);

    document.addEventListener(eventName.touchend, function(evt) {
        var touchCount = Object.keys(currentTouches).length;
        currentTouches = {};
        if (touchCount === 3) {
            evt.preventDefault();
            window.history.back(window.history.length);
        }
    }, false);

})(window);
</script>
