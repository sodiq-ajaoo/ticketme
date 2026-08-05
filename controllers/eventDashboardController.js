// exports.getEventDashboard = catchAsync(async (req, res, next) => {
//   const event = await Event.findById(req.params.id);

//   if (!event) {
//     return next(new AppError('No event found', 404));
//   }

//   // all tickets
//   const totalTickets = await Ticket.countDocuments({
//     event: event._id,
//   });

//   // sold
//   const ticketsSold = await Ticket.countDocuments({
//     event: event._id,
//     status: { $in: ['paid', 'checked-in'] },
//   });

//   // checked in
//   const checkedIn = await Ticket.countDocuments({
//     event: event._id,
//     status: 'checked-in',
//   });

//   // revenue
//   const revenue = await Payment.aggregate([
//     {
//       $lookup: {
//         from: 'tickets',
//         localField: 'ticket',
//         foreignField: '_id',
//         as: 'ticket',
//       },
//     },
//     { $unwind: '$ticket' },
//     {
//       $match: {
//         status: 'success',
//         'ticket.event': event._id,
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
//       event,
//       totalTickets,
//       ticketsSold,
//       checkedIn,
//       ticketsRemaining: totalTickets - ticketsSold,
//       revenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
//     },
//   });
// });
