
require('dotenv').config()

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const PORT = process.env.PORT || 5050;


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// })



app.get('/', (req,res) => {
    res.status(200).json("It's Working")
})

app.get('/online', (req,res) => {
    res.status(200).json("Server Online")
})

/**
 *  /sign in, Post
 * returns: success / failure
 */
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

/**
 *   /register, Post 
 *   returns: post / user
 */
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt) });

/**
 *  /profile/:userId, get
 *  returns user info
 */
app.get(`/profile/:id`, (req,res) => { profile.handleProfileGet(req, res, db)})

/**
 *  /image, put
 *  returns updated user object or data
 */
app.put('/image', (req,res) => { image.handleImage(req, res, db) })

/**
 *  /imageurl, post
 *  takes request from the user and  securely passes the 
 *  data to the clarify api.
 */
 app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res);
  });

/**
 *  @function bcrypt
 *  @description Allows us to hash, and compare passwords for authenticaiton
 */

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your PW DB
// });

// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// })

// bcrypt.compare("veggie", hash, function(err, res) {
//     // res = false
// })


app.listen(PORT, () => {
    console.log(`Server Online: http://localhost:${PORT}/`);
})