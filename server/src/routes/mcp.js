import express from 'express';
import db from '../config/db.js';
import { parseQuestion } from '../utils/questionParser.js';
import { askGpt } from '../services/gptService.js';

const router = express.Router();

// ✅ 사용자별 최근 질문 시간 저장용 메모리 맵
const lastQuestionTimestamps = new Map();
const QUESTION_COOLDOWN_MS = 60000; // 1분 간격 제한

router.post('/', async (req, res) => {
  try {
    const { message, user_id } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ answer: '질문을 입력해주세요.' });
    }

    // ✅ user_id가 없으면 IP로 대체하여 제한
    const userKey = user_id || req.ip;

    const now = Date.now();
    const last = lastQuestionTimestamps.get(userKey);

    if (last && now - last < QUESTION_COOLDOWN_MS) {
      const waitSec = ((QUESTION_COOLDOWN_MS - (now - last)) / 1000).toFixed(1);
      return res.status(429).json({
        answer: `⏳ 너무 빠르게 질문하고 있어요. ${waitSec}초 후에 다시 시도해주세요.`,
      });
    }

    lastQuestionTimestamps.set(userKey, now); // 최근 질문 시간 저장

    const { name, type } = await parseQuestion(message);
    let gptPrompt = '';

    if (type === 'birth') {
      const result = await db.query(
        `SELECT birthday FROM ferret_profiles WHERE name = $1`,
        [name]
      );
      const birthday = result.rows[0]?.birthday;
      if (!birthday) {
        gptPrompt = `"${name}"의 생일 정보는 없어요. 하지만 일반적으로 페럿의 생일에 대해 "${message}"에 자연스럽게 대답해줘.`;
      } else {
        gptPrompt = `${name}의 생일은 ${birthday}입니다. 사용자의 질문 "${message}"에 자연스럽게 대답해줘.`;
      }
    } else if (type === 'snack') {
      const result = await db.query(
        `SELECT snack FROM ferret_profiles WHERE name = $1`,
        [name]
      );
      const snack = result.rows[0]?.snack;
      if (!snack) {
        gptPrompt = `"${name}"의 간식 정보는 없어요. 일반적으로 페럿이 좋아하는 간식을 참고해 "${message}"에 맞게 따뜻하게 답해줘.`;
      } else {
        gptPrompt = `${name}는 "${snack}"을(를) 좋아해요. "${message}"이라는 질문에 맞게 따뜻하고 친근하게 대답해줘.`;
      }
    } else if (type === 'personality') {
      const result = await db.query(
        `SELECT tags FROM ferret_profiles WHERE name = $1`,
        [name]
      );
      const tags = result.rows[0]?.tags;
      if (!tags || tags.length === 0) {
        gptPrompt = `"${name}"의 성격 정보는 없지만, 일반적으로 페럿 성격에 대해 "${message}"에 감성적으로 답해줘.`;
      } else {
        const tagList = tags.join(', ');
        gptPrompt = `${name}의 성격은 ${tagList}입니다. "${message}"에 감성적이고 따뜻하게 대답해줘.`;
      }
    } else if (type === 'oldest') {
      const result = await db.query(
        `SELECT name, age FROM ferret_profiles ORDER BY age DESC LIMIT 1`
      );
      const ferret = result.rows[0];
      if (!ferret) {
        gptPrompt = `가장 나이 많은 아이에 대한 정보는 없지만, 일반적으로 페럿의 수명이나 노령 특징을 바탕으로 "${message}"에 대답해줘.`;
      } else {
        gptPrompt = `가장 나이 많은 아이는 ${ferret.name}이고, 나이는 ${ferret.age}살이에요. "${message}"이라는 질문에 자연스럽게 대답해줘.`;
      }
    } else if (type === 'fallback') {
      gptPrompt = `사용자가 "${message}"이라고 물었어요. DB에 정확한 정보는 없지만, 페럿에 대한 일반적인 지식을 바탕으로 따뜻하고 부드럽게 대답해줘.`;
    } else {
      gptPrompt = `사용자가 "${message}"라고 물었어요. 
질문은 DB에 있는 프로필과는 무관하지만, 페럿에 대한 일반적인 지식이나 조언을 바탕으로 따뜻하고 부드럽게 대답해줘.`;
    }

    const gptAnswer = await askGpt(gptPrompt);
    return res.json({ answer: gptAnswer });
  } catch (err) {
    console.error('❌ MCP 처리 중 서버 내부 오류:', err);
    return res
      .status(500)
      .json({ answer: '⚠️ 서버 내부 오류가 발생했습니다.' });
  }
});

export default router;