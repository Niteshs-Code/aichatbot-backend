import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    profilePic: {
  type: String,
  default: ""
},

    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    isVerified: {
  type: Boolean,
  default: false
},

verificationToken: {
  type: String
},
authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local"
}
,
resetPasswordToken: String,
resetPasswordExpire: Date,

});
export default mongoose.model("User", userSchema);