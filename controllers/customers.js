/** Express router providing Customers related routes
 *
 * @module routers/Customers
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
const Customers = models.Customers;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const CustomersListExport = require('../exports/CustomersList')
const CustomersViewExport = require('../exports/CustomersView')


/**
 * Route to list customers records
 * @route {GET} /customers/index/{fieldname}/{fieldvalue}
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
			let searchFields = Customers.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Customers.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Customers.exportListFields(sequelize);
			let records = await Customers.findAll(query);
			return CustomersListExport.export(records, req, res)
		}
		query.attributes = Customers.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Customers.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Customers record
 * @route {GET} /customers/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['customerNumber'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Customers.exportViewFields(sequelize);
			let records = await Customers.findAll(query);
			return CustomersViewExport.export(records, req, res)
		}
		query.attributes = Customers.viewFields();
		let record = await Customers.findOne(query);
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
 * Route to insert Customers record
 * @route {POST} /customers/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('customernumber').not().isEmpty().isNumeric(),
		body('customername').not().isEmpty(),
		body('contactlastname').not().isEmpty(),
		body('contactfirstname').not().isEmpty(),
		body('phone').not().isEmpty(),
		body('addressline1').not().isEmpty(),
		body('addressline2').optional({nullable: true, checkFalsy: true}),
		body('city').not().isEmpty(),
		body('state').optional({nullable: true, checkFalsy: true}),
		body('postalcode').optional({nullable: true, checkFalsy: true}),
		body('country').not().isEmpty(),
		body('salesrepemployeenumber').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('creditlimit').optional({nullable: true, checkFalsy: true}).isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Customers record
		let record = await Customers.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['customernumber'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Customers record for edit
 * @route {GET} /customers/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['customerNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Customers.editFields();
		let record = await Customers.findOne(query);
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
 * Route to update  Customers record
 * @route {POST} /customers/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('customernumber').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('customername').optional({nullable: true}).not().isEmpty(),
		body('contactlastname').optional({nullable: true}).not().isEmpty(),
		body('contactfirstname').optional({nullable: true}).not().isEmpty(),
		body('phone').optional({nullable: true}).not().isEmpty(),
		body('addressline1').optional({nullable: true}).not().isEmpty(),
		body('addressline2').optional({nullable: true, checkFalsy: true}),
		body('city').optional({nullable: true}).not().isEmpty(),
		body('state').optional({nullable: true, checkFalsy: true}),
		body('postalcode').optional({nullable: true, checkFalsy: true}),
		body('country').optional({nullable: true}).not().isEmpty(),
		body('salesrepemployeenumber').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('creditlimit').optional({nullable: true, checkFalsy: true}).isNumeric(),
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
		where['customerNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Customers.editFields();
		let record = await Customers.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Customers.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Customers record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /customers/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['customerNumber'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Customers.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Customers.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
async function getNextRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'customernumber';
	where[keyField] = { [Op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await Customers.findOne(query);
	return (record ? record.customernumber : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'customernumber';
	where[keyField] = { [Op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await Customers.findOne(query);
	return (record ? record.customernumber : null);
}
module.exports = router;
