const Scanner = require('../models/scannerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Event = require('../models/eventModel');
// const Scanner = require('../models/scannerModel');

// exports.createScanner = catchAsync(async (req, res, next) => {
//   const { eventId } = req.params;

//   const event = await Event.findById(eventId);

//   if (!event) {
//     return next(new AppError('Event not found.', 404));
//   }

//   // Only the assigned organizer can create scanners
//   if (event.owner.toString() !== req.user.id) {
//     return next(
//       new AppError(
//         'You are not allowed to create scanners for this event.',
//         403,
//       ),
//     );
//   }

const Ticket = require('../models/ticketModel');

//   const scanner = await Scanner.create({
//     ...req.body,
//     event: event._id,
//     createdBy: req.user._id,
//   });

//   res.status(201).json({
//     status: 'success',
//     data: {
//       scanner,
//     },
//   });
// });

exports.createScanner = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found.', 404));
  }

  // const isOrganizer = event.organizers.some(
  //   (organizer) => organizer.toString() === req.user.id,
  // );

  const isOrganizer = event.organizers.some(
    (organizer) =>
      (organizer._id || organizer).toString() === req.user.id.toString(),
  );
  console.log('Logged in:', req.user._id.toString());
  console.log(
    'Organizers:',
    event.organizers.map((id) => id.toString()),
  );

  if (!isOrganizer) {
    return next(
      new AppError(
        'You are not allowed to create scanners for this event.',
        403,
      ),
    );
  }

  const scanner = await Scanner.create({
    ...req.body,
    event: event._id,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      scanner,
    },
  });
});

exports.getEventScanners = catchAsync(async (req, res) => {
  const scanners = await Scanner.find({
    event: req.params.eventId,
  }).populate('assignedTo', 'name email');

  res.status(200).json({
    status: 'success',
    results: scanners.length,
    data: {
      scanners,
    },
  });
});

exports.updateScanner = catchAsync(async (req, res, next) => {
  const scanner = await Scanner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!scanner) {
    return next(new AppError('Scanner not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      scanner,
    },
  });
});

exports.deleteScanner = catchAsync(async (req, res, next) => {
  const scanner = await Scanner.findByIdAndDelete(req.params.id);

  if (!scanner) {
    return next(new AppError('Scanner not found.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.checkInTicket = catchAsync(async (req, res, next) => {
  const { ticketCode } = req.body;

  if (!ticketCode) {
    return next(new AppError('Please provide a ticket code.', 400));
  }

  const ticket = await Ticket.findOne({ ticketCode })
    .populate('buyer', 'name email')
    .populate('event', 'name');

  if (!ticket) {
    return next(new AppError('Ticket not found.', 404));
  }
  console.log('========================');
  console.log('Scanner Event:', req.scanner.event.toString());
  console.log('Ticket Event:', ticket.event._id.toString());
  console.log('Ticket:', ticket);
  console.log('========================');

  // Make sure scanner belongs to this event
  if (ticket.event._id.toString() !== req.scanner.event.toString()) {
    return next(
      new AppError('This ticket does not belong to your assigned event.', 403),
    );
  }

  if (ticket.status !== 'paid') {
    return next(new AppError('Only paid tickets can be checked in.', 400));
  }

  if (ticket.status === 'checked-in') {
    return next(new AppError('Ticket has already been checked in.', 400));
  }

  ticket.status = 'checked-in';
  ticket.checkedInAt = new Date();
  ticket.checkedInBy = req.scanner._id;

  await ticket.save();

  res.status(200).json({
    status: 'success',
    message: 'Ticket checked in successfully.',
    data: {
      ticket,
    },
  });
});

// const Event = require('../models/eventModel');
// const Scanner = require('../models/scannerModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// exports.createScanner = catchAsync(async (req, res, next) => {
//   const { eventId } = req.params;

//   const event = await Event.findById(eventId);

//   if (!event) {
//     return next(new AppError('Event not found.', 404));
//   }

//   const isOrganizer = event.organizers.some(
//     organizer => organizer.toString() === req.user.id
//   );

//   if (!isOrganizer) {
//     return next(
//       new AppError(
//         'You are not allowed to create scanners for this event.',
//         403
//       )
//     );
//   }

//   const scanner = await Scanner.create({
//     ...req.body,
//     event: event._id,
//     createdBy: req.user._id,
//   });

//   res.status(201).json({
//     status: 'success',
//     data: {
//       scanner,
//     },
//   });
// });
