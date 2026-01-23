import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Sparkles, Calendar, Clock, MapPin } from 'lucide-react';

// 12지지 시간대 옵션
const BIRTH_TIME_OPTIONS = [
    { value: '', label: '모름 / 선택안함', time: '' },
    { value: '자시', label: '자시 (子時)', time: '23:00 ~ 01:00' },
    { value: '축시', label: '축시 (丑時)', time: '01:00 ~ 03:00' },
    { value: '인시', label: '인시 (寅時)', time: '03:00 ~ 05:00' },
    { value: '묘시', label: '묘시 (卯時)', time: '05:00 ~ 07:00' },
    { value: '진시', label: '진시 (辰時)', time: '07:00 ~ 09:00' },
    { value: '사시', label: '사시 (巳時)', time: '09:00 ~ 11:00' },
    { value: '오시', label: '오시 (午時)', time: '11:00 ~ 13:00' },
    { value: '미시', label: '미시 (未時)', time: '13:00 ~ 15:00' },
    { value: '신시', label: '신시 (申時)', time: '15:00 ~ 17:00' },
    { value: '유시', label: '유시 (酉時)', time: '17:00 ~ 19:00' },
    { value: '술시', label: '술시 (戌時)', time: '19:00 ~ 21:00' },
    { value: '해시', label: '해시 (亥時)', time: '21:00 ~ 23:00' },
];

// 출생지 옵션 (한국 주요 도시 + 해외)
const BIRTHPLACE_OPTIONS = [
    { value: '', label: '선택안함' },
    { value: '서울', label: '서울' },
    { value: '부산', label: '부산' },
    { value: '대구', label: '대구' },
    { value: '인천', label: '인천' },
    { value: '광주', label: '광주' },
    { value: '대전', label: '대전' },
    { value: '울산', label: '울산' },
    { value: '세종', label: '세종' },
    { value: '수원', label: '수원' },
    { value: '창원', label: '창원' },
    { value: '성남', label: '성남' },
    { value: '고양', label: '고양' },
    { value: '용인', label: '용인' },
    { value: '청주', label: '청주' },
    { value: '전주', label: '전주' },
    { value: '천안', label: '천안' },
    { value: '제주', label: '제주' },
    { value: '해외', label: '해외' },
];

const Home = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male',
        calendarType: 'solar',  // 양력/음력
        isLeapMonth: false,     // 윤달 여부
        birthDate: '2000-01-01',
        birthTime: '',
        birthPlace: '',         // 출생지
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/result', { state: formData });
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이름 */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-starlight-200">
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2 bg-midnight-900/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-starlight-100 placeholder:text-white/20 transition-all"
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* 성별 */}
                <div className="space-y-2">
                    <span className="block text-sm font-medium text-starlight-200">성별</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={handleChange}
                                className="appearance-none w-4 h-4 rounded-full border border-white/30 checked:bg-gold-500 checked:border-gold-500 transition-colors"
                            />
                            <span className="text-starlight-100 group-hover:text-gold-400 transition-colors">남성</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={handleChange}
                                className="appearance-none w-4 h-4 rounded-full border border-white/30 checked:bg-gold-500 checked:border-gold-500 transition-colors"
                            />
                            <span className="text-starlight-100 group-hover:text-gold-400 transition-colors">여성</span>
                        </label>
                    </div>
                </div>

                {/* 양력/음력 구분 */}
                <div className="space-y-2">
                    <span className="block text-sm font-medium text-starlight-200">
                        양력/음력 <span className="text-gold-500">*</span>
                    </span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="calendarType"
                                value="solar"
                                checked={formData.calendarType === 'solar'}
                                onChange={handleChange}
                                className="appearance-none w-4 h-4 rounded-full border border-white/30 checked:bg-gold-500 checked:border-gold-500 transition-colors"
                            />
                            <span className="text-starlight-100 group-hover:text-gold-400 transition-colors">양력</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="calendarType"
                                value="lunar"
                                checked={formData.calendarType === 'lunar'}
                                onChange={handleChange}
                                className="appearance-none w-4 h-4 rounded-full border border-white/30 checked:bg-gold-500 checked:border-gold-500 transition-colors"
                            />
                            <span className="text-starlight-100 group-hover:text-gold-400 transition-colors">음력</span>
                        </label>
                    </div>
                </div>

                {/* 윤달 체크박스 - 음력 선택 시에만 표시 */}
                {formData.calendarType === 'lunar' && (
                    <div className="space-y-2 animate-fade-in">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isLeapMonth"
                                checked={formData.isLeapMonth}
                                onChange={handleChange}
                                className="appearance-none w-4 h-4 rounded border border-white/30 checked:bg-gold-500 checked:border-gold-500 transition-colors"
                            />
                            <span className="text-sm text-starlight-200 group-hover:text-gold-400 transition-colors">윤달</span>
                        </label>
                    </div>
                )}

                {/* 생년월일 */}
                <div className="space-y-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-starlight-200 flex items-center gap-1">
                        <Calendar size={16} className="text-gold-500" /> 생년월일
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        required
                        className="w-full px-4 py-2 bg-midnight-900/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-starlight-100 [color-scheme:dark] transition-all"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                </div>

                {/* 태어난 시 */}
                <div className="space-y-2">
                    <label htmlFor="birthTime" className="block text-sm font-medium text-starlight-200 flex items-center gap-1">
                        <Clock size={16} className="text-gold-500" /> 태어난 시
                    </label>
                    <select
                        id="birthTime"
                        name="birthTime"
                        className="w-full px-4 py-2 bg-midnight-900/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-starlight-100 transition-all appearance-none"
                        value={formData.birthTime}
                        onChange={handleChange}
                    >
                        {BIRTH_TIME_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-midnight-900 text-starlight-100">
                                {option.time ? `${option.label} ${option.time}` : option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 출생지 */}
                <div className="space-y-2">
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-starlight-200 flex items-center gap-1">
                        <MapPin size={16} className="text-gold-500" /> 출생지
                    </label>
                    <select
                        id="birthPlace"
                        name="birthPlace"
                        className="w-full px-4 py-2 bg-midnight-900/60 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-starlight-100 transition-all appearance-none"
                        value={formData.birthPlace}
                        onChange={handleChange}
                    >
                        {BIRTHPLACE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-midnight-900 text-starlight-100">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-gradient-to-r from-midnight-700 to-midnight-800 border border-gold-500/40 text-gold-400 rounded-lg font-serif font-bold tracking-wider hover:from-midnight-600 hover:to-midnight-700 hover:border-gold-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles size={18} className="text-gold-300 group-hover:animate-pulse" />
                    <span>운명 확인하기</span>
                </button>
            </form>
        </Layout>
    );
};

export default Home;
