
const BaseModel = require("./basemodel");
class User_Seg extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				usuario: {name: 'usuario', type:Sequelize.STRING},
				password: {name: 'password', type:Sequelize.STRING},
				email: {name: 'email', type:Sequelize.STRING},
				foto: {name: 'foto', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "user_seg",
				modelName: "user_seg",
			}
		);
	}
	
	static listFields() {
		let sequelize = this.sequelize;
		return [
			'id', 
			'usuario', 
			'email', 
			'foto'
		];
	}

	static exportListFields() {
		let sequelize = this.sequelize;
		return [
			'id', 
			'usuario', 
			'email', 
			'foto'
		];
	}

	static viewFields() {
		let sequelize = this.sequelize;
		return [
			'id', 
			'usuario', 
			'email', 
			'foto'
		];
	}

	static exportViewFields() {
		let sequelize = this.sequelize;
		return [
			'id', 
			'usuario', 
			'email', 
			'foto'
		];
	}

	static editFields() {
		let sequelize = this.sequelize;
		return [
			'id', 
			'usuario', 
			'email', 
			'foto'
		];
	}

	
	static searchFields(){
		let sequelize = this.sequelize;
		return [
			sequelize.literal("usuario LIKE :search"), 
			sequelize.literal("password LIKE :search"), 
			sequelize.literal("email LIKE :search"), 
			sequelize.literal("foto LIKE :search"),
		];
	}

	
	
}
module.exports = User_Seg;
