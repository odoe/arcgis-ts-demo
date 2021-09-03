import './style.css'

import App from './app';

const apiKey = 'AAPK6f433fecf80d4d17b1510d043ea28f65h4D1jbtaAiyCqRy2w7NQOF8NAbQ0k4wQNHAM3nx4OMr3QHIzN8WLMEqCFLPUfYkc';

const app = new App({ apiKey });

app.watch('loaded', () => {
  console.log('app is loaded')
})

app.layerViews.on('after-add', (event) => {
  console.log(event.item);
});
