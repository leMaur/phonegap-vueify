<script type="text/javascript">
//
// Proxy
///
// Intercept XHR calls that would violate single-origin policy.
// These requests will be proxied through the server.
//
(function() {
    var xhr = {};
    xhr.open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url) {
        var parser = document.createElement('a');
        parser.href = url;

        // WP8 does not set hostname on some XHRs
        if (!parser.hostname) {
            parser.hostname = window.location.hostname;
        }

        // proxy the cross-origin request
        if (!parser.hostname.match(window.location.hostname)) {
            url = '/proxy/' + encodeURIComponent(url);
        }

        xhr.open.apply(this, arguments);
    };
})(window);
</script>
