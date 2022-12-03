/** Express router providing Productlines related routes
 *
 * @module routers/Productlines
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
const Productlines = models.Productlines;


const sequelize = models.sequelize; // sequelize functions and operations
const Op = models.Op; // sequelize query operators
const filterByRaw = models.filterByRaw; // sequelize where condtion
const dbRaw = sequelize.literal; // sequelize raw query expression


const ProductlinesListExport = require('../exports/ProductlinesList')
const ProductlinesViewExport = require('../exports/ProductlinesView')


/**
 * Route to list productlines records
 * @route {GET} /productlines/index/{fieldname}/{fieldvalue}
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
			let searchFields = Productlines.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Productlines.getOrderBy(req, 'desc');
		if(req.query.export){
			query.attributes = Productlines.exportListFields(sequelize);
			let records = await Productlines.findAll(query);
			return ProductlinesListExport.export(records, req, res)
		}
		query.attributes = Productlines.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 20;
		let result = await Productlines.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Productlines record
 * @route {GET} /productlines/view/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		let recid = req.params.recid || null;
		let query = {}
		let where = {}
		where['productLine'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = Productlines.exportViewFields(sequelize);
			let records = await Productlines.findAll(query);
			return ProductlinesViewExport.export(records, req, res)
		}
		query.attributes = Productlines.viewFields();
		let record = await Productlines.findOne(query);
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
 * Route to insert Productlines record
 * @route {POST} /productlines/add
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/add/' , 
	[
		body('productline').not().isEmpty(),
		body('textdescription').optional({nullable: true, checkFalsy: true}),
		body('htmldescription').optional({nullable: true, checkFalsy: true}),
		body('image').optional({nullable: true, checkFalsy: true}),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = req.body;
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.image !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.image, "image");
			modeldata.image = fileInfo.filepath;
		}
		
		//save Productlines record
		let record = await Productlines.create(modeldata);
		//await record.reload(); //reload the record from database
		let recid =  record['productline'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Productlines record for edit
 * @route {GET} /productlines/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		let recid = req.params.recid;
		let query = {};
		let where = {};
		where['productLine'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Productlines.editFields();
		let record = await Productlines.findOne(query);
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
 * Route to update  Productlines record
 * @route {POST} /productlines/edit/{recid}
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/edit/:recid' , 
	[
		body('productline').optional({nullable: true}).not().isEmpty(),
		body('textdescription').optional({nullable: true, checkFalsy: true}),
		body('htmldescription').optional({nullable: true, checkFalsy: true}),
		body('image').optional({nullable: true, checkFalsy: true}),
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
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.image !== undefined) {
			let fileInfo = utils.moveUploadedFiles(modeldata.image, "image");
			modeldata.image = fileInfo.filepath;
		}
		let query = {};
		let where = {};
		where['productLine'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Productlines.editFields();
		let record = await Productlines.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Productlines.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Productlines record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /productlines/delete/{recid}
 * @param {array} path - Array of express paths
 * @param {callback} middleware - Express middleware.
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		let recid = req.params.recid || '';
		recid = recid.split(',');
		let query = {};
		let where = {};
		where['productLine'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Productlines.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Productlines.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
