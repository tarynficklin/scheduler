// The logged-in user ({ user_id, user_name, user_email }), from GET /api/user-data,
// POST /api/login or POST /api/signup. Was ducks/auth0.js.

//INITAL STATE
const initialState = { user: {} };

//CONSTANTS
const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
const DELETE_USER = 'DELETE_USER';

//REDUCER
export default function users(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_DATA:
      return { ...state, user: action.payload ?? {} };
    case DELETE_USER:
      return { ...state, user: {} };
    default:
      return state;
  }
}

//ACTION CREATORS
export function updateUserData(user) {
  return { type: UPDATE_USER_DATA, payload: user };
}
export function deleteUser() {
  return { type: DELETE_USER };
}
