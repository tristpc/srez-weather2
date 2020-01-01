/** 
 * api
 * 
 * Http service wrapper
 */

// Import axios for ajax
import {config as http} from './config';
 
// Main export
export const api = {
  /**
   * @function fetchForecastData
   * Get page url from http service
   * 
   * @param {Object} payload
   * @param {String} payload.q - City,CountryCode (ie. Vancouver,ca)
   * @param {String} payload.units - C or F (ie. metric)
   */
  fetchForecastData: payload =>
    http.get('forecast', { params: { ...payload } }),

  /**
   * @function fetchWeatherData
   * Get page url from http service
   * 
   * @param {Object} payload
   * @param {String} payload.q - City,CountryCode (ie. Vancouver,ca)
   * @param {String} payload.units - C or F (ie. metric)
   */
  fetchWeatherData: payload =>
    http.get('weather', { params: { ...payload } }),
};
