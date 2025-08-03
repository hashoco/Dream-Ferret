import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';



dotenv.config();
const router = express.Router();

const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

router.get('/login', (req, res) => {
  const state = Math.random().toString(36).substring(2, 15); // CSRF 보호용
  const redirectURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    NAVER_CALLBACK_URL
  )}&state=${state}`;

  res.redirect(redirectURL);
});
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    const tokenRes = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        redirect_uri: NAVER_CALLBACK_URL,
        code,
        state,
      },
    });

    const access_token = tokenRes.data.access_token;

    const profileRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = profileRes.data.response;
    
    const payload = {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      nickname: userInfo.nickname, 
      profile_image: userInfo.profile_image,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // ✅ JSON 응답 대신 프론트로 리디렉션
//    const redirectUrl = `http://localhost:5173/oauth/callback?token=${token}`;
const redirectUrl = `${process.env.CLIENT_URL}/oauth/callback?token=${token}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('네이버 로그인 실패:', err.message);
    return res.status(500).send('로그인 처리 중 오류가 발생했습니다.');
  }
});


export default router;
