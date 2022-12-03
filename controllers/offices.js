/** Express router providing Offices related routes
 *
 * @module routers/Offices
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
const Offices = models.Offices;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const OfficesListExport = require('../exports/OfficesList')
const OfficesViewExport = require('../exports/OfficesView')


/**
 * Route to list offices records
 * @route {GET} /offices/index/{fieldname}/{fieldvalue}
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
			let searchFields = Offices.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Offices.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Offices.exportListFields(sequelize);
			let records = await Offices.findAll(query);
			return OfficesListExport.export(records, req, res)
		}
		query.attributes = Offices.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Offices.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Offices record
 * @route {GET} /offices/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['officeCode'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Offices.exportViewFields(sequelize);
			let records = await Offices.findAll(query);
			return OfficesViewExport.export(records, req, res)
		}
		query.attributes = Offices.viewFields();
		let record = await Offices.findOne(query);
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
 * Route to insert Offices record
 * @route {POST} /offices/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('officecode').not().isEmpty(),
		body('city').not().isEmpty(),
		body('phone').not().isEmpty(),
		body('addressline1').not().isEmpty(),
		body('addressline2').optional({nullable: true, checkFalsy: true}),
		body('state').optional({nullable: true, checkFalsy: true}),
		body('country').not().isEmpty(),
		body('postalcode').not().isEmpty(),
		body('territory').not().isEmpty(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
		//save Offices record
		let record = await Offices.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['officecode'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Offices record for edit
 * @route {GET} /offices/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['officeCode'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Offices.editFields();
		let record = await Offices.findOne(query);
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
 * Route to update  Offices record
 * @route {POST} /offices/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('officecode').optional({nullable: true}).not().isEmpty(),
		body('city').optional({nullable: true}).not().isEmpty(),
		body('phone').optional({nullable: true}).not().isEmpty(),
		body('addressline1').optional({nullable: true}).not().isEmpty(),
		body('addressline2').optional({nullable: true, checkFalsy: true}),
		body('state').optional({nullable: true, checkFalsy: true}),
		body('country').optional({nullable: true}).not().isEmpty(),
		body('postalcode').optional({nullable: true}).not().isEmpty(),
		body('territory').optional({nullable: true}).not().isEmpty(),
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
		where['officeCode'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Offices.editFields();
		let record = await Offices.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Offices.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Offices record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /offices/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['officeCode'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Offices.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Offices.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
