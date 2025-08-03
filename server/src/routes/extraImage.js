// src/routes/extraImage.js
import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// ✅ 특정 ferret_id에 대한 추가 이미지 조회
router.get('/extra-images', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'id 파라미터가 필요합니다' });
  }

  try {
    const result = await db.query(
      'SELECT image_url FROM ferret_extra_images WHERE ferret_id = $1 ORDER BY image_url ASC',
      [id]
    );

    res.json(result.rows); // [{ image_url: '...' }, ...]
  } catch (err) {
    console.error('추가 이미지 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;