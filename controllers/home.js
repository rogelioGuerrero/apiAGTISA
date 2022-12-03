


/** Express router providing related routes to page component data
 *
 * @module routers/components_data
 * @module config - app config
 * @module models- app model module
 * @requires express
 */
const express = require('express');
const router = express.Router();
const config = require('../config.js');
const models = require('../models/index.js');
const utils = require('../helpers/utils.js');

//2lines
const sequelize = models.sequelize;
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression

router.get(['/', '/index'], async function (req, res)
{
    res.render('pages/index/welcome.html');
});



module.exports = router;
