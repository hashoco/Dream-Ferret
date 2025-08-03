import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { Heart, MessageCircle } from "lucide-react";
import { useAuth } from '../context/AuthContext';

const FerretInfo = () => {
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [ferrets, setFerrets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false); // ✅ 기본 회색 하트
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const { user } = useAuth();
  //console.log(user);
  const userId = user?.naver_id;

  // 👇 컴포넌트 맨 위에 추가
  const maskUserId = (id) => {
    if (!id) return '익명';
    return id.length > 10 ? id.slice(0, 5) + '***' : id;
  };
  // 전체 프로필 조회
  useEffect(() => {
    fetch(`${API_BASE}/api/profiles/public`)
      .then(res => res.json())
      .then(data => setFerrets(data))
      .catch(err => console.error('조회 실패:', err));
  }, []);

  useEffect(() => {
    if (!selected) return;

    fetch(`${API_BASE}/api/comments?ferret_id=${selected.id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error('댓글 조회 실패:', err));
  }, [selected]);

  
  // 특정 프로필 클릭 시 추가 이미지 불러오기
  const handleSelect = (ferret) => {
    setSelected(ferret);
    //console.log(ferret)
    fetch(`${API_BASE}/api/extra-images?id=${ferret.id}`)
      .then(res => res.json())
      .then(data => {
        setExtraImages(data); // 배열 [{ image_url }]
        setCurrent(0); // 첫 슬라이드로 초기화
      })
      .catch(err => console.error('추가 이미지 조회 실패:', err));

    fetch(`${API_BASE}/api/likes?ferret_id=${ferret.id}`)
      .then(res => res.json())
      .then(data => setLiked(data.liked))
      .catch(err => console.error('좋아요 상태 조회 실패:', err));
  };


  const handleLikeToggle = () => {
    const url = `${API_BASE}/api/likes`;
    const payload = {
      user_id: user?.nickname || '비회원',
      ferret_id: selected.id
    };

    fetch(url, {
      method: liked ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) setLiked(!liked);
        else console.error('좋아요 처리 실패');
      })
      .catch(err => console.error('서버 오류:', err));
  };

  const handleCommentSubmit = async () => {
  if (!commentInput.trim()) return;

  const newComment = {
    ferret_id: selected.id,
    user_id: user.nickname || user.naver_id,
    content: commentInput,
  };

  const res = await fetch(`${API_BASE}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  });

  if (res.ok) {
    setCommentInput('');
    // ✅ 댓글 다시 불러오기
                          
    const updated = await fetch(`${API_BASE}/api/comments?ferret_id=${selected.id}`).then(r => r.json());
    setComments(updated);
  } else {
    alert('댓글 등록 실패');
  }
};
  const handleCommentDelete = (commentId) => {
    fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('삭제 실패');
        setComments(prev => prev.filter(c => c.id !== commentId));
      })
      .catch(err => console.error('댓글 삭제 실패:', err));
  };

    
  return (
    <div className="bg-orange-50 py-12 px-6 min-h-screen">
<h2 className="text-4xl text-center mb-12 text-orange-400" style={{ fontFamily: "'Jua', sans-serif" }}>
  🐹 아이들 이야기
</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {ferrets.map((ferret) => (
          <motion.div
            key={ferret.id}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSelect(ferret)}
          >
            <div className="w-64 h-64 overflow-hidden rounded-[36px] shadow-lg">
              <img
                src={`${API_BASE}/${ferret.image_url}`}
                alt={ferret.name}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
            </div>
            <p className="mt-4 text-xl font-semibold">{ferret.name}</p>
          </motion.div>
        ))}
      </div>
      {/* 상세 정보 모달 */}
      {selected && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex relative overflow-hidden"
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-gray-800 z-10"
        onClick={() => setSelected(null)}
      >
        &times;
      </button>

      {/* 좌측: 이미지 영역 */}
      <div className="w-1/2 bg-black relative">
        {extraImages.length > 0 ? (
          <>
            <img
              src={`${API_BASE}/${extraImages[current].image_url}`}
              alt="ferret"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {extraImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`${API_BASE}/${img.image_url}`}
                  className={`w-10 h-10 rounded border-2 cursor-pointer ${
                    idx === current ? 'border-pink-500' : 'border-transparent'
                  }`}
                  onClick={() => setCurrent(idx)}
                  alt={`썸네일${idx + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src={`${API_BASE}/${selected.image_url}`}
            alt="ferret"
            className="w-full h-full object-cover"
          />
        )}
      </div>

    {/* 우측: 소개 및 댓글 (배경 유지 + 내부만 강조) */}
<div className="w-1/2 flex flex-col bg-[#fffaf4] p-6">
  {/* 소개 영역 */}
  <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(80vh - 200px)' }}>
    <h3 className="text-xl font-bold text-[#8b5c2b] mb-2">
      🐾 {selected.name}를 소개합니다
    </h3>
    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
      🎂 {dayjs(selected.birthday).format('YYYY년 M월 D일')}에 우리는 만났고, {selected.age}살이에요.<br />
      🍭 간식은 <span className="font-semibold">{selected.snack}</span>을 좋아해요.<br />
      😊 성격은 {
        Array.isArray(selected.tags)
          ? selected.tags.join(' · ')
          : typeof selected.tags === 'string'
            ? selected.tags.split(',').map(t => t.trim()).join(' · ')
            : '정보 없음'
      }입니다.
    </p>

    {/* 한 줄 소개 */}
    <hr className="my-3 border-t border-gray-300" />
    <h4 className="text-md font-semibold text-[#8b5c2b] mb-1">📝 한 줄 소개</h4>
    <div className="h-20 overflow-y-auto px-2 py-1 bg-[#fff4e6] rounded-md shadow-inner">
      <p className="text-gray-800 text-sm whitespace-pre-wrap">{selected.description}</p>
    </div>
  </div>

  {/* 하단: 좋아요 + 댓글 */}
  <div className="mt-4">
    <div className="flex items-center gap-4 mb-2">
      <button onClick={handleLikeToggle} className="transition-colors duration-200">
        <Heart
          fill={liked ? "#ef4444" : "none"}
          color={liked ? "#ef4444" : "#9ca3af"}
          className="w-6 h-6"
        />
      </button>
      <span className="text-sm text-gray-600">댓글 {comments.length}개</span>
    </div>

    {/* 댓글 목록 */}
    <div className="h-48 overflow-y-auto text-sm mb-2 text-gray-700 px-2 py-1 bg-[#fff4e6] rounded-md shadow-inner">
      {comments.length > 0 ? (
        comments.map((c, idx) => (
          <div key={idx} className="flex justify-between items-center mb-1">
            <p>
              <span className="font-bold">@{c.user_id}</span> {c.content}
            </p>
            {(c.user_id === (user?.nickname || user?.naver_id)) && (
              <button
                onClick={() => handleCommentDelete(c.id)}
                className="text-gray-400 hover:text-red-500 text-xs ml-2"
              >
                삭제
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400 italic">댓글이 아직 없어요.</p>
      )}
    </div>

    {/* 댓글 입력 */}
    {user ? (
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          className="flex-1 border rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          className="text-sm text-pink-500 font-semibold"
          onClick={handleCommentSubmit}
        >
          게시
        </button>
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">댓글 작성은 로그인 후 가능합니다.</p>
    )}
  </div>
</div>
    </motion.div>
  </div>
)}
    </div>
  );
};

export default FerretInfo;