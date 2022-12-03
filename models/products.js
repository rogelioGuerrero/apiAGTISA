
const BaseModel = require("./basemodel");
class Products extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				productcode: { type: Sequelize.STRING, primaryKey: true  },
				productname: {name: 'productName', type:Sequelize.STRING},
				productline: {name: 'productLine', type:Sequelize.STRING},
				productscale: {name: 'productScale', type:Sequelize.STRING},
				productvendor: {name: 'productVendor', type:Sequelize.STRING},
				productdescription: {name: 'productDescription', type:Sequelize.STRING},
				quantityinstock: {name: 'quantityInStock', type:Sequelize.STRING},
				buyprice: {name: 'buyPrice', type:Sequelize.DECIMAL},
				msrp: {name: 'MSRP', type:Sequelize.DECIMAL}
			}, 
			{ 
				sequelize,
				
				tableName: "products",
				modelName: "products",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('productName AS productname'), 
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('productScale AS productscale'), 
			sequelize.literal('productVendor AS productvendor'), 
			sequelize.literal('productDescription AS productdescription'), 
			sequelize.literal('quantityInStock AS quantityinstock'), 
			sequelize.literal('buyPrice AS buyprice'), 
			sequelize.literal('MSRP AS msrp')
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('productName AS productname'), 
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('productScale AS productscale'), 
			sequelize.literal('productVendor AS productvendor'), 
			sequelize.literal('productDescription AS productdescription'), 
			sequelize.literal('quantityInStock AS quantityinstock'), 
			sequelize.literal('buyPrice AS buyprice'), 
			sequelize.literal('MSRP AS msrp')
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('productName AS productname'), 
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('productScale AS productscale'), 
			sequelize.literal('productVendor AS productvendor'), 
			sequelize.literal('productDescription AS productdescription'), 
			sequelize.literal('quantityInStock AS quantityinstock'), 
			sequelize.literal('buyPrice AS buyprice'), 
			sequelize.literal('MSRP AS msrp')
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('productName AS productname'), 
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('productScale AS productscale'), 
			sequelize.literal('productVendor AS productvendor'), 
			sequelize.literal('productDescription AS productdescription'), 
			sequelize.literal('quantityInStock AS quantityinstock'), 
			sequelize.literal('buyPrice AS buyprice'), 
			sequelize.literal('MSRP AS msrp')
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productCode AS productcode'), 
			sequelize.literal('productName AS productname'), 
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('productScale AS productscale'), 
			sequelize.literal('productVendor AS productvendor'), 
			sequelize.literal('productDescription AS productdescription'), 
			sequelize.literal('quantityInStock AS quantityinstock'), 
			sequelize.literal('buyPrice AS buyprice'), 
			sequelize.literal('MSRP AS msrp')
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("productCode LIKE :search"), 
			sequelize.literal("productName LIKE :search"), 
			sequelize.literal("productLine LIKE :search"), 
			sequelize.literal("productScale LIKE :search"), 
			sequelize.literal("productVendor LIKE :search"), 
			sequelize.literal("productDescription LIKE :search"),
		];
	}

	
	
}
module.exports = Products;
