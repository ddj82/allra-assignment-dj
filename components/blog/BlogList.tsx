'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/api';
import {useEffect, useState} from "react";
import { blog } from "@/types/Items";
import dayjs from 'dayjs';
import Link from "next/link";
import {
    ChevronRight,
    ChevronLeft,
    ChevronsRight,
    ChevronsLeft,
} from "lucide-react";

interface BlogsProps {
    searchQuery: string;
    selectedCategory: string;
}

export default function BlogList({ searchQuery, selectedCategory }: BlogsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageGroupSize = 5; // 페이지 그룹

    const { data, isLoading, isError } = useQuery({
        queryKey: ['blogs', currentPage, searchQuery, selectedCategory],
        queryFn: () => getPosts({
            page: currentPage,
            pageSize: 12,
            term: searchQuery || undefined,
            category: selectedCategory || undefined,
        }),
    });

    // 검색어나 카테고리 변경 시 첫 페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    if (isLoading) return <div>로딩…</div>;
    if (isError) return <div>에러</div>;

    const totalPages = data?.totalPages || 1;

    // 현재 페이지가 속한 그룹의 시작 페이지 계산
    const getCurrentGroupStart = (page: number) => {
        return Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;
    };

    // 현재 그룹의 시작과 끝 페이지
    const currentGroupStart = getCurrentGroupStart(currentPage);
    const currentGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);

    // 표시할 페이지 번호들 생성
    const getVisiblePages = () => {
        const pages = [];
        for (let i = currentGroupStart; i <= currentGroupEnd; i++) {
            pages.push(i);
        }
        return pages;
    };

    // 버튼 핸들러들
    const goToFirstGroup = () => {
        const newGroupStart = getCurrentGroupStart(currentPage) - pageGroupSize;
        if (newGroupStart >= 1) {
            setCurrentPage(newGroupStart);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToNextGroup = () => {
        const newGroupStart = getCurrentGroupStart(currentPage) + pageGroupSize;
        if (newGroupStart <= totalPages) {
            setCurrentPage(newGroupStart);
        }
    };

    return (
        <div className="mt-9 md:mt-10">
            {/* 블로그 목록 */}
            {searchQuery && (
                <p className="mb-8 text-body-3 font-medium text-label-500">
                    '{searchQuery}'에 대한 {data.totalCount}개의 검색결과
                </p>
            )}

            {/* 결과 없음 메시지 */}
            {data?.list?.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[270px] lg:h-[550px]">
                    <div className="flex flex-col items-center justify-center gap-7 md:gap-8">
                        <div className="text-title-4 font-medium md:text-title-3">
                            검색 결과가 없어요
                        </div>
                    </div>
                    <p className="mt-5 text-body-3 font-normal text-label-700 md:text-body-2">
                        아래와 같은 단어로 다시 검색해보세요.
                    </p>
                    <div className="flex flex-wrap items-baseline gap-1">
                        <button className="searchTagBtn">트렌드</button>
                        <span className="font-normal text-label-900"> , </span>
                        <button className="searchTagBtn">올라소식</button>
                        <span className="font-normal text-label-900"> , </span>
                        <button className="searchTagBtn">이커머스</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.list?.map((blog: blog) => (
                    <Link key={blog.id} href={`/blogs/${blog.id}`}>
                        <div className="flex flex-col gap-6">
                            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
                                <img alt={blog.title} src={blog.thumbnail} className="object-cover"/>
                            </div>
                            <div>
                                <div>
                                    <p className="text-body-3 font-medium text-secondary-400">
                                        {blog.category}
                                    </p>
                                    <h3 className="mt-1 line-clamp-2 text-title-4 font-medium">{blog.title}</h3>
                                    <p className="mt-5 text-body-3 text-label-500">
                                        {dayjs(blog.createdAt).format("YYYY-MM-DD")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex w-full flex-wrap items-center justify-center gap-6 text-body-2 mt-9 md:mt-10 lg:mt-11">
                    {/* 왼쪽 버튼 */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToFirstGroup}
                            className="paginationBtn"
                            disabled={currentGroupStart <= pageGroupSize}
                        >
                            <ChevronsLeft size={24} />
                        </button>

                        <button
                            onClick={goToPrevPage}
                            className="paginationBtn"
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    {/* 페이지 번호 */}
                    <div className="flex items-center gap-1">
                        {getVisiblePages().map(pageNum => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:text-status-disable h-[40px] gap-3 px-6 text-body-2 !size-9 rounded-full hover:bg-component-alternative md:size-10 bg-component-alternative font-bold text-label-900"
                            >
                                <span className="translate-y-px text-body-3 md:text-body-2">{pageNum}</span>
                            </button>
                        ))}
                    </div>

                    {/* 오른쪽 버튼 */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToNextPage}
                            className="paginationBtn"
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={24} />
                        </button>

                        <button
                            onClick={goToNextGroup}
                            className="paginationBtn"
                            disabled={currentGroupStart + pageGroupSize > totalPages}
                        >
                            <ChevronsRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}