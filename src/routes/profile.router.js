const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/', checkAuthenticated, async (req, res) => {
    res.render('profile/index', {
        user: req.user
    })
})

module.exports = router;
