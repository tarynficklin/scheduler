import {combineReducers, createStore} from 'redux';
import auth0     from './ducks/auth0';
import reducer from './ducks/reducer';

const rootReducer = combineReducers({auth0, reducer});
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;