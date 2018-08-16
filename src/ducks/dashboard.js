//INITIAL STATE
const initialState = {
	trip_budget : 0
};

//CONSTANTS
const UPDATE_BUDGET = "UPDATE_BUDGET";

//REDUCER
export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
		case UPDATE_BUDGET:
			return Object.assign({}, state, {budget: action.payload})
		default:
			return state;
		}
}

//ACTION CREATORS
export function getBudgetInfo(budget) {return {type: UPDATE_BUDGET, payload: budget}}