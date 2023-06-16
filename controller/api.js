const Sequelize=require("sequelize")
const sequelize=require("../util/database")
const { Op } = require('sequelize');
const Movie=require("../model/movies")
const Rating=require("../model/ratings")

exports.longestdurationmovies=async(req,res)=>{
    try{
      /*
      select tconst, primaryTitle, runtimeMinutes, genres from onitotech.movies
      order by runtimeMinutes desc
      limit 10;
      */
     const movies=await Movie.findAll({
        attributes:['tconst', 'primaryTitle', 'runtimeMinutes', 'genres'],
        order:[['runtimeMinutes','DESC']],
        limit:10
     });
     res.status(200).json({data:movies})
    }
    catch(err){
     console.log(err)
     res.status(500).json({msg:"internal error"})
    }
}


exports.postNewMovie = async (req, res) => {
  try {
    /*  INSERT INTO onitotech.movies (tconst,titleType, primaryTitle, runtimeMinutes, genres)
       VALUES ('tt0000001',' movie' ,'Carmencita', 1987, 'Documentary');
    */

    const moviesData = Array.isArray(req.body) ? req.body : [req.body];

    const existingMovies = await Movie.findAll({
      where: {
        [Op.or]: moviesData.map((movie) => ({
          [Op.and]: [
            { titleType: movie.titleType },
            { primaryTitle: movie.primaryTitle },
            { runtimeMinutes: movie.runtimeMinutes },
            { genres: movie.genres },
          ],
        })),
      },
    });

    if (existingMovies.length > 0) {
      const existingTitles = existingMovies.map((movie) => movie.primaryTitle);
      return res.status(205).json({
        msg: `The following movies already exist in the database: ${existingTitles.join(', ')}`,
      });
    }

    const existingPrimaryKeys = await Movie.findAll({
      where: {
        tconst: moviesData.map((movie) => movie.tconst),
      },
    });

    if (existingPrimaryKeys.length > 0) {
      const existingTconsts = existingPrimaryKeys.map((movie) => movie.tconst);
      return res.status(204).json({
        msg: `Movies exist in the database with the following tconsts: ${existingTconsts.join(', ')}. Please try with different tconsts`,
      });
    }

    const createdMovies = await Movie.bulkCreate(moviesData);

    return res.status(200).json({ newMovies: createdMovies });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Internal error' });
  }
};


exports.incrementRuntime = async (req, res) => {
  try {
    /*
    UPDATE Movies
    SET runtimeMinutes = CASE
    WHEN genres = 'Documentary' THEN runtimeMinutes + 15
    WHEN genres = 'Animation' THEN runtimeMinutes + 30
    ELSE runtimeMinutes + 45
    END;
    */

     await Movie.update(
      {
        runtimeMinutes: Sequelize.literal(
          'CASE ' +
            'WHEN genres = "Documentary" THEN runtimeMinutes + 15 ' +
            'WHEN genres = "Animation" THEN runtimeMinutes + 30 ' +
            'ELSE runtimeMinutes + 45 ' +
            'END'
        ),
      },
      { where: {} }
      );

    res.status(200).json({ msg: 'Runtime increment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};


exports.topratedmovie=async(req,res)=>{
try {
  /*
  SELECT movie.tconst, movie.primaryTitle, movie.genres, rating.averageRating
FROM movie
JOIN rating ON movie.tconst = rating.tconst
WHERE rating.averageRating > 6.0
ORDER BY rating.averageRating;

  */
  const movies = await Movie.findAll({
    include: [
      {
        model: Rating,
        where: {
          averageRating: {
            [Sequelize.Op.gt]: 6.0
          }
        },
        attributes: ['averageRating']
      }
    ],
    order: [[{ model: Rating }, 'averageRating', 'ASC']],
    attributes: ['tconst', 'primaryTitle', 'genres'],
    raw: true
  });

  res.status(200).json(movies);
} catch (err) {
  console.log(err);
  res.status(500).json({ msg: 'Internal error' });
}
}

exports.allmoviesgenrewise = async (req, res) => {
  try {
    const data = await sequelize.query(`
    SELECT subquery.genres, subquery.primaryTitle, subquery.numVotes
    FROM (
      SELECT m.genres, m.primaryTitle, r.numVotes, 0 AS isTotal
      FROM onitotech.movies AS m
      JOIN onitotech.ratings AS r ON m.tconst = r.tconst
      UNION ALL
      SELECT m.genres, 'TOTAL', SUM(r.numVotes), 1 AS isTotal
      FROM onitotech.movies AS m
      JOIN onitotech.ratings AS r ON m.tconst = r.tconst
      GROUP BY m.genres
    ) AS subquery
    ORDER BY subquery.genres, subquery.isTotal

    `, { type: Sequelize.QueryTypes.SELECT });


    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal error" });
  }
};




