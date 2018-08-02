import {combineReducers, createStore} from 'redux';
import reducer from './ducks/reducer';
import auth0 from './ducks/auth0';

const rootReducer = combineReducers({reducer,	auth0});

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;