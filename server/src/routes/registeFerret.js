import express from 'express';
import db from '../config/db.js';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

const router = express.Router();

async function generateCustomId() {
  const today = dayjs().format('YYYYMMDD');
  const result = await db.query(
    `SELECT id FROM ferret_profiles WHERE id LIKE $1 ORDER BY id DESC LIMIT 1`,
    [`${today}_%`]
  );

  let seq = 1;
  if (result.rows.length > 0) {
    const last = result.rows[0].id;
    const parts = last.split('_');
    const numPart = parseInt(parts[1]);
    seq = isNaN(numPart) ? 1 : numPart + 1;
  }

  return `${today}_${String(seq).padStart(4, '0')}`;
}

// ✅ ID 미리 생성용 엔드포인트
router.get('/profiles/id', async (req, res) => {
  try {
    const id = await generateCustomId();
    res.json({ id });
  } catch (err) {
    console.error('ID 생성 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 등록
router.post('/profiles', async (req, res) => {
  try {
    const {
      id,
      user_id,
      email,
      name,
      gender,
      age,
      birthday,
      snack,
      tags,
      description,
      notes,
      image_url
    } = req.body;

   // console.log(id)
   // console.log(user_id)
  //  console.log(email)
  //  console.log(name)
  //  console.log(image_url)
    if (!id || !user_id || !email || !name || !image_url) {
      return res.status(400).json({ message: '필수 항목 누락' });
    }

    image_url;
    await db.query(
      `INSERT INTO ferret_profiles (
        id, user_id, email, name, gender, age, birthday,
        snack, tags, description, notes, image_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12
      )`,
      [
        id,
        user_id,
        email,
        name,
        gender,
        age,
        birthday,
        snack,
        tags,
        description,
        notes,
        image_url
      ]
    );

    res.status(201).json({ message: '등록 성공', id });
  } catch (err) {
    console.error('등록 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 조회 (user_id별)
router.get('/profiles', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id가 필요합니다' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM ferret_profiles WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    const profiles = result.rows;

    // 각 프로필마다 extra 이미지 조회
    for (const profile of profiles) {
      const extra = await db.query(
        'SELECT image_url FROM ferret_extra_images WHERE ferret_id = $1 ORDER BY image_url',
        [profile.id]
      );
      profile.extra_images = extra.rows.map(row => row.image_url); // 배열로 저장
    }

    res.json(profiles);

  } catch (err) {
    console.error('프로필 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

router.put('/profiles/:id', async (req, res) => {
  const { id } = req.params;
  const {
    user_id, email, name, gender, age, birthday, snack, tags, description, notes, image_url
  } = req.body;

  try {
    // 기존 이미지 조회
    const oldResult = await db.query('SELECT image_url FROM ferret_profiles WHERE id = $1', [id]);
    const oldImageUrl = oldResult.rows[0]?.image_url;

    // 이미지가 변경되었을 경우 기존 이미지 삭제
    const newImageFullUrl = image_url.startsWith('uploads/')
      ? image_url
      : `uploads/${image_url}`;

    if (oldImageUrl && oldImageUrl !== newImageFullUrl) {
      const oldPath = path.join(process.cwd(), oldImageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await db.query(
      `UPDATE ferret_profiles SET
        user_id = $1, email = $2, name = $3, gender = $4, age = $5, birthday = $6,
        snack = $7, tags = $8, description = $9, notes = $10, image_url = $11
       WHERE id = $12`,
      [user_id, email, name, gender, age, birthday, snack, tags, description, notes, newImageFullUrl, id]
    );

    res.json({ message: '수정 성공' });
  } catch (err) {
    console.error('수정 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});
router.delete('/profiles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // ✅ 프로필 이미지 경로 가져오기
    const oldResult = await db.query(
      'SELECT image_url FROM ferret_profiles WHERE id = $1',
      [id]
    );
    const oldImageUrl = oldResult.rows[0]?.image_url;

    if (oldImageUrl) {
      const imagePath = path.join(process.cwd(), oldImageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // 프로필 이미지 삭제
      }

      const folderPath = path.dirname(imagePath);
      const remaining = fs.readdirSync(folderPath);
      if (remaining.length === 0) {
        fs.rmdirSync(folderPath); // 프로필 폴더 삭제
      }
    }

    // ✅ 추가 이미지 폴더 삭제 (uploads/extra/{id})
    const extraPath = path.join(process.cwd(), 'uploads/extra', id);
    if (fs.existsSync(extraPath)) {
      const files = fs.readdirSync(extraPath);
      for (const file of files) {
        fs.unlinkSync(path.join(extraPath, file));
      }
      fs.rmdirSync(extraPath);
    }

    // ✅ DB에서 삭제
    await db.query('DELETE FROM ferret_profiles WHERE id = $1', [id]);
    res.json({ message: '삭제 성공' });
  } catch (err) {
    console.error('삭제 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});
// ✅ 전체 공개 조회
router.get('/profiles/public', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM ferret_profiles ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('전체 프로필 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;