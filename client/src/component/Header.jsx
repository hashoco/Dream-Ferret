import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  //console.log('API_BASE:', import.meta.env.VITE_API_BASE_URL);
  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/naver/login`;
  };
  return (
    <header className="bg-white border-b border-[#e6dac5] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* 로고 + 제목 */}
        <div className="flex items-center space-x-3">
          <img
            src="/ferret_logo.jpg"
            alt="로이 로고"
            className="w-10 h-10 rounded-md object-cover border border-orange-200 shadow"
          />
          <h1
            className="text-lg sm:text-xl font-bold text-orange-500 tracking-tight"
            style={{ fontFamily: "'Poor Story', sans-serif" }}
          >
            <a href="/">페럿의꿈꾸는다락방</a>
          </h1>
        </div>

        {/* 햄버거 메뉴 (모바일) */}
        <button
          className="sm:hidden text-orange-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden sm:flex items-center gap-5 text-sm text-stone-700">
          <a href="/aboutFerret" className="hover:text-orange-500 transition">아이들이야기</a>
          <a href="/ferretInfo" className="hover:text-orange-500 transition">아이들 소개</a>

          {user && (
            <a href="/registerPage" className="hover:text-orange-500 transition">정보등록</a>
          )}
          {user ? (
            <>
              <span className="text-stone-500 text-sm hidden sm:inline">
                {user.name || user.nickname || '회원'}님 환영해요
              </span>
              <button
                onClick={logout}
                className="bg-orange-400 text-white px-3 py-1.5 rounded-full text-sm hover:bg-orange-500 shadow"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm hover:bg-emerald-600 shadow"
            >
              로그인
            </button>
          )}
        </nav>
      </div>

      {/* 모바일 메뉴 토글 */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 text-sm text-stone-700">
          <a href="/" className="block hover:text-orange-500">홈</a>
          <a href="/aboutFerret" className="block hover:text-orange-500">자랑하기</a>
          {user && (
            <a href="/registerPage" className="block hover:text-orange-500">정보등록</a>
          )}
          {user ? (
            <>
              <span className="block text-stone-500 text-sm">
                {user.name || user.nickname || '회원'}님 환영해요
              </span>
              <button
                onClick={logout}
                className="w-full text-left bg-orange-400 text-white px-3 py-1.5 rounded hover:bg-orange-500"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogin();
              }}
              className="w-full text-left bg-emerald-500 text-white px-3 py-1.5 rounded hover:bg-emerald-600"
            >
              로그인
            </button>
          )}
        </div>
      )}
    </header>
  );
}