const QRCode = require('qrcode');

module.exports = async (ticketCode) => {
  return QRCode.toDataURL(ticketCode);
};
