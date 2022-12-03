/** Express Server App
 * @module server/app
 * @requires express
 * @requires config - app configigurations
 * @requires path- path module
 * @requires cors- Enable cors for all routes
 * @requires auth/passport passport auth using JWTStrategy
 * @requires helpers/response Http Response Status Code
 */


const express = require('express');
const path = require('path');
const config = require('./config.js');
const cors = require('cors');


const app = express();

//set view engine use to return Html
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
require('./helpers/response')(app);
app.use(cors());
app.use(express.static(config.app.publicDir));
app.use(express.json()) // Parses json, multi-part (file), url-encoded
app.use(express.urlencoded({extended:true, limit:'50mb'}));
// convert blank fields to null.
// trim string inputs
app.use((req, res, next) => {
    if (req.body) {
        const sanitizeInput = require('./helpers/sanitizeinput');
        sanitizeInput(req.body);
    };
    next();
});

//bind page route to the controllers
app.use('/api/home', require('./controllers/home.js'));
app.use('/api/components_data', require('./controllers/components_data.js'));
app.use('/api/fileuploader', require('./controllers/fileuploader.js'));
app.use('/api/s3uploader', require('./controllers/s3uploader.js'));
app.use('/api/customers', require('./controllers/customers.js'))
app.use('/api/employees', require('./controllers/employees.js'))
app.use('/api/offices', require('./controllers/offices.js'))
app.use('/api/orderdetails', require('./controllers/orderdetails.js'))
app.use('/api/orders', require('./controllers/orders.js'))
app.use('/api/payments', require('./controllers/payments.js'))
app.use('/api/productlines', require('./controllers/productlines.js'))
app.use('/api/products', require('./controllers/products.js'))
app.use('/api/user_seg', require('./controllers/user_seg.js'))
app.get('*', function(req, res){
    res.status(404).json("Page not found");
});

let port = process.env.PORT || 5000;
//start app
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port);
});