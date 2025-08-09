import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import db from '../config/db.js';

const router = express.Router();

const deleteOldExtraImages = async (req, res, next) => {
  const ferretId = req.query.id;
  if (!ferretId) return res.status(400).json({ message: 'id 쿼리 파라미터가 필요합니다' });

  const dir = path.join(process.cwd(), 'uploads/extra', ferretId);

  try {
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir)) {
        fs.unlinkSync(path.join(dir, file));
      }
    }
    await db.query('DELETE FROM ferret_extra_images WHERE ferret_id = $1', [ferretId]);
    next();
  } catch (err) {
    console.error('DB 이미지 삭제 오류:', err);
    return res.status(500).json({ message: 'DB 삭제 오류' });
  }
};

// ✅ 메모리 저장 + 파일 크기 제한(100MB/파일, 최대 8장)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024, files: 8 },
});

router.post('/upload-extra', deleteOldExtraImages, upload.array('images', 8), async (req, res) => {
  const ferretId = req.query.id;
  if (!ferretId) return res.status(400).json({ message: 'id 쿼리 파라미터가 필요합니다' });

  const saveDir = path.join(process.cwd(), 'uploads/extra', ferretId);
  fs.mkdirSync(saveDir, { recursive: true });

  try {
    const uploaded = [];

    for (let i = 0; i < (req.files?.length || 0); i++) {
      const file = req.files[i];
      const filename = `${ferretId}_${i + 1}.webp`;
      const filepath = path.join(saveDir, filename);

      await sharp(file.buffer)
        .resize(600, 600, { fit: 'inside' })
        .toFormat('webp')
        .toFile(filepath);

      const imageUrl = `uploads/extra/${ferretId}/${filename}`; // 프론트에서 `${API_BASE}/${image_url}`
      await db.query(
        'INSERT INTO ferret_extra_images (ferret_id, image_url) VALUES ($1, $2)',
        [ferretId, imageUrl]
      );

      uploaded.push({ image_url: imageUrl });
    }

    return res.json({ message: '추가 이미지 업로드 및 저장 성공', files: uploaded });
  } catch (err) {
    console.error('추가 이미지 업로드 오류:', err);
    return res.status(500).json({ message: '이미지 저장 중 오류 발생' });
  }
});

router.get('/upload-extra/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT image_url FROM ferret_extra_images WHERE ferret_id = $1 ORDER BY image_url ASC',
      [id]
    );
    return res.json(result.rows.map(r => r.image_url));
  } catch (err) {
    console.error('추가 이미지 조회 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
