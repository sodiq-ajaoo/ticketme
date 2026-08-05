const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    title: String,

    message: String,

    type: {
      type: String,
      enum: ['payment', 'ticket', 'event', 'announcement', 'system'],
      default: 'system',
    },

    read: {
      type: Boolean,
      default: false,
    },

    link: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Notification', notificationSchema);
