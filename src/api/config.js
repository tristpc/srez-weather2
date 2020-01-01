/** 
 * config.js
 * 
 * Configure an AJAX client
 */
import axios from 'axios';

axios.defaults.baseURL = 'https://api.openweathermap.org/data/2.5/';
axios.defaults.params = {
  appid:  'bd586fd23c1ee5b08ef59926e847b6e0'
};

// Export
export {
  axios as config
};

