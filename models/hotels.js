const mongoose = require('mongoose');
require('dotenv').config();

// Определение схемы задачи
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    beds:{
      type: Number,
    },
    price:{
      type: Number,
    },
  }
);

// Определение модели задачи
const Hotel = mongoose.model('Hotel', hotelSchema, 'listingsAndReviews');

module.exports = Hotel;
//realSum,room_type,room_shared,room_private,person_capacity,host_is_superhost,multi,biz,cleanliness_rating,guest_satisfaction_overall,bedrooms,dist,metro_dist,attr_index,attr_index_norm,rest_index,rest_index_norm,lng,lat