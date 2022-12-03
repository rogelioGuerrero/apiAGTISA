/** Express router providing Products related routes
 *
 * @module routers/Products
 * @module config - app config
 * @module utils - app utils functions
 * @module express-validator - form validation module
 * @module models- app model module
 * @requires express
 */
const express = require('express');
const router = express.Router();
const utils = require('../helpers/utils');
const { body, validationResult } = require('express-validator');
const models = require('../models/index.js');
const Products = models.Products;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const ProductsListExport = require('../exports/ProductsList')
const ProductsViewExport = require('../exports/ProductsView')


/**
 * Route to list products records
 * @route {GET} /products/index/{fieldname}/{fieldvalue}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		let query = {};  // sequelize query object
		let where = {};  // sequelize where conditions
		let replacements = {};  // sequelize query params
		let fieldname = req.params.fieldname;
		let fieldvalue = req.params.fieldvalue;
		
		if (fieldname){
			where[Op.and] = [
				sequelize.literal(`(${fieldname} = :fieldvalue)`)
			];
			replacements.fieldvalue = fieldvalue;
		}
		let search = req.query.search;
		if(search){
			let searchFields = Products.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Products.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Products.exportListFields(sequelize);
			let records = await Products.findAll(query);
			return ProductsListExport.export(records, req, res)
		}
		query.attributes = Products.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Products.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Products record
 * @route {GET} /products/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['productCode'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Products.exportViewFields(sequelize);
			let records = await Products.findAll(query);
			return ProductsViewExport.export(records, req, res)
		}
		query.attributes = Products.viewFields();
		let record = await Products.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert Products record
 * @route {POST} /products/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('productcode').not().isEmpty(),
		body('productname').not().isEmpty(),
		body('productline').not().isEmpty(),
		body('productscale').not().isEmpty(),
		body('productvendor').not().isEmpty(),
		body('productdescription').not().isEmpty(),
		body('quantityinstock').not().isEmpty().isNumeric(),
		body('buyprice').not().isEmpty().isNumeric(),
		body('msrp').not().isEmpty().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Products record
		let record = await Products.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['productcode'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Products record for edit
 * @route {GET} /products/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['productCode'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Products.editFields();
		let record = await Products.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  Products record
 * @route {POST} /products/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('productcode').optional({nullable: true}).not().isEmpty(),
		body('productname').optional({nullable: true}).not().isEmpty(),
		body('productline').optional({nullable: true}).not().isEmpty(),
		body('productscale').optional({nullable: true}).not().isEmpty(),
		body('productvendor').optional({nullable: true}).not().isEmpty(),
		body('productdescription').optional({nullable: true}).not().isEmpty(),
		body('quantityinstock').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('buyprice').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('msrp').optional({nullable: true}).not().isEmpty().isNumeric(),
	]
, async (req, res) => {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let recid = req.params.recid;
		let modeldata = req.body;
		let query = {};
		let where = {};
		where['productCode'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Products.editFields();
		let record = await Products.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Products.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Products record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /products/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['productCode'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Products.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Products.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
