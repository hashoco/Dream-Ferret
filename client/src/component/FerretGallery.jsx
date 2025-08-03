// components/FerretGallery.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const images = ['/kuku.jpg', '/koko.jpg', '/Roy.jpg', '/koko2.jpg', '/moca.jpg', '/Hero1.jpg'];

export default function FerretGallery() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="relative bg-gradient-to-b from-pink-50 to-orange-50 py-32 px-4 overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full opacity-20 -z-10" />
      <div className="absolute bottom-0 -right-10 w-52 h-52 bg-pink-100 rounded-full opacity-20 -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-rose-500 mb-2">
            🌸 우리 아이 자랑하기
          </h2>
          <p className="text-stone-500 text-sm sm:text-base">
            귀엽고 사랑스러운 우리 페럿 친구들의 소중한 순간을 함께 감상해보세요 🧸
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* 좌측 컨트롤 */}
          <div className="flex sm:flex-col gap-3 justify-center sm:justify-start">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-pink-200 flex items-center justify-center bg-white shadow hover:bg-pink-100 transition"
            >
              <ChevronLeft className="text-rose-400" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-rose-400 flex items-center justify-center bg-white shadow hover:bg-rose-100 transition"
            >
              <ChevronRight className="text-rose-500" />
            </button>
          </div>

          {/* 이미지 슬라이드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {images.slice(index, index + 3).map((img, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:scale-[1.02] bg-white"
              >
                <img
                  src={img}
                  alt={`갤러리 이미지 ${i + 1}`}
                  className="object-cover w-full h-64 sm:h-72"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
