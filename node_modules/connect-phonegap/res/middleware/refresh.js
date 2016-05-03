<script type="text/javascript">
//
// Refresh the app on a four-finger tap.
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
    });

    document.addEventListener(eventName.touchend, function(evt) {
        var touchCount = Object.keys(currentTouches).length;
        currentTouches = {};
        if (touchCount === 4) {
            evt.preventDefault();
            window.location.reload(true);
        }
    }, false);

})(window);
</script>
