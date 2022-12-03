/** Express router providing Orders related routes
 *
 * @module routers/Orders
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
const Orders = models.Orders;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const OrdersListExport = require('../exports/OrdersList')
const OrdersViewExport = require('../exports/OrdersView')


/**
 * Route to list orders records
 * @route {GET} /orders/index/{fieldname}/{fieldvalue}
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
			let searchFields = Orders.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Orders.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Orders.exportListFields(sequelize);
			let records = await Orders.findAll(query);
			return OrdersListExport.export(records, req, res)
		}
		query.attributes = Orders.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Orders.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Orders record
 * @route {GET} /orders/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['orderNumber'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Orders.exportViewFields(sequelize);
			let records = await Orders.findAll(query);
			return OrdersViewExport.export(records, req, res)
		}
		query.attributes = Orders.viewFields();
		let record = await Orders.findOne(query);
		if(!record){
			return res.notFound();
		}
			record.nextRecordId = await getNextRecordId(recid);
			record.previousRecordId = await getPreviousRecordId(recid);
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert Orders record
 * @route {POST} /orders/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('ordernumber').not().isEmpty().isNumeric(),
		body('orderdate').not().isEmpty(),
		body('requireddate').not().isEmpty(),
		body('shippeddate').optional({nullable: true, checkFalsy: true}),
		body('status').not().isEmpty(),
		body('comments').optional({nullable: true, checkFalsy: true}),
		body('customernumber').not().isEmpty().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Orders record
		let record = await Orders.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['ordernumber'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Orders record for edit
 * @route {GET} /orders/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['orderNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Orders.editFields();
		let record = await Orders.findOne(query);
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
 * Route to update  Orders record
 * @route {POST} /orders/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('ordernumber').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('orderdate').optional({nullable: true}).not().isEmpty(),
		body('requireddate').optional({nullable: true}).not().isEmpty(),
		body('shippeddate').optional({nullable: true, checkFalsy: true}),
		body('status').optional({nullable: true}).not().isEmpty(),
		body('comments').optional({nullable: true, checkFalsy: true}),
		body('customernumber').optional({nullable: true}).not().isEmpty().isNumeric(),
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
		where['orderNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Orders.editFields();
		let record = await Orders.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Orders.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Orders record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /orders/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['orderNumber'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Orders.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Orders.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
async function getNextRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'ordernumber';
	where[keyField] = { [Op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await Orders.findOne(query);
	return (record ? record.ordernumber : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'ordernumber';
	where[keyField] = { [Op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await Orders.findOne(query);
	return (record ? record.ordernumber : null);
}
module.exports = router;
