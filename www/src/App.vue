<template>
  <div id="app">
    <hello></hello>
  </div>
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
	body
		font-family: Helvetica, sans-serif
</style>
