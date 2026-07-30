const Scanner = require('../models/scannerModel');
const Ticket = require('../models/ticketModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDashboard = catchAsync(async (req, res, next) => {
  const scanner = await Scanner.findById(req.scanner._id).populate(
    'event',
    'name venue startDate',
  );

  if (!scanner) {
    return next(new AppError('Scanner not found.', 404));
  }

  const paidTickets = await Ticket.countDocuments({
    event: scanner.event._id,
    status: 'paid',
  });

  const checkedIn = await Ticket.countDocuments({
    event: scanner.event._id,
    status: 'checked-in',
  });

  const recentCheckIns = await Ticket.find({
    event: scanner.event._id,
    status: 'checked-in',
  })
    .populate('buyer', 'name email')
    .sort('-checkedInAt')
    .limit(10);

  res.status(200).json({
    status: 'success',
    data: {
      scanner: {
        id: scanner._id,
        name: scanner.name,
        email: scanner.email,
      },
      event: scanner.event,
      stats: {
        paidTickets,
        checkedIn,
        remaining: paidTickets - checkedIn,
      },
      recentCheckIns,
    },
  });
});
