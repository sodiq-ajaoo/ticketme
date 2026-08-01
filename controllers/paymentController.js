const axios = require('axios');
const Payment = require('../models/paymentModel');
const Ticket = require('../models/ticketModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const sendEmail = require('../utils/sendEmail');
const sendEmail = require('../utils/email');
const generateQrCode = require('../utils/generateQrCode');

exports.initializePayment = catchAsync(async (req, res, next) => {
  const { ticketIds } = req.body;

  if (!ticketIds || !ticketIds.length) {
    return next(new AppError('Please provide ticket IDs.', 400));
  }

  // Find all tickets
  const tickets = await Ticket.find({
    _id: { $in: ticketIds },
  }).populate('buyer');

  if (!tickets.length) {
    return next(new AppError('No tickets found.', 404));
  }

  // Validate ownership & status
  for (const ticket of tickets) {
    if (ticket.buyer._id.toString() !== req.user.id) {
      return next(
        new AppError(
          'You do not have permission to pay for these tickets.',
          403,
        ),
      );
    }

    if (ticket.status !== 'reserved') {
      return next(
        new AppError(
          'One or more tickets are no longer awaiting payment.',
          400,
        ),
      );
    }
  }

  // Calculate total amount
  const totalAmount = tickets.reduce(
    (sum, ticket) => sum + ticket.totalPrice,
    0,
  );

  // Generate payment reference
  const reference = `PAY-${Date.now()}`;

  // Save payment
  const payment = await Payment.create({
    tickets: ticketIds,
    buyer: req.user._id,
    amount: totalAmount,
    reference,
  });

  // Initialize Paystack
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email: tickets[0].buyer.email,
      amount: totalAmount * 100, // Kobo
      reference,
      callback_url: 'http://localhost:5173/payment-success',
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      payment,
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference,
    },
  });
});

// exports.verifyPayment = catchAsync(async (req, res, next) => {
//   const { reference } = req.params;

//   // Prevent duplicate verification
//   if (payment.status === 'success') {
//     const tickets = await Ticket.find({
//       _id: { $in: payment.tickets },
//     })
//       .populate('buyer', 'name email')
//       .populate('event', 'name');

//     const ticketsWithQr = await Promise.all(
//       tickets.map(async (ticket) => ({
//         ...ticket.toObject(),
//         qrCode: await generateQrCode(ticket.ticketCode),
//       })),
//     );

//     return res.status(200).json({
//       status: 'success',
//       message: 'Payment already verified.',
//       data: {
//         payment,
//         tickets: ticketsWithQr,
//       },
//     });
//   }

//   // Find payment
//   const payment = await Payment.findOne({ reference });

//   if (!payment) {
//     return next(new AppError('Payment not found.', 404));
//   }

//   // // Prevent duplicate verification
//   // if (payment.status === 'success') {
//   //   return res.status(200).json({
//   //     status: 'success',
//   //     message: 'Payment already verified.',
//   //     data: { payment },
//   //   });
//   // }

//   // Prevent duplicate verification
//   if (payment.status === 'success') {
//     const tickets = await Ticket.find({
//       _id: { $in: payment.tickets },
//     })
//       .populate('buyer', 'name email')
//       .populate('event', 'name');

//     const ticketsWithQr = await Promise.all(
//       tickets.map(async (ticket) => ({
//         ...ticket.toObject(),
//         qrCode: await generateQrCode(ticket.ticketCode),
//       })),
//     );

//     return res.status(200).json({
//       status: 'success',
//       message: 'Payment already verified.',
//       data: {
//         payment,
//         tickets: ticketsWithQr,
//       },
//     });
//   }

//   // Verify with Paystack
//   const response = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     },
//   );

//   const paystackPayment = response.data.data;

//   if (paystackPayment.status !== 'success') {
//     return next(new AppError('Payment was not successful.', 400));
//   }

//   // Update payment
//   payment.status = 'success';
//   payment.paidAt = new Date();
//   await payment.save();

//   // Fetch all purchased tickets
//   const tickets = await Ticket.find({
//     _id: { $in: payment.tickets },
//   })
//     .populate('buyer', 'name email')
//     .populate('event', 'name');

//   if (!tickets.length) {
//     return next(new AppError('No tickets found for this payment.', 404));
//   }

//   // Mark all tickets as paid
//   for (const ticket of tickets) {
//     ticket.status = 'paid';
//     ticket.paymentReference = payment.reference;
//     await ticket.save();
//   }

