import dotenv from 'dotenv';
// import { time } from 'node:console';
dotenv.config();

// TODO: Define an interface for the Coordinates object
class Coordinates{
  longitude: string
  latitude: string
  constructor(longitude: string, latitude: string){
    this.longitude = longitude;
    this.latitude = latitude;
  }
}

// TODO: Define a class for the Weather object
class Weather {
  city: string; 
  date: string; 
  icon: string; 
  iconDescription: string; 
  tempF: number; 
  windSpeed: number; 
  humidity: number;

  constructor(
    city: string, 
    date: string, 
    icon: string, 
    iconDescription: string, 
    temp: number, 
    windSpeed: number, 
    humidity: number 
  ) {
    this.city = city; 
    this.date = date; 
    this.icon = icon; 
    this.iconDescription = iconDescription; 
    this.tempF = this.kelvinToFahrenheit(temp); 
    this.windSpeed = windSpeed; 
    this.humidity = humidity;
  }

  toString(): string {
    const output: string = `Weather object:
    city: ${this.city}
    date: ${this.date}
    icon: ${this.icon}
    iconDescription: ${this.iconDescription}
    tempF: ${this.tempF}
    windSpeed: ${this.windSpeed}
    humidity: ${this.humidity}`;
    return output;
  }

  kelvinToFahrenheit(tempK: number): number {
    let tempF = (tempK - 273.15) * 9/5 + 32;
    return Math.round(tempF * 100) / 100;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  city_name?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {

    try {
      const params = new URLSearchParams({
        q: query,
        limit: '1',
        appid: this.apiKey ?? ''
      });
  
      const finalURL = this.baseURL + '/geo/1.0/direct?' + params.toString();

      console.log(`fetching from URL: ${finalURL}`);
      let response = await fetch(finalURL);
      response = await response.json();
      return response;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const longitude = locationData[0].lon;
    const latitude = locationData[0].lat;
    const coords = new Coordinates(longitude,latitude);
    return coords;
  }

  // // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {
  //   return 'hello world';
  // }

  // // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {
  //   return coordinates.longitude;
  // }

  // // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {
  //   let something = await this.fetchLocationData('hi');
  //   let coords = new Coordinates('something','something');
  //   this.destructureLocationData(coords);
  // }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try{
      const params = new URLSearchParams({
        lon: coordinates.longitude,
        lat: coordinates.latitude,
        appid: this.apiKey ?? ''
      });
      const finalURL = this.baseURL + '/data/2.5/forecast?' + params.toString();
      console.log(`fetching from URL: ${finalURL}`);
      let response = await fetch(finalURL);
      return await response.json();

    } catch (err){
      console.log(err);
      return null;
    }
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(weatherData: any): Weather {
    
  //   const currentData = weatherData[0];
  //   return null;
  // }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any, cityName: string): Weather[] {
    let forecasts: Weather[] = [];

    for(let i = 0; i < weatherData.list.length; i += 8) {
      const dataPoint = weatherData.list[i];
      const date = dataPoint.dt_txt; 
      const icon = dataPoint.weather[0].icon;
      const iconDescription = dataPoint.weather[0].description;
      const tempF = dataPoint.main.temp;
      const windSpeed = dataPoint.wind.speed;
      const humidity = dataPoint.main.humidity;
      forecasts.push(new Weather(cityName,date,icon,iconDescription,tempF,windSpeed,humidity));
    }
    
    return forecasts;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(cityName: string): Promise<Weather[] | null> {
    let locationData: any;
    let coords: Coordinates | null = null;
    let weatherData: any = null;
    let Forecast: Weather[] | null = null;

    locationData = await this.fetchLocationData(cityName);

    if(locationData){
      coords = this.destructureLocationData(locationData);
    }

    if(coords){
      weatherData = await this.fetchWeatherData(coords);
    }

    if(weatherData){
      Forecast = this.buildForecastArray(weatherData, cityName);
      return Forecast;

    } else {return null;}
  }
}

export default new WeatherService();
