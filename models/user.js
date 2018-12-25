module.exports = (Schema) => {

  let schema = new Schema({
    password: { type: String, required: true },
    email: { type: String, unique: true },
    name: { type: String },
    role: { type: Number, default: 3, enum: [1, 2] },
    disabled: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },

  }, { timestamps: true });
  schema.virtual('isAdmin').get(function () {
    return this.role === 1;
  });

  schema.virtual('isSubAdmin').get(function () {
    return this.role === 2;
  });
  schema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
  }, 'The e-mail field cannot be empty.');

  return schema;
}
