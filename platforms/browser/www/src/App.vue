<template>
    <hello></hello>
</template>

<script>
	import Hello from './components/Hello.vue'

	export default {
		components: {
			Hello
		}
	}
</script>

<style lang="stylus">

	/*
	 * Variables
	 */
	color-text = #333333
	color-bg = #EAEAE7


	@import url(https://fonts.googleapis.com/css?family=Dosis:200)


	html
		height: 100%


	body
		-webkit-touch-callout: none
		-webkit-text-size-adjust: none
		-webkit-user-select: none

		display: flex
		flex-direction: column

		height: 100%
		margin: 0
		padding: 0
		
		font-family: 'Dosis', sans-serif
		font-size: 16px
		background-color: color-bg
		color: color-text
		
		box-sizing: border-box
		overflow: hidden

</style>
