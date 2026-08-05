const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    tickets: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Ticket',
        required: true,
      },
    ],

    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'NGN',
    },

    reference: {
      type: String,
      unique: true,
      required: true,
    },

    gateway: {
      type: String,
      default: 'paystack',
    },

    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },

    paidAt: Date,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Payment', paymentSchema);
