const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const Movie=sequelize.define("Movie",{
    tconst:{
     type:Sequelize.STRING,
     primaryKey:true,
     allowNull: false
    },
    titleType:{
     type:Sequelize.STRING,
     allowNull: false
    },
    primaryTitle:{
    type:Sequelize.STRING,
    allowNull: false
    },
    runtimeMinutes:{
    type:Sequelize.INTEGER,
    allowNull: false
    },
    genres:{
    type:Sequelize.STRING,
    allowNull: false
    }
},
    {
        timestamps: false // Disable timestamps
    },

);
module.exports=Movie;