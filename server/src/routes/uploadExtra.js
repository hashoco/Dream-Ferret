// src/routes/uploadExtra.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import db from '../config/db.js';

const router = express.Router();

// ✅ 기존 이미지 삭제 미들웨어
const deleteOldExtraImages = async (req, res, next) => {
  const ferretId = req.query.id;
  if (!ferretId) return res.status(400).json({ message: 'id 쿼리 파라미터가 필요합니다' });

  const dir = path.join(process.cwd(), 'uploads/extra', ferretId);

  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      fs.unlinkSync(path.join(dir, file));
    }
  }

  try {
    await db.query('DELETE FROM ferret_extra_images WHERE ferret_id = $1', [ferretId]);
  } catch (err) {
    console.error('DB 이미지 삭제 오류:', err);
    return res.status(500).json({ message: 'DB 삭제 오류' });
  }

  next();
};

// ✅ 메모리 저장 설정
const upload = multer({ storage: multer.memoryStorage() });

// ✅ 리사이즈 + 저장 처리
router.post('/upload-extra', deleteOldExtraImages, upload.array('images', 8), async (req, res) => {
  const ferretId = req.query.id;
  if (!ferretId) return res.status(400).json({ message: 'id 쿼리 파라미터가 필요합니다' });

  const saveDir = path.join(process.cwd(), 'uploads/extra', ferretId);
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

  try {
    const uploadedFilenames = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const filename = `${ferretId}_${i + 1}.webp`;
      const filepath = path.join(saveDir, filename);

      // sharp 리사이징 및 저장
      await sharp(file.buffer)
        .resize(600, 600, { fit: 'inside' })
        .toFormat('webp')
        .toFile(filepath);

      const imageUrl = `uploads/extra/${ferretId}/${filename}`;
      await db.query(
        'INSERT INTO ferret_extra_images (ferret_id, image_url) VALUES ($1, $2)',
        [ferretId, imageUrl]
      );

      uploadedFilenames.push(filename);
    }

    res.json({
      message: '추가 이미지 업로드 및 저장 성공',
      files: uploadedFilenames,
    });
  } catch (err) {
    console.error('추가 이미지 업로드 오류:', err);
    res.status(500).json({ message: '이미지 저장 중 오류 발생' });
  }
});

// ✅ 특정 ferret_id에 해당하는 추가 이미지 조회
router.get('/upload-extra/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT image_url FROM ferret_extra_images WHERE ferret_id = $1 ORDER BY image_url ASC',
      [id]
    );
    res.json(result.rows.map(r => r.image_url));
  } catch (err) {
    console.error('추가 이미지 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;