interface IUserMethods {
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
}

export { type IUserMethods };
