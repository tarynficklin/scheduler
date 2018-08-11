//DEPENDENCIES

const //CONTROLLERS
			auth0Controller    = require ('./controllers/auth0Controller'   ),
			userController     = require ('./controllers/userController'    ),
			tripController     = require ('./controllers/tripController'    ),
			listController     = require ('./controllers/listController'    ),
			scheduleController = require ('./controllers/scheduleController'),
			//NODE MODULES
			express            = require ('express'        ),
			session            = require ('express-session'),
			bodyParser         = require ('body-parser'    ),
			massive            = require ('massive'        )
													 require ('dotenv').config();

//SERVER SETUP
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env;
const app = express();
app.use(bodyParser.json());

//MIDDLEWARE
massive(CONNECTION_STRING).then(db => app.set('db', db));
app.use(session({secret: SESSION_SECRET, resave: false,	saveUninitialized: false}));

//AUTH0 ENDPOINTS
app.get    ('/auth/callback', auth0Controller.auth  );
app.get    ('/api/user-data', auth0Controller.user  );
app.get    ('/api/logout',    auth0Controller.logout);

//USER ENDPOINTS
const userOrigin = '/api/users';
app.get    (`${userOrigin}`,     userController.read  );
app.post   (`${userOrigin}`,     userController.create);
app.put    (`${userOrigin}/:id`, userController.update);
app.delete (`${userOrigin}/:id`, userController.delete);

//TRIP ENDPOINTS
const tripOrigin = '/api/trips';
app.get    (`${tripOrigin}/:user`,         tripController.read     );
app.get    (`${tripOrigin}`,               tripController.readLast );
app.get    (`${tripOrigin}/trip/:id`,      tripController.find     );
app.post   (`${tripOrigin}`,               tripController.create   );
app.put    (`${tripOrigin}/:id`,           tripController.update   );
app.put    (`${tripOrigin}/budget/:id`,    tripController.budget   );
app.put    (`${tripOrigin}/location/:id`,  tripController.location );
app.put    (`${tripOrigin}/startDate/:id`, tripController.startDate);
app.put    (`${tripOrigin}/endDate/:id`,   tripController.endDate  );
app.delete (`${tripOrigin}/:id`,           tripController.delete   );

//PACKING LIST ENDPOINTS
const listOrigin = '/api/list';
app.get    (`${listOrigin}/:id`,       listController.read    );
app.post   (`${listOrigin}`,           listController.create  );
app.put		 (`${listOrigin}/:id`,			 listController.update  );
app.put    (`${listOrigin}/check/:id`, listController.check   );
app.delete (`${listOrigin}/:id`,			 listController.delete  );
app.delete (`${listOrigin}/purge/:id`, listController.purge   );

//SCHEDULE ENDPOINTS
const scheduleOrigin = '/api/schedule';
app.get    (`${scheduleOrigin}/:id`,            scheduleController.read      );
app.post   (`${scheduleOrigin}`,                scheduleController.create    );
app.get    (`${scheduleOrigin}/item/:id`,       scheduleController.readItem  );
app.post   (`${scheduleOrigin}/item`,           scheduleController.createItem);
app.put    (`${scheduleOrigin}/item/title/:id`, scheduleController.titleItem );
app.put    (`${scheduleOrigin}/item/price/:id`, scheduleController.priceItem );
app.put    (`${scheduleOrigin}/item/check/:id`, scheduleController.checkItem );
app.delete (`${scheduleOrigin}/item/:id`,       scheduleController.deleteItem);

//RUN THE SERVER
app.listen(SERVER_PORT, () => console.log(`server started on port ${SERVER_PORT}`));