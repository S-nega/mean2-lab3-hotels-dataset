var express = require('express');
var router = express.Router();
const Hotel = require('../models/hotels.js');

const { Decimal128 } = require('mongodb');


//get all 
router.get('/', async(req, res)=>{
    try{
      const hotels = await Hotel.find({}, { _id: 0, name: 1, price: 1 }).sort({ price: -1 });
    //   console.log(hotels);
      res.json(hotels);
    } catch (error){
      console.log(error)
      res.status(500).json({message: error.message});
    }
});

//get one by id
router.get('/id/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const hotel = await Hotel.findById(id);
  
        res.json(hotel);
  
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//get one by name
router.get('/name/:name', async(req, res) => {
    try {
        const name = req.params.name;
        const hotels = await Hotel.find({name: name});
  
        res.json(hotels);
  
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/beds/:beds', async(req, res) => {
    try {
        const beds = req.params.beds;

        // const hotels = await Hotel.aggregate([
        //     { $sort: { beds: 1 } },
        //     { $match: { beds: { $gte: beds } } },
        //     { $limit: 30 },
        //     { $project: { _id: 0, name: 1, price: 1 } }
        // ]);

        const explain = await Hotel.find({beds: beds}).limit(30).explain('executionStats');
        const hotels = await Hotel.find({beds: beds}, { _id: 0, name: 1, beds: 1 }).limit(30);
  
        console.log(explain);
        res.json(hotels);
  
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/price/:price', async(req, res) => {
    try {
        const targetPrice = req.params.price;
        

        const explain = await Hotel.find({price: targetPrice}).limit(30).explain('executionStats');
        const hotels = await Hotel.find({price: targetPrice}, { _id: 0, name: 1, price: 1 }).limit(30);
       
        console.log(explain);
        res.json(hotels);
  
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/cheapest', async(req, res) => {
    try{
        // Без использования агрегации
        const start1 = new Date();
        const cheapestListing1 = await Hotel.find({}, { _id: 0, name: 1, price: 1 }).sort({ price: 1 });
        const end1 = new Date();
        console.log("Без использования агрегации:", cheapestListing1, "Время выполнения:", end1 - start1, "мс");


        // С использованием агрегации
        const start2 = new Date();
        const cheapestListing2 = await Hotel.aggregate([
            // { $limit: 1 },
            { $project: { _id: 0, name: 1, price: 1 } },
            { $sort: { price: 1 } },
        ]);
        const end2 = new Date();
        console.log("С использованием агрегации:", cheapestListing2[0], "Время выполнения:", end2 - start2, "мс");

        res.status(200).json(cheapestListing1, cheapestListing2[0]);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


module.exports = router;
