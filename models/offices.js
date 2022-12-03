
const BaseModel = require("./basemodel");
class Offices extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				officecode: { type: Sequelize.STRING, primaryKey: true  },
				city: {name: 'city', type:Sequelize.STRING},
				phone: {name: 'phone', type:Sequelize.STRING},
				addressline1: {name: 'addressLine1', type:Sequelize.STRING},
				addressline2: {name: 'addressLine2', type:Sequelize.STRING},
				state: {name: 'state', type:Sequelize.STRING},
				country: {name: 'country', type:Sequelize.STRING},
				postalcode: {name: 'postalCode', type:Sequelize.STRING},
				territory: {name: 'territory', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "offices",
				modelName: "offices",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('officeCode AS officecode'), 
			'city', 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'state', 
			'country', 
			sequelize.literal('postalCode AS postalcode'), 
			'territory'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('officeCode AS officecode'), 
			'city', 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'state', 
			'country', 
			sequelize.literal('postalCode AS postalcode'), 
			'territory'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('officeCode AS officecode'), 
			'city', 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'state', 
			'country', 
			sequelize.literal('postalCode AS postalcode'), 
			'territory'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('officeCode AS officecode'), 
			'city', 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'state', 
			'country', 
			sequelize.literal('postalCode AS postalcode'), 
			'territory'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('officeCode AS officecode'), 
			'city', 
			'phone', 
			sequelize.literal('addressLine1 AS addressline1'), 
			sequelize.literal('addressLine2 AS addressline2'), 
			'state', 
			'country', 
			sequelize.literal('postalCode AS postalcode'), 
			'territory'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("officeCode LIKE :search"), 
			sequelize.literal("city LIKE :search"), 
			sequelize.literal("phone LIKE :search"), 
			sequelize.literal("addressLine1 LIKE :search"), 
			sequelize.literal("addressLine2 LIKE :search"), 
			sequelize.literal("state LIKE :search"), 
			sequelize.literal("country LIKE :search"), 
			sequelize.literal("postalCode LIKE :search"), 
			sequelize.literal("territory LIKE :search"),
		];
	}

	
	
}
module.exports = Offices;
