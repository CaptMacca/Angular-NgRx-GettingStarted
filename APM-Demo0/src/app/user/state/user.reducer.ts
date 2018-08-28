export function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_USERNAME_MASK':
      console.log('existing state: ' + JSON.stringify(state));
      console.log('payload: ' + action.payload);
      return {
        ...state,
        maskUsername: action.payload
      };
    default:
      return state;
  }
}
