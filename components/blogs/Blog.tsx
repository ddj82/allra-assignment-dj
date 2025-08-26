'use client';

import BlogList from "@/components/blogs/BlogList";
import BlogBanners from "@/components/blogs/BlogBanners";
import BlogHeader, {BlogHeaderRef} from "@/components/common/BlogHeader";
import {useEffect, useRef, useState} from "react";
import BlogCategory from "@/components/blogs/BlogCategory";
import {useRouter, useSearchParams} from "next/navigation";

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogHeaderRef = useRef<BlogHeaderRef>(null);

    // URL 파라미터에서 초기 값 읽기
    useEffect(() => {
        const term = searchParams.get('term') || '';
        const category = searchParams.get('category') || '';
        setSearchQuery(term);
        setSelectedCategory(category);
    }, [searchParams]);

    // 검색어 변경 핸들러 (페이지 이동)
    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(`/?term=${encodeURIComponent(query)}`);
        } else {
            router.push('/');
        }
    };

    // 카테고리 변경 핸들러 (페이지 이동)
    const handleCategoryChange = (category: string) => {
        if (category) {
            router.push(`/?category=${category}`);
        } else {
            router.push('/');
        }
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
            />
        </div>
    );
};
