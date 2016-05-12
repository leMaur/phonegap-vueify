PhoneGap Vueify
===============
PhoneGap with Vue, Browserify + vueify, hot reload, linting and unit testing.

Getting Started
---------------

### Prerequisites
To use this you'll need Node.js v4 or newer.

### Installation
***via Github***
``` bash
$ git clone https://github.com/leMaur/phonegap-vueify.git MyApp
$ cd MyApp
$ npm install
$ npm run dev
```
Please, change `MyApp`with your folder name.

***via Phonegap***
```bash
$ npm install -g phonegap
$ phonegap create --template phonegap-vueify
$ npm run dev
```
You can then open the app in your browser by visiting [localhost:8888](http://localhost:8888)  

### What's included
- `npm run dev`: Browserify + `vueify` with proper config for source map & hot-reload.
- `npm run build`: Production build with HTML/CSS/JS minification.
- `npm run lint`: Lint JavaScript and `*.vue` files with ESLint.
- `npm test`: Unit tests in PhantomJS with Karma + karma-jasmine + karma-browserify, with support for mocking and ES2015.
- `npm run prepare [ ios | android ]`: Set the platform. Example (`npm run prepare -- ios`).
- `npm run [ ios | android ]`: Run in the iOS simulator / Android emulator. (Running in another terminal).
- `npm run compile [ ios | android ]`: Build the app for the specified platform. Example (`npm run compile -- ios`).
- `npm run clean`: Clean the `platforms/` and `dist/` folders.

## License
MIT. Copyright (c) 2016 Maurizio Lepora.

## Credits
- [Vue Browserify Boilerplate](https://github.com/vuejs-templates/browserify)
- [PhoneGap template Hello World](https://github.com/phonegap/phonegap-template-hello-world)
