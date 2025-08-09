import {
  Instagram,
  MapPin,
  PawPrint,
  ChevronUp
} from 'lucide-react';

export default function SnsFloatingBar() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 데스크탑 우측 고정 바 */}
      <div className="hidden lg:flex fixed right-3 top-1/3 z-50 flex-col items-center space-y-4 bg-white rounded-full py-4 px-2 shadow-lg text-xs text-stone-700">
        {/*
        <a href="https://pf.kakao.com" target="_blank" rel="noreferrer" className="flex flex-col items-center hover:text-orange-400">
          <img src="/kakao-icon.png" alt="Kakao" className="w-6 h-6 mb-1" />
          카톡
        </a>
        */}
        <a target="_blank" href="https://cafe.naver.com/ferretattic" className="flex flex-col items-center hover:text-orange-400">
          <PawPrint className="w-6 h-6 mb-1" />
          카페
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex flex-col items-center hover:text-orange-400">
          <Instagram className="w-6 h-6 mb-1" />
          인스타
        </a>
        <button
          onClick={() => alert("지도기능 업데이트 중입니다")}
          className="flex flex-col items-center text-gray-500 hover:text-orange-400"
        >
          <MapPin className="w-6 h-6 mb-1" />
          오시는길
        </button>
        <button onClick={handleScrollTop} className="flex flex-col items-center hover:text-orange-400">
          <ChevronUp className="w-6 h-6 mb-1" />
          ↑
        </button>
      </div>

      {/* 모바일 하단 고정 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-t z-50 flex justify-around py-2 border-t border-orange-100">
        {/*
        <a href="https://pf.kakao.com" target="_blank" rel="noreferrer" className="flex flex-col items-center text-xs hover:text-orange-500">
          <img src="/kakao-icon.png" alt="Kakao" className="w-5 h-5" />
          톡
        </a>
        */ }
        <a target="_blank" href="https://cafe.naver.com/ferretattic" className="flex flex-col items-center text-xs hover:text-orange-500">
          <PawPrint className="w-5 h-5" />
          카페
        </a>
        <a href="https://www.instagram.com/ryuryup?igsh=MWNtMGZlNWs0NXdvZw==" target="_blank" rel="noreferrer" className="flex flex-col items-center text-xs hover:text-orange-500">
          <Instagram className="w-5 h-5" />
          인스타
        </a>
        <a href="/location" className="flex flex-col items-center text-xs hover:text-orange-500">
          <MapPin className="w-5 h-5" />
          길
        </a>
        <button onClick={handleScrollTop} className="flex flex-col items-center text-xs hover:text-orange-500">
          <ChevronUp className="w-5 h-5" />
          ↑
        </button>
      </div>
    </>
  );
}
