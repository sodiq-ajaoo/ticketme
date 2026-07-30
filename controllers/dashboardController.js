const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Ticket = require('../models/ticketModel');
const Payment = require('../models/paymentModel');

const catchAsync = require('../utils/catchAsync');

exports.getAdminDashboard = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalEvents,
    totalTickets,
    ticketsSold,
    upcomingEvents,
    checkedIn,
  ] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments({ isDeleted: false }),
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: { $in: ['paid', 'checked-in'] } }),
    Event.countDocuments({
      startDate: { $gte: new Date() },
      isDeleted: false,
    }),
    Ticket.countDocuments({ status: 'checked-in' }),
  ]);

  const revenue = await Payment.aggregate([
    {
      $match: {
        status: 'success',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$amount',
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalEvents,
      totalTickets,
      ticketsSold,
      upcomingEvents,
      checkedIn,
      totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
    },
  });
});

exports.getOrganizerDashboard = catchAsync(async (req, res, next) => {
  const myEvents = await Event.find({
    isDeleted: false,
    $or: [{ owner: req.user.id }, { organizers: req.user.id }],
  }).select('_id');

  const eventIds = myEvents.map((event) => event._id);

  const [totalEvents, ticketsSold, checkedIn, upcomingEvents] =
    await Promise.all([
      Event.countDocuments({
        isDeleted: false,
        $or: [{ owner: req.user.id }, { organizers: req.user.id }],
      }),

      Ticket.countDocuments({
        event: { $in: eventIds },
        status: { $in: ['paid', 'checked-in'] },
      }),

      Ticket.countDocuments({
        event: { $in: eventIds },
        status: 'checked-in',
      }),

      Event.countDocuments({
        startDate: { $gte: new Date() },
        isDeleted: false,
        $or: [{ owner: req.user.id }, { organizers: req.user.id }],
      }),
    ]);

  const revenue = await Payment.aggregate([
    {
      $lookup: {
        from: 'tickets',
        localField: 'ticket',
        foreignField: '_id',
        as: 'ticket',
      },
    },
    { $unwind: '$ticket' },
    {
      $match: {
        status: 'success',
        'ticket.event': { $in: eventIds },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$amount',
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalEvents,
      ticketsSold,
      checkedIn,
      upcomingEvents,
      totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
    },
  });
});
