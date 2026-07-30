const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAttendees = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found.', 404));
  }

  // Only organizers/admin can view attendees

  const isOrganizer = event.organizers.some(
    (organizer) =>
      (organizer._id ?? organizer).toString() === req.user.id.toString(),
  );
  // const isOrganizer =
  //   event.organizers &&
  //   event.organizers.some(
  //     (organizer) => organizer.toString() === req.user.id.toString(),
  //   );

  const isAdmin = req.user.role === 'admin';

  if (!isOrganizer && !isAdmin) {
    return next(
      new AppError('You do not have permission to view attendees.', 403),
    );
  }

  const attendees = await Ticket.find({
    event: eventId,
    status: 'checked-in',
  })
    .populate('buyer', 'name email')
    .populate('checkedInBy', 'name email')
    .sort('-checkedInAt');

  res.status(200).json({
    status: 'success',
    results: attendees.length,
    data: {
      attendees,
    },
  });
});
