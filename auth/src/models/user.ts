import mongoose from "mongoose";

interface userModel extends mongoose.Model<any> {
  build(attrs: userAttrs): userDocument;
}

interface userDocument extends mongoose.Document {
  email: string;
  password: string;
  // createdAt:string,
  // updatedAt:string,
}

interface userAttrs {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    requierd: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: userAttrs) => {
  // how are we refering to User before defining it? User depends on userSchema and we are using User inisde userSchema?
  return new User(attrs);
};

const User = mongoose.model<userDocument, userModel>("User", userSchema);

export { User };

///To create new user..
// const user = User.build({ email: "navi@gmail.com", password: "password" });
