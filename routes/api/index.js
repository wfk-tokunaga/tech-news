// Collects all the routes in our API folder and packages them up for us

const router = require('express').Router();

const userRoutes = require('./user-routes.js');
// In user-routes.js, we didn't specify '/api/users' since we're doing that here
router.use('/users', userRoutes);

module.exports = router;