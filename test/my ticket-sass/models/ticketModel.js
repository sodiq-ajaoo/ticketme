const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: [true, 'Ticket must belong to an event'],
    },

    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Ticket must belong to a user'],
    },

    ticketTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    ticketTypeName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // status: {
    //   type: String,
    //   enum: ['reserved', 'paid', 'cancelled', 'refunded'],
    //   default: 'reserved',
    // },

    status: {
      type: String,
      enum: {
        values: ['reserved', 'paid', 'checked-in', 'cancelled', 'refunded'],
        message: 'Invalid ticket status.',
      },
      default: 'reserved',
    },

    paymentReference: String,

    payment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },

    checkedInScanner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Scanner',
    },

    // qrCode: String,

    // checkedIn: {
    //   type: Boolean,
    //   default: false,
    // },

    ticketCode: {
      type: String,
      unique: true,
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: Date,
    // checkedInAt: Date,

    checkedInBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Scanner',
    },

    // checkedInBy: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    // },
  },

  {
    timestamps: true,
  },
);

ticketSchema.index({ event: 1 });
ticketSchema.index({ buyer: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ event: 1, ticketTypeId: 1 });

ticketSchema.pre('save', function () {
  if (!this.ticketCode) {
    this.ticketCode = uuidv4();
  }

  // next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
