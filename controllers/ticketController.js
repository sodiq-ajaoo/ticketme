const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const QRCode = require('qrcode');
const generateQrCode = require('../utils/generateQrCode');
const sendEmail = require('../utils/email');
const QRCode = require('qrcode');
const generateTicketPdf = require('../utils/generateTicketPdf');
// const QRCode = require('qrcode');

// exports.purchaseTicket = catchAsync(async (req, res, next) => {
//   const { eventId, ticketTypeId, quantity } = req.body;

//   // 1. Validate request
//   const qty = Number(quantity);

//   if (!eventId || !ticketTypeId || !qty) {
//     return next(
//       new AppError('Please provide eventId, ticketTypeId and quantity.', 400),
//     );
//   }

//   if (qty < 1) {
//     return next(new AppError('Quantity must be at least 1.', 400));
//   }

//   // 2. Find event
//   const event = await Event.findById(eventId);

//   if (!event) {
//     return next(new AppError('No event found with that ID.', 404));
//   }

//   // 3. Event must be published
//   if (event.status !== 'published') {
//     return next(
//       new AppError('This event is not available for ticket purchase.', 400),
//     );
//   }

//   // 4. Event must not have started
//   if (event.startDate <= Date.now()) {
//     return next(new AppError('Ticket sales have closed for this event.', 400));
//   }

//   // 5. Find selected ticket type
//   const ticketType = event.ticketTypes.id(ticketTypeId);

//   if (!ticketType) {
//     return next(new AppError('Ticket type not found.', 404));
//   }

//   // 6. Calculate tickets already sold
//   const sold = await Ticket.aggregate([
//     {
//       $match: {
//         event: event._id,
//         ticketTypeId: ticketType._id,
//         status: { $ne: 'cancelled' },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalSold: {
//           $sum: '$quantity',
//         },
//       },
//     },
//   ]);

//   const totalSold = sold.length ? sold[0].totalSold : 0;

//   // 7. Check availability
//   const available = ticketType.quantity - totalSold;

//   if (qty > available) {
//     return next(new AppError(`Only ${available} ticket(s) remaining.`, 400));
//   }

//   // 8. Create ticket
//   const ticket = await Ticket.create({
//     event: event._id,
//     buyer: req.user._id,
//     ticketTypeId: ticketType._id,
//     ticketTypeName: ticketType.name,
//     quantity: qty,
//     unitPrice: ticketType.price,
//     totalPrice: ticketType.price * qty,
//     status: 'reserved',
//   });

//   const qrCode = await generateQrCode(ticket.ticketCode);
//   await sendEmail({
//     email: req.user.email,
//     subject: 'Ticket Reserved',
//     message: `
// Hi ${req.user.name},

// Your ticket has been reserved successfully.

// Event: ${event.name}
// Ticket Type: ${ticket.ticketTypeName}
// Quantity: ${ticket.quantity}
// Amount: ₦${ticket.totalPrice}

// Please complete your payment to activate your ticket.

// Thank you for using TicketMe.
// `,
//   });

//   // Update sold tickets
//   // ticketType.sold += qty;

//   // await event.save();

//   await Event.updateOne(
//     {
//       _id: event._id,
//       'ticketTypes._id': ticketType._id,
//     },
//     {
//       $inc: {
//         'ticketTypes.$.sold': qty,
//       },
//     },
//   );

//   // 9. Return response
//   res.status(201).json({
//     status: 'success',
//     data: {
//       ticket: {
//         ...ticket.toObject(),
//         qrCode,
//       },
//     },
//   });
// });

