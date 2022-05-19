var express = require('express');
var router = express.Router();
const db = require('../controllers/db');
const auth = require('../controllers/auth');
const crud = require('../controllers/crud');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');
const { json } = require('express');
var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/imgs/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const uploadImage = multer({ storage: imageStorage });

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("hello api");
});

router.post('/signin', async (req, res) => {
    // Read username and password from request body
    try {
        const { email, password } = req.body;
        // Filter user from the users array by username and password
        const user = await db.users.findOne({ 'email': email });
        console.log(user);
        if (user) {
            // Generate an access token
            var isAuth = await bcrypt.compare(password, user.password);
            if (isAuth) {
                var accessToken;

                accessToken = auth.generateAccessToken(user.email, password);

                res.json({
                    user,
                    accessToken
                });
            }
            else {
                res.status(403);
                res.send({ error: ' password is incorrect' });
            }
        }
        else {
            res.status(403);
            res.send({ error: 'User Not Found' });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ error: 'Internal Server Error' });
    }
});



router.post('/signup', async (req, res) => {
    const { userName, email, password, role } = req.body;
    console.log(req.body);
    if (email && password) {
        try {
            const q = await db.users.findOne({ 'email': email });
            if (!q) {
                var hashed_password = await bcrypt.hash(password, 10);
                var user = await new db.users({ userName: userName, email: email, password: hashed_password, role: role });
                await user.save();
                const accessToken = auth.generateAccessToken(email, password);
                res.json({
                    user,
                    accessToken
                });
            }
            else {
                res.status(403);
                res.send({ error: "User Already exist" });
            }
        }
        catch (e) {
            console.log(e);
            res.status(500);
            res.send({ error: e });
        }
    } else {
        res.status(400);
        res.send({ error: "some fields need to be filled" });
    }
});


//----------------hotels------------------

router.get('/hotels', async (req, res) => {
    // crud.readMany(req, res, db.hotels);
    db.hotels.find({}).lean().exec(async(e, result) => {
        if (e) {
            res.status(500);
            res.send({ message: e });
        }
        else {
            let data=[]
            
            for(var i=0;i<result.length;i++){
                let services =await  db.service.find({ hotelId: result[i]._id });
                let rates = await db.rate.find({ hotel: result[i]._id });
                let r=0;
                let hrate=await db.rate.aggregate(
                   [ // Limit to relevant documents and potentially take advantage of an index
                    { $match: {
                        hotel: result[i]._id
                    }},
                
                    { $project: {
                        
                        total: { $add: "$rate"}
                    }}]
                );
                for(var j=0;j<hrate.length;j++){
                    r+=hrate[j].total;
                }
                console.log(hrate);
                result[i].services = services;
                result[i].rate = r/(hrate.length+1);
                result[i].rates = rates;
                data.push(result[i]);
            }
            // console.log(data)
            res.send(data);
        }
    });
    
});

router.post('/hotels', auth.authenticateToken, uploadImage.array('images[]', 12), async (req, res) => {
    try {
        const { name, description, services, images, tags } = req.body;

        console.log(req.body);
        console.log(req.files);
        if (req.files) {
            let img = req.files;
            console.log(img)
            let images = [];
            img.map(v => images.push('/imgs/' + v.filename));
            req.body.images = images;
            req.body.rate = 1;
            crud.create(req, res, db.hotels);
        } else {
            req.body.images = images;
            req.body.rate = 1;
            crud.create(req, res, db.hotels);
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});

router.put('/hotels', auth.authenticateToken, uploadImage.single('image'), async (req, res) => {
    const { cat_id, name, description, tags } = req.body;
    try {
        var ct_id = mongoose.Types.ObjectId(cat_id);
        if (req.user.isAdmin) {
            var active = true;
            var image = '/imgs/' + req.file.filename;
            edited_cat = await db.hotels.findByIdAndUpdate(ct_id, { name: name, image: image, active: active },);
            res.status(200);
            res.send({ Message: "Done" });
        }
        else {
            res.status(403);
            res.send({ error: "you are not admin" });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});

router.delete('/hotels/:_id', auth.authenticateToken, async (req, res) => {
    crud.remove(req, res, db.hotels);
});

//------------------------rates----------------------------------

router.get('/rates/:hotel', auth.authenticateToken, async (req, res) => {
    id = mongoose.Types.ObjectId(req.params.hotel);
    crud.readMany(req, res, db.rate, { hotel: id });
});

router.post('/rates/', auth.authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        crud.create(req, res, db.rate);

    } catch (e) {

        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});

router.put('/rates', auth.authenticateToken, async (req, res) => {

    try {
        var id = mongoose.Types.ObjectId(req.body._id);
        if (req.user.role == 'Admin' || req.user._id == req.body.user) {
            edited_cat = await db.rate.findByIdAndUpdate(id, req.body);
            res.status(200);
            res.send({ Message: "Done" });
        }
        else {
            res.status(403);
            res.send({ error: "you are not admin" });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});

router.delete('/rates/:_id', auth.authenticateToken, async (req, res) => {
    crud.delete(req, res, db.rate);
});
//------------------------------------services----------------------
router.get('/services/:hotel', auth.authenticateToken, async (req, res) => {
    id = mongoose.Types.ObjectId(req.params.hotel);
    crud.readMany(req, res, db.rate, { hotel: id });
});

router.post('/services/', auth.authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        crud.create(req, res, db.service);

    } catch (e) {

        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});

router.put('/services', auth.authenticateToken, async (req, res) => {

    try {
        var id = mongoose.Types.ObjectId(req.body._id);
        if (req.user.role == 'Admin' || req.user._id == req.body.user) {
            edited_cat = await db.service.findByIdAndUpdate(id, req.body);
            res.status(200);
            res.send({ Message: "Done" });
        }
        else {
            res.status(403);
            res.send({ error: "you are not admin" });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});

router.delete('/services/:_id', auth.authenticateToken, async (req, res) => {
    crud.delete(req, res, db.service);
});
//----------------------Booking----------------
router.get('/booking', auth.authenticateToken, async (req, res) => {
    id = mongoose.Types.ObjectId(req.user.id);
    crud.readMany(req, res, db.booking, { user: id });
});
router.post('/booking/', auth.authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        let uid=req.user._id;
        req.body.user=uid;
        crud.create(req, res, db.booking);
    } catch (e) {

        console.log(e);
        res.status(500);
        res.send({ error: e.Message });
    }
});
router.delete('/booking/:_id', auth.authenticateToken, async (req, res) => {
    crud.delete(req, res, db.booking);
});
module.exports = router;