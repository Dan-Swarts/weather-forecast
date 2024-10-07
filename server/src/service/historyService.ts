import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City{
  name: string;
  id: string;
  constructor(name: string, id: string){
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<any> {

    let historyData = await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });

    return historyData;
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try{
      await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
    } catch (err) {
      throw new Error('failed to write City to database');
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      const cities: any = await this.read();
      const parsedCities: City[] = JSON.parse(cities);
      return parsedCities;

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {

    if (!cityName) {
      throw new Error('city cannot be blank');
    }

    const newCity: City = { name: cityName, id: uuidv4() };

    let cities = await this.getCities();

    if (!cities.find((city) => city.name === cityName)) {
      cities.push(newCity);
      await this.write(cities);
    }
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.getCities();

    cities = cities.filter((city) => {
      return city.id !== id;
    });

    return await this.write(cities);
  }
}

export default new HistoryService();
