<script type="text/javascript">
//
// Reload the app if server detects local change
//
(function() {

    var url = 'http://' + document.location.host + '/__api__/autoreload';

    function postStatus() {
        var xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && /^[2]/.test(this.status)) {
            }
        }
        xhr.send();
    }

    function checkForReload() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && /^[2]/.test(this.status)) {
                var response = JSON.parse(this.responseText);
                if (response.content.outdated) {
                    postStatus();
                    window.location.reload();
                }
            }
        }
        xhr.send();
    }

    setInterval(checkForReload, 1000 * 3);

})(window);
</script>
