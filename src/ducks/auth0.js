const initialState = {user: {}}
const UPDATE_USER_DATA = "UPDATE_USER_DATA";

export default function users(state = initialState, action) {
	switch (action.type) {
		case UPDATE_USER_DATA: return Object.assign({}, state, {user: action.payload})
		default: return state;
	}
}

export function updateUserData (user) {return {type: UPDATE_USER_DATA, payload: user}}