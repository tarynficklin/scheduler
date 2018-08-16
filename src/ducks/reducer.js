//INITIAL STATE
const initialState = {
	background: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=13b58b0343d8efc06a88c55e843f624f&auto=format&fit=crop&w=1500&q=80'
};

//CONSTANTS
const UPDATE_BACKGROUND = "UPDATE_BACKGROUND";

//REDUCER
export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
		case UPDATE_BACKGROUND:
			return Object.assign({}, state, {background: action.payload})
		default:
			return state;
		}
}

export function updateBackground(background) {
	return {type: UPDATE_BACKGROUND,
		payload: background}}