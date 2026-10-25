// redux 5 still ships createStore (as legacy_createStore); @reduxjs/toolkit's configureStore is the modern route.
import { combineReducers, legacy_createStore as createStore } from 'redux';
import auth from './ducks/auth';
import reducer from './ducks/reducer';

const rootReducer = combineReducers({ auth, reducer });
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
