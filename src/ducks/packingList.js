//INITIAL STATE
const initialState = {
	packingList: []
};

//CONSTANTS
const UPDATE_PACKING_LIST = "UPDATE_PACKING_LIST";

//REDUCER
export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
		case UPDATE_PACKING_LIST:
			return Object.assign({}, state, {packingList: action.payload})
		// case DELETE_PACKING_ITEM:
		// 	let listIndex = _.findIndex(packingList, i => i.packing_id === id);
		// 	packingList.splice(listIndex, 1);
		// 	return Object.assign({}, state, {packingList: action.payload})
		default:
			return state;
		}
}

//ACTION CREATORS
export function updatePackingList(packingList) {return {type: UPDATE_PACKING_LIST, payload: packingList}}
// export function deletePackingItem(packingList) {return {type: DELETE_PACKING_ITEM, payload: packingList}}