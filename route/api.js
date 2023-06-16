const express=require("express");
const router=express.Router();
const apiController=require("../controller/api")

router.get("/api/v1/longest-duration-movies",apiController.longestdurationmovies);
router.post("/api/v1/new-movie",apiController.postNewMovie);
router.post("/movies/increment-runtime", apiController.incrementRuntime);
router.get("/api/v1/top-rated-movies",apiController.topratedmovie)
router.get("/api/v1/genre-movies-with-subtotals",apiController.allmoviesgenrewise)

module.exports=router