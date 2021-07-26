const jwt = require('jsonwebtoken');
const redisClient = require('../redis/redisCongif').redisClient;

const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return Promise.reject('Incorrect Username or Password.')
    }
    
    return db.select('email', 'hash').from('login')
            .where('email', '=', email)
            .then(data => {
                const isValid = bcrypt.compareSync(password, data[0].hash);
                if(isValid) {
                    return db
                        .select('*')
                        .from('users')
                        .where('email', '=', email)
                        .then( user => user[0])
                        .catch(err => Promise.reject('Error fetching user data'))
                } else {
                    Promise.reject('Incorrect Username or Password')
                }
            })
            .catch(err => Promise.reject('Invalid Username or Password'))
}

const getAuthTokenId = (req,res) => {
    const { authorization } = req.headers;

    return redisClient.get(authorization, (err, reply) => {
        if ( err || !reply ) {
            return res.status(400).json('Unauthorized');
        } else {
            return res.json({ id: reply })
        }
    })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET)
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => { return { success: 'true', userId: id, token } })
        .catch(console.log())
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ?
        getAuthTokenId(req,res):
        handleSignin(db,bcrypt,req,res)
            .then(data => {
                return data.id && data.email ?
                    createSessions(data):
                    Promise.reject('Unauthorized', data)
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err))
}

module.exports = {
    signinAuthentication: signinAuthentication
}