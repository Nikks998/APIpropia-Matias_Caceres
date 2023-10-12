const db = require("../database/models");

const getAllMovies = async (limit, offset) => {
    try {
        const movies = await db.Movie.findAll({
            limit,
            offset,
            attributes: {
                exclude: ['created_at', 'updated_at', 'genre_id']
            },
            include: [{
                association: 'genre',
                attributes: ['id', 'name']
            },
            {
                association: 'actors',
                attributes: ['id', 'first_name', 'last_name'],
                through: {
                    attributes: []
                }
            }]
        })
        const count = await db.Movie.count();
        return {
            movies,
            count
        };
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || 'error'
        }
    }
}

const getMovieById = async (id) => {
    try {

        if (!id) {
            throw {
                status: 400,
                message: 'ID no encontrado'
            }
        }

        const movies = await db.Movie.findByPk(id, {
            attributes: {
                exclude: ['created_at', 'updated_at', 'genre_id']
            },
            include: [{
                association: 'genre',
                attributes: ['id', 'name']
            },
            {
                association: 'actors',
                attributes: ['id', 'first_name', 'last_name'],
                through: {
                    attributes: []
                }
            }]
        })

        if (!movies) {
            throw {
                status: 404,
                message: 'No hay una pelicula con ese ID'
            }
        }

        return movies;
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || 'error en el servicio'
        }
    }
}

const storeMovie = async (dataMovie, actors) => {
    try {
        const newMovie = await db.Movie.create(dataMovie)
        if (actors) {
            const actorsDB = actors.map(actor => {
                return {
                    movie_id: newMovie.id,
                    actor_id: actor
                }
            })
            await db.Actor_Movie.bulkCreate(actorsDB, {
                validate: true
            })
        }

        return await getMovieById(newMovie.id)
        
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || 'error en el servicio'
        }
    }
}

module.exports = {
    getAllMovies,
    getMovieById,
    storeMovie
}