
const Sequelize = require('sequelize');
const dbConfig    = require('../config.js').database;

const sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
		dialect: dbConfig.type,
		host: dbConfig.host,
		
		pool: {
			max: 15,
			min: 5,
			idle: 20000,
			evict: 15000,
			acquire: 30000
		},
		define: {
			timestamps: false,
			freezeTableName: true
		},
		operatorsAliases: 0
	}
);


// Override timezone formatting
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
	return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss');
};

const Customers =  require("./customers").init(sequelize, Sequelize);
const Employees =  require("./employees").init(sequelize, Sequelize);
const Offices =  require("./offices").init(sequelize, Sequelize);
const Orderdetails =  require("./orderdetails").init(sequelize, Sequelize);
const Orders =  require("./orders").init(sequelize, Sequelize);
const Payments =  require("./payments").init(sequelize, Sequelize);
const Productlines =  require("./productlines").init(sequelize, Sequelize);
const Products =  require("./products").init(sequelize, Sequelize);
const User_Seg =  require("./user_seg").init(sequelize, Sequelize);

const Op = Sequelize.Op;

const filterByRaw = function(expression, value){
	return sequelize.where(sequelize.literal(expression), value);
}

module.exports = {
	sequelize,
	Op,
	filterByRaw,
	Customers,
	Employees,
	Offices,
	Orderdetails,
	Orders,
	Payments,
	Productlines,
	Products,
	User_Seg
}
