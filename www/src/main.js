import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-new */
var Phonegap = {

	// Application Constructor
	initialize() {
		this.bindEvents()
	},

	// Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
	bindEvents() {
		document.addEventListener('deviceready', this.onDeviceReady, false)
	},

	// deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'Phonegap.receivedEvent(...);'
	onDeviceReady() {
		Phonegap.receivedEvent()
	},

	// Update DOM on a Received Event
	receivedEvent() {
		
		console.log('The device is ready!')

		// Load Vue instance
		new Vue({
		  el: 'body',
		  components: { App }
		})
	}
}


Phonegap.initialize()
