// src/services/gptService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askGpt(message) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || '답변이 없습니다.';
  } catch (error) {
    console.error('❌ GPT 처리 중 오류:', error);

    if (error.status === 429) {
      return '❗요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (Rate limit 초과)';
    }

    if (error.status === 404) {
      return '❗모델이 존재하지 않거나 접근할 수 없습니다. 관리자에게 문의해주세요.';
    }

    if (error.status === 401) {
      return '❗OpenAI 인증에 실패했습니다. API 키를 확인해주세요.';
    }

    return '❗AI 응답 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}