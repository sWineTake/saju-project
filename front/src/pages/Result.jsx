import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { calculateSaju } from '../utils/sajuCalculator';
import { ArrowLeft, Share2, Star, AlertTriangle, CheckCircle, Compass, Palette } from 'lucide-react';

// 사주팔자 카드 컴포넌트
const PillarCard = ({ title, data }) => (
    <div className="flex flex-col items-center p-3 bg-midnight-900/40 border border-white/10 rounded-lg shadow-inner ring-1 ring-white/5">
        <span className="text-starlight-200/60 text-xs mb-1 tracking-widest">{title}</span>
        <div className="text-2xl font-bold text-starlight-100 mb-1 font-serif drop-shadow-md">{data.text}</div>
        <div className="flex gap-2 text-xs text-starlight-200/50">
            <span>{data.gan}</span>
            <span>{data.ji}</span>
        </div>
    </div>
);

// 섹션 헤더 컴포넌트
const SectionHeader = ({ title, icon, important }) => (
    <h3 className="font-serif font-bold text-starlight-100 mb-4 flex items-center gap-2 text-lg">
        <span className={`w-1 h-5 block ${important ? 'bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-accent-blue'}`}></span>
        {icon && <span>{icon}</span>}
        {title}
        {important && <span className="text-gold-400 text-sm animate-pulse">★ 중요</span>}
    </h3>
);

// 오행 바 컴포넌트
const ElementBar = ({ element, data }) => (
    <div className="flex items-center gap-3 mb-2">
        <div className={`w-16 text-sm font-medium ${data.colors.text}`}>
            {element}({data.hanja})
        </div>
        <div className="flex-1 h-4 bg-midnight-900/50 rounded-full overflow-hidden border border-white/5">
            <div
                className={`h-full ${data.colors.bar} transition-all duration-500 shadow-lg`}
                style={{ width: `${data.percentage}%` }}
            ></div>
        </div>
        <div className="w-12 text-right text-sm text-starlight-200">{data.percentage}%</div>
        <div className="w-16 text-xs transform translate-y-[1px]">
            {data.status === 'excess' && <span className="text-red-400 font-medium">(과다)</span>}
            {data.status === 'deficient' && <span className="text-gold-500 flex items-center gap-1"><AlertTriangle size={12} /> 부족</span>}
        </div>
    </div>
);

// 별점 컴포넌트
const StarRating = ({ rating, max = 5 }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'fill-gold-400 text-gold-400 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]' : 'text-white/10'}
            />
        ))}
    </div>
);

// 대운 카드 컴포넌트
const DaeunCard = ({ daeun }) => (
    <div className={`p-3 rounded-lg border backdrop-blur-sm transition-all ${daeun.status === 'current'
        ? 'border-gold-500/50 bg-gold-500/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] transform -translate-y-1'
        : daeun.status === 'past'
            ? 'border-white/5 bg-white/5 opacity-40'
            : 'border-white/10 bg-white/5'
        }`}>
        <div className="text-center">
            <div className={`text-lg font-serif font-bold ${daeun.status === 'current' ? 'text-gold-400' : 'text-starlight-100'}`}>{daeun.ganji}</div>
            <div className="text-xs text-starlight-200/70">{daeun.period}</div>
            <div className="text-xs text-starlight-200/50">{daeun.ageRange}</div>
            {daeun.status === 'current' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-gold-500 text-midnight-900 text-xs font-bold rounded-full">현재</span>
            )}
            <div className={`mt-2 text-xs font-medium ${daeun.feature.type === 'good' ? 'text-green-400' : 'text-gold-600'}`}>
                {daeun.feature.type === 'good' ? '→ ' : '⚠ '}{daeun.feature.text}
            </div>
        </div>
    </div>
);

