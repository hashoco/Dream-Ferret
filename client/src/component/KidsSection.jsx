// components/KidsSection.jsx
import PetCard from './PetCard';

const kids = [
  {
    name: '꾸꾸',
    image: '/kuku.jpg',
    tag: '든든이',
    description: '항상 옆을 지켜주는 믿음직한 친구예요 💪'
  },
  {
    name: '코코',
    image: '/koko.jpg',
    tag: '애교쟁이',
    description: '사람을 정말 좋아해요! 졸졸졸~ 따라다니는 게 특기예요 🐾'
  },
  {
    name: '로이',
    image: '/Roy.jpg',
    tag: '꼬마 탐험가',
    description: '호기심 가득! 모험을 너무 좋아해요 ✨'
  },
  {
    name: '동주',
    image: '/Hero4.jpg',
    tag: '엉뚱발랄',
    description: '궁금한 게 많고 늘 새로운 장난을 궁리해요 🌀'
  }
];

export default function KidsSection() {
  return (
    <section className="relative bg-gradient-to-r from-emerald-200 to-orange-50 py-16 px-4 overflow-hidden font-sans">
      {/* 배경 장식 요소 (성능 최적화 버전) */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-emerald-100 rounded-full opacity-20" />
      <div className="absolute bottom-0 -right-16 w-48 h-48 bg-orange-100 rounded-full opacity-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start relative z-10">
       {/* 좌측 소개 영역 */}
        <div className="lg:w-1/3 w-full bg-white rounded-2xl p-8 shadow-md relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 leading-snug">
            장난꾸러기미 넘치는,<br />귀여운 우리 아이들이에요 🐾
          </h2>
          <p className="text-stone-600 text-base leading-relaxed mb-6">
            페럿 친구들의 일상과 매력을 소개하는 공간이에요. <br className="hidden sm:block" />
            사랑스러운 성격과 장난기 가득한 모습, 지금 함께 만나보세요!
          </p>
          <a href="/ferretInfo">
            <button className="bg-emerald-400 text-white text-sm font-semibold py-2 px-6 rounded-full hover:bg-emerald-500 transition">
              아이들 이야기 더 보기
            </button>
          </a>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-orange-100 rounded-full opacity-30" />
        </div>

        {/* 우측 카드 영역 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
          {kids.map((kid) => (
            <PetCard key={kid.name} name={kid.name} image={kid.image} description={kid.description} tag={kid.tag} />
          ))}
        </div>
      </div>
    </section>
  );
}
