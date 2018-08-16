// const initialState = {user: {}}
const initialState = {
	user: {user_id: 1, user_name: "Taryn Ficklin", user_email: "tarynficklin@gmail.com", auth_id: "google-oauth2|100800992512531079080", auth_profile: "https://lh4.googleusercontent.com/-xeeCTQ3xyYw/AAAAAAAAAAI/AAAAAAAAAHM/59818DJojEk/photo.jpg"},
	background: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=13b58b0343d8efc06a88c55e843f624f&auto=format&fit=crop&w=1500&q=80'
}

const UPDATE_USER_DATA = "UPDATE_USER_DATA";
const DELETE_USER = "DELETE_USER";
const UPDATE_BACKGROUND = "UPDATE_BACKGROUND"

export default function users(state = initialState, action) {
	switch (action.type) {
		case UPDATE_USER_DATA: return Object.assign({}, state, {user: action.payload})
		case DELETE_USER: return Object.assign({}, state, {user: {}})
		case UPDATE_BACKGROUND:
				return Object.assign({},state,{background:action.payload})
		default: return state;
	}
}

export const updateBackground = (background) => ({
	type: UPDATE_BACKGROUND,
	payload: background
})
export function updateUserData (user) {return {type: UPDATE_USER_DATA, payload: user}}
export function deleteUser () {return {type: DELETE_USER}}