import type { UserType } from "../types/user.types.js";

function removeSensitiveData(userObj: UserType) {
  const {
    password,
    verificationToken,
    verificationTokenExpiry,
    forgotPasswordToken,
    forgotPasswordTokenExpiry,
    __v,
    ...user
  } = userObj;

  return user;
}

export default removeSensitiveData;
