
const BaseModel = require("./basemodel");
class Productlines extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				productline: { type: Sequelize.STRING, primaryKey: true  },
				textdescription: {name: 'textDescription', type:Sequelize.STRING},
				htmldescription: {name: 'htmlDescription', type:Sequelize.STRING},
				image: {name: 'image', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "productlines",
				modelName: "productlines",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('textDescription AS textdescription'), 
			sequelize.literal('htmlDescription AS htmldescription'), 
			'image'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('textDescription AS textdescription'), 
			sequelize.literal('htmlDescription AS htmldescription'), 
			'image'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('textDescription AS textdescription'), 
			sequelize.literal('htmlDescription AS htmldescription'), 
			'image'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('textDescription AS textdescription'), 
			sequelize.literal('htmlDescription AS htmldescription'), 
			'image'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			sequelize.literal('productLine AS productline'), 
			sequelize.literal('textDescription AS textdescription'), 
			sequelize.literal('htmlDescription AS htmldescription'), 
			'image'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("productLine LIKE :search"), 
			sequelize.literal("textDescription LIKE :search"), 
			sequelize.literal("htmlDescription LIKE :search"),
		];
	}

	
	
}
module.exports = Productlines;
