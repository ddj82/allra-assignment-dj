'use client';

import BlogList from "@/components/blog/BlogList";
import BlogBanners from "@/components/blog/BlogBanners";
import BlogHeader, {BlogHeaderRef} from "@/components/common/BlogHeader";
import {useEffect, useRef, useState} from "react";
import BlogCategory from "@/components/blog/BlogCategory";
import {useRouter, useSearchParams} from "next/navigation";

export default function Blog() {

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogHeaderRef = useRef<BlogHeaderRef>(null);

    // URL 파라미터에서 초기 값 읽기
    useEffect(() => {
        const term = searchParams.get('term') || '';
        const category = searchParams.get('category') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);

        setSearchQuery(term);
        setSelectedCategory(category);
        setCurrentPage(page);
    }, [searchParams]);

    // URL 업데이트 함수
    const updateURL = (params: { term?: string; category?: string; page?: number }) => {
        const urlParams = new URLSearchParams();

        if (params.term?.trim()) {
            urlParams.set('term', params.term);
        }
        if (params.category) {
            urlParams.set('category', params.category);
        }
        if (params.page && params.page > 1) {
            urlParams.set('page', params.page.toString());
        }

        const newURL = urlParams.toString() ? `/?${urlParams.toString()}` : '/';
        router.push(newURL);
    };

    // 검색어 변경 핸들러 (카테고리 초기화, 페이지를 1로 리셋)
    const handleSearch = (query: string) => {
        updateURL({ term: query, page: 1 });
    };

    // 카테고리 변경 핸들러 (검색어 초기화, 페이지를 1로 리셋)
    const handleCategoryChange = (category: string) => {
        updateURL({ category: category, page: 1 });
    };

    // 페이지 변경 핸들러 (현재 검색어/카테고리 유지)
    const handlePageChange = (page: number) => {
        updateURL({
            term: searchQuery,
            category: selectedCategory,
            page: page
        });
    };

    return (
        <div>
            <BlogHeader ref={blogHeaderRef} onSearch={handleSearch} />
            <BlogBanners />
            <BlogCategory
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />
            <BlogList
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
