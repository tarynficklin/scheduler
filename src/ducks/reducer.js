//INITIAL STATE
const initialState = {
	background: 'https://images.unsplash.com/photo-1518144591331-17a5dd71c477?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=210f0cacd6dd701fe842441652db7be8&auto=format&fit=crop&w=1920&q=80',
	color: '25, 144, 172'
};

//CONSTANTS
const UPDATE_BACKGROUND = "UPDATE_BACKGROUND";
const UPDATE_COLOR      = "UPDATE_COLOR";

//REDUCER
export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
		case UPDATE_BACKGROUND : return Object.assign({}, state, {background: action.payload});
		case UPDATE_COLOR      : return Object.assign({}, state, {color: action.payload});
		default: return state;
		}
}

//ACTION CREATORS
export function updateBackground(background) {return {type: UPDATE_BACKGROUND, payload: background}};
export function updateColor(color) {return {type: UPDATE_COLOR, payload: color}};