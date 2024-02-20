var createError = require('http-errors');
const cors = require("cors");
var express = require('express');
var path = require('path');
// const Users = require('./models/users.js');
const { error } = require('console');
const hotelRouter = require('./routes/hotels.js');
const Hotel = require('./models/hotels.js');

var app = express();
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { AggregationCursor } = require('mongodb');

var app = express();


app.use(express.static(path.join(__dirname, 'lab2-users/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //Разрешение на cors
app.use(bodyParser.json());app.use(express.static(path.join(__dirname, 'lab2-users/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //Разрешение на cors
app.use(bodyParser.json());


app.use('/api/hotels', hotelRouter);

async function AggregationFunctions(){
    
    //Группировка по типу комнаты и подсчет количества записей в каждой группе
    const aggregation = Hotel.aggregate([
        { $group: { _id: "$room_type", count: { $sum: 1 } } }
    ]);

    //Фильтрация по определенным критериям и подсчет средней цены за ночь
    Hotel.aggregate([
        { $match: { beds: { $gte: 2 }, price: { $lt: 200 } } },
        { $group: { _id: null, avgPrice: { $avg: "$price" } } }
    ]);

    //Сортировка по цене за ночь по возрастанию
    Hotel.aggregate([
        { $sort: { price: -1 } }
    ]);

    //Подсчет количества записей и вычисление средней и минимальной цены за ночь
    Hotel.aggregate([
        { $group: { _id: null, count: { $sum: 1 }, avgPrice: { $avg: "$price" }, minPrice: { $min: "$price" } } }
    ]);
    

    // Вывод статистики
    // const explainResult = await aggregation.explain("executionStats");
    console.log(aggregation);
}


//mongoose connecting
mongoose.
connect('mongodb+srv://admin:admin@hotelsdb.xgnhfpf.mongodb.net/?retryWrites=true&w=majority', 
    {
        dbName: 'sample_airbnb',
        
    }
).then(() => {
    
    console.log('connected to MongoDB')

    // mongoose.connection.db.collection('listingsAndReviews').createIndex({ year: 1 });
    mongoose.connection.db.collection('listingsAndReviews').createIndex({ price: 1, beds: -1});
    console.log('Index created for price and beds field');

    // AggregationFunctions();

}).catch((error) => {
    console.log(error)
})

//port connection
app.listen(3000, ()=>{
  console.log('listen port 3000')
});