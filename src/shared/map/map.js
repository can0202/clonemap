import {Loader} from '@googlemaps/js-api-loader';

export const loader = new Loader({
  apiKey: 'AIzaSyCf9lM_JmMfWvPRF0lB4Imq0-a9pm2m69s',
  version: 'weekly',
  libraries: ['drawing', 'geometry'],
});

export const initMap = (google, mapId, options) => {
  return new google.maps.Map(document.getElementById(mapId), options);
};
