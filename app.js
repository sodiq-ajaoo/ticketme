const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const eventRouter = require('./routes/eventRouter');
const userRouter = require('./routes/userRouter');
const ticketRouter = require('./routes/ticketRouter');
const cors = require('cors');
const paymentRouter = require('./routes/paymentRouter');
const dashboardRouter = require('./routes/dashboardRouter');
const scannerRouter = require('./routes/scannerRouter');
const scannerAuthRouter = require('./routes/scannerAuthRouter');
const checkInRouter = require('./routes/checkInRouter');
const scannerDashboardRouter = require('./routes/scannerDashboardRouter');
const attendeeRouter = require('./routes/attendeeRouter');
const analyticsRouter = require('./routes/analyticsRouter');

const app = express();

console.log('✅ CHECK IN CONTROLLER LOADED');
// app.use(cors());
// app.options('/*', cors());
// app.use(cors());
// app.options('/{*any}', cors());

// const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// Security headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// const app = express();

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  max: 10000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});

app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization
// app.use(mongoSanitize());

// Cookie parser
app.use(cookieParser());

// XSS protection
// app.use(xss());

// Prevent parameter pollution

app.use(
  hpp({
    whitelist: ['price', 'category', 'date', 'location'],
  }),
);
// Compression
app.use(compression());

// Static files
app.use(express.static(`${__dirname}/public`));

// Request time
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

// Routes
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/scanners', scannerRouter);
app.use('/api/v1/scanners', scannerAuthRouter);
app.use('/api/v1/check-in', checkInRouter);
app.use('/api/v1/scanner-dashboard', scannerDashboardRouter);
app.use('/api/v1/attendees', attendeeRouter);

app.use('/api/v1/analytics', analyticsRouter);

// Unknown routes
app.all('/*splat', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
