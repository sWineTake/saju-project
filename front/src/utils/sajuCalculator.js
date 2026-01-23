import { Lunar, Solar } from 'lunar-javascript';

// 천간(天干) 오행 매핑
const CHEONGAN_ELEMENT = {
    '甲': '목', '乙': '목',
    '丙': '화', '丁': '화',
    '戊': '토', '己': '토',
    '庚': '금', '辛': '금',
    '壬': '수', '癸': '수'
};

// 지지(地支) 오행 매핑
const JIJI_ELEMENT = {
    '子': '수', '丑': '토', '寅': '목', '卯': '목',
    '辰': '토', '巳': '화', '午': '화', '未': '토',
    '申': '금', '酉': '금', '戌': '토', '亥': '수'
};

// 오행 한자
const ELEMENT_HANJA = {
    '목': '木', '화': '火', '토': '土', '금': '金', '수': '水'
};

// 오행 색상
const ELEMENT_COLORS = {
    '목': { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
    '화': { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
    '토': { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' },
    '금': { bg: 'bg-stone-100', text: 'text-stone-700', bar: 'bg-stone-400' },
    '수': { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' }
};

// 12지지 시간 매핑
const JIJI_TIME_MAP = {
    '자시': 0, '축시': 2, '인시': 4, '묘시': 6,
    '진시': 8, '사시': 10, '오시': 12, '미시': 14,
    '신시': 16, '유시': 18, '술시': 20, '해시': 22
};

// 오행 분석 계산
const calculateElementBalance = (pillars) => {
    const elements = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };

    // 각 주의 천간과 지지에서 오행 계산
    Object.values(pillars).forEach(pillar => {
        if (pillar.gan && CHEONGAN_ELEMENT[pillar.gan]) {
            elements[CHEONGAN_ELEMENT[pillar.gan]] += 1;
        }
        if (pillar.ji && JIJI_ELEMENT[pillar.ji]) {
            elements[JIJI_ELEMENT[pillar.ji]] += 1;
        }
    });

    // 백분율 계산
    const total = Object.values(elements).reduce((a, b) => a + b, 0) || 1;
    const result = {};

    Object.entries(elements).forEach(([element, count]) => {
        const percentage = Math.round((count / total) * 100);
        let status = 'normal';
        if (percentage >= 40) status = 'excess';
        else if (percentage <= 10) status = 'deficient';

        result[element] = {
            count,
            percentage,
            status,
            hanja: ELEMENT_HANJA[element],
            colors: ELEMENT_COLORS[element]
        };
    });

    return result;
};

// 십성(十星) 분석
const calculateTenStars = (dayGan, pillars) => {
    // 일간 기준 십성 분석 (간략화된 버전)
    const stars = {
        비겁: { name: '비겁(比劫)', strength: 'normal', description: '자아, 형제, 경쟁심' },
        식상: { name: '식상(食傷)', strength: 'normal', description: '표현력, 창의력, 재능' },
        재성: { name: '재성(財星)', strength: 'normal', description: '재물, 아버지, 현실감' },
        관성: { name: '관성(官星)', strength: 'normal', description: '직장, 명예, 규율' },
        인성: { name: '인성(印星)', strength: 'normal', description: '학문, 어머니, 지혜' }
    };

    // 일간의 오행에 따른 십성 강약 분석 (목업)
    const dayElement = CHEONGAN_ELEMENT[dayGan];
    if (dayElement === '목') {
        stars.식상.strength = 'strong';
        stars.재성.strength = 'weak';
    } else if (dayElement === '화') {
        stars.비겁.strength = 'strong';
        stars.인성.strength = 'weak';
    } else if (dayElement === '토') {
        stars.관성.strength = 'strong';
        stars.식상.strength = 'weak';
    } else if (dayElement === '금') {
        stars.재성.strength = 'strong';
        stars.비겁.strength = 'weak';
    } else if (dayElement === '수') {
        stars.인성.strength = 'strong';
        stars.관성.strength = 'weak';
    }

    return stars;
};

// 용신(用神) 분석
const calculateYongsin = (elementBalance, dayGan) => {
    const dayElement = CHEONGAN_ELEMENT[dayGan];

    // 부족한 오행을 용신으로 설정 (간략화)
    let yongsin = '화';
    let heesin = '목';
    let keesin = '수';

    // 가장 부족한 오행 찾기
    let minElement = '화';
    let minValue = 100;
    Object.entries(elementBalance).forEach(([element, data]) => {
        if (data.percentage < minValue) {
            minValue = data.percentage;
            minElement = element;
        }
    });
    yongsin = minElement;

    // 용신 생성 오행을 희신으로
    const generatingCycle = { '목': '수', '화': '목', '토': '화', '금': '토', '수': '금' };
    heesin = generatingCycle[yongsin];

    // 용신 극하는 오행을 기신으로
    const controllingCycle = { '목': '금', '화': '수', '토': '목', '금': '화', '수': '토' };
    keesin = controllingCycle[yongsin];

    // 방향 매핑
    const directions = { '목': '동쪽', '화': '남쪽', '토': '중앙', '금': '서쪽', '수': '북쪽' };
    // 색상 매핑
    const colors = { '목': '초록색/청색', '화': '빨간색/분홍색', '토': '노란색/황토색', '금': '흰색/금색', '수': '검정색/파란색' };

    return {
        yongsin: { element: yongsin, hanja: ELEMENT_HANJA[yongsin] },
        heesin: { element: heesin, hanja: ELEMENT_HANJA[heesin] },
        keesin: { element: keesin, hanja: ELEMENT_HANJA[keesin] },
        luckyDirection: directions[yongsin],
        luckyColor: colors[yongsin],
        unluckyDirection: directions[keesin],
        unluckyColor: colors[keesin]
    };
};

// 대운(大運) 계산
const calculateDaeun = (birthYear, gender) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // 대운 시작 나이 (간략화 - 실제는 더 복잡한 계산 필요)
    const daeunStartAge = gender === 'male' ? 8 : 7;

    const daeunList = [];
    const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const jiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    for (let i = 0; i < 8; i++) {
        const startAge = daeunStartAge + (i * 10);
        const endAge = startAge + 9;
        const startYear = birthYear + startAge;
        const endYear = birthYear + endAge;

        const gan = ganList[(birthYear + i) % 10];
        const ji = jiList[(birthYear + i) % 12];

        let status = 'future';
        if (age >= startAge && age <= endAge) status = 'current';
        else if (age > endAge) status = 'past';

        // 운세 특징 (목업)
        const features = [
            { type: 'good', text: '재물운 상승기' },
            { type: 'good', text: '새로운 기회 도래' },
            { type: 'caution', text: '건강 관리 필요' },
            { type: 'good', text: '인간관계 확장' },
            { type: 'caution', text: '신중한 결정 필요' },
            { type: 'good', text: '안정과 성장의 시기' },
            { type: 'good', text: '사업 확장 적기' },
            { type: 'caution', text: '재정 관리 주의' }
        ];

        daeunList.push({
            period: `${startYear}-${endYear}`,
            ageRange: `${startAge}-${endAge}세`,
            ganji: `${gan}${ji}`,
            gan,
            ji,
            status,
            feature: features[i]
        });
    }

    return daeunList;
};

// 세운(歲運) - 현재 년도 운세
const calculateSeun = (birthYear, dayGan) => {
    const currentYear = new Date().getFullYear();
    const ganList = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
    const jiList = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];

    const yearGan = ganList[currentYear % 10];
    const yearJi = jiList[currentYear % 12];

    // 월별 운세 (목업)
    const monthlyFortune = [];
    const ratings = [4, 3, 5, 4, 3, 4, 5, 3, 4, 5, 3, 4];
    const descriptions = [
        '새해 시작, 계획 수립 적기',
        '안정 유지, 신중함 필요',
        '좋은 기회 도래, 적극 행동',
        '인간관계 확장의 달',
        '재정 점검 필요',
        '건강 관리 중요',
        '전환점, 새로운 시도 길함',
        '휴식과 재충전',
        '결실의 시기',
        '도전과 성장',
        '준비와 계획',
        '마무리와 정리'
    ];

    for (let i = 1; i <= 12; i++) {
        monthlyFortune.push({
            month: i,
            rating: ratings[i - 1],
            description: descriptions[i - 1]
        });
    }

    // 길한 달 찾기
    const luckyMonths = monthlyFortune
        .filter(m => m.rating >= 4)
        .map(m => m.month);

    return {
        year: currentYear,
        ganji: `${yearGan}${yearJi}`,
        gan: yearGan,
        ji: yearJi,
        firstHalf: '새로운 시작과 도전의 기회가 많은 시기입니다. 적극적으로 행동하면 좋은 결과를 얻을 수 있습니다.',
        secondHalf: '인간관계에 주의가 필요하며, 건강 관리에 신경 쓰는 것이 좋습니다.',
        luckyMonths,
        monthlyFortune
    };
};

// 분야별 운세
const calculateCategoryFortune = (elementBalance, yongsin, tenStars) => {
    return {
        wealth: {
            title: '재물운',
            icon: '📊',
            rating: 4,
            summary: '중년 이후 재물운이 점차 상승하는 형국입니다.',
            details: [
                '꾸준한 저축과 투자가 유리합니다.',
                '사업보다는 안정적인 직장 생활이 적합합니다.',
                '40대 이후 부동산 관련 행운이 있습니다.'
            ],
            advice: '충동적인 지출을 피하고, 장기적인 재정 계획을 세우세요.'
        },
        career: {
            title: '직업/학업운',
            icon: '💼',
            rating: 4,
            summary: '창의적인 분야에서 두각을 나타낼 수 있습니다.',
            details: [
                '예술, 디자인, 기획 관련 직종에 적합합니다.',
                '대인관계가 좋아 영업, 서비스업도 좋습니다.',
                '학업에서는 인문학, 사회과학 분야가 유리합니다.'
            ],
            advice: '자신의 강점을 살릴 수 있는 분야를 선택하세요.'
        },
        love: {
            title: '연애/결혼운',
            icon: '❤️',
            rating: 3,
            summary: '비슷한 가치관을 가진 사람과 좋은 인연이 있습니다.',
            details: [
                '30대 초반에 좋은 인연을 만날 가능성이 높습니다.',
                '배우자는 차분하고 현실적인 성격이 어울립니다.',
                '결혼 후 안정적인 가정을 이룰 수 있습니다.'
            ],
            advice: '급하게 결정하지 말고, 충분한 교제 기간을 가지세요.'
        },
        health: {
            title: '건강운',
            icon: '🏥',
            rating: 3,
            summary: '전반적으로 건강하나 특정 부위 관리가 필요합니다.',
            details: [
                '소화기 계통 건강에 주의가 필요합니다.',
                '스트레스로 인한 피로 누적에 주의하세요.',
                '규칙적인 운동과 충분한 수면이 중요합니다.'
            ],
            advice: '과로를 피하고, 정기적인 건강검진을 받으세요.'
        },
        family: {
            title: '육친(가족) 관계',
            icon: '👨‍👩‍👧‍👦',
            rating: 4,
            summary: '가족과의 관계가 전반적으로 원만합니다.',
            details: [
                '부모님과의 관계에서 효도의 기회가 있습니다.',
                '형제자매와 협력할 일이 생깁니다.',
                '자녀가 있다면 교육에 관심을 기울이세요.'
            ],
            advice: '가족과의 대화 시간을 늘리고, 소통에 노력하세요.'
        }
    };
};

// 길흉 방향 & 색상
const calculateLuckyItems = (yongsin) => {
    return {
        luckyDirections: [yongsin.luckyDirection],
        unluckyDirections: [yongsin.unluckyDirection],
        luckyColors: yongsin.luckyColor.split('/'),
        unluckyColors: yongsin.unluckyColor.split('/'),
        luckyNumbers: [3, 8],
        luckyDay: '목요일'
    };
};

// 개운 방법
const calculateImprovementTips = (yongsin, elementBalance) => {
    const tips = [
        {
            category: '일상 실천',
            items: [
                `${yongsin.luckyColor} 계열의 옷이나 소품을 활용하세요.`,
                `${yongsin.luckyDirection} 방향으로 이동하거나 여행하면 좋습니다.`,
                '아침에 일찍 일어나 명상이나 운동을 하세요.'
            ]
        },
        {
            category: '풍수 조언',
            items: [
                '집이나 사무실의 동쪽에 식물을 배치하세요.',
                '침실은 어둡고 조용하게 유지하세요.',
                '현관은 항상 깨끗하게 정리하세요.'
            ]
        },
        {
            category: '마음가짐',
            items: [
                '감사 일기를 쓰는 습관을 들이세요.',
                '긍정적인 사람들과 교류하세요.',
                '자신의 장점을 인정하고 발전시키세요.'
            ]
        }
    ];

    return tips;
};

export const calculateSaju = (name, birthDate, birthTime, gender, calendarType = 'solar', isLeapMonth = false, birthPlace = '') => {
    const [year, month, day] = birthDate.split('-').map(Number);

    let solar, lunar;

    if (calendarType === 'lunar') {
        // 음력 -> 양력 변환
        lunar = Lunar.fromYmd(year, month, day);
        if (isLeapMonth) {
            // 윤달 처리 (lunar-javascript에서 지원하는 경우)
            // Lunar.fromYmd의 4번째 인자로 윤달 여부 전달 가능
        }
        solar = lunar.getSolar();
    } else {
        solar = Solar.fromYmd(year, month, day);
        lunar = solar.getLunar();
    }

    // 시간 처리
    let timeHour = 12; // 기본값
    if (birthTime && JIJI_TIME_MAP[birthTime] !== undefined) {
        timeHour = JIJI_TIME_MAP[birthTime];
    }

    const solarWithTime = Solar.fromYmdHms(solar.getYear(), solar.getMonth(), solar.getDay(), timeHour, 0, 0);
    const lunarWithTime = solarWithTime.getLunar();

    // 사주팔자 계산
    const yearPillar = lunar.getYearInGanZhi();
    const monthPillar = lunar.getMonthInGanZhi();
    const dayPillar = lunar.getDayInGanZhi();

    let timePillar = '??';
    let timeGan = '?';
    let timeJi = '?';

    if (birthTime) {
        timePillar = lunarWithTime.getTimeInGanZhi();
        timeGan = lunarWithTime.getTimeGan();
        timeJi = lunarWithTime.getTimeZhi();
    }

    const pillars = {
        year: { text: yearPillar, gan: lunar.getYearGan(), ji: lunar.getYearZhi() },
        month: { text: monthPillar, gan: lunar.getMonthGan(), ji: lunar.getMonthZhi() },
        day: { text: dayPillar, gan: lunar.getDayGan(), ji: lunar.getDayZhi() },
        time: { text: timePillar, gan: timeGan, ji: timeJi }
    };

    // 일간(日干) - 일주의 천간
    const dayGan = lunar.getDayGan();

    // 오행 분석
    const elementBalance = calculateElementBalance(pillars);

    // 십성 분석
    const tenStars = calculateTenStars(dayGan, pillars);

    // 용신 분석
    const yongsin = calculateYongsin(elementBalance, dayGan);

    // 대운 계산
    const daeun = calculateDaeun(year, gender);

    // 세운 계산
    const seun = calculateSeun(year, dayGan);

    // 분야별 운세
    const categoryFortune = calculateCategoryFortune(elementBalance, yongsin, tenStars);

    // 길흉 방향 & 색상
    const luckyItems = calculateLuckyItems(yongsin);

    // 개운 방법
    const improvementTips = calculateImprovementTips(yongsin, elementBalance);

    return {
        userInfo: {
            name,
            gender,
            birthDate,
            birthTime,
            calendarType,
            isLeapMonth,
            birthPlace,
            solarDate: `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`,
            lunarDate: `${lunar.getYear()}-${String(lunar.getMonth()).padStart(2, '0')}-${String(lunar.getDay()).padStart(2, '0')}`
        },
        pillars,
        dayGan,
        elementBalance,
        tenStars,
        yongsin,
        daeun,
        seun,
        categoryFortune,
        luckyItems,
        improvementTips
    };
};