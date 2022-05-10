const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// If we make a request to any endpoint that doesn't exist, we receive a 404 error
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;