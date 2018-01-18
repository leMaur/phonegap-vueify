<template>

    <div id="app">

        <router-view></router-view>

    </div>

</template>

<script>

    export default {
        name: 'app',
        data ()
        {
            return {
                init: false
            }
        },
        mounted ()
        {
            document.addEventListener('deviceready', this.onDeviceReady, false)
        },
        methods:
        {
            onDeviceReady (ev)
            {
                console.log(ev)
                this.init = true
            }
        }
    }

</script>
