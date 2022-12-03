/** Express router providing Payments related routes
 *
 * @module routers/Payments
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
const Payments = models.Payments;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const PaymentsListExport = require('../exports/PaymentsList')
const PaymentsViewExport = require('../exports/PaymentsView')


/**
 * Route to list payments records
 * @route {GET} /payments/index/{fieldname}/{fieldvalue}
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
			let searchFields = Payments.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Payments.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Payments.exportListFields(sequelize);
			let records = await Payments.findAll(query);
			return PaymentsListExport.export(records, req, res)
		}
		query.attributes = Payments.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Payments.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Payments record
 * @route {GET} /payments/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['checkNumber'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Payments.exportViewFields(sequelize);
			let records = await Payments.findAll(query);
			return PaymentsViewExport.export(records, req, res)
		}
		query.attributes = Payments.viewFields();
		let record = await Payments.findOne(query);
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
 * Route to insert Payments record
 * @route {POST} /payments/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('customernumber').not().isEmpty().isNumeric(),
		body('checknumber').not().isEmpty(),
		body('paymentdate').not().isEmpty(),
		body('amount').not().isEmpty().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Payments record
		let record = await Payments.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['checknumber'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Payments record for edit
 * @route {GET} /payments/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['checkNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Payments.editFields();
		let record = await Payments.findOne(query);
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
 * Route to update  Payments record
 * @route {POST} /payments/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('customernumber').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('checknumber').optional({nullable: true}).not().isEmpty(),
		body('paymentdate').optional({nullable: true}).not().isEmpty(),
		body('amount').optional({nullable: true}).not().isEmpty().isNumeric(),
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
		where['checkNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Payments.editFields();
		let record = await Payments.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Payments.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Payments record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /payments/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['checkNumber'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Payments.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Payments.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
