# Weather App

> A small weather application built with Gatsby and the Open Weather API.

![GitHub last commit](https://img.shields.io/github/last-commit/devinle/weatherapp.svg)

## Demo

[See the demo](https://devinle.github.io/weatherapp/)

## Approach

1. Review the requirements
2. Quick sketch
3. Validate sketches, and compare to current apps.
4. Iterate sketch
5. Compare to my own preferred mobile app
6. Review the API docs
7. Choose a JS framework

## Mobile applications are very fast to access weather. How can a web app compare? 

1. Needs to run very fast, so keep it simple
2. Nice to have geolocation option to quickly find local weather
3. Potential to add hinted dropdown when searching by city for convenience and to match API requirements
4. Celsius vs Fahrenheit switcher
5. Local storage to remember your last searched city for convenience
6. Potential to drill down each day to hourly outlook

## API understanding

* For temperature in Fahrenheit use units=imperial (main.temp)
* For temperature in Celsius use units=metric (main.temp)
* City is under name prop 
* Country code is under country
* clouds.all percent of cloudiness
* weather[].icon to retrieve icon (weather can be an array)
* weather[].main to retrieve conditions
* weather[].description to retrieve weather description

## Breakdown 

- Search Form
- Large card for today’s weather
- Small cards for remaining days
- Slider for hourly today (not used)
- API request
- Geolocation functionality
- Local Storage to save last search

## JS Requirements

- API service (axiom)
- JSON file for city codes and hinted search (not using)
- Gatsby with React for quick DOM updates and easy state management

## License

[MIT](http://vjpr.mit-license.org)
