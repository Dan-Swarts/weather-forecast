import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';
// import { stat } from 'fs';

  // TODO: POST Request with city name to retrieve weather data
  router.post('/', async (req: Request, res: Response) => {
    try{
      // TODO: GET weather data from city name
      const { cityName } = req.body;
      const data = await weatherService.getWeatherForCity(cityName);

      // TODO: save city to search history
      await HistoryService.addCity(cityName);
      res.json(data);

    } catch(err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try{
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const cityID = req.params.id;

    if(!cityID) {
      res.status(400).json({ msg: 'City id is required' });
    }
    await HistoryService.removeCity(cityID);
    res.json({ sucess: 'City successfully removed from search history' });
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