// 월별 운세 아이템
const MonthlyFortuneItem = ({ data }) => {
    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-400';
        if (rating >= 3) return 'text-starlight-200';
        return 'text-gold-500'; // Warning color changed to gold for 'caution' vibe or orange
    };

    const getRatingLabel = (rating) => {
        if (rating >= 5) return '대길';
        if (rating >= 4) return '길운';
        if (rating >= 3) return '평운';
        return '흉운';
    };

    return (
        <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors rounded px-2">
            <span className="w-10 text-sm font-medium text-starlight-100">{data.month}월</span>
            <StarRating rating={data.rating} />
            <span className={`text-xs font-medium ${getRatingColor(data.rating)}`}>
                {getRatingLabel(data.rating)}
            </span>
            <span className="flex-1 text-xs text-starlight-200/70">{data.description}</span>
        </div>
    );
};

// 분야별 운세 카드
const CategoryFortuneCard = ({ data }) => (
    <div className="bg-midnight-900/40 p-4 rounded-lg border border-white/10 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-starlight-100 flex items-center gap-2">
                <span>{data.icon}</span> {data.title}
            </h4>
            <StarRating rating={data.rating} />
        </div>
        <p className="text-sm text-starlight-200 mb-3 leading-relaxed">{data.summary}</p>
        <ul className="space-y-1 mb-3">
            {data.details.map((detail, i) => (
                <li key={i} className="text-xs text-starlight-200/80 flex items-start gap-2">
                    <span className="text-accent-blue mt-[2px]">•</span>
                    {detail}
                </li>
            ))}
        </ul>
        <div className="text-xs text-green-300 bg-green-900/20 border border-green-500/20 p-2 rounded">
            💡 {data.advice}
        </div>
    </div>
);

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!location.state) {
            navigate('/');
            return;
        }
        const calculated = calculateSaju(
            location.state.name,
            location.state.birthDate,
            location.state.birthTime,
            location.state.gender,
            location.state.calendarType,
            location.state.isLeapMonth,
            location.state.birthPlace
        );
        setResult(calculated);
    }, [location.state, navigate]);

    if (!result) {
        return (
            <Layout>
                <div className="text-center p-10">
                    <div className="animate-pulse text-gold-400 font-serif text-lg">운명을 읽는 중...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8 animate-fade-in pb-8">

                {/* 1. 기본 정보 & 사주팔자 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-radial from-gold-500/10 to-transparent pointer-events-none"></div>

                    <div className="text-center mb-6 relative z-10">
                        <h2 className="text-2xl font-serif font-bold text-gold-400 mb-2">
                            {result.userInfo.name}님의 사주팔자
                        </h2>
                        <p className="text-starlight-200 text-sm">
                            {result.userInfo.birthDate} ({result.userInfo.calendarType === 'solar' ? '양력' : '음력'})
                            {result.userInfo.isLeapMonth && ' 윤달'}
                            {' | '}
                            {result.userInfo.gender === 'male' ? '남' : '여'}
                            {result.userInfo.birthPlace && ` | ${result.userInfo.birthPlace}`}
                        </p>
                        {result.userInfo.calendarType === 'lunar' && (
                            <p className="text-xs text-starlight-200/50 mt-1">
                                양력: {result.userInfo.solarDate}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                        <PillarCard title="시주" data={result.pillars.time} />
                        <PillarCard title="일주" data={result.pillars.day} />
                        <PillarCard title="월주" data={result.pillars.month} />
                        <PillarCard title="년주" data={result.pillars.year} />
                    </div>
                    <div className="mt-4 text-center text-xs text-starlight-200/80">
                        일간(日干): <span className="font-bold text-starlight-100 text-lg ml-1 font-serif">{result.dayGan}</span>
                    </div>
                </section>

                {/* 2. 오행(五行) 균형 분석 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <SectionHeader title="오행(五行) 균형 분석" important />
                    <div className="space-y-4">
                        {Object.entries(result.elementBalance).map(([element, data]) => (
                            <ElementBar key={element} element={element} data={data} />
                        ))}
                    </div>
                    <div className="mt-5 p-3 bg-midnight-900/60 rounded-lg text-sm text-starlight-200 border border-white/5">
                        <p className="flex items-start gap-2">
                            <AlertTriangle size={16} className="text-gold-500 mt-0.5 shrink-0" />
                            <span>
                                부족한 오행: <span className="text-starlight-100 font-bold">{Object.entries(result.elementBalance)
                                    .filter(([, data]) => data.status === 'deficient')
                                    .map(([el, data]) => `${el}(${data.hanja})`)
                                    .join(', ') || '없음'}</span>
                                {' → '}보완이 필요합니다.
                            </span>
                        </p>
                    </div>
                </section>

                {/* 3. 십성(十星) 분석 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <SectionHeader title="십성(十星) 분석" />
                    <div className="space-y-3">
                        {Object.entries(result.tenStars).map(([key, star]) => (
                            <div key={key} className="flex items-center gap-3 p-3 bg-midnight-900/40 border border-white/5 rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${star.strength === 'strong' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                                    star.strength === 'weak' ? 'bg-gold-500' : 'bg-starlight-200/50'
                                    }`}></div>
                                <div className="flex-1">
                                    <span className="font-medium text-starlight-100">{star.name}</span>
                                    <span className="ml-2 text-xs text-starlight-200/70">{star.description}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${star.strength === 'strong' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                                    star.strength === 'weak' ? 'bg-gold-900/20 text-gold-400 border border-gold-500/20' :
                                        'bg-white/10 text-starlight-200'
                                    }`}>
                                    {star.strength === 'strong' ? '강함' : star.strength === 'weak' ? '약함' : '보통'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. 용신(用神) & 희기신 */}
                <section className="bg-gradient-to-br from-gold-900/20 to-midnight-800/80 p-5 rounded-xl border border-gold-500/30 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div>
                    <SectionHeader title="용신(用神) & 희기신" icon="⭐" important />
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-midnight-900/60 rounded-lg border border-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                            <div className="text-xs text-gold-400/80 mb-1">용신</div>
                            <div className="text-2xl font-serif font-bold text-gold-400">
                                {result.yongsin.yongsin.hanja}
                            </div>
                            <div className="text-sm text-starlight-200">({result.yongsin.yongsin.element})</div>
                        </div>
                        <div className="text-center p-3 bg-midnight-900/40 rounded-lg border border-green-500/30">
                            <div className="text-xs text-green-400/80 mb-1">희신</div>
                            <div className="text-2xl font-serif font-bold text-green-400">
                                {result.yongsin.heesin.hanja}
                            </div>
                            <div className="text-sm text-starlight-200">({result.yongsin.heesin.element})</div>
                        </div>
                        <div className="text-center p-3 bg-midnight-900/30 rounded-lg border border-white/10">
                            <div className="text-xs text-starlight-200/50 mb-1">기신</div>
                            <div className="text-2xl font-serif font-bold text-starlight-200/50">
                                {result.yongsin.keesin.hanja}
                            </div>
                            <div className="text-sm text-starlight-200/50">({result.yongsin.keesin.element})</div>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm bg-midnight-900/40 p-3 rounded-lg border border-white/5">
                        <p className="flex items-center gap-2">
                            <Compass size={16} className="text-accent-blue" />
                            <span className="text-starlight-200">길한 방향: <strong className="text-starlight-100">{result.yongsin.luckyDirection}</strong></span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Palette size={16} className="text-accent-red" />
                            <span className="text-starlight-200">길한 색상: <strong className="text-starlight-100">{result.yongsin.luckyColor}</strong></span>
                        </p>
                    </div>
                </section>

                {/* 5. 대운(大運) 흐름 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <SectionHeader title="대운(大運) 흐름" icon="📅" important />
                    <div className="overflow-x-auto -mx-2 px-2 pb-2 scrollbar-hide">
                        <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                            {result.daeun.map((d, i) => (
                                <DaeunCard key={i} daeun={d} />
                            ))}
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-starlight-200/40 text-center animate-pulse">
                        ← 좌우로 스크롤하여 전체 대운을 확인하세요 →
                    </p>
                </section>

                {/* 6. 세운(歲運) - 현재 년도 운세 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <SectionHeader title={`${result.seun.year}년 세운(歲運)`} />
                    <div className="text-center mb-6">
                        <span className="text-4xl font-serif font-bold text-starlight-100 drop-shadow-md">
                            {result.seun.ganji}
                        </span>
                        <span className="ml-2 text-starlight-200">년</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-accent-blue/10 rounded-lg border border-accent-blue/20">
                            <div className="font-medium text-accent-blue mb-2 text-sm">전반기 (1-6월)</div>
                            <p className="text-sm text-starlight-200 leading-relaxed">{result.seun.firstHalf}</p>
                        </div>
                        <div className="p-4 bg-gold-400/10 rounded-lg border border-gold-500/20">
                            <div className="font-medium text-gold-400 mb-2 text-sm">후반기 (7-12월)</div>
                            <p className="text-sm text-starlight-200 leading-relaxed">{result.seun.secondHalf}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-300 bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                        <CheckCircle size={16} />
                        <span>길한 달: {result.seun.luckyMonths.join('월, ')}월</span>
                    </div>
                </section>

                {/* 7. 분야별 상세 운세 */}
                <section>
                    <SectionHeader title="분야별 상세 운세" />
                    <div className="space-y-4">
                        {Object.entries(result.categoryFortune).map(([key, data]) => (
                            <CategoryFortuneCard key={key} data={data} />
                        ))}
                    </div>
                </section>

                {/* 8. 월별 운세 캘린더 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <SectionHeader title="월별 운세 캘린더" />
                    <div className="space-y-1">
                        {result.seun.monthlyFortune.map((month) => (
                            <MonthlyFortuneItem key={month.month} data={month} />
                        ))}
                    </div>
                </section>

                {/* 9. 길흉 방향 & 색상 */}
                <section className="bg-gradient-to-br from-white/5 to-accent-blue/10 p-5 rounded-xl border border-white/10">
                    <SectionHeader title="길흉 방향 & 색상" icon="🧭" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-900/10 p-3 rounded-lg border border-green-500/10">
                            <h4 className="text-sm font-medium text-green-400 mb-2">길한 요소</h4>
                            <div className="space-y-2 text-sm text-starlight-200">
                                <p>방향: {result.luckyItems.luckyDirections.join(', ')}</p>
                                <p>색상: {result.luckyItems.luckyColors.join(', ')}</p>
                                <p>숫자: {result.luckyItems.luckyNumbers.join(', ')}</p>
                            </div>
                        </div>
                        <div className="bg-red-900/10 p-3 rounded-lg border border-red-500/10">
                            <h4 className="text-sm font-medium text-red-400 mb-2">흉한 요소</h4>
                            <div className="space-y-2 text-sm text-starlight-200/70">
                                <p>방향: {result.luckyItems.unluckyDirections.join(', ')}</p>
                                <p>색상: {result.luckyItems.unluckyColors.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. 개운 방법 & 조언 */}
                <section className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <SectionHeader title="개운 방법 & 조언" icon="✨" />
                    <div className="space-y-4">
                        {result.improvementTips.map((tip, i) => (
                            <div key={i} className="p-4 bg-midnight-900/50 rounded-lg border border-white/5">
                                <h4 className="font-medium text-gold-400 mb-2">{tip.category}</h4>
                                <ul className="space-y-1">
                                    {tip.items.map((item, j) => (
                                        <li key={j} className="text-sm text-starlight-200 flex items-start gap-2">
                                            <span className="text-accent-blue">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 하단 버튼 */}
                <div className="flex gap-2 pt-4 pb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 py-3 px-4 border border-white/20 rounded-lg text-starlight-200 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={18} /> 다시하기
                    </button>
                    <button className="py-3 px-4 border border-white/20 rounded-lg text-starlight-200 hover:bg-white/10 transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Result;