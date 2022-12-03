
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
				{header: "Ordernumber", key: "ordernumber"},
				{header: "Productcode", key: "productcode"},
				{header: "Quantityordered", key: "quantityordered"},
				{header: "Priceeach", key: "priceeach"},
				{header: "Orderlinenumber", key: "orderlinenumber"}
			]
			let filename = "orderdetailslist-report";
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
				let page = "orderdetailslist.ejs";
				let html = await ejs.renderFile("views/layouts/report.ejs", {records, page, config});
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
				let page = "orderdetailslist.ejs";
				let html = await ejs.renderFile("views/layouts/report.ejs", {records, page, config});
				return res.ok(html);
			}
		}
		catch(err){
			console.error(err)
			return res.serverError(err);
		}
	}
}
