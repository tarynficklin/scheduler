//DEPENDENCIES
require('dotenv').config();
const express = require('express'),
			session = require('express-session'),
			bodyParser = require('body-parser'),
			massive = require('massive'),
			axios = require('axios'),
			controller = require('./controllers/controller')

//SERVER SETUP
const {SERVER_PORT, REACT_APP_DOMAIN, REACT_APP_CLIENT_ID, CLIENT_SECRET, CONNECTION_STRING} = process.env;
const app = express();
app.use(bodyParser.json());

//MIDDLEWARE
massive(CONNECTION_STRING).then(db => app.set('db', db));

//ENDPOINTS
const origin = '/api';
app.get    (`${origin}`,     controller.read  );
app.post   (`${origin}`,     controller.create);
app.put    (`${origin}/:id`, controller.update);
app.delete (`${origin}/:id`, controller.delete);

//RUN THE SERVER
app.listen(SERVER_PORT, () => console.log(`server started on port ${SERVER_PORT}`));