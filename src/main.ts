import './style.css'

import App from './app';

const apiKey = import.meta.env.VITE_API_KEY as string;

const app = new App({ apiKey });

app.watch('loaded', () => {
  console.log('app is loaded')
})

app.layerViews.on('after-add', (event) => {
  console.log(event.item);
});
