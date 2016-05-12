<template>
    <div class="Hello">
        <img class="Logo Logo-phonegap" src="../images/logo_phonegap.png" alt="PhoneGap">
        <div class="Lead Lead-phonegap">{{ msg[0] }}</div>
        <div class="Lead Lead-spacer">{{ msg[1] }}</div>
        <img class="Logo Logo-vue" src="../images/logo_vue.png" alt="Vue.js">
        <div class="Lead Lead-vue">{{ msg[2] }}</div>
    </div>
    <div class="Copyright">All product names, logos, and brands are property of their respective owners.</div>
</template>

<script>
    export default {
        data () {
            return {
                // Note: modifying `msg` below will not cause changes to occur with
                // hot-reload. As reloaded components preserve their initial state,
                // modifying these values will have no effect.
                msg: [
                    'Phonegap',
                    'meets',
                    'Vue.js'
                ]
            }
        }
    }
</script>

<style lang="stylus">

    /*
     * Variables
     */
    color-phonegap = #2fa0c3
    color-vue = #42b983
    color-muted = #CCCCCC


    .Hello
        flex: 1 0 auto

        display: flex
        flex-direction: column
        align-items: center
        justify-content: center

        > .H1
            color: color-phonegap


    .Logo
        max-height: 100%

        &.Logo-phonegap
            width: 150px

        &.Logo-vue
            width: 120px


    .Lead
        font-size: 2rem

        &.Lead-spacer
            margin: 5px 0 20px
            font-size: 3.5rem

        &.Lead-phonegap
            color: color-phonegap

        &.Lead-vue
            color: color-vue


    .Copyright
        flex 0 0 70px
        font-size: 0.8rem
        color: color-muted
        text-align: center
        padding: 0 40px

</style>