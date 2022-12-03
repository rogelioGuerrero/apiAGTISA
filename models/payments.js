
const BaseModel = require("./basemodel");
class Payments extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				customernumber: { type: Sequelize.INTEGER, primaryKey: true  },
				checknumber: { type: Sequelize.STRING, primaryKey: true  },
				paymentdate: {name: 'paymentDate', type:Sequelize.DATEONLY},
				amount: {name: 'amount', type:Sequelize.DECIMAL}
			}, 
			{ 
				sequelize,
				
				tableName: "payments",
				modelName: "payments",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('checkNumber AS checknumber'), 
			sequelize.literal('paymentDate AS paymentdate'), 
			'amount'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('checkNumber AS checknumber'), 
			sequelize.literal('paymentDate AS paymentdate'), 
			'amount'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('checkNumber AS checknumber'), 
			sequelize.literal('paymentDate AS paymentdate'), 
			'amount'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('checkNumber AS checknumber'), 
			sequelize.literal('paymentDate AS paymentdate'), 
			'amount'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('customerNumber AS customernumber'), 
			sequelize.literal('checkNumber AS checknumber'), 
			sequelize.literal('paymentDate AS paymentdate'), 
			'amount'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("checkNumber LIKE :search"),
		];
	}

	
	
}
module.exports = Payments;
