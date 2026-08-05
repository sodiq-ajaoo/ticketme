const PDFDocument = require('pdfkit');

const generateTicketPdf = (ticket, qrCodeBuffer, res) => {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  const PRIMARY = '#2563eb';
  const DARK = '#111827';
  const LIGHT = '#f3f4f6';
  const SUCCESS = '#16a34a';

  // Response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=ticket-${ticket.ticketCode}.pdf`,
  );

  doc.pipe(res);

  // ==========================
  // HEADER
  // ==========================

  doc.rect(0, 0, doc.page.width, 90).fill(PRIMARY);

  doc
    .fillColor('white')
    .font('Helvetica-Bold')
    .fontSize(28)
    .text('TicketMe', 50, 25);

  doc.font('Helvetica').fontSize(13).text('Digital Event Ticket', 50, 60);

  // ==========================
  // EVENT
  // ==========================

  doc.moveDown(3);

  doc
    .fillColor(DARK)
    .font('Helvetica-Bold')
    .fontSize(22)
    .text(ticket.event.name);

  doc.moveDown(0.5);

  doc.font('Helvetica').fontSize(13).fillColor('#555');

  if (ticket.event.venue) {
    doc.text(`Venue: ${ticket.event.venue}`);
  }

  if (ticket.event.startDate) {
    doc.text(`Date: ${new Date(ticket.event.startDate).toLocaleDateString()}`);
  }

  // ==========================
  // DIVIDER
  // ==========================

  doc.moveDown();

  doc
    .strokeColor('#dddddd')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown();

  // ==========================
  // BUYER DETAILS
  // ==========================

  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(16).text('Attendee');

  doc.moveDown(0.3);

  doc.font('Helvetica').fontSize(13).fillColor('#444');

  doc.text(`Name: ${ticket.buyer.name}`);
  doc.text(`Email: ${ticket.buyer.email}`);

  // ==========================
  // TICKET DETAILS
  // ==========================

  doc.moveDown();

  doc
    .fillColor(DARK)
    .font('Helvetica-Bold')
    .fontSize(16)
    .text('Ticket Details');

  doc.moveDown(0.3);

  doc.font('Helvetica').fontSize(13).fillColor('#444');

  doc.text(`Ticket Type: ${ticket.ticketTypeName}`);
  doc.text(`Quantity: ${ticket.quantity}`);

  doc.text(`Amount Paid: NGN ${ticket.totalPrice.toLocaleString()}`);

  doc.moveDown();

  // doc
  //   .fillColor(SUCCESS)
  //   .font('Helvetica-Bold')
  //   .fontSize(14)
  //   .text(`Ticket Code: ${ticket.ticketCode}`);

  doc
    .fillColor(SUCCESS)
    .font('Helvetica-Bold')
    .fontSize(13)
    .text('Ticket Code');

  // doc.fillColor('#444').font('Helvetica').fontSize(10).text(ticket.ticketCode, {
  //   width: 260,
  // });

  doc.fillColor('#555').font('Helvetica').fontSize(9).text(ticket.ticketCode, {
    width: 260,
  });
  // ==========================
  // QR CODE
  // ==========================

  if (qrCodeBuffer) {
    doc.image(qrCodeBuffer, 370, 250, {
      fit: [150, 150],
      align: 'center',
    });

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#666')
      .text('Present this QR code at the event entrance.', 340, 410, {
        width: 190,
        align: 'center',
      });
  }

  // ==========================
  // FOOTER
  // ==========================

  doc.moveDown(8);

  doc
    .fontSize(10)
    .fillColor('#999')
    .text('Powered by TicketMe • Please keep this ticket safe.', {
      align: 'center',
    });

  doc.end();
};

module.exports = generateTicketPdf;
