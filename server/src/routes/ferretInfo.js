import express from 'express';
import db from '../config/db.js';

const router = express.Router();
// routes/ferret.js
router.get('/knowledge', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM ferret_knowledge ORDER BY section, order_no`);
    res.json(result.rows);
  } catch (err) {
    console.error('페럿 지식 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});
export default router;