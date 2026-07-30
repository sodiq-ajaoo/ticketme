const Ticket = require('../models/ticketModel');
const Scanner = require('../models/scannerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkInTicket = catchAsync(async (req, res, next) => {
  console.log('🔥 checkInTicket function is running');
  const { ticketCode } = req.body;

  if (!ticketCode) {
    return next(new AppError('Please provide a ticket code.', 400));
  }

  const ticket = await Ticket.findOne({ ticketCode }).populate('event');

  if (!ticket) {
    return next(new AppError('Ticket not found.', 404));
  }

  // Get logged-in scanner
  const scanner = await Scanner.findById(req.scanner.id);

  if (!scanner) {
    return next(new AppError('Scanner not found.', 404));
  }

  console.log('Scanner Event:', scanner.event.toString());
  console.log('Ticket Event:', ticket.event._id.toString());
  console.log('Ticket Code:', ticket.ticketCode);
  console.log('Ticket Status:', ticket.status);

  // Scanner can only scan tickets for their event
  if (ticket.event._id.toString() !== scanner.event.toString()) {
    return next(
      new AppError('This ticket does not belong to your assigned event.', 403),
    );
  }

  if (ticket.status === 'reserved') {
    return next(new AppError('Ticket has not been paid.', 400));
  }

  if (ticket.status === 'cancelled') {
    return next(new AppError('Ticket has been cancelled.', 400));
  }

  if (ticket.status === 'refunded') {
    return next(new AppError('Ticket has been refunded.', 400));
  }

  if (ticket.status === 'checked-in') {
    return next(new AppError('Ticket already checked in.', 400));
  }

  ticket.status = 'checked-in';
  ticket.checkedInAt = new Date();
  ticket.checkedInBy = scanner._id;

  await ticket.save();

  res.status(200).json({
    status: 'success',
    message: 'Ticket checked in successfully.',
    data: {
      ticket,
    },
  });
});
