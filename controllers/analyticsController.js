const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getEventAnalytics = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found.', 404));
  }

  // Organizer or Admin only
  const isOrganizer =
    event.organizers &&
    event.organizers.some(
      (organizer) =>
        (organizer._id || organizer).toString() === req.user.id.toString(),
    );

  const isAdmin = req.user.role === 'admin';

  if (!isOrganizer && !isAdmin) {
    return next(
      new AppError('You do not have permission to view analytics.', 403),
    );
  }

  // Paid + Checked-in tickets
  const paidTickets = await Ticket.find({
    event: eventId,
    status: { $in: ['paid', 'checked-in'] },
  });

  // Checked-in tickets
  const checkedInTickets = await Ticket.find({
    event: eventId,
    status: 'checked-in',
  });

  const totalTicketsSold = paidTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  const totalCheckedIn = checkedInTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  // Total revenue
  const revenue = paidTickets.reduce(
    (sum, ticket) => sum + ticket.totalPrice,
    0,
  );

  // Attendance %
  // const attendanceRate =
  //   paidTickets.length === 0
  //     ? 0
  //     : ((checkedInTickets.length / paidTickets.length) * 100).toFixed(1);

  const attendanceRate =
    totalTicketsSold === 0
      ? 0
      : ((totalCheckedIn / totalTicketsSold) * 100).toFixed(1);

  // Revenue & sales by ticket type
  const ticketBreakdown = await Ticket.aggregate([
    {
      $match: {
        event: event._id,
        status: { $in: ['paid', 'checked-in'] },
      },
    },
    {
      $group: {
        _id: '$ticketTypeName',
        sold: {
          $sum: '$quantity',
        },
        revenue: {
          $sum: '$totalPrice',
        },
      },
    },
    {
      $project: {
        _id: 0,
        ticketType: '$_id',
        sold: 1,
        revenue: 1,
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      event: event.name,
      ticketsSold: totalTicketsSold,
      ticketsCheckedIn: totalCheckedIn,
      ticketsRemaining: totalTicketsSold - totalCheckedIn,
      attendanceRate,
      revenue,
      ticketBreakdown,
    },
  });
});
