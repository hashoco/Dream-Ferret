// components/FerretCare.jsx
import { useState } from 'react';
import { PawPrint, ChevronDown, ChevronUp } from 'lucide-react';

const careTips = [
  {
    title: '페럿은 어떤 동물인가요?',
    description:
      '페럿은 족제비과의 동물로, 호기심이 많고 장난기 넘치는 반려동물이에요. 하루 대부분을 자면서 보내지만, 활동할 땐 아주 활발하답니다.'
  },
  {
    title: '무엇을 먹고 살아가요?',
    description:
      '고단백, 고지방 사료가 필수예요. 일반 고양이 사료보다는 페럿 전용 사료가 좋아요. 초콜릿, 양파, 포도, 카페인은 절대 금지!'
  },
  {
    title: '배변 훈련은 가능할까요?',
    description:
      '가능해요! 보통 모서리에 화장실을 두고 반복적으로 유도하면 익숙해져요. 실수했을 땐 절대 혼내지 마세요.'
  },
  {
    title: '목욕은 얼마나 자주 시켜야 하나요?',
    description:
      '너무 자주 목욕하면 피부가 건조해져요. 한 달에 한두 번 정도가 적당하며, 페럿 전용 샴푸를 사용해 주세요.'
  },
  {
    title: '혼자 두어도 괜찮을까요?',
    description:
      '페럿은 사회성이 높아서 오랜 시간 혼자 두면 스트레스를 받을 수 있어요. 주기적인 교감과 놀이가 꼭 필요해요.'
  }
];

export default function FerretCare() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-orange-50 py-20 px-4">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-100 rounded-full opacity-20 -z-10" />
      <div className="absolute bottom-10 right-0 w-48 h-48 bg-orange-100 rounded-full opacity-20 -z-10" />

      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 flex items-center justify-center gap-2">
          <PawPrint className="w-7 h-7 text-orange-400" />
          페럿 상식 & 돌봄 이야기
        </h2>
        <p className="text-stone-600">
          페럿을 더욱 사랑스럽게 이해하고 보살피는 방법을 알려드릴게요!
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {careTips.map((tip, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full px-6 py-4 flex justify-between items-center text-left"
            >
              <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-orange-400" />
                {tip.title}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-orange-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-sm text-stone-600 leading-relaxed">
                {tip.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
