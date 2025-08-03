// src/routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const id = req.query.id;

    if (!id) {
      return cb(new Error('id 쿼리 파라미터가 필요합니다'));
    }

    const dynamicPath = path.join(process.cwd(), 'uploads/profile', id);

    // 폴더가 없으면 생성
    if (!fs.existsSync(dynamicPath)) {
      fs.mkdirSync(dynamicPath, { recursive: true });
    }

    cb(null, dynamicPath);
  },
  filename: function (req, file, cb) {
    const id = req.query.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const uniqueName = `${id}_${timestamp}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /api/upload?id=YOUR_ID
router.post('/upload', (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: 'id 쿼리 파라미터가 필요합니다' });
  }

  // multer 미들웨어 적용
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('업로드 오류:', err);
      return res.status(500).json({ message: '파일 업로드 실패' });
    }

    // 파일이 없는 경우 (수정 시 이미지 유지)
    if (!req.file) {
      return res.json({
        message: '이미지 파일 없음 - 기존 이미지 유지',
        image_url: null,
      });
    }

    const imageUrl = `uploads/profile/${id}/${req.file.filename}`;
    res.json({
      filename: req.file.filename,
      image_url: imageUrl,
    });
  });
});

export default router;