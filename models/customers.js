
const BaseModel = require("./basemodel");
class Customers extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				customernumber: { type: Sequelize.INTEGER, primaryKey: true  },
				customername: {name: 'customerName', type:Sequelize.STRING},
				contactlastname: {name: 'contactLastName', type:Sequelize.STRING},
				contactfirstname: {name: 'contactFirstName', type:Sequelize.STRING},
				phone: {name: 'phone', type:Sequelize.STRING},
				addressline1: {name: 'addressLine1', type:Sequelize.STRING},
				addressline2: {name: 'addressLine2', type:Sequelize.STRING},
				city: {name: 'city', type:Sequelize.STRING},
				state: {name: 'state', type:Sequelize.STRING},
				postalcode: {name: 'postalCode', type:Sequelize.STRING},
				country: {name: 'country', type:Sequelize.STRING},
				salesrepemployeenumber: {name: 'salesRepEmployeeNumber', type:Sequelize.INTEGER},
				creditlimit: {name: 'creditLimit', type:Sequelize.DECIMAL}
			}, 
			{ 
				sequelize,
				
				tableName: "customers",
				modelName: "customers",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('customerName AS customername'), 
			sequelize.literal('contactLastName AS contactlastname'), 
			sequelize.literal('contactFirstName AS contactfirstname'), 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'city', 
			'state', 
			sequelize.literal('postalCode AS postalcode'), 
			'country', 
			sequelize.literal('salesRepEmployeeNumber AS salesrepemployeenumber'), 
			sequelize.literal('creditLimit AS creditlimit')
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('customerName AS customername'), 
			sequelize.literal('contactLastName AS contactlastname'), 
			sequelize.literal('contactFirstName AS contactfirstname'), 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'city', 
			'state', 
			sequelize.literal('postalCode AS postalcode'), 
			'country', 
			sequelize.literal('salesRepEmployeeNumber AS salesrepemployeenumber'), 
			sequelize.literal('creditLimit AS creditlimit')
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('customerName AS customername'), 
			sequelize.literal('contactLastName AS contactlastname'), 
			sequelize.literal('contactFirstName AS contactfirstname'), 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'city', 
			'state', 
			sequelize.literal('postalCode AS postalcode'), 
			'country', 
			sequelize.literal('salesRepEmployeeNumber AS salesrepemployeenumber'), 
			sequelize.literal('creditLimit AS creditlimit')
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('customerName AS customername'), 
			sequelize.literal('contactLastName AS contactlastname'), 
			sequelize.literal('contactFirstName AS contactfirstname'), 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'city', 
			'state', 
			sequelize.literal('postalCode AS postalcode'), 
			'country', 
			sequelize.literal('salesRepEmployeeNumber AS salesrepemployeenumber'), 
			sequelize.literal('creditLimit AS creditlimit')
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('customerName AS customername'), 
			sequelize.literal('contactLastName AS contactlastname'), 
			sequelize.literal('contactFirstName AS contactfirstname'), 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'city', 
			'state', 
			sequelize.literal('postalCode AS postalcode'), 
			'country', 
			sequelize.literal('salesRepEmployeeNumber AS salesrepemployeenumber'), 
			sequelize.literal('creditLimit AS creditlimit')
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("customerName LIKE :search"), 
			sequelize.literal("contactLastName LIKE :search"), 
			sequelize.literal("contactFirstName LIKE :search"), 
			sequelize.literal("phone LIKE :search"), 
			sequelize.literal("addressLine1 LIKE :search"), 
			sequelize.literal("addressLine2 LIKE :search"), 
			sequelize.literal("city LIKE :search"), 
			sequelize.literal("state LIKE :search"), 
			sequelize.literal("postalCode LIKE :search"), 
			sequelize.literal("country LIKE :search"),
		];
	}

	
	
}
module.exports = Customers;