exports.reserveTickets = catchAsync(async (req, res, next) => {
  const { eventId, tickets } = req.body;

  if (!eventId || !tickets || !tickets.length) {
    return next(
      new AppError('Please provide eventId and ticket selections.', 400),
    );
  }

  // Find event
  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('No event found with that ID.', 404));
  }

  // Event must be published
  if (event.status !== 'published') {
    return next(
      new AppError('This event is not available for ticket purchase.', 400),
    );
  }

  // Event must not have started
  if (event.startDate <= Date.now()) {
    return next(new AppError('Ticket sales have closed.', 400));
  }

  const reservedTickets = [];

  for (const item of tickets) {
    const { ticketTypeId, quantity } = item;

    const qty = Number(quantity);

    if (!qty || qty < 1) continue;

    // Find ticket type
    const ticketType = event.ticketTypes.id(ticketTypeId);

    if (!ticketType) {
      return next(new AppError(`Ticket type ${ticketTypeId} not found.`, 404));
    }

    // Check availability
    const sold = await Ticket.aggregate([
      {
        $match: {
          event: event._id,
          ticketTypeId: ticketType._id,
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalSold: {
            $sum: '$quantity',
          },
        },
      },
    ]);

    const totalSold = sold.length ? sold[0].totalSold : 0;

    const available = ticketType.quantity - totalSold;

    if (qty > available) {
      return next(
        new AppError(
          `Only ${available} ${ticketType.name} ticket(s) remaining.`,
          400,
        ),
      );
    }

    // Create reserved ticket
    const ticket = await Ticket.create({
      event: event._id,
      buyer: req.user._id,
      ticketTypeId: ticketType._id,
      ticketTypeName: ticketType.name,
      quantity: qty,
      unitPrice: ticketType.price,
      totalPrice: qty * ticketType.price,
      status: 'reserved',
    });

    reservedTickets.push(ticket);

    // Update sold count
    await Event.updateOne(
      {
        _id: event._id,
        'ticketTypes._id': ticketType._id,
      },
      {
        $inc: {
          'ticketTypes.$.sold': qty,
        },
      },
    );
  }

  res.status(201).json({
    status: 'success',
    results: reservedTickets.length,
    data: {
      tickets: reservedTickets,
    },
  });
});
exports.getMyTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({
    buyer: req.user._id,
  })
    .populate({
      path: 'event',
      select: 'name venue startDate imageCover state city',
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: {
      tickets,
    },
  });
});

exports.getMyTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate({
    path: 'event',
    select: 'name venue startDate imageCover state city',
  });

  if (!ticket) {
    return next(new AppError('Ticket not found.', 404));
  }

  if (ticket.buyer.toString() !== req.user.id) {
    return next(
      new AppError('You do not have permission to view this ticket.', 403),
    );
  }

  const qrCode = await generateQrCode(ticket.ticketCode);

  res.status(200).json({
    status: 'success',
    data: {
      ticket: {
        ...ticket.toObject(),
        qrCode,
      },
    },
  });
});

exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate({
      path: 'event',
      select:
        'name venue startDate endDate imageCover state city ticketTypes totalTickets',
    })

    .populate({
      path: 'buyer',
      select: 'name email',
    });

  if (!ticket) {
    return next(new AppError('No ticket found with that ID.', 404));
  }

  // Prevent users from viewing other people's tickets
  if (
    ticket.buyer._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to view this ticket.', 403),
    );
  }

  const qrCode = await generateQrCode(ticket.ticketCode);

  res.status(200).json({
    status: 'success',
    data: {
      ticket: {
        ...ticket.toObject(),
        qrCode,
      },
    },
  });

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     ticket,
  //     qrCode,
  //   },
  // });
});

exports.cancelTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate('event');

  if (!ticket) {
    return next(new AppError('No ticket found with that ID.', 404));
  }

  // Only owner or admin can cancel
  if (ticket.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to cancel this ticket.', 403),
    );
  }

  // Already cancelled
  if (ticket.status === 'cancelled') {
    return next(new AppError('Ticket is already cancelled.', 400));
  }

  // Cannot cancel after event starts
  if (ticket.event.startDate <= Date.now()) {
    return next(
      new AppError(
        'You cannot cancel a ticket after the event has started.',
        400,
      ),
    );
  }

  // Return tickets to inventory
  await Event.updateOne(
    {
      _id: ticket.event._id,
      'ticketTypes._id': ticket.ticketTypeId,
    },
    {
      $inc: {
        'ticketTypes.$.sold': -ticket.quantity,
      },
    },
  );

  // Update ticket status
  ticket.status = 'cancelled';
  await ticket.save();

  // const qrCode = await generateQrCode(ticket.ticketCode);

  res.status(200).json({
    status: 'success',
    data: {
      ticket,
      // qrCode,
    },
  });
});

