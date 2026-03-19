import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is requried!'],
        trim: true,
        lowercase:true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin", "owner", "user"],
        default: "user"
    },
    profileImage: {
  type: String,
  default: ""
}
},
{ timestamps: true}
);

export default mongoose.model("User", userSchema);
