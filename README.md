# react-i13n-gtm

**G**oogle **T**ag **M**anager plugin for [ink](https://github.com/yahoo/react-i13n).


## Install

```
npm install react-i13n-gtm
```


## Implementation

### Code

```JS
// imports
import {setupI13n} from 'react-i13n';
import ReactI13nGTM from 'react-i13n-gtm';
import App from './path/to/App';

// instantiate with your gtm container id
var reactI13nGTM = new ReactI13nGTM('GTM-XXXX');

// pass the plugin the the react i13n application
App = setupI13n(App, {}, [reactI13nGTM.getPlugin()]);
```

### GTM data layer elements

#### Page view

Given current url '/sample/url':

```JS
reacti13nInstance.execute('pageview', {
    url: '/sample/url'
});

dataLayer[dataLayer.length - 1].should.deep.equal({
    'event': 'content-view',
    'content-name': '/sample/url'
});
```

#### Custom event

Given current payload as an object:

```JS
reacti13nInstance.execute('custom', payload);

dataLayer[dataLayer.length - 1].should.deep.equal({
    'event': payload.event,
    'target': payload.category || 'all',
    'action': payload.action || 'click',
    'target-properties': payload.label || '',
    'value': payload.value,
    'interaction-type': payload.noninteraction,
    ...payload.extraVariables
});
```

#### Click event

This only set event to 'click' if not provided.


#### Provide other variables

Set all gtm variables as provided in the payload.


```JS
reacti13nInstance.execute('setVariables', payload);

dataLayer[dataLayer.length - 1].should.deep.equal(payload);
```
