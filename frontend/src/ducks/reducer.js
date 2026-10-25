// The app's current background image and theme color (an "r, g, b" string).
export const DEFAULT_BACKGROUND =
  'https://images.unsplash.com/photo-1541789094913-f3809a8f3ba5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ba555c8bb03ffabb86e6ecf9ec4243c&auto=format&fit=crop&w=1920&q=80';
export const DEFAULT_COLOR = '25, 144, 172';

//INITIAL STATE
const initialState = {
  background: DEFAULT_BACKGROUND,
  color: DEFAULT_COLOR,
};

//CONSTANTS
const UPDATE_BACKGROUND = 'UPDATE_BACKGROUND';
const UPDATE_COLOR = 'UPDATE_COLOR';

//REDUCER
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BACKGROUND:
      return { ...state, background: action.payload };
    case UPDATE_COLOR:
      return { ...state, color: action.payload };
    default:
      return state;
  }
}

//ACTION CREATORS
export function updateBackground(background) {
  return { type: UPDATE_BACKGROUND, payload: background };
}
export function updateColor(color) {
  return { type: UPDATE_COLOR, payload: color };
}
