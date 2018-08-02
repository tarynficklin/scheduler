// const initialState = {user: {}}
const initialState = {user: {user_id: 19, user_name: "Taryn Ficklin", user_email: "tarynficklin@gmail.com", auth_id: "google-oauth2|100800992512531079080", auth_profile: "https://lh4.googleusercontent.com/-xeeCTQ3xyYw/AAAAAAAAAAI/AAAAAAAAAD4/SytnD43EHy4/photo.jpg"}}
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