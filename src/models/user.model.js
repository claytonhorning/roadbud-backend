const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String, default: "" },
  idType: { type: String, default: "" },
  fullName: { type: String, default: "" },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false },
  settings: {
    hasPushNotifications: { type: Boolean, default: false },
    hasLocationServices: { type: Boolean, default: false },
    hasEmailMarketing: { type: Boolean, default: false },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function generateAuthToken() {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    process.env.PRIVATEKEY
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function findByCredentials(
  email,
  password
) {
  const user = await User.findOne({ email });
  if (!user) {
    // throw new Error("Unable to login: User not registered");
    const error = new Error("Unable to login: User not registered");
    error.code = 404;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // throw new Error("Unable to login: Wrong password");
    const error = new Error("Unable to login: Wrong password");
    error.code = 401;
    throw error;
  }
  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", function preSave(next) {
  try {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(8, (err, salt) => {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, (bcryptError, hash) => {
        if (bcryptError) return next(bcryptError);

        // override the cleartext password with the hashed one
        user.password = hash;
        return next();
      });
    });
  } catch (e) {
    throw e;
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
