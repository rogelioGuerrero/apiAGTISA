
const excel = require("exceljs");
const utils = require("../helpers/utils");
const ejs = require('ejs');
const pdf = require('html-pdf');
const config = require('../config.js');
module.exports =  {
	async export(records, req, res) {
		try{
			let format = req.query.export.toLowerCase();
			let columns =  [
				{header: "Customernumber", key: "customernumber"},
				{header: "Customername", key: "customername"},
				{header: "Contactlastname", key: "contactlastname"},
				{header: "Contactfirstname", key: "contactfirstname"},
				{header: "Phone", key: "phone"},
				{header: "Addressline1", key: "addressline1"},
				{header: "Addressline2", key: "addressline2"},
				{header: "City", key: "city"},
				{header: "State", key: "state"},
				{header: "Postalcode", key: "postalcode"},
				{header: "Country", key: "country"},
				{header: "Salesrepemployeenumber", key: "salesrepemployeenumber"},
				{header: "Creditlimit", key: "creditlimit"}
			]
			let filename = utils.dateNow() + "customersview-report";
			if(format == "excel"){
				let workbook = new excel.Workbook();
				let worksheet = workbook.addWorksheet("");
				worksheet.columns = columns;
				worksheet.addRows(records);
				res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
				return workbook.xlsx.write(res).then(function () {
					res.status(200).end();
				})
			}
			else if(format == "csv"){
				let workbook = new excel.Workbook();
				let worksheet = workbook.addWorksheet("");
				worksheet.columns = columns;
				worksheet.addRows(records);
				res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
				return workbook.csv.write(res).then(function () {
					res.status(200).end();
				})
			}
			else if(format == "pdf"){
				let page = "customersview.ejs";
				let record = records[0];
				let html = await ejs.renderFile("views/layouts/report.ejs", {record, page, config});
				pdf.create(html).toStream((err, pdfStream) => {
					if(err){
						return res.serverError("Error creating pdf")
					}
					else{
						res.statusCode = 200
						pdfStream.on('end', () => {
							return res.end()
						})
						pdfStream.pipe(res);
					}
				});
			}
			else if(format == "print"){
				let page = "customersview.ejs";
				let record = records[0];
				let html = await ejs.renderFile("views/layouts/report.ejs", {record, page, config});
				return res.ok(html);
			}
		}
		catch(err){
			console.error(err)
			return res.serverError(err);
		}
	}
}
