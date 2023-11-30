const express = require('express');
const path = require('path');
const app = express();
const paginate = require('express-paginate')
const cors = require('cors')

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors())

app.use(paginate.middleware(8,50))

// Aqui pueden colocar las rutas de APIs
app.use('/api/v1/movies', require('./routes/v1/movies.routes'))
app.use('/api/v1/genres', require('./routes/v1/genres.routes'))

//Activando el servidor desde express
app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
