const cron = require('node-cron');
const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');

cron.schedule('*/5 * * * *', async () => {
  try {
    const expiry = new Date(Date.now() - 15 * 60 * 1000);

    const expiredTickets = await Ticket.find({
      status: 'reserved',
      createdAt: { $lt: expiry },
    });

    for (const ticket of expiredTickets) {
      const event = await Event.findById(ticket.event);

      if (event) {
        const ticketType = event.ticketTypes.id(ticket.ticketTypeId);

        if (ticketType) {
          ticketType.availableQuantity += ticket.quantity;
        }

        await event.save();
      }

      ticket.status = 'cancelled';
      await ticket.save();
    }

    console.log(`Released ${expiredTickets.length} expired reservations.`);
  } catch (err) {
    console.error(err);
  }
});
