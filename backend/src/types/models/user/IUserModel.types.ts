import type { Model } from "mongoose";
import type { IUserFields } from "./IUserFields.types.js";
import type { IUserMethods } from "./IUserMethods.types.js";

interface IUserModel extends Model<IUserFields, {}, IUserMethods> {}

export { type IUserModel };
