"use strict";

import chai from 'chai';
import chaiAsPromise from 'chai-as-promised';
import chaiDom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import jsdom from 'jsdom';
import ReactI13nGTM from '../../dist/bundle';

chai.should();
chai.use(chaiAsPromise);
chai.use(chaiDom);
chai.use(sinonChai);

describe('gtm plugin client', function () {

    var reactI13nGTM;

    var containerId = 'GTM-XXXX';
    var layerName = 'customLayer';

    beforeEach(function (done) {

        jsdom.env('<html>\n    <head>\n        <script></script>        \n    </head>\n</html>', [], function(err, window) {
            global.window = window;
            global.document = window.document;
            global.navigator = window.navigator;
            global.location = window.location;
            global.HTMLElement = window.HTMLElement;
            global.NodeList = window.NodeList;

            reactI13nGTM = new ReactI13nGTM(containerId, layerName);
            done();
        });

    });

    describe('prototype', function () {

        describe('load', function () {

            it('should load append gtm script to load the container', function (done) {

                reactI13nGTM.load();
                document.head.should.contain('script[src="//www.googletagmanager.com/gtm.js?id=' + containerId + '&amp;l=' + layerName + '"]');
                done();

            });

        });

        describe('getPlugin', function () {

            var plugin;

            beforeEach(function () {

                reactI13nGTM.load();
                plugin = reactI13nGTM.getPlugin();

            });

            it('should get a plugin with name gtm and eventHandlers', function () {

                plugin.name.should.equal('gtm');
                plugin.eventHandlers.should.be.an('object');

            });

            describe('eventHandlers', function () {

                describe('pageview', function () {

                    it('should push the right event in the data layer', function (done) {

                        var payload = {
                            url: '/path'
                        };

                        plugin.eventHandlers.pageview(payload, () => {
                            window[layerName][window[layerName].length-1].should.deep.equal({
                                'content-name': payload.url,
                                event: 'content-view'
                            });
                            done();
                        });

                    });

                });

                describe('custom', function () {

                    it('should push the right event in the data layer', function (done) {

                        var payload = {
                            event: 'myEvent',
                            category: 'myCategory',
                            action: 'myAction',
                            label: 'myLabel',
                            value: 'myValue',
                            noninteraction: true
                        };

                        plugin.eventHandlers.custom(payload, () => {
                            window[layerName][window[layerName].length-1].should.deep.equal({
                                'event': payload.event,
                                'target': payload.category,
                                'action': payload.action,
                                'target-properties': payload.label,
                                'value': payload.value,
                                'interaction-type': payload.noninteraction
                            });
                            done();
                        });

                    });

                });

                describe('click', function () {

                    beforeEach(function () {

                        sinon.spy(plugin.eventHandlers, 'custom');

                    });

                    afterEach(function () {

                        plugin.eventHandlers.custom.restore();

                    });

                    it('should use custom event handler with the "click" event', function (done) {

                        var payload = {
                            category: 'myCategory',
                            action: 'myAction',
                            label: 'myLabel',
                            value: 'myValue',
                            noninteraction: true
                        };

                        plugin.eventHandlers.click(payload, () => {
                            window[layerName][window[layerName].length-1].should.deep.equal({
                                'event': 'click',
                                'target': payload.category,
                                'action': payload.action,
                                'target-properties': payload.label,
                                'value': payload.value,
                                'interaction-type': payload.noninteraction
                            });
                            done();
                        });

                    });

                });

            });

        });

    });

});
