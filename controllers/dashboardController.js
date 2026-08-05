const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Ticket = require('../models/ticketModel');
const Payment = require('../models/paymentModel');

const catchAsync = require('../utils/catchAsync');

// exports.getAdminDashboard = catchAsync(async (req, res) => {
//   const [
//     totalUsers,
//     totalEvents,
//     totalTickets,
//     ticketsSold,
//     upcomingEvents,
//     checkedIn,
//   ] = await Promise.all([
//     User.countDocuments(),
//     Event.countDocuments({ isDeleted: false }),
//     Ticket.countDocuments(),
//     Ticket.countDocuments({ status: { $in: ['paid', 'checked-in'] } }),
//     Event.countDocuments({
//       startDate: { $gte: new Date() },
//       isDeleted: false,
//     }),
//     Ticket.countDocuments({ status: 'checked-in' }),
//   ]);

//   const revenue = await Payment.aggregate([
//     {
//       $match: {
//         status: 'success',
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalRevenue: {
//           $sum: '$amount',
//         },
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       totalUsers,
//       totalEvents,
//       totalTickets,
//       ticketsSold,
//       upcomingEvents,
//       checkedIn,
//       totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
//     },
//   });
// });

exports.getAdminDashboard = catchAsync(async (req, res) => {
  // Existing dashboard stats
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

  // Revenue
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

  // ==========================
  // NEW DASHBOARD DATA
  // ==========================
  const [
    recentEvents,
    topSellingEvents,
    monthlyRevenue,
    latestUsers,
    ticketStatus,
  ] = await Promise.all([
    Event.find({ isDeleted: false })
      .sort('-createdAt')
      .limit(5)
      .select('name status startDate'),

    Ticket.aggregate([
      {
        $match: {
          status: { $in: ['paid', 'checked-in'] },
        },
      },
      {
        $group: {
          _id: '$event',
          ticketsSold: { $sum: '$quantity' },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { ticketsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $project: {
          name: '$event.name',
          ticketsSold: 1,
          revenue: 1,
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          status: 'success',
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
          },
          revenue: {
            $sum: '$amount',
          },
        },
      },
      {
        $sort: {
          '_id.month': 1,
        },
      },
    ]),

    User.find().sort('-createdAt').limit(5).select('name email createdAt'),

    Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          value: {
            $sum: '$quantity',
          },
        },
      },
    ]),
  ]);

  // ==========================
  // RESPONSE
  // ==========================

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalEvents,
      totalTickets,
      ticketsSold,
      upcomingEvents,
      checkedIn,
      totalRevenue: revenue.length ? revenue[0].totalRevenue : 0,

      recentEvents,
      latestUsers,
      topSellingEvents,
      monthlyRevenue,
      ticketStatus,
    },
  });
});

exports.getAdminReports = catchAsync(async (req, res) => {
  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const revenueSummary = await Promise.all([
    Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]),
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      revenueSummary: {
        today: revenueSummary[0][0]?.total || 0,
        week: revenueSummary[1][0]?.total || 0,
        month: revenueSummary[2][0]?.total || 0,
        year: revenueSummary[3][0]?.total || 0,
      },
    },
  });
  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'success',
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
        },
        revenue: {
          $sum: '$amount',
        },
      },
    },
    {
      $sort: {
        '_id.month': 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      revenueSummary: {
        today: revenueSummary[0][0]?.total || 0,
        week: revenueSummary[1][0]?.total || 0,
        month: revenueSummary[2][0]?.total || 0,
        year: revenueSummary[3][0]?.total || 0,
      },

      monthlyRevenue,
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
