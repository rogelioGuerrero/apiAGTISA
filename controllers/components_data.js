/** Express router providing related routes to page component data
 *
 * @module routers/components_data
 * @module config - app config
 * @module models- app model module
 * @requires express
 */
const express = require('express');
const router = express.Router();
const models = require('../models/index.js');


const sequelize = models.sequelize;
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


 /**
 * Route to get salesrepemployeenumber_option_list records
 * @route {GET} /components_data/salesrepemployeenumber_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/salesrepemployeenumber_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT employeeNumber as value, lastname as label FROM employees` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get officecode_option_list records
 * @route {GET} /components_data/officecode_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/officecode_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT officeCode as value, officeCode as label FROM offices` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get ordernumber_option_list records
 * @route {GET} /components_data/ordernumber_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/ordernumber_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT orderNumber as value, orderNumber as label FROM orders` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get productcode_option_list records
 * @route {GET} /components_data/productcode_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/productcode_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT productCode as value, productname as label FROM products` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get customernumber_option_list records
 * @route {GET} /components_data/customernumber_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/customernumber_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT customerNumber as value, customername as label FROM customers` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});


 /**
 * Route to get productline_option_list records
 * @route {GET} /components_data/productline_option_list
 * @param {string} path - Express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/productline_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT productLine as value, productLine as label FROM productlines` ;
		let records = await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		console.error(err)
		return res.serverError(err);
	}
});
module.exports = router;
