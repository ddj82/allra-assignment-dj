export interface banner {
    id: number;
    summary: string;
    thumbnail: string;
    title: string;
}

export interface blog {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    showCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface userData {
    businessNumber: string;
    userName: string;
    password: string;
    companyName: string;
    phone: string;
    email: string;
    partnerId: string;
    birthDate: string;
    isMarketingConsent: boolean;
    businessNumberVerifyToken: string;
}

export const BLOG_CATEGORIES = [
    { value: '', label: '전체' },
    { value: 'TREND', label: '트렌드' },
    { value: 'TIP', label: '운영 팁' },
    { value: 'GUIDE', label: '올라가이드' },
    { value: 'NEWS', label: '올라소식' },
    { value: 'EXPERIENCE', label: '고객사례' },
] as const;

// 영어 값을 한글로 변환하는 함수
export const getCategoryLabel = (value: string): string => {
    const category = BLOG_CATEGORIES.find(cat => cat.value === value);
    return category?.label || value;
};

