import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { secret } from '../config';

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    passwordHash: { type: String, required: true },
    salt: String,
  },
  { timestamps: true },
);

schema.plugin(uniqueValidator, {
  message: 'is already taken',
});

schema.methods.setPassword = function setPassword(
  password,
) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

schema.methods.validPassword = function validPassword(
  password,
) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.passwordHash === hash;
};

schema.methods.generateJWT = function generateJWT() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000, 10),
    },
    secret,
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT(),
  };
};

export default mongoose.model('User', schema);
