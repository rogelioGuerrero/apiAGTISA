/** Express router providing Orderdetails related routes
 *
 * @module routers/Orderdetails
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
const Orderdetails = models.Orderdetails;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const OrderdetailsListExport = require('../exports/OrderdetailsList')
const OrderdetailsViewExport = require('../exports/OrderdetailsView')


/**
 * Route to list orderdetails records
 * @route {GET} /orderdetails/index/{fieldname}/{fieldvalue}
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
			let searchFields = Orderdetails.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Orderdetails.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Orderdetails.exportListFields(sequelize);
			let records = await Orderdetails.findAll(query);
			return OrderdetailsListExport.export(records, req, res)
		}
		query.attributes = Orderdetails.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Orderdetails.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Orderdetails record
 * @route {GET} /orderdetails/view/{recid}
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
			query.attributes = Orderdetails.exportViewFields(sequelize);
			let records = await Orderdetails.findAll(query);
			return OrderdetailsViewExport.export(records, req, res)
		}
		query.attributes = Orderdetails.viewFields();
		let record = await Orderdetails.findOne(query);
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
 * Route to insert Orderdetails record
 * @route {POST} /orderdetails/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('ordernumber').not().isEmpty().isNumeric(),
		body('productcode').not().isEmpty(),
		body('quantityordered').not().isEmpty().isNumeric(),
		body('priceeach').not().isEmpty().isNumeric(),
		body('orderlinenumber').not().isEmpty().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Orderdetails record
		let record = await Orderdetails.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['productcode'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Orderdetails record for edit
 * @route {GET} /orderdetails/edit/{recid}
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
		query.attributes = Orderdetails.editFields();
		let record = await Orderdetails.findOne(query);
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
 * Route to update  Orderdetails record
 * @route {POST} /orderdetails/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('ordernumber').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('productcode').optional({nullable: true}).not().isEmpty(),
		body('quantityordered').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('priceeach').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('orderlinenumber').optional({nullable: true}).not().isEmpty().isNumeric(),
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
		query.attributes = Orderdetails.editFields();
		let record = await Orderdetails.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Orderdetails.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Orderdetails record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /orderdetails/delete/{recid}
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
		let records = await Orderdetails.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Orderdetails.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
