import express from 'express';
import { getDB } from '../db/schema.js';

const router = express.Router();

const generateRefNo = () => {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.floor(10000 + Math.random() * 90000);
  return `CMP-${dateStr}-${randomStr}`;
};

router.post('/', (req, res) => {
  try {
    const db = getDB();
    const refNo = generateRefNo();
    const data = req.body;

    const newComplaint = {
      id: db.length + 1,
      referenceNumber: refNo,
      ...data,
      suspectDetails: data.suspectDetails || null,
      witnessInfo: data.witnessInfo || null,
      email: data.email || null,
      status: 'Under Review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.push(newComplaint);

    res.status(201).json({ success: true, referenceNumber: refNo });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

router.get('/:ref', (req, res) => {
  try {
    const db = getDB();
    const complaint = db.find(c => c.referenceNumber === req.params.ref);

    if (complaint) {
      res.json({ success: true, data: complaint });
    } else {
      res.status(404).json({ success: false, error: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

router.get('/', (req, res) => {
  try {
    const db = getDB();
    // sort descending by date
    const complaints = [...db].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

export default router;
