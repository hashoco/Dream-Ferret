import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AboutFerretPage() {

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetch(`${API_BASE}/api/ferret/knowledge`)
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((acc, item) => {
                    if (!acc[item.section]) acc[item.section] = [];
                    acc[item.section].push(item);
                    return acc;
                }, {});
                setData(grouped);
            });
    }, []);

    const checklistItems = [
        '하루 2시간 이상 돌봐줄 시간이 있나요?',
        '정기적으로 병원비를 지출할 수 있나요?',
        '배변 훈련 실패 시 인내할 수 있나요?',
        '혼자 있는 시간이 많은 생활이 아닌가요?',
        '은신처나 놀이공간을 마련할 수 있나요?'
    ];

    const [answers, setAnswers] = useState(Array(checklistItems.length).fill(null));
    const answeredCount = answers.filter(a => a === 'yes').length;

    const [data, setData] = useState([]);




    return (
        <div className="bg-[#fef6ec] text-gray-800 px-4 py-8 max-w-5xl mx-auto">
            {/* Intro */}
            <motion.section
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1
                    className="text-4xl sm:text-5xl font-bold mb-4 text-orange-500 tracking-tight"
                    style={{ fontFamily: "'Poor Story', sans-serif" }}
                >
                    처음 만나는 페럿
                </h1>
                <p
                    className="text-xl sm:text-2xl mb-8 text-orange-400 tracking-tight"
                    style={{ fontFamily: "'Poor Story', sans-serif" }}
                >
                    알면 알수록 매력적인, 작지만 강한 친구를 소개합니다 🐾
                </p>
                <img src="../infoImg2.png" alt="페럿 소개" className="mx-auto rounded-2xl shadow-lg w-full max-w-md object-cover" />
            </motion.section>

            {/* Basic Info */}
            {data.basic && (
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-14"
                >
                    <h2
                        className="text-3xl font-bold mb-6 text-orange-500 tracking-tight"
                        style={{ fontFamily: "'Poor Story', sans-serif" }}
                    >
                        페럿은 어떤 동물인가요?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {data.basic.map((item) => (
                            <InfoCard
                                key={item.id}
                                emoji={item.emoji}
                                title={item.title}
                                content={item.content}
                            />
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Day in Life */}
            {data.daily && (
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-14"
                >
                    <h2 className="text-3xl font-bold mb-6 text-orange-500 tracking-tight" style={{ fontFamily: "'Poor Story', sans-serif" }}>
                        페럿의 하루는 어떤가요?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.daily.map((item) => (
                            <InfoCard
                                key={item.id}
                                emoji={item.emoji}
                                title={item.title}
                                content={item.content}
                            />
                        ))}
                    </div>
                </motion.section>
            )}
            {data.pros && data.cons && (
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-14"
                >
                    <h2 className="text-3xl font-bold mb-6 text-orange-500 tracking-tight" style={{ fontFamily: "'Poor Story', sans-serif" }}>
                        페럿의 장점과 주의할 점
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-green-600 text-lg mb-3">🌟 장점</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {data.pros.map((item) => (
                                    <li key={item.id}>{item.content}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-red-500 text-lg mb-3">⚠️ 주의할 점</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {data.cons.map((item) => (
                                    <li key={item.id}>{item.content}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Checklist */}
            <section className="mb-14">
                {/* 제목 */}
                <h2
                    className="text-3xl font-bold mb-2 text-orange-500 tracking-tight text-left"
                    style={{ fontFamily: "'Poor Story', sans-serif" }}
                >
                    함께하기 전에 확인해보세요
                </h2>

                {/* 안내 문구 */}
                <p className="text-left text-amber-500 font-semibold mb-4">
                    아래 항목들을 클릭해 테스트를 진행해보세요! ({answeredCount}/{checklistItems.length})
                </p>

                {/* 체크리스트 */}
                <ul className="space-y-3">
                    {checklistItems.map((item, idx) => (
                        <li key={idx} className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center">
                            <span className="text-sm sm:text-base text-gray-800">{item}</span>
                            <div className="space-x-2">
                                <button
                                    className={`font-bold ${answers[idx] === 'yes' ? 'text-green-600' : 'text-gray-400'}`}
                                    onClick={() => {
                                        const updated = [...answers];
                                        updated[idx] = 'yes';
                                        setAnswers(updated);
                                    }}
                                >
                                    ✅
                                </button>
                                <button
                                    className={`font-bold ${answers[idx] === 'no' ? 'text-red-500' : 'text-gray-400'}`}
                                    onClick={() => {
                                        const updated = [...answers];
                                        updated[idx] = null; // ❌ 누르면 체크 해제
                                        setAnswers(updated);
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* 모든 항목 Yes일 때 메시지 */}
                {answers.every(ans => ans === 'yes') && (
                    <p className="text-center text-green-600 font-semibold mt-6">
                        🎉 이제 함께할 준비가 되었어요!
                    </p>
                )}
            </section>

            {/* FAQ */}
            {data.faq && (
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-14"
                >
                    <h2
                        className="text-3xl font-bold mb-6 text-orange-500 tracking-tight"
                        style={{ fontFamily: "'Poor Story', sans-serif" }}
                    >
                        자주 묻는 질문 (FAQ)
                    </h2>
                    <div className="space-y-6">
                        {data.faq.map((item) => (
                            <FaqItem
                                key={item.id}
                                question={item.title}
                                answer={item.content}
                            />
                        ))}
                    </div>
                </motion.section>
            )}

            {/* CTA */}
            <div className="text-center mt-16">
                <p className="text-lg mb-4">작고 소중한, 우리 아이들을 만나보세요 🐾</p>
                <a href="/ferretInfo" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-bold">
                    아이들 소개 보러가기
                </a>
            </div>
        </div>
    );
}

function InfoCard({ emoji, title, content }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-md"
        >
            <div className="text-3xl mb-2">{emoji}</div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
        </motion.div>
    );
}

function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-md cursor-pointer"
            onClick={() => setOpen(!open)}
        >
            <h4 className="font-bold text-base mb-1">❓ {question}</h4>
            {open && <p className="text-sm text-gray-700 mt-1 leading-relaxed">{answer}</p>}
        </motion.div>
    );
}