// const fs = require('fs');
const AppError = require('../utils/appError');
const Event = require('./../models/eventModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

exports.aliasFeaturedEvents = (req, res, next) => {
  req.query.featured = 'true';
  req.query.status = 'published';
  req.query.limit = '6';
  req.query.sort = '-views,-createdAt';

  next();
};

exports.getEventStats = catchAsync(async (req, res, next) => {
  const stats = await Event.aggregate([
    {
      $group: {
        _id: '$category',
        numEvents: { $sum: 1 },
        avgViews: { $avg: '$views' },
        minViews: { $min: '$views' },
        maxViews: { $max: '$views' },
      },
    },
    {
      $sort: {
        numEvents: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Event.aggregate([
    {
      $match: {
        startDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDate',
        },
        numEvents: {
          $sum: 1,
        },
        events: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// exports.getAllEvents = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Event.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const events = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: events.length,
//     data: {
//       events,
//     },
//   });
// });

// exports.getAllEvents = catchAsync(async (req, res, next) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 12;
//   const skip = (page - 1) * limit;

//   // Total events
//   const totalEvents = await Event.countDocuments();

//   const features = new APIFeatures(Event.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields();

//   features.query = features.query.skip(skip).limit(limit);

//   const events = await features.query;

//   res.status(200).json({
//     status: 'success',
//     page,
//     limit,
//     totalEvents,
//     totalPages: Math.ceil(totalEvents / limit),
//     results: events.length,
//     data: {
//       events,
//     },
//   });
// });

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 12;

  // Apply filters first
  const filteredFeatures = new APIFeatures(Event.find(), req.query).filter();

  // Count filtered documents
  const totalResults = await Event.countDocuments(
    filteredFeatures.query.getFilter(),
  );

  const totalPages = Math.ceil(totalResults / limit);

  // Apply all features
  const features = new APIFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // const events = await features.query;
  const events = await features.query.populate(
    'organizers',
    'name email photo',
  );

  res.status(200).json({
    status: 'success',
    currentPage: page,
    totalPages,
    totalResults,
    results: events.length,
    data: {
      events,
    },
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  // const event = await Event.findById(req.params.id).populate('attendees');
  const event = await Event.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  console.log(req.files);
  console.log(req.body);

  req.body.owner = req.user.id;

  console.log(req.body.ticketTypes);
  console.log(typeof req.body.ticketTypes);

  // if (req.body.ticketTypes) {
  //   req.body.ticketTypes = JSON.parse(req.body.ticketTypes);
  // }

  // if (req.body.location) {
  //   req.body.location = JSON.parse(req.body.location);
  // }

  // if (req.files.imageCover) {
  //   req.body.imageCover = req.files.imageCover[0].path;
  // }

  // if (req.files.images) {
  //   req.body.images = req.files.images.map((file) => file.path);
  // }

  if (req.body.ticketTypes) {
    req.body.ticketTypes = JSON.parse(req.body.ticketTypes);
  }

  if (req.body.location) {
    req.body.location = JSON.parse(req.body.location);
  }

  if (req.body.organizers) {
    req.body.organizers = JSON.parse(req.body.organizers);
  }

  if (req.files.imageCover) {
    req.body.imageCover = req.files.imageCover[0].path;
  }

  if (req.files.images) {
    req.body.images = req.files.images.map((file) => file.path);
  }

  // const newEvent = await Event.create(req.body);

  const newEvent = await Event.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      event: newEvent,
    },
  });
});

// exports.createEvent = catchAsync(async (req, res, next) => {
//   // Automatically assign the logged-in admin as owner
//   req.body.owner = req.user.id;

//   const newEvent = await Event.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       event: newEvent,
//     },
//   });
// });

exports.updateEvent = catchAsync(async (req, res, next) => {
  if (req.files) {
    if (req.files.imageCover) {
      req.body.imageCover = req.files.imageCover[0].path;
    }

    if (req.files.images) {
      req.body.images = req.files.images.map((file) => file.path);
    }
  }

  // Parse JSON fields coming from FormData
  if (req.body.location) {
    req.body.location = JSON.parse(req.body.location);
  }

  if (req.body.ticketTypes) {
    req.body.ticketTypes = JSON.parse(req.body.ticketTypes);
  }

  if (req.body.organizers) {
    req.body.organizers = JSON.parse(req.body.organizers);
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  Object.assign(event, req.body);

  await event.save();

  res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});
// exports.deleteEvent = catchAsync(async (req, res, next) => {
//   await Event.findByIdAndDelete(req.params.id);

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.assignOrganizer = catchAsync(async (req, res, next) => {
  const { organizerId } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID.', 404));
  }

  const organizer = await User.findById(organizerId);

  if (!organizer) {
    return next(new AppError('No user found with that ID.', 404));
  }

  // Prevent duplicate assignment
  if (
    event.organizers.some((id) => id.toString() === organizer._id.toString())
  ) {
    return next(new AppError('User is already an organizer.', 400));
  }

  // Add organizer
  event.organizers.push(organizer._id);

  // Upgrade role if necessary
  if (organizer.role === 'user') {
    organizer.role = 'organizer';
    await organizer.save({ validateBeforeSave: false });
  }

  await event.save();

  // Notify organizer
  await sendEmail({
    email: organizer.email,
    subject: 'You have been assigned as an event organizer',
    message: `
Hello ${organizer.name},

You have been assigned as an organizer for:

${event.name}

Venue: ${event.venue}

Start Date: ${event.startDate}

You can now manage this event.

Regards,
TicketMe Team
`,
  });

  res.status(200).json({
    status: 'success',
    message: 'Organizer assigned successfully.',
    data: {
      event,
    },
  });
});

exports.removeOrganizer = catchAsync(async (req, res, next) => {
  const { organizerId } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No event found.', 404));
  }

  event.organizers = event.organizers.filter(
    (id) => id.toString() !== organizerId,
  );

  await event.save();

  // Check if the user still organizes another event
  const stillOrganizer = await Event.exists({
    organizers: organizerId,
  });

  if (!stillOrganizer) {
    await User.findByIdAndUpdate(organizerId, {
      role: 'user',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Organizer removed successfully.',
  });
});

exports.getEventDashboard = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found.', 404));
  }

  // Make sure organizer owns the event
  const isOwner = event.owner && event.owner.toString() === req.user.id;

  const isOrganizer =
    event.organizers &&
    event.organizers.some((org) => org.toString() === req.user.id);

  if (!isOwner && !isOrganizer && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to view this dashboard.', 403),
    );
  }

  // Get all tickets for this event
  const tickets = await Ticket.find({
    event: event._id,
  });

  const soldTickets = tickets.filter(
    (t) => t.status === 'paid' || t.status === 'checked-in',
  );

  const checkedInTickets = tickets.filter((t) => t.status === 'checked-in');

  const cancelledTickets = tickets.filter((t) => t.status === 'cancelled');

  const revenue = soldTickets.reduce(
    (sum, ticket) => sum + ticket.totalPrice,
    0,
  );

  const ticketTypes = event.ticketTypes.map((type) => {
    const sold = soldTickets
      .filter(
        (ticket) => ticket.ticketTypeId.toString() === type._id.toString(),
      )
      .reduce((sum, ticket) => sum + ticket.quantity, 0);

    return {
      id: type._id,
      name: type.name,
      price: type.price,
      quantity: type.quantity,
      sold,
      remaining: type.quantity - sold,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      event: {
        id: event._id,
        name: event.name,
      },

      analytics: {
        revenue,
        ticketsSold: soldTickets.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        ),
        checkedIn: checkedInTickets.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        ),
        cancelled: cancelledTickets.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        ),
        ticketTypes,
      },
    },
  });
});