//   // Generate QR codes
//   const ticketsWithQr = await Promise.all(
//     tickets.map(async (ticket) => ({
//       ...ticket.toObject(),
//       qrCode: await generateQrCode(ticket.ticketCode),
//     })),
//   );

//   // Build email ticket list
//   const ticketList = tickets
//     .map(
//       (ticket) => `
//         <li>
//           <strong>${ticket.ticketTypeName}</strong>
//           × ${ticket.quantity}
//           — ₦${ticket.totalPrice.toLocaleString()}
//         </li>
//       `,
//     )
//     .join('');

//   // Send confirmation email once
//   await sendEmail({
//     email: tickets[0].buyer.email,
//     subject: '🎉 Your Tickets are Confirmed',
//     html: `
//       <h2>Payment Successful</h2>

//       <p>Hello ${tickets[0].buyer.name},</p>

//       <p>Your payment has been received successfully.</p>

//       <h3>Event</h3>
//       <p><strong>${tickets[0].event.name}</strong></p>

//       <h3>Your Tickets</h3>
//       <ul>
//         ${ticketList}
//       </ul>

//       <p>Your tickets are now active.</p>

//       <p>Thank you for choosing <strong>TicketMe</strong>.</p>
//     `,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       payment,
//       tickets: ticketsWithQr,
//     },
//   });
// });

// exports.verifyPayment = catchAsync(async (req, res, next) => {
//   const { reference } = req.params;

//   // Find payment
//   const payment = await Payment.findOne({ reference });

//   if (!payment) {
//     return next(new AppError('Payment not found.', 404));
//   }

//   // Verify with Paystack
//   const response = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     },
//   );

//   const paystackPayment = response.data.data;

//   if (paystackPayment.status !== 'success') {
//     return next(new AppError('Payment was not successful.', 400));
//   }

//   // Update payment
//   payment.status = 'success';
//   payment.paidAt = new Date();

//   await payment.save();

//   // Update ticket
//   // Find the ticket
//   const ticket = await Ticket.findById(payment.ticket)
//     .populate('buyer', 'name email')
//     .populate('event', 'name');

//   // Update ticket
//   ticket.status = 'paid';

//   await ticket.save();

//   const qrCode = await generateQrCode(ticket.ticketCode);

//   await sendEmail({
//     email: ticket.buyer.email,
//     subject: '🎉 Your Ticket is Confirmed',
//     html: `
//     <h2>Payment Successful</h2>

//     <p>Hi ${ticket.buyer.name},</p>

//     <p>Your payment has been received successfully.</p>

//     <h3>Event Details</h3>

//     <ul>
//       <li><strong>Event:</strong> ${ticket.event.name}</li>
//       <li><strong>Ticket:</strong> ${ticket.ticketTypeName}</li>
//       <li><strong>Quantity:</strong> ${ticket.quantity}</li>
//       <li><strong>Amount:</strong> ₦${ticket.totalPrice}</li>
//       <li><strong>Ticket Code:</strong> ${ticket.ticketCode}</li>
//     </ul>

//     <p>Please present the QR code below at the event entrance.</p>

//     <img src="${qrCode}" width="250"/>

//     <p>Thank you for choosing TicketMe.</p>
//   `,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       payment,
//       ticket,
//     },
//   });
// });
// const axios = require('axios');
// const Payment = require('../models/paymentModel');
// const Ticket = require('../models/ticketModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// // const sendEmail = require('../utils/sendEmail');
// const sendEmail = require('../utils/email');
// const generateQrCode = require('../utils/generateQrCode');

// exports.initializePayment = catchAsync(async (req, res, next) => {
//   const { ticketId } = req.body;
//   const { ticketIds } = req.body;

//   if (!ticketIds || !ticketIds.length) {
//     return next(new AppError('Please provide ticket IDs.', 400));
//   }

//   // Find ticket
//   console.log('ticketId received:', ticketId);
//   const ticket = await Ticket.findById(ticketId).populate('buyer');

//   // const ticket = await Ticket.findById(ticketId).populate('buyer');

//   console.log('ticket found:', ticket);

//   // if (!ticket) {
//   //   return next(new AppError('Ticket not found.', 404));
//   // }

//   // // User must own the ticket
//   // if (ticket.buyer._id.toString() !== req.user.id) {
//   //   return next(
//   //     new AppError('You do not have permission to pay for this ticket.', 403),
//   //   );
//   // }

