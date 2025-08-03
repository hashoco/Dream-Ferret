import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = ['/Hero1.jpg', '/Hero2.jpg', '/Hero3.jpg', '/Hero4.jpg'];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] overflow-hidden bg-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 left-0 sm:left-20 right-0 rounded-b-[140px] overflow-hidden">
        <img
          src={images[current]}
          alt={`페럿 이미지 ${current + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 텍스트 + 컨트롤 */}
      <div className="absolute bottom-16 left-16 z-16 max-w-xs sm:max-w-md text-white space-y-3">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-12">
          <div className="text-white max-w-xs sm:max-w-md">
           <p className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]">
  <span className="text-3xl sm:text-5xl">작고 소중한 친구들</span><br />
  <span className="text-orange-300">페럿의꿈꾸는다락방</span>
</p>

            <div className="flex items-center gap-4 text-white text-base sm:text-lg">
              <button onClick={prevSlide} className="hover:text-orange-300">
                &lt;
              </button>
              <span>
                {current + 1} / {images.length}
              </span>
              <button onClick={nextSlide} className="hover:text-orange-300">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
