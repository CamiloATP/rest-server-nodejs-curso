require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
// Instalar paquete para recibir datos vía POST
// > npm i body-parser --save

// Routes usuario
app.use(require('./routes/usuario'));

// Configuraciones de Mongoose
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true, 
	useFindAndModify: false
}

const callback = (err, res) => {
	if(err) throw err;

	console.log('> Base de datos cargada...');
}

// mongoose.connect(process.env.URLDB, options, callback);
mongoose.connect(process.env.URLDB, options, callback);

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}`));

// > npm install mongoose --save

// nodemon server/server