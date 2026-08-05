// const Payment = require('../models/paymentModel');
// const Ticket = require('../models/ticketModel');

// exports.getEventDashboard = catchAsync(async (req, res, next) => {
//   try {
//     // EVERYTHING currently inside getEventDashboard goes here
//     console.log('PARAM ID:', req.params.id);
//     const event = await Event.findById(req.params.id).populate(
//       'organizers',
//       'name email',
//     );
//     console.log('EVENT:', event);

//     if (!event) {
//       return next(new AppError('No event found with that ID', 404));
//     }

//     const totalTickets = await Ticket.countDocuments({
//       event: event._id,
//     });

//     const ticketsSold = await Ticket.countDocuments({
//       event: event._id,
//       status: { $in: ['paid', 'checked-in'] },
//     });

//     const checkedIn = await Ticket.countDocuments({
//       event: event._id,
//       status: 'checked-in',
//     });

//     const soldTicketsData = await Ticket.find({
//       event: event._id,
//       status: { $in: ['paid', 'checked-in'] },
//     });

//     const totalRevenue = soldTicketsData.reduce(
//       (sum, ticket) => sum + ticket.totalPrice,
//       0,
//     );

//     res.status(200).json({
//       status: 'success',
//       data: {
//         event,

//         stats: {
//           totalTickets,
//           ticketsSold,
//           ticketsRemaining: totalTickets - ticketsSold,
//           checkedIn,
//           totalRevenue,
//         },

//         // ticketBreakdown,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     console.log(err.stack);

//     throw err;
//   }
// });

// exports.getEventDashboard = catchAsync(async (req, res, next) => {
//   console.log('STEP 1');

//   const event = await Event.findById(req.params.id).populate(
//     'organizers',
//     'name email',
//   );

//   console.log('STEP 2');

//   const totalTickets = await Ticket.countDocuments({
//     event: event._id,
//   });

//   console.log('STEP 3');

//   const ticketsSold = await Ticket.countDocuments({
//     event: event._id,
//     status: { $in: ['paid', 'checked-in'] },
//   });

//   console.log('STEP 4');

//   const checkedIn = await Ticket.countDocuments({
//     event: event._id,
//     status: 'checked-in',
//   });

//   console.log('STEP 5');

//   const soldTicketsData = await Ticket.find({
//     event: event._id,
//     status: { $in: ['paid', 'checked-in'] },
//   });

//   console.log('STEP 6');

//   const totalRevenue = soldTicketsData.reduce(
//     (sum, ticket) => sum + ticket.totalPrice,
//     0,
//   );

//   console.log('STEP 7');

//   const ticketBreakdown = event.ticketTypes.map((type) => ({
//     id: type._id,
//     name: type.name,
//     price: type.price,
//     quantity: type.quantity,
//     sold: type.sold,
//     remaining: type.quantity - type.sold,
//   }));

//   console.log('STEP 8');

//   res.status(200).json({
//     status: 'success',
//     data: {
//       event,
//       stats: {
//         totalTickets,
//         ticketsSold,
//         ticketsRemaining: totalTickets - ticketsSold,
//         checkedIn,
//         totalRevenue,
//       },
//       ticketBreakdown,
//     },
//   });
// });
