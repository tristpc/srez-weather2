import React, { Component } from 'react';
import { api } from '../api/';
import Layout from '../components/layout';

class Homepage extends Component {
  //Main contructor
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      location: '',
      units: 'metric', // Default
      weather: {},
      today: {}
    };
  }
  /**
   * Lifecycle method, check local storage
   * for last saved search
   */
  componentDidMount() {
      this.setState({
          navigator: window.navigator ? window.navigator : null
      });
      // For convenience, load last query from local storage
      const lastLocation = localStorage.getItem('weatherAppCityName');
      const lastMetric = localStorage.getItem('weatherAppMetric');
      if(lastLocation) {
        this.setState({
            location: lastLocation || '',
            units: lastMetric || this.state.units
        }, this.fetchForecastData);
      }
  }
  /**
   * @function handleMetrics
   * Used to toggle the metrics between metric/imperial
   * @param {String} val - The prefered units
   */
  handleMetrics(val) {
        this.setState(
            {
                units: val
            },
            this.fetchForecastData
        );
  }
  /**
   * @function renderMetricsButtons
   * Used to render the metrics button switcher
   */
  renderMetricsButtons() {
      return (
          <div className="metric-buttons">
              <button className={"metric "  + (this.state.units === 'metric' ? 'active' : '')} onClick={() => this.handleMetrics('metric')}>˚C</button>
              <button className={"metric "  + (this.state.units === 'imperial' ? 'active' : '')} onClick={() => this.handleMetrics('imperial')}>˚F</button>
          </div>
      );
  }

  /**
   * @function renderTodaysWeather
   * Used to render current weather conditions for
   * the active location.
   */
  renderTodaysWeather() {
      if(this.state.loading || !this.state.today.name || this.state.error !== '') return '';
      const { today } = this.state;
      return (
        <div className="today">
            <div className="headline headline--lg">{today.name}</div>
            <div className="today__inner">
                <div className="today__listing">
                    <div className="today__temp-icon">
                        {this.getIcon(today.weather)}
                        {this.getTemp(today.main.temp)}
                    </div>
                    {
                    today.weather.map(({ description }, key) => {
                        return (
                            <p key={key} className="today__listing-item"><strong>Conditions:</strong> {description}</p>
                        );
                    })
                }
                    <p className="today__listing-item"><strong>Humidity:</strong> {today.main.humidity}</p>
                    <p className="today__listing-item"><strong>Pressure:</strong> {today.main.pressure}</p>
                    <p className="today__listing-item"><strong>Wind speed:</strong> {today.wind.speed}</p>
                    <p className="today__listing-item"><strong>Last requested:</strong> {this.getDateAsHours(today.dt)}</p>
                </div>
            </div>
        </div>
      );
  }
  /**
   * @function renderGeolocationButton
   * Used to render a geolocation button.
   * 
   * @returns {String} HTML string
   */
  renderGeolocationButton() {
    if(!this.state.navigator) return;
    return <button className="plain" onClick={this.handleGetLocation}>Locate me</button>;
  }
  /**
   * @function getGeo
   * Used to trigger geolocation query
   */
  getGeo() {
    this.state.navigator.geolocation.getCurrentPosition(this.queryWeatherByLocation);
  }
  /**
   * @function handleGeoLocation
   * Used to query the geolocation of a user
   * and make a query from the API.
   */
  handleGetLocation = () => {
    this.setState({ 
        loading: true,
        location: ''
    }, this.getGeo);
    
  }
  /**
   * @function queryWeatherByLocation
   * Used to send coordinates to the API request
   * when geolocating
   */
  queryWeatherByLocation = position =>
    this.fetchForecastData({ lat: position.coords.latitude, lon: position.coords.longitude });
  /**
   * @function handleChange
   * When a new value is entered into the search field,
   * update the state value
   */
  handleChange = e => {
    this.setState({ location: e.target.value });
  }
  /**
   * @function handleSubmit
   * When the search form is submitted, request the weather
   */
  handleSubmit = e => {
    e.preventDefault();
    this.fetchForecastData();
  }
  /**
   * @function async fetchForecastData
   * Used to async fetch the desired city weather from API
   * 
   * @param {Object} payload - A set of query params 
   */
  async fetchForecastData(payload = { q: this.state.location }) {
    try {
      if(this.state.location === '' && !payload.lat && !payload.lon) return;
      // Loading...
      this.setState({ 
          loading: true,
          error: ''
      });
      // Await fetch from API
      const { data: weather } = await api.fetchForecastData({ ...payload, units: this.state.units });
      const { data: today } = await api.fetchWeatherData({ ...payload, units: this.state.units })
      // Success, update state
      this.setState({ 
          loading: false, 
          weather, 
          today,
          location: `${weather.city.name},${weather.city.country}` 
      });
      // Save to local storage
      localStorage.setItem('weatherAppCityName', this.state.location);
      localStorage.setItem('weatherAppMetric', this.state.units);
    } catch(error) {
      const status = error.response.status;
      let errorMessage = '';
      if(status === 404) {
        errorMessage = 'Your location cannot be found. Please be sure to include City and Country Code. ie. Vancouver,CA';
      } else {
        errorMessage = 'Oops. There is a technical issue fetching weather. Please try again later.'
      }
      this.setState({
        loading: false,
        error: errorMessage,
      });
    }
  }
  /**
   * @function getIcon
   * Used to return a full URL to a weather icon image
   * 
   * @param {String} icon - Icon name
   * @returns {String} Full URL to image on openweather server
   */
  getIconPath(str) {
      return `https://openweathermap.org/img/w/${str}.png`;
  }
  /**
   * @function getIcon
   * Used to return a fully qualified image object
   * for the weather icon.
   * @param {Object} weather - Weather object
   */
  getIcon(weather) {
    return weather.map(({ icon }, key) =>
        <div key={key} className="icon"><img src={this.getIconPath(icon)} alt={icon} /></div>
    );
  }
  /**
   * @function getTemp
   * Use to return a formatted string with temp and symbol
   * 
   * @param {Int} temp - Temperature 
   * @returns {String} String with temp type
   */
  getTemp(temp) {
    const tempRound = Math.round(temp);
    const symbol = (this.state.units === 'metric') ? 'C' : 'F';
    return <div className="temp">{tempRound}<span>˚{symbol}</span></div>;
  }
  /**
   * @function getDescription
   * Used to return a weather description.
   * 
   * @param {Array} weather - Array of weather options
   * @returns {String} HTML details
   */
  getDescription(weather) {
    return weather.map(({ description }, key) =>
        <div className="weather__description" key={key}>{description}</div>
    );
  }
  /**
   * @function getDateAsString
   * Utility for transforming a timstamp 
   * into a readable date string.
   * 
   * @param {String} timestamp - Date timestamp
   * @returns {String} - Human readable day
   */
  getDateAsString(timestamp) {
      return new Date(timestamp*1000).toDateString();
  }
  /**
   * @function addZero
   * Used to add a zero to single digit minutes
   * 
   * @param {Int} i - Minutes 
   * @returns {String} - String of number with 0
   */
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  /**
   * @function getDateAsHours
   * Returns a clock time for display in the UI
   * 
   * @param {String} timestamp
   * @returns {String} - Clock time 
   */
  getDateAsHours(timestamp) {
      const date = new Date(timestamp*1000);
      let hours = date.getHours();
      let minutes = this.addZero(date.getMinutes());
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes !== '00' ? minutes : '';
      return <span className="time">{hours}:{minutes}{ampm}</span>;
  }

  /**
   * @function getWeatherByDay
   * Used to filter weather by a specific day.
   * 
   * @param {String} timestamp - Date timestamp
   * @returns {Array} - Selection of weather by day
   */
  getWeatherByDay(timestamp) {
    const dateAsString = this.getDateAsString(timestamp);
    const { list = [] } = this.state.weather;
    return list.filter(({ dt }) => 
        dateAsString === this.getDateAsString(dt)
    );    
  }
  /**
   * @function getDaysFromWeather
   * Filter the weather listing by day. Used to
   * subgroup results headlined by day.
   * 
   * @returns {Array} Selection of days
   */
  getDaysFromWeather() {
    const { list = [] } = this.state.weather;
    let dateTrack = '';
    return list.filter(({ dt }) => {
        if(this.getDateAsString(dt) !== dateTrack) {
            dateTrack = this.getDateAsString(dt);
            return true;
        }
        return false;
    });
  }
  /**
   * @function getList
   * Used to parse a full list of weather options
   * 
   * @returns {String} HTML with details
   */
  getWeatherListing() {
    if(this.state.loading || this.state.error !== '') return [];
    return this.getDaysFromWeather().map(({dt}, key) => {
        return (
            <div className="weather__day" key={key}>
                <div className="headline">{this.getDateAsString(dt)}</div>
                <div className="weather__hours">  {
                        this.getWeatherByDay(dt).map(({ dt, weather, main }, key) => {
                            return (<div className="weather__card" key={key}>
                                <div className="weather__time">{this.getDateAsHours(dt)}</div>
                                {this.getIcon(weather)}
                                {this.getDescription(weather)}
                                {this.getTemp(main.temp)}
                            </div>)
                        
                        })
                    }
                </div>
            </div>
        );
    });
  }
  /**
   * @function isLoading
   * Used to output a loading signal when the API
   * content is being fetched
   * 
   * @return {String} - Loading string
   */
  isLoading() {
      if(this.state.loading) {
        return <div className="loading">Loading...</div>
      }
      return '';
  }
    /**
   * @function isError
   * Used to output an error message if there are API
   * issues returned.
   * 
   * @return {String} - Error string
   */
  isError() {
    if(this.state.error !== '') {
      return <div className="error">{this.state.error}</div>
    }
    return '';
  }
  // Main render function
  render() {
    return (
      <Layout>
          {this.renderMetricsButtons()}
          <form className="searchForm" onSubmit={this.handleSubmit} autoComplete="off">
            <p><label htmlFor="search">Search a city to fetch the 5 day forecast.</label></p>
            <div className="searchForm__inner">
              <input id="search" className="searchForm__input" type="text" placeholder="ie Vancouver,CA" value={this.state.location} onChange={this.handleChange} />
              <button className="searchForm__button" type="submit">Search</button>
            </div>
          </form>
          {this.renderGeolocationButton()}
          {this.renderTodaysWeather()}
          <div className="weather">
            {this.isError()}
            {this.isLoading()}
            {this.getWeatherListing()}
          </div>
      </Layout>
    );
  }
}
export default Homepage;
