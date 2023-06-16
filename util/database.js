require("dotenv").config();
const { config } = require("dotenv");
const Sequelize=require("sequelize");

const sequelize=new Sequelize(process.env.dbname,process.env.dbuser,process.env.dbpassword,
{
    dialect: 'mysql',
    host: process.env.host,
    logging: false
    

}
)
module.exports=sequelize


