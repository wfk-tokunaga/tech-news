const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

// If we make a request to any endpoint that doesn't exist, we receive a 404 error
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;