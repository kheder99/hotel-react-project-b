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

<<<<<<< HEAD
const categories = new schema({
  name: { type: String, unique: true, required: true },
  image: String,
});
=======

>>>>>>> 7292a7bb72881106dacfc1257cc28c07b9bb546c

const hotels = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "User"
  },
  name: { type: String, unique: true, required: true },
  images: [String],
  description: String,
<<<<<<< HEAD
  category: {
    type: schema.Types.ObjectId,
    ref: "Categories"
  },
=======
>>>>>>> 7292a7bb72881106dacfc1257cc28c07b9bb546c
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
<<<<<<< HEAD
  service: {
    type: schema.Types.ObjectId,
    ref: "Service"
  },
=======
>>>>>>> 7292a7bb72881106dacfc1257cc28c07b9bb546c
  comment: String,
  rate: {
    type: Number,
    required: false,
    enum: [0, 1, 2, 3, 4, 5]
  },

<<<<<<< HEAD
})


const service = new schema({
  name: { type: String, unique: true, required: true },
  images: [String],
=======
});

const booking = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "User"
  },
  hotel: {
    type: schema.Types.ObjectId,
    ref: "Hotel"
  },
  description: String,
  created_date: { type: Date, default: Date.now },
});


const service = new schema({
  name: { type: String, required: true },
  hotelId: {
    type: schema.Types.ObjectId,
    ref: "Hotel",
    required: true 
  },
>>>>>>> 7292a7bb72881106dacfc1257cc28c07b9bb546c
  description: String,
  edit_date: { type: Date, default: Date.now },
  rate: {
    type: Number,
    required: false,
    enum: [0, 1, 2, 3, 4, 5]
  },
});



const User = mongoose.model('User', user);
<<<<<<< HEAD
const Categories = mongoose.model('Categories', categories);
const Hotels = mongoose.model('Hotels', hotels);
const Service = mongoose.model('Service', service);
const Rate = mongoose.model('Rate', rate);

module.exports = {
  users: User,
  categories: Categories,
  hotels: Hotels,
  service: Service,
  rate: Rate
=======
const Hotels = mongoose.model('Hotels', hotels);
const Service = mongoose.model('Service', service);
const Rate = mongoose.model('Rate', rate);
const Booking = mongoose.model('Booking', booking);

module.exports = {
  users: User,
  hotels: Hotels,
  service: Service,
  rate: Rate,
  booking:Booking
>>>>>>> 7292a7bb72881106dacfc1257cc28c07b9bb546c
}