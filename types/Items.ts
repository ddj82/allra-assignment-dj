export interface blog {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    showCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogsProps {
    searchQuery: string;
    selectedCategory: string;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export interface BlogDetailData {
    category: string;
    content: string;
    createdAt: string;
    id: number;
    summary: string;
    thumbnail: string;
    title: string;
    updatedAt: string;
}

export interface BlogDetailProps {
    blog: BlogDetailData;
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

// 한글을 영어 값으로 변환하는 함수 (필요시)
export const getCategoryValue = (label: string): string => {
    const category = BLOG_CATEGORIES.find(cat => cat.label === label);
    return category?.value || '';
};