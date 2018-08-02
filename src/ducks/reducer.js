//INITIAL STATE
const initialState = {
	
};

//CONSTANTS
const UPDATE_FUNCTION = "UPDATE_FUNCTION";

//REDUCER
export default function reducer( state = initialState, action ) {
  // switch ( action.type ) {
  //   case UPDATE_FUNCTION:
	// 		return Object.assign({}, state, {arg: action.payload})
	// 	default:
	// 		return state;
	// 	}
}

//ACTION CREATORS
export function updateProperty(arg) {
	return {
		type: UPDATE_FUNCTION,
		payload: arg
	}
}