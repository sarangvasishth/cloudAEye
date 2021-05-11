import { fetchPost } from "./serviceClient";

export const isEmailExist = async (email) => {
  return await fetchPost(`${process.env.REACT_APP_URL}/auth/is-email-exist`, {
    email: email,
  });
};
export const signUpUser = async (body) => {
  return await fetchPost(`${process.env.REACT_APP_URL}/auth/sign-up`, body);
};
export const loginUser = async (body) => {
  return await fetchPost(`${process.env.REACT_APP_URL}/auth/login`, body);
};
