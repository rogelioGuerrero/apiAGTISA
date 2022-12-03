
const BaseModel = require("./basemodel");
class Orderdetails extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				ordernumber: { type: Sequelize.INTEGER, primaryKey: true  },
				productcode: { type: Sequelize.STRING, primaryKey: true  },
				quantityordered: {name: 'quantityOrdered', type:Sequelize.INTEGER},
				priceeach: {name: 'priceEach', type:Sequelize.DECIMAL},
				orderlinenumber: {name: 'orderLineNumber', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "orderdetails",
				modelName: "orderdetails",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('quantityOrdered AS quantityordered'), 
			sequelize.literal('priceEach AS priceeach'), 
			sequelize.literal('orderLineNumber AS orderlinenumber')
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('quantityOrdered AS quantityordered'), 
			sequelize.literal('priceEach AS priceeach'), 
			sequelize.literal('orderLineNumber AS orderlinenumber')
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('quantityOrdered AS quantityordered'), 
			sequelize.literal('priceEach AS priceeach'), 
			sequelize.literal('orderLineNumber AS orderlinenumber')
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('quantityOrdered AS quantityordered'), 
			sequelize.literal('priceEach AS priceeach'), 
			sequelize.literal('orderLineNumber AS orderlinenumber')
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('quantityOrdered AS quantityordered'), 
			sequelize.literal('priceEach AS priceeach'), 
			sequelize.literal('orderLineNumber AS orderlinenumber')
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("productCode LIKE :search"),
		];
	}

	
	
}
module.exports = Orderdetails;
