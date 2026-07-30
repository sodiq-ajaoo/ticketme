const mongoose = require('mongoose');
const slugify = require('slugify');
require('./userModel');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An event must have a name'],
      unique: true,
      trim: true,
      minlength: [5, 'An event name must have at least 5 characters'],
      maxlength: [
        100,
        'An event name must have less than or equal to 100 characters',
      ],
    },

    slug: String,

    description: {
      type: String,
      required: [true, 'An event must have a description'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },

    summary: {
      type: String,
      required: [true, 'An event must have a summary'],
      trim: true,
      maxlength: [200, 'Summary cannot exceed 200 characters'],
    },

    category: {
      type: String,
      required: [true, 'An event must have a category'],
      enum: {
        values: [
          'concert',
          'conference',
          'workshop',
          'seminar',
          'festival',
          'sports',
          'comedy',
          'religious',
          'other',
        ],
        message:
          'Category is either: concert, conference, workshop, seminar, festival, sports, comedy, religious or other',
      },
    },

    venue: {
      type: String,
      required: [true, 'An event must have a venue'],
      trim: true,
    },

    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },

      coordinates: {
        type: [Number],
        required: [true, 'Please provide event coordinates'],
      },

      address: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },
    },

    state: {
      type: String,
      required: [true, 'An event must have a state'],
      enum: {
        values: [
          'Lagos',
          'Ogun',
          'Oyo',
          'Osun',
          'Ondo',
          'Ekiti',
          'Delta',
          'Rivers',
          'Abuja',
          'Kano',
          'Kaduna',
          'Enugu',
          'Anambra',
          'Imo',
          'Cross River',
          'Akwa Ibom',
          'Edo',
          'Kogi',
          'Nasarawa',
          'Benue',
          'Plateau',
          'Taraba',
          'Bauchi',
          'Gombe',
          'Yobe',
          'Borno',
          'Adamawa',
          'Sokoto',
          'Katsina',
          'Jigawa',
          'Kebbi',
          'Zamfara',
          'Kwara',
          'others',
        ],
        message: 'Please select a valid Nigerian state',
      },
    },

    city: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'An event must have a start date'],

      validate: {
        validator: function (val) {
          return val >= Date.now();
        },
        message: 'Event cannot start in the past.',
      },
    },

    endDate: {
      type: Date,

      validate: {
        validator: function (val) {
          // Only works on CREATE and SAVE
          return !val || val >= this.startDate;
        },
        message: 'End date must be after the start date.',
      },
    },
    imageCover: {
      type: String,
      required: [true, 'An event must have a cover image'],
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'unpublished'],
        message: 'Status must be draft, published or unpublished',
      },
      default: 'draft',
    },

    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An event must have an owner'],
    },

    ticketTypes: [
      {
        name: {
          type: String,
          required: [true, 'Ticket type must have a name'],
          trim: true,
        },

        price: {
          type: Number,
          required: [true, 'Ticket must have a price'],
          min: [0, 'Ticket price cannot be negative'],
        },

        quantity: {
          type: Number,
          required: [true, 'Ticket quantity is required'],
          min: [1, 'Ticket quantity must be at least 1'],
        },

        sold: {
          type: Number,
          default: 0,

          validate: {
            validator: function (val) {
              return val <= this.quantity;
            },
            message: 'Sold tickets cannot exceed available quantity.',
          },
        },
      },
    ],

    totalTickets: {
      type: Number,
      default: 0,
      min: [0, 'Total tickets cannot be negative'],
    },

    organizers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,

    tags: {
      type: [String],
      default: [],
    },

    ageRestriction: {
      type: Number,
      min: [0, 'Age restriction cannot be negative'],
      max: [21, 'Age restriction cannot exceed 21'],
    },

    currency: {
      type: String,
      default: 'NGN',
      enum: {
        values: ['NGN', 'USD', 'EUR', 'GBP'],
        message: 'Unsupported currency',
      },
    },

    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

eventSchema.index({ location: '2dsphere' });
eventSchema.index({ slug: 1 });
// ADD INDEX FOR STATE FOR BETTER FILTERING PERFORMANCE
eventSchema.index({ state: 1 });
eventSchema.index({ category: 1, state: 1 }); // Compound index for category + state filtering

eventSchema.index({ startDate: 1 });

eventSchema.index({
  featured: 1,
  startDate: 1,
});

eventSchema.index({
  status: 1,
  startDate: 1,
});

eventSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }

  if (this.isModified('ticketTypes')) {
    this.totalTickets = this.ticketTypes.reduce(
      (sum, type) => sum + type.quantity,
      0,
    );
  }
});

eventSchema.virtual('availableTickets').get(function () {
  const ticketTypes = this.ticketTypes || [];

  return ticketTypes.reduce((total, ticket) => {
    return total + (ticket.quantity - ticket.sold);
  }, 0);
});

eventSchema.virtual('soldTickets').get(function () {
  const ticketTypes = this.ticketTypes || [];

  return ticketTypes.reduce((total, ticket) => {
    return total + ticket.sold;
  }, 0);
});

eventSchema.virtual('isUpcoming').get(function () {
  return this.startDate > Date.now();
});

eventSchema.virtual('isOngoing').get(function () {
  const now = Date.now();

  return this.startDate <= now && (!this.endDate || this.endDate >= now);
});

eventSchema.virtual('hasEnded').get(function () {
  return this.endDate && this.endDate < Date.now();
});

eventSchema.pre(/^find/, function () {
  this.find({
    isDeleted: false,
    status: { $ne: 'unpublished' },
  });

  this.populate({
    path: 'owner',
    select: 'name email photo',
  });

  this.populate({
    path: 'organizers',
    select: 'name email role',
  });

  this.start = Date.now();
});

eventSchema.post(/^find/, function (docs) {
  console.log(`Query took ${Date.now() - this.start} ms`);
});

eventSchema.pre('aggregate', function () {
  this.pipeline().unshift({
    $match: {
      isDeleted: { $ne: true },
      status: { $ne: 'unpublished' },
    },
  });

  console.log(this.pipeline());
});

// Event duration in days
eventSchema.virtual('durationDays').get(function () {
  if (!this.startDate || !this.endDate) return null;

  const diff = this.endDate - this.startDate;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Tickets remaining
eventSchema.virtual('ticketsRemaining').get(function () {
  const ticketTypes = this.ticketTypes || [];

  return ticketTypes.reduce((total, ticket) => {
    return total + (ticket.quantity - ticket.sold);
  }, 0);
});

// Percentage of tickets sold
eventSchema.virtual('soldPercentage').get(function () {
  if (this.totalTickets === 0) return 0;

  return Math.round((this.soldTickets / this.totalTickets) * 100);
});

// Whether event is sold out
eventSchema.virtual('isSoldOut').get(function () {
  return this.soldTickets >= this.totalTickets;
});

// Revenue generated
eventSchema.virtual('revenue').get(function () {
  const ticketTypes = this.ticketTypes || [];

  return ticketTypes.reduce((total, ticket) => {
    return total + ticket.price * ticket.sold;
  }, 0);
});

// eventSchema.virtual('attendees', {
//   ref: 'Ticket',
//   foreignField: 'event',
//   localField: '_id',
// });

// eventSchema.pre(/^find/, function (next) {
//   console.log('Find middleware running...');
// });
module.exports = mongoose.model('Event', eventSchema);
