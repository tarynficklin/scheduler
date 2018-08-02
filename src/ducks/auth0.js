const initialState = {user: {}}
const UPDATE_USER_DATA = "UPDATE_USER_DATA";
const DELETE_USER = "DELETE_USER";

export default function users(state = initialState, action) {
	switch (action.type) {
		case UPDATE_USER_DATA: return Object.assign({}, state, {user: action.payload})
		case DELETE_USER: return Object.assign({}, state, {user: {}})
		default: return state;
	}
}

export function updateUserData (user) {return {type: UPDATE_USER_DATA, payload: user}}
export function deleteUser () {return {type: DELETE_USER}}