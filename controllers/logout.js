const redisClient = require('../redis/redisCongif').redisClient;

const handleLogout = (req, res, redis) => {
    const redisClient = redis.redisClient()
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }
    redisClient.del(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        } else {
            return res.status(200).json('Success');
        }
    })
}