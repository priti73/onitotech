const express= require("express")
const sequelize=require("./util/database")
const bodyparser=require("body-parser")
const Movie=require("./model/movies")
const Rating=require("./model/ratings")
const cors=require("cors")
const app= express();
app.use(cors());
app.use(bodyparser.json({ extended:false}));

const apiRoutes=require("./route/api")
app.use(apiRoutes)

Movie.hasOne(Rating, { foreignKey: 'tconst' });


sequelize
.sync()
//.sync({force:true})
.then((res)=>{
    app.listen(3000)
}
).catch((err)=>{
   console.log(err)
})

