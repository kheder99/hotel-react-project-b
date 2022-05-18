const mongoose = require('mongoose');
const schema = mongoose.Schema;

const user = new schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  email: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Hotel', 'User']
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  image: String,
});



const hotels = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "User"
  },
  name: { type: String, unique: true, required: true },
  images: [String],
  description: String,
  edit_date: { type: Date, default: Date.now },
  rate: {
    type: Number,
    required: false,
    enum: [0, 1, 2, 3, 4, 5]
  },
});

const rate = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "User"
  },
  hotel: {
    type: schema.Types.ObjectId,
    ref: "Hotel"
  },
  comment: String,
  rate: {
    type: Number,
    required: false,
    enum: [0, 1, 2, 3, 4, 5]
  },

})


const service = new schema({
  name: { type: String, required: true },
  hotelId: {
    type: schema.Types.ObjectId,
    ref: "Hotel",
    required: true 
  },
  description: String,
  edit_date: { type: Date, default: Date.now },
  rate: {
    type: Number,
    required: false,
    enum: [0, 1, 2, 3, 4, 5]
  },
});



const User = mongoose.model('User', user);
const Hotels = mongoose.model('Hotels', hotels);
const Service = mongoose.model('Service', service);
const Rate = mongoose.model('Rate', rate);

module.exports = {
  users: User,
  hotels: Hotels,
  service: Service,
  rate: Rate
}