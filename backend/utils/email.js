const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@clothingshop.com',
    to,
    subject,
    html,
    text,
  });
};

const sendOrderConfirmation = async (user, order) => {
  const itemsHtml = order.orderItems
    .map(
      (item) =>
        `<tr>
          <td>${item.name}</td>
          <td>${item.size || '-'}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  await sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <h2>Thank you for your order, ${user.name}!</h2>
      <p>Your order <strong>#${order._id}</strong> has been placed.</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Subtotal:</strong> $${order.itemsPrice.toFixed(2)}</p>
      <p><strong>Shipping:</strong> $${order.shippingPrice.toFixed(2)}</p>
      <p><strong>Tax:</strong> $${order.taxPrice.toFixed(2)}</p>
      <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
    `,
  });
};

module.exports = { sendEmail, sendOrderConfirmation };
