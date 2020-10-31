import whenDomReady from 'when-dom-ready';

import { jsReady } from './util/jsReady';

whenDomReady(() => {
    jsReady();
});
