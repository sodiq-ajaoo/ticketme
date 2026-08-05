const sendEmail = require('./email');
const generateQrCode = require('./generateQrCode');

exports.sendPaymentSuccess = async (user, ticket, event) => {
  const qrCode = await generateQrCode(ticket.ticketCode);

  await sendEmail({
    email: user.email,
    subject: 'Payment Successful',
    message: `Hi ${user.name},

Your payment was successful.

Event: ${event.name}
Ticket: ${ticket.ticketTypeName}
Quantity: ${ticket.quantity}

Thank you.`,
    html: `
      <h2>Payment Successful</h2>
      <p>Hello ${user.name},</p>
      <p>Your payment has been confirmed.</p>

      <ul>
        <li><strong>Event:</strong> ${event.name}</li>
        <li><strong>Ticket:</strong> ${ticket.ticketTypeName}</li>
        <li><strong>Quantity:</strong> ${ticket.quantity}</li>
      </ul>

      <img src="${qrCode}" width="250" />

      <p>Thank you for choosing TicketMe.</p>
    `,
  });
};
