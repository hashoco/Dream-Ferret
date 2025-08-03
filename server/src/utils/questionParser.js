import db from '../config/db.js';

export async function parseQuestion(message) {
  const lowerMessage = message.toLowerCase();

  // 1. DB에서 모든 이름 가져오기
  const result = await db.query(`SELECT name FROM ferret_profiles`);
  const allNames = result.rows.map(row => row.name);

  // 2. 메시지에 포함된 이름 찾기
  const name = allNames.find(n => message.includes(n));

  // 3. 질문 유형(type) 판단
  if (lowerMessage.includes('생일')) return { name, type: 'birth' };
  if (lowerMessage.includes('간식')) return { name, type: 'snack' };
  if (lowerMessage.includes('성격') || lowerMessage.includes('어때')) return { name, type: 'personality' };
  if (lowerMessage.includes('나이 많은') || lowerMessage.includes('최고령') || lowerMessage.includes('가장 나이')) return { name: null, type: 'oldest' };

  // 4. 어떤 유형에도 해당하지 않으면 일반 질문 처리
  return { name, type: 'fallback' };
}