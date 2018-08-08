import {combineReducers, createStore} from 'redux';
import packingList from './ducks/packingList';
import auth0 from './ducks/auth0';

const rootReducer = combineReducers({packingList,	auth0});
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;