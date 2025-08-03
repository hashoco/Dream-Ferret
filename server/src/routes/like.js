import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// 좋아요 추가
router.post('/', async (req, res) => {
    const { ferret_id, user_id } = req.body;
    if (!ferret_id || !user_id) return res.status(400).json({ message: '필수값 누락' });

    try {
        await db.query('INSERT INTO likes (ferret_id, user_id) VALUES ($1, $2)', [ferret_id, user_id]);
        res.json({ success: true });
    } catch (err) {
        console.error('좋아요 추가 실패', err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 좋아요 취소
router.delete('/', async (req, res) => {
    const { ferret_id, user_id } = req.body;
    if (!ferret_id || !user_id) return res.status(400).json({ message: '필수값 누락' });

    try {
        await db.query('DELETE FROM likes WHERE ferret_id = $1 AND user_id = $2', [ferret_id, user_id]);
        res.json({ success: true });
    } catch (err) {
        console.error('좋아요 삭제 실패', err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 특정 프로필의 좋아요 수 조회
router.get('/:ferret_id/count', async (req, res) => {
    const { ferret_id } = req.params;

    try {
        const result = await db.query('SELECT COUNT(*) FROM likes WHERE ferret_id = $1', [ferret_id]);
        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error('좋아요 수 조회 실패', err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 유저가 해당 프로필 좋아요 눌렀는지 여부 확인
router.get('/check', async (req, res) => {
    const { ferret_id, user_id } = req.query;

    try {
        const result = await db.query('SELECT 1 FROM likes WHERE ferret_id = $1 AND user_id = $2', [ferret_id, user_id]);
        res.json({ liked: result.rows.length > 0 });
    } catch (err) {
        console.error('좋아요 여부 확인 실패', err);
        res.status(500).json({ message: '서버 오류' });
    }
});
// likes.js
// routes/likes.js
router.get('/', async (req, res) => {
    const { ferret_id } = req.query;
    
    try {
        const result = await db.query(
            'SELECT * FROM likes WHERE ferret_id = $1',
            [ferret_id]
        );

        res.json({ liked: result.rows.length > 0 });
    } catch (err) {
        console.error('좋아요 조회 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
});
export default router;