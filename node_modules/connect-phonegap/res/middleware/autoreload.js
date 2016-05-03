<script type="text/javascript">
//
// Reload the app if server detects local change
//
(function() {
    var host = 'http://127.0.0.1:3000',
        url = host + '/__api__/autoreload',
        timer;

    function postStatus() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && /^[2]/.test(this.status)) {
            }
        }
        xhr.send();
    }

    function checkForReload() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && /^[2]/.test(this.status)) {
                var response = JSON.parse(this.responseText);
                if (response.content.outdated) {
                    postStatus();

                    // this is ensure we don't duplicate a download when we first launch the app on device
                    if(response.content.lastUpdated != 0){
                        window.clearTimeout(timer);
                        window.phonegap.app.config.load(function(config){
                            window.phonegap.app.downloadZip({
                                address: 'http://' + config.address,
                                update: true
                            });
                        });
                    }
                } else if (response.projectChanged) {
                    window.history.back(window.history.length);
                }
            }
        }
        xhr.send();
    }

    document.addEventListener("deviceready", function(){
        timer = setInterval(checkForReload, 1000 * 3);
    }, false);
})(window);
</script>
