export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const setUser = payload => ({
  type: SET_USER,
  payload,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
