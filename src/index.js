"use strict";

const DEFAULT_CATEGORY = 'all';
const DEFAULT_ACTION = 'click';
const DEFAULT_LABEL = '';

class ReactI13nGTM {

    static _defaults = {
        maxLoadAttempts: 5
    };

    containerId: string;
    dataLayerName: string;
    options: object;
    _loadPromise: Promise = null;
    _loadAttempts: number = 0;

    constructor(containerId, dataLayerName = 'dataLayer', options = {}) {
        this.containerId = containerId;
        this.dataLayerName = dataLayerName;
        this.options = {
            ...ReactI13nGTM._defaults,
            ...options
        };
    }

    load() {

        if (this._loadPromise) {
            return this._loadPromise;
        }

        var loadPromise = new Promise((resolve, reject) => {

            var tagName = 'script';
            var dataLayerName = this.dataLayerName;
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
            script.onload = script.onreadystatechange = function() {
                if ( !loaded && (!this.readyState || this.readyState == 'complete') ) {
                    resolve();
                    loaded = true;
                }
            };

            script.onerror = function(error) {
                reject(error);
            };

            firstScript.parentNode.insertBefore(script, firstScript);
            script.src = '//www.googletagmanager.com/gtm.js?id=' + this.containerId + dl;

        });

        this._loadPromise = loadPromise.catch((err) => {
            // if network error, don't try again, don't increment
            this._loadAttempts += 1;
            this._loadPromise = null;

            if (this._loadAttempts < this.options.maxLoadAttempts) {
                return this.load();
            } else {
                return Promise.reject(err);
            }
        });

        return this._loadPromise;
    }

    getPlugin() {

        var plugin = {
            name: 'gtm',
            eventHandlers: {

                pageview: (payload, callback) => {

                    this.load();

                    window[this.dataLayerName].push({
                        'event': 'content-view',
                        'content-name': payload.url
                    });

                    callback();
                },

                custom: (payload, callback) => {

                    this.load();

                    window[this.dataLayerName].push({
                        'event': payload.event || 'custom',
                        'target': payload.category || DEFAULT_CATEGORY,
                        'action': payload.action || DEFAULT_ACTION,
                        'target-properties': payload.label || DEFAULT_LABEL,
                        'value': payload.value,
                        'interaction-type': payload.noninteraction
                    });

                    callback();
                },

                click: (payload, callback) => {

                    payload.event = 'click';

                    plugin.eventHandlers.custom(payload, callback);
                }

            }
        };

        return plugin;
    }
}

export default ReactI13nGTM;
