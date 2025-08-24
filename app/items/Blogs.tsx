'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/api';
import { useState } from "react";
import { blog } from "@/types/Items";
import dayjs from 'dayjs';

interface BlogsProps {
    searchQuery: string;
}

export default function Blogs({ searchQuery }: BlogsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageGroupSize = 5; // 페이지 그룹

    const { data, isLoading, isError } = useQuery({
        queryKey: ['blogs', currentPage, searchQuery],
        queryFn: () => getPosts({
            page: currentPage,
            pageSize: 12,
            term: searchQuery || undefined
        }),
    });

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
            <div className="grid grid-cols-1 gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.list?.map((blog: blog) => (
                    <div key={blog.id} className="flex flex-col gap-6">
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
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex w-full flex-wrap items-center justify-center gap-6 text-body-2 mt-9 md:mt-10 lg:mt-11">
                {/* 오른쪽 버튼 */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={goToFirstGroup}
                        className="paginationBtn"
                        disabled={currentGroupStart <= pageGroupSize}
                    >
                        &lt;&lt;
                    </button>

                    <button
                        onClick={goToPrevPage}
                        className="paginationBtn"
                        disabled={currentPage === 1}
                    >
                        &lt;
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

                {/* 왼쪽 버튼 */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={goToNextPage}
                        className="paginationBtn"
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>

                    <button
                        onClick={goToNextGroup}
                        className="paginationBtn"
                        disabled={currentGroupStart + pageGroupSize > totalPages}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}