exports.getEventTickets = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(new AppError('No event found with that ID.', 404));
  }

  // Check permission
  const isOwner = event.owner && event.owner.toString() === req.user.id;

  const isOrganizer =
    event.organizers &&
    event.organizers.some((organizer) => organizer.toString() === req.user.id);

  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isOrganizer && !isAdmin) {
    return next(
      new AppError('You do not have permission to view these tickets.', 403),
    );
  }

  const tickets = await Ticket.find({
    event: event._id,
  })
    .populate({
      path: 'buyer',
      select: 'name email',
    })
    .populate({
      path: 'event',
      select: 'name venue startDate imageCover',
    })
    .sort('-createdAt');

  // const ticketsWithQr = await Promise.all(
  //   tickets.map(async (ticket) => ({
  //     ticket,
  //     qrCode: await generateQrCode(ticket.ticketCode),
  //   })),
  // );

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: {
      tickets,
      // tickets: ticketsWithQr,
    },
  });
});

exports.downloadTicket = catchAsync(async (req, res, next) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId)
    .populate('buyer', 'name email')
    .populate('event', 'name venue startDate');

  if (!ticket) {
    return next(new AppError('Ticket not found.', 404));
  }

  // Only the owner can download
  if (ticket.buyer._id.toString() !== req.user.id.toString()) {
    return next(
      new AppError('You do not have permission to download this ticket.', 403),
    );
  }

  // Ticket must be paid
  if (!['paid', 'checked-in'].includes(ticket.status)) {
    return next(new AppError('Only paid tickets can be downloaded.', 400));
  }

  // Generate QR image
  const qrDataUrl = await QRCode.toDataURL(ticket.ticketCode);

  // Convert Base64 to Buffer
  const qrCodeBuffer = Buffer.from(
    qrDataUrl.replace(/^data:image\/png;base64,/, ''),
    'base64',
  );

  // Generate PDF
  generateTicketPdf(ticket, qrCodeBuffer, res);
});

// exports.checkInTicket = catchAsync(async (req, res, next) => {
//   const ticket = await Ticket.findById(req.params.id).populate('event');

//   if (!ticket) {
//     return next(new AppError('No ticket found with that ID.', 404));
//   }

//   // Only owner or admin can check in tickets
//   const isOwner =
//     ticket.event.owner && ticket.event.owner.toString() === req.user.id;

//   const isAdmin = req.user.role === 'admin';

//   if (!isOwner && !isAdmin) {
//     return next(
//       new AppError('You do not have permission to check in tickets.', 403),
//     );
//   }

//   if (ticket.status === 'cancelled') {
//     return next(new AppError('Ticket has been cancelled.', 400));
//   }

//   // Only paid tickets can be checked in
//   if (ticket.status !== 'paid') {
//     return next(new AppError('Only paid tickets can be checked in.', 400));
//   }

//   // Prevent duplicate check-ins
//   if (ticket.status === 'checked-in') {
//     return next(new AppError('Ticket already checked in.', 400));
//   }

//   ticket.status = 'checked-in';
//   ticket.checkedIn = true;
//   ticket.checkedInAt = Date.now();

//   await ticket.save();

//   // const qrCode = await generateQrCode(ticket.ticketCode);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       ticket: {
//         id: ticket._id,
//         ticketCode: ticket.ticketCode,
//         buyer: ticket.buyer,
//         event: ticket.event,
//         quantity: ticket.quantity,
//         status: ticket.status,
//         checkedInAt: ticket.checkedInAt,
//       },
//     },
//   });
// });