//   // // Ticket must still be reserved
//   // if (ticket.status !== 'reserved') {
//   //   return next(
//   //     new AppError('This ticket is no longer awaiting payment.', 400),
//   //   );
//   // }

//   if (!tickets.length) {
//     return next(new AppError('No tickets found.', 404));
//   }

//   for (const ticket of tickets) {
//     if (ticket.buyer._id.toString() !== req.user.id) {
//       return next(
//         new AppError(
//           'You do not have permission to pay for these tickets.',
//           403,
//         ),
//       );
//     }

//     if (ticket.status !== 'reserved') {
//       return next(
//         new AppError(
//           'One or more tickets are no longer awaiting payment.',
//           400,
//         ),
//       );
//     }
//   }

//   // Generate payment reference

//   const reference = `PAY-${Date.now()}`;

//   // Save payment record
//   const payment = await Payment.create({
//     ticket: ticket._id,
//     buyer: req.user._id,
//     amount: ticket.totalPrice,
//     reference,
//   });

//   // Call Paystack
//   const response = await axios.post(
//     'https://api.paystack.co/transaction/initialize',
//     {
//       email: ticket.buyer.email,
//       amount: ticket.totalPrice * 100, // Kobo
//       reference,
//       callback_url: 'http://localhost:3000/payment-success',
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     },
//   );

//   res.status(200).json({
//     status: 'success',
//     data: {
//       payment,
//       authorization_url: response.data.data.authorization_url,
//       access_code: response.data.data.access_code,
//       reference,
//     },
//   });
// });

// exports.verifyPayment = catchAsync(async (req, res, next) => {
//   const { reference } = req.params;

//   // Find payment
//   const payment = await Payment.findOne({ reference });

//   if (!payment) {
//     return next(new AppError('Payment not found.', 404));
//   }

//   // Verify with Paystack
//   const response = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     },
//   );

//   const paystackPayment = response.data.data;

//   if (paystackPayment.status !== 'success') {
//     return next(new AppError('Payment was not successful.', 400));
//   }

//   // Update payment
//   payment.status = 'success';
//   payment.paidAt = new Date();

//   await payment.save();

//   // Update ticket
//   // Find the ticket
//   const ticket = await Ticket.findById(payment.ticket)
//     .populate('buyer', 'name email')
//     .populate('event', 'name');

//   // Update ticket
//   ticket.status = 'paid';

//   await ticket.save();

//   const qrCode = await generateQrCode(ticket.ticketCode);

//   await sendEmail({
//     email: ticket.buyer.email,
//     subject: '🎉 Your Ticket is Confirmed',
//     html: `
//     <h2>Payment Successful</h2>

//     <p>Hi ${ticket.buyer.name},</p>

//     <p>Your payment has been received successfully.</p>

//     <h3>Event Details</h3>

//     <ul>
//       <li><strong>Event:</strong> ${ticket.event.name}</li>
//       <li><strong>Ticket:</strong> ${ticket.ticketTypeName}</li>
//       <li><strong>Quantity:</strong> ${ticket.quantity}</li>
//       <li><strong>Amount:</strong> ₦${ticket.totalPrice}</li>
//       <li><strong>Ticket Code:</strong> ${ticket.ticketCode}</li>
//     </ul>

//     <p>Please present the QR code below at the event entrance.</p>

//     <img src="${qrCode}" width="250"/>

//     <p>Thank you for choosing TicketMe.</p>
//   `,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       payment,
//       ticket,
//     },
//   });
// });

// exports.verifyPayment = catchAsync(async (req, res, next) => {
//   const { reference } = req.params;

//   // Find payment
//   const payment = await Payment.findOne({ reference });

//   if (!payment) {
//     return next(new AppError('Payment not found.', 404));
//   }

//   // Verify Paystack payment
//   const response = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     },
//   );

//   const paystackPayment = response.data.data;

//   if (paystackPayment.status !== 'success') {
//     return next(new AppError('Payment was not successful.', 400));
//   }

//   // Update payment
//   payment.status = 'success';
//   payment.paidAt = new Date();

//   await payment.save();

//   // Fetch every ticket
//   const tickets = await Ticket.find({
//     _id: { $in: payment.tickets },
//   })
//     .populate('buyer', 'name email')
//     .populate('event', 'name');

//   // Mark every ticket as paid
//   for (const ticket of tickets) {
//     ticket.status = 'paid';
//     ticket.paymentReference = payment.reference;

//     await ticket.save();
//   }

