const Sequelize= require("sequelize")
const sequelize=require("../util/database")

const Rating=sequelize.define("Rating",{
     
    averageRating:{
     type:Sequelize.FLOAT,
     allowNull:false
    }, 
    numVotes:{
  type:Sequelize.INTEGER,
  allowNull:false
    }
},
{
  timestamps: false // Disable timestamps
},
);

module.exports=Rating;
