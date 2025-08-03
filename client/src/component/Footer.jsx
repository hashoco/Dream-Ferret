
export default function Footer() {
  return (
    <footer className="bg-stone-100 py-12 px-4 border-t border-stone-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* 사이트 소개 */}
        <div>
          <h3 className="text-lg font-bold text-stone-700 mb-2">페럿의 꿈꾸는 다락방</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            따뜻한 마음이 모이는 곳,
            <br />작고 소중한 친구들을 위한 온라인 공간입니다.
          </p>
        </div>

       

        {/* SNS 및 연락처 */}
        <div>
          <h4 className="text-sm font-semibold text-stone-600 mb-2">SNS & 문의</h4>
          <ul className="space-y-1 text-sm text-stone-500">
            <li>인스타그램: @ferretdream_official</li>
            <li>이메일: uoco0120@google.co.kr</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-stone-400 mt-12">
        © 2025 Ferret Dream. All rights reserved.
      </div>
    </footer>
  );
}
