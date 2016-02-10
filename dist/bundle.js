(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactI13nGTM"] = factory();
	else
		root["ReactI13nGTM"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DEFAULT_CATEGORY = 'all';
	var DEFAULT_ACTION = 'click';
	var DEFAULT_LABEL = '';

	var ReactI13nGTM = (function () {
	    function ReactI13nGTM(containerId) {
	        var dataLayerName = arguments.length <= 1 || arguments[1] === undefined ? 'dataLayer' : arguments[1];
	        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	        _classCallCheck(this, ReactI13nGTM);

	        this._loadPromise = null;
	        this._loadAttempts = 0;

	        this.containerId = containerId;
	        this.dataLayerName = dataLayerName;
	        this.options = _extends({}, ReactI13nGTM._defaults, options);
	    }

	    _createClass(ReactI13nGTM, [{
	        key: 'load',
	        value: function load() {
	            var _this = this;

	            if (this._loadPromise) {
	                return this._loadPromise;
	            }

	            var loadPromise = new Promise(function (resolve, reject) {

	                var tagName = 'script';
	                var dataLayerName = _this.dataLayerName;
	                window[dataLayerName] = window[dataLayerName] || [];
	                window[dataLayerName].push({
	                    'gtm.start': new Date().getTime(),
	                    event: 'gtm.js'
	                });
	                var firstScript = document.getElementsByTagName(tagName)[0],
	                    script = document.createElement(tagName),
	                    dl = dataLayerName != 'dataLayer' ? '&amp;l=' + dataLayerName : '';
	                script.async = true;

	                var loaded = false;
	                script.onload = script.onreadystatechange = function () {
	                    if (!loaded && (!this.readyState || this.readyState == 'complete')) {
	                        resolve();
	                        loaded = true;
	                    }
	                };

	                script.onerror = function (error) {
	                    reject(error);
	                };

	                firstScript.parentNode.insertBefore(script, firstScript);
	                script.src = '//www.googletagmanager.com/gtm.js?id=' + _this.containerId + dl;
	            });

	            this._loadPromise = loadPromise.catch(function (err) {
	                // if network error, don't try again, don't increment
	                _this._loadAttempts += 1;
	                _this._loadPromise = null;

	                if (_this._loadAttempts < _this.options.maxLoadAttempts) {
	                    return _this.load();
	                } else {
	                    return Promise.reject(err);
	                }
	            });

	            return this._loadPromise;
	        }
	    }, {
	        key: 'getPlugin',
	        value: function getPlugin() {
	            var _this2 = this;

	            var plugin = {
	                name: 'gtm',
	                eventHandlers: {

	                    pageview: function pageview(payload, callback) {

	                        _this2.load();

	                        window[_this2.dataLayerName].push({
	                            'event': 'content-view',
	                            'content-name': payload.url
	                        });

	                        callback();
	                    },

	                    custom: function custom(payload, callback) {

	                        _this2.load();

	                        window[_this2.dataLayerName].push(_extends({
	                            'event': payload.event || 'custom',
	                            'target': payload.category || DEFAULT_CATEGORY,
	                            'action': payload.action || DEFAULT_ACTION,
	                            'target-properties': payload.label || DEFAULT_LABEL,
	                            'value': payload.value,
	                            'interaction-type': payload.noninteraction
	                        }, payload.extraVariables));

	                        callback();
	                    },

	                    click: function click(payload, callback) {

	                        payload.event = 'click';

	                        plugin.eventHandlers.custom(payload, callback);
	                    },

	                    setVariables: function setVariables(payload, callback) {

	                        if (payload) {
	                            _this2.load();

	                            var data = {};

	                            for (var key in payload) {
	                                if (payload.hasOwnProperty(key) && key !== 'env' && key !== 'i13nNode') {
	                                    data[key] = payload[key];
	                                }
	                            }

	                            window[_this2.dataLayerName].push(data);
	                        }

	                        callback();
	                    }

	                }
	            };

	            return plugin;
	        }
	    }]);

	    return ReactI13nGTM;
	})();

	ReactI13nGTM._defaults = {
	    maxLoadAttempts: 5
	};
	exports.default = ReactI13nGTM;

/***/ }
/******/ ])
});
;