//   // Generate QR codes
//   const ticketsWithQr = await Promise.all(
//     tickets.map(async (ticket) => ({
//       ...ticket.toObject(),
//       qrCode: await generateQrCode(ticket.ticketCode),
//     })),
//   );

//   // Build email ticket list
//   const ticketList = tickets
//     .map(
//       (ticket) => `
//         <li>
//           ${ticket.ticketTypeName}
//           × ${ticket.quantity}
//           — ₦${ticket.totalPrice.toLocaleString()}
//         </li>
//       `,
//     )
//     .join('');

//   // Email once
//   await sendEmail({
//     email: tickets[0].buyer.email,
//     subject: '🎉 Your Tickets are Confirmed',
//     html: `
//       <h2>Payment Successful</h2>

//       <p>Hello ${tickets[0].buyer.name},</p>

//       <p>Your payment has been received successfully.</p>

//       <h3>Event</h3>

//       <p>${tickets[0].event.name}</p>

//       <h3>Your Tickets</h3>

//       <ul>
//         ${ticketList}
//       </ul>

//       <p>Thank you for choosing TicketMe.</p>
//     `,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       payment,
//       tickets: ticketsWithQr,
//     },
//   });
// });

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { reference } = req.params;

  // Find payment
  const payment = await Payment.findOne({ reference });

  if (!payment) {
    return next(new AppError('Payment not found.', 404));
  }

  // If already verified, return payment and tickets
  if (payment.status === 'success') {
    const tickets = await Ticket.find({
      _id: { $in: payment.tickets },
    })
      .populate('buyer', 'name email')
      .populate('event', 'name');

    const ticketsWithQr = await Promise.all(
      tickets.map(async (ticket) => ({
        ...ticket.toObject(),
        qrCode: await generateQrCode(ticket.ticketCode),
      })),
    );

    return res.status(200).json({
      status: 'success',
      message: 'Payment already verified.',
      data: {
        payment,
        tickets: ticketsWithQr,
      },
    });
  }

  // Verify payment with Paystack
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const paystackPayment = response.data.data;

  if (paystackPayment.status !== 'success') {
    return next(new AppError('Payment was not successful.', 400));
  }

  // Update payment
  // payment.status = 'success';
  // payment.paidAt = new Date();

  // await payment.save();

  // for (const ticket of tickets) {
  //   ticket.status = 'paid';
  //   ticket.paymentReference = payment.reference;
  //   ticket.payment = payment._id;

  //   await ticket.save();
  // }

  // Fetch purchased tickets
  const tickets = await Ticket.find({
    _id: { $in: payment.tickets },
  })
    .populate('buyer', 'name email')
    .populate('event', 'name');

  payment.status = 'success';
  payment.paidAt = new Date();

  await payment.save();

  for (const ticket of tickets) {
    ticket.status = 'paid';
    ticket.paymentReference = payment.reference;
    ticket.payment = payment._id;

    await ticket.save();
  }

  if (!tickets.length) {
    return next(new AppError('No tickets found for this payment.', 404));
  }

  // Mark every ticket as paid
  // for (const ticket of tickets) {
  //   ticket.status = 'paid';
  //   ticket.paymentReference = payment.reference;

  //   await ticket.save();
  // }

  // Generate QR codes
  const ticketsWithQr = await Promise.all(
    tickets.map(async (ticket) => ({
      ...ticket.toObject(),
      qrCode: await generateQrCode(ticket.ticketCode),
    })),
  );

  // Build email ticket list
  const ticketList = tickets
    .map(
      (ticket) => `
        <li>
          <strong>${ticket.ticketTypeName}</strong>
          × ${ticket.quantity}
          — ₦${ticket.totalPrice.toLocaleString()}
        </li>
      `,
    )
    .join('');

  // Send confirmation email
  await sendEmail({
    email: tickets[0].buyer.email,
    subject: '🎉 Your Tickets are Confirmed',
    html: `
      <h2>Payment Successful</h2>

      <p>Hello ${tickets[0].buyer.name},</p>

      <p>Your payment has been received successfully.</p>

      <h3>Event</h3>
      <p><strong>${tickets[0].event.name}</strong></p>

      <h3>Your Tickets</h3>

      <ul>
        ${ticketList}
      </ul>

      <p>Your tickets are now active.</p>

      <p>Thank you for choosing <strong>TicketMe</strong>.</p>
    `,
  });

  res.status(200).json({
    status: 'success',
    data: {
      payment,
      tickets: ticketsWithQr,
    },
  });
});
