import {combineReducers, createStore} from 'redux';
import auth0     from './ducks/auth0';
import dashboard from './ducks/dashboard';
import newTrip   from './ducks/newTrip';
import insighter from './ducks/insighter';

const rootReducer = combineReducers({auth0, dashboard, newTrip, insighter});
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;