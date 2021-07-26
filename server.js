require('dotenv').config()

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middleware/authorization');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(morgan('dev'));


const PORT = process.env.PORT || 5050;


const db = knex({
    client: 'pg',
    connection: { 
        connectionString: process.env.DATABASE_URL, // dynamic database value for heroku    
        ssl: {
          rejectUnauthorized: false
        }
      }
});

app.get('/online', (req,res) => {
    res.status(200).json("Server Online")
});

/**
 *  /sign in, Post
 * returns: success / failure
 */
app.post('/signin',
        (req, res) => { signin.signinAuthentication(req, res, db, bcrypt)}
);

/**
 *   /register, Post 
 *   returns: post / user
 */
app.post('/register',
        (req,res) => { register.handleRegister(req, res, db, bcrypt)}
);

/**
 *  /logout, Post
 *  returns: 'success' on successful user signout
 */
app.post('/logout',
        auth.requireAuth,
        (req,res) => { logout.handleLogout(req, res)}
);

/**
 *  /profile/:userId, get
 *  returns user info
 */
app.get(`/profile/:id`,
        auth.requireAuth,
        (req,res) => { profile.handleProfileGet(req, res, db)}
);

/**
 *  /profile/:userId, post
 *  updates the user profile
 */
app.post('/profile/:id',
        auth.requireAuth,
        (req,res) => { profile.handleProfileUpdate(req, res, db)}
);

/**
 *  /image, put
 *  returns updated user object or data
 */
app.put('/image',
        auth.requireAuth,
        (req,res) => { image.handleImage(req, res, db)}
);

/**
 *  /imageurl, post
 *  takes request from the user and  securely passes the 
 *  data to the clarify api.
 */
 app.post('/imageurl',
          auth.requireAuth,
          (req, res) => {image.handleApiCall(req, res)}
);


app.listen(PORT, () => {
    console.log(`Server Online: http://localhost:${PORT}/`);
});