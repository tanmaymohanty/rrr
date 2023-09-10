import { SET_USER, LOGOUT_USER } from './userActions';

const initialState = {
  username: null,
  phone: null,
  email: null,
};

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_USER:
      return {
        ...state,
        username: action.payload.username,
        phone: action.payload.phone,
        email: action.payload.email,
      };

    case LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;
