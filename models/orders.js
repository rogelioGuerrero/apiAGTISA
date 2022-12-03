
const BaseModel = require("./basemodel");
class Orders extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				ordernumber: { type: Sequelize.INTEGER, primaryKey: true  },
				orderdate: {name: 'orderDate', type:Sequelize.DATEONLY},
				requireddate: {name: 'requiredDate', type:Sequelize.DATEONLY},
				shippeddate: {name: 'shippedDate', type:Sequelize.DATEONLY},
				status: {name: 'status', type:Sequelize.STRING},
				comments: {name: 'comments', type:Sequelize.STRING},
				customernumber: {name: 'customerNumber', type:Sequelize.INTEGER}
			}, 
			{ 
				sequelize,
				
				tableName: "orders",
				modelName: "orders",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('orderDate AS orderdate'), 
			sequelize.literal('requiredDate AS requireddate'), 
			sequelize.literal('shippedDate AS shippeddate'), 
			'status', 
			'comments', 
			sequelize.literal('customerNumber AS customernumber')
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('orderDate AS orderdate'), 
			sequelize.literal('requiredDate AS requireddate'), 
			sequelize.literal('shippedDate AS shippeddate'), 
			'status', 
			'comments', 
			sequelize.literal('customerNumber AS customernumber')
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('orderDate AS orderdate'), 
			sequelize.literal('requiredDate AS requireddate'), 
			sequelize.literal('shippedDate AS shippeddate'), 
			'status', 
			'comments', 
			sequelize.literal('customerNumber AS customernumber')
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('orderDate AS orderdate'), 
			sequelize.literal('requiredDate AS requireddate'), 
			sequelize.literal('shippedDate AS shippeddate'), 
			'status', 
			'comments', 
			sequelize.literal('customerNumber AS customernumber')
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('orderNumber AS ordernumber'), 
			sequelize.literal('orderDate AS orderdate'), 
			sequelize.literal('requiredDate AS requireddate'), 
			sequelize.literal('shippedDate AS shippeddate'), 
			'status', 
			'comments', 
			sequelize.literal('customerNumber AS customernumber')
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("status LIKE :search"), 
			sequelize.literal("comments LIKE :search"),
		];
	}

	
	
}
module.exports = Orders;
