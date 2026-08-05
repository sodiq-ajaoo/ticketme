const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const scannerSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

scannerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // next();
});

scannerSchema.methods.correctPassword = async function (
  candidatePassword,
  scannerPassword,
) {
  return await bcrypt.compare(candidatePassword, scannerPassword);
};

// module.exports = mongoose.model('Scanner', scannerSchema);

module.exports = mongoose.model('Scanner', scannerSchema);
