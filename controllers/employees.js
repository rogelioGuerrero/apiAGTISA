/** Express router providing Employees related routes
 *
 * @module routers/Employees
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
const Employees = models.Employees;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const EmployeesListExport = require('../exports/EmployeesList')
const EmployeesViewExport = require('../exports/EmployeesView')


/**
 * Route to list employees records
 * @route {GET} /employees/index/{fieldname}/{fieldvalue}
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
			let searchFields = Employees.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Employees.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Employees.exportListFields(sequelize);
			let records = await Employees.findAll(query);
			return EmployeesListExport.export(records, req, res)
		}
		query.attributes = Employees.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Employees.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Employees record
 * @route {GET} /employees/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['employeeNumber'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Employees.exportViewFields(sequelize);
			let records = await Employees.findAll(query);
			return EmployeesViewExport.export(records, req, res)
		}
		query.attributes = Employees.viewFields();
		let record = await Employees.findOne(query);
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
 * Route to insert Employees record
 * @route {POST} /employees/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('employeenumber').not().isEmpty().isNumeric(),
		body('lastname').not().isEmpty(),
		body('firstname').not().isEmpty(),
		body('extension').not().isEmpty(),
		body('email').not().isEmpty().isEmail(),
		body('officecode').not().isEmpty(),
		body('reportsto').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('jobtitle').not().isEmpty(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Employees record
		let record = await Employees.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['employeenumber'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Employees record for edit
 * @route {GET} /employees/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['employeeNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Employees.editFields();
		let record = await Employees.findOne(query);
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
 * Route to update  Employees record
 * @route {POST} /employees/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('employeenumber').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('lastname').optional({nullable: true}).not().isEmpty(),
		body('firstname').optional({nullable: true}).not().isEmpty(),
		body('extension').optional({nullable: true}).not().isEmpty(),
		body('email').optional({nullable: true}).not().isEmpty().isEmail(),
		body('officecode').optional({nullable: true}).not().isEmpty(),
		body('reportsto').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('jobtitle').optional({nullable: true}).not().isEmpty(),
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
		where['employeeNumber'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Employees.editFields();
		let record = await Employees.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Employees.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Employees record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /employees/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['employeeNumber'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Employees.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Employees.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
async function getNextRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'employeenumber';
	where[keyField] = { [Op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await Employees.findOne(query);
	return (record ? record.employeenumber : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'employeenumber';
	where[keyField] = { [Op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await Employees.findOne(query);
	return (record ? record.employeenumber : null);
}
module.exports = router;