// exports.scanTicket = catchAsync(async (req, res, next) => {
//   const ticket = await Ticket.findOne({
//     ticketCode: req.body.ticketCode,
//   })
//     .populate('buyer', 'name email')
//     .populate(
//       'event',
//       'name venue startDate endDate owner organizers ticketTypes totalTickets',
//     );

//   // 1. Check ticket exists
//   if (!ticket) {
//     return next(new AppError('Invalid ticket.', 404));
//   }

//   // 2. Check permissions
//   const isOwner =
//     ticket.event.owner && ticket.event.owner.toString() === req.user.id;

//   const isOrganizer =
//     ticket.event.organizers &&
//     ticket.event.organizers.some(
//       (organizer) => organizer.toString() === req.user.id,
//     );

//   const isAdmin = req.user.role === 'admin';

//   if (!isOwner && !isOrganizer && !isAdmin) {
//     return next(
//       new AppError(
//         'You do not have permission to scan tickets for this event.',
//         403,
//       ),
//     );
//   }

//   // 3. Event has not started
//   if (ticket.event.startDate > Date.now()) {
//     return next(new AppError('This event has not started yet.', 400));
//   }

//   // 4. Event already ended (optional)
//   if (ticket.event.endDate && ticket.event.endDate < Date.now()) {
//     return next(new AppError('This event has already ended.', 400));
//   }

//   // 5. Ticket cancelled
//   if (ticket.status === 'cancelled') {
//     return next(new AppError('Ticket has been cancelled.', 400));
//   }

//   // 6. Ticket refunded
//   if (ticket.status === 'refunded') {
//     return next(new AppError('Ticket has been refunded.', 400));
//   }

//   // 7. Already checked in
//   if (ticket.status === 'checked-in') {
//     return next(new AppError('Ticket has already been checked in.', 400));
//   }

//   // 8. Must be paid
//   if (ticket.status !== 'paid') {
//     return next(new AppError('Only paid tickets can be scanned.', 400));
//   }

//   // 9. Check in ticket
//   ticket.status = 'checked-in';
//   ticket.checkedInAt = new Date();
//   ticket.checkedInBy = req.user._id;

//   await ticket.save();

//   // 10. Success response
//   res.status(200).json({
//     status: 'success',
//     message: 'Ticket verified successfully.',
//     data: {
//       ticket: {
//         id: ticket._id,
//         ticketCode: ticket.ticketCode,
//         buyer: ticket.buyer,
//         event: ticket.event,
//         quantity: ticket.quantity,
//         status: ticket.status,
//         checkedInAt: ticket.checkedInAt,
//         checkedInBy: req.user.name,
//       },
//     },
//   });
// });

// exports.scanTicket = catchAsync(async (req, res, next) => {
//   const { ticketCode } = req.body;

//   if (!ticketCode) {
//     return next(new AppError('Please provide a ticket code.', 400));
//   }

//   const ticket = await Ticket.findOne({ ticketCode })
//     .populate('buyer', 'name email')
//     .populate('event', 'name date location');

//   if (!ticket) {
//     return next(new AppError('Invalid ticket.', 404));
//   }

//   if (ticket.status !== 'paid') {
//     return next(
//       new AppError(
//         'This ticket has not been paid for or has been cancelled.',
//         400,
//       ),
//     );
//   }

//   if (ticket.checkedIn) {
//     return next(new AppError('Ticket already used.', 400));
//   }

//   // ticket.checkedIn = true;
//   // ticket.checkedInAt = Date.now();
//   ticket.checkedIn = true;
//   ticket.checkedInAt = Date.now();
//   ticket.checkedInBy = req.user._id;

//   await ticket.save();

//   res.status(200).json({
//     status: 'success',
//     message: 'Ticket is valid.',
//     data: {
//       ticket,
//     },
//   });
// });
