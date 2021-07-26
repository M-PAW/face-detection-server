const requireAuth = (req, res, redis, next) => {
    const redisClient = redis.redisClient;

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized')
        } else {
            return next();
        }
    })
}

module.exports = {
    requireAuth: requireAuth
}