import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// ✅ 댓글 조회
router.get('/', async (req, res) => {
  const { ferret_id } = req.query;
  try {
    const result = await db.query(
      'SELECT * FROM comments WHERE ferret_id = $1 ORDER BY created_at ASC',
      [ferret_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('댓글 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ 댓글 등록
router.post('/', async (req, res) => {
  const { ferret_id, user_id, content } = req.body;
  try {
    await db.query(
      'INSERT INTO comments (ferret_id, user_id, content) VALUES ($1, $2, $3)',
      [ferret_id, user_id, content]
    );
    res.status(201).json({ message: '등록 성공' });
  } catch (err) {
    console.error('댓글 등록 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', async (req, res) => {
  const commentId = req.params.id;

  try {
    const result = await db.query(
      `DELETE FROM comments WHERE id = $1`,
      [commentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error('댓글 삭제 오류:', err);
    
    res.status(500).json({ message: '서버 오류' });
  }
});


export default router;