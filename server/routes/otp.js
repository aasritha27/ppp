import express from 'express';

const router = express.Router();

router.post('/send', (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ success: false, error: 'Mobile number is required' });
  }
  // Mock sending OTP
  console.log(`Sending mock OTP 123456 to ${mobileNumber}`);
  res.json({ success: true, message: 'OTP sent successfully' });
});

router.post('/verify', (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (otp === '123456') {
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
});

export default router;
