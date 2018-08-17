//INITIAL STATE
const initialState = {background: 'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9c7ebd41ce42bc44af4c1fff64cb39ba&auto=format&fit=crop&w=1920&q=80'};

//CONSTANTS
const UPDATE_BACKGROUND = "UPDATE_BACKGROUND";

//REDUCER
export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
		case UPDATE_BACKGROUND:
			document.getElementById("app").style.cssText = `background: center fixed url(${state.background}); background-size: cover; min-height: 100vh; transition: 1s;`
			return Object.assign({}, state, {background: action.payload})
		default: return state;
		}
}

//ACTION CREATORS
export function updateBackground(background) {return {type: UPDATE_BACKGROUND, payload: background}};