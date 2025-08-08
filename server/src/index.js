import express from 'express';
import cors from 'cors';
import path from 'path';

import naverAuthRouter from './routes/auth/naver.js';
import registeFerretRouter from './routes/registeFerret.js';
import uploadRoutes from './routes/upload.js';
import uploadExtraRouter from './routes/uploadExtra.js';
import extraImageRouter from './routes/extraImage.js';
import likeRoutes from './routes/like.js';
import commentRoutes from './routes/comments.js';
//import commentsRouter from './routes/comments.js';
import ferretInfoRoutes from './routes/ferretInfo.js';
import mcpRouter from './routes/mcp.js';

const app = express();
const BASE_URL = process.env.BASE_URL;
// ✅ 정적 이미지 경로 등록 (/uploads → 실제 uploads 폴더)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ CORS 및 body 파싱
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 라우터 등록
app.use('/api/auth/naver', naverAuthRouter);
app.use('/api', uploadRoutes);           // /api/upload
app.use('/api', registeFerretRouter);    // /api/profiles
app.use('/api', uploadExtraRouter);      // /api/upload-extra
app.use('/api', extraImageRouter);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
//app.use('/api', commentsRouter);
app.use('/api/ferret', ferretInfoRoutes);
app.use('/api/mcp', mcpRouter);
// ✅ 서버 실행
app.listen(5000, () => {
  console.log(`✅ 서버 실행 중: ${BASE_URL}`);
});


