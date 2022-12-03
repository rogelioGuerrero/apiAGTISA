
const BaseModel = require("./basemodel");
class Employees extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				employeenumber: { type: Sequelize.INTEGER, primaryKey: true  },
				lastname: {name: 'lastName', type:Sequelize.STRING},
				firstname: {name: 'firstName', type:Sequelize.STRING},
				extension: {name: 'extension', type:Sequelize.STRING},
				email: {name: 'email', type:Sequelize.STRING},
				officecode: {name: 'officeCode', type:Sequelize.STRING},
				reportsto: {name: 'reportsTo', type:Sequelize.INTEGER},
				jobtitle: {name: 'jobTitle', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "employees",
				modelName: "employees",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('employeeNumber AS employeenumber'), 
			sequelize.literal('lastName AS lastname'), 
			sequelize.literal('firstName AS firstname'), 
			'extension', 
			'email', 
			sequelize.literal('officeCode AS officecode'), 
			sequelize.literal('reportsTo AS reportsto'), 
			sequelize.literal('jobTitle AS jobtitle')
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('employeeNumber AS employeenumber'), 
			sequelize.literal('lastName AS lastname'), 
			sequelize.literal('firstName AS firstname'), 
			'extension', 
			'email', 
			sequelize.literal('officeCode AS officecode'), 
			sequelize.literal('reportsTo AS reportsto'), 
			sequelize.literal('jobTitle AS jobtitle')
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('employeeNumber AS employeenumber'), 
			sequelize.literal('lastName AS lastname'), 
			sequelize.literal('firstName AS firstname'), 
			'extension', 
			'email', 
			sequelize.literal('officeCode AS officecode'), 
			sequelize.literal('reportsTo AS reportsto'), 
			sequelize.literal('jobTitle AS jobtitle')
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('employeeNumber AS employeenumber'), 
			sequelize.literal('lastName AS lastname'), 
			sequelize.literal('firstName AS firstname'), 
			'extension', 
			'email', 
			sequelize.literal('officeCode AS officecode'), 
			sequelize.literal('reportsTo AS reportsto'), 
			sequelize.literal('jobTitle AS jobtitle')
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('employeeNumber AS employeenumber'), 
			sequelize.literal('lastName AS lastname'), 
			sequelize.literal('firstName AS firstname'), 
			'extension', 
			'email', 
			sequelize.literal('officeCode AS officecode'), 
			sequelize.literal('reportsTo AS reportsto'), 
			sequelize.literal('jobTitle AS jobtitle')
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("lastName LIKE :search"), 
			sequelize.literal("firstName LIKE :search"), 
			sequelize.literal("extension LIKE :search"), 
			sequelize.literal("email LIKE :search"), 
			sequelize.literal("officeCode LIKE :search"), 
			sequelize.literal("jobTitle LIKE :search"),
		];
	}

	
	
}
module.exports = Employees;
