//DEPENDENCIES
require('dotenv').config();
const express = require('express'),
			session = require('express-session'),
			bodyParser = require('body-parser'),
			massive = require('massive'),
			axios = require('axios'),
			userController = require('./controllers/userController'),
			tripController = require('./controllers/tripController')

//SERVER SETUP
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env;
const app = express();
app.use(bodyParser.json());

//MIDDLEWARE
massive(CONNECTION_STRING).then(db => app.set('db', db));
app.use(session({secret: SESSION_SECRET, resave: false,	saveUninitialized: false}));

//AUTH0
app.get('/auth/callback', async (req, res) => {
	const {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID, CLIENT_SECRET} = process.env;

	let payload = {
		client_id: REACT_APP_CLIENT_ID,
		client_secret: CLIENT_SECRET,
		code: req.query.code,
		grant_type: 'authorization_code',
		redirect_uri: `http://${req.headers.host}/auth/callback`
	}

	let resWithToken = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload);
	let resWithUserData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${resWithToken.data.access_token}`);
	const db = req.app.get('db');

	let {name, email, sub, picture} = resWithUserData.data;
	let foundUser = await db.find_user([sub]);
	
	if (foundUser[0]) {
		req.session.user = foundUser[0];
		res.redirect('/#/private')
	}	else {
		let createdUser = await db.create_user([name, email, sub, picture]);
		req.session.user = createdUser[0];
		res.redirect('/#/private');
	}
});

//USER ENDPOINTS
const userOrigin = '/api/users';
app.get    (`${userOrigin}`,     userController.read  );
app.post   (`${userOrigin}`,     userController.create);
app.put    (`${userOrigin}/:id`, userController.update);
app.delete (`${userOrigin}/:id`, userController.delete);

//TRIP ENDPOINTS
const tripOrigin = '/api/trips';
app.get    (`${tripOrigin}`,     tripController.read  );
app.post   (`${tripOrigin}`,     tripController.create);
app.put    (`${tripOrigin}/:id`, tripController.update);
app.delete (`${tripOrigin}/:id`, tripController.delete);

//RUN THE SERVER
app.listen(SERVER_PORT, () => console.log(`server started on port ${SERVER_PORT}`));