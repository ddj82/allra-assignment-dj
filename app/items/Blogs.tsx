'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/api';
import { useState } from "react";
import { blog } from "@/types/Items";
import dayjs from 'dayjs';

export default function Blogs() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageGroupSize = 5; // 페이지 그룹

    const { data, isLoading, isError } = useQuery({
        queryKey: ['blogs', currentPage],
        queryFn: () => getPosts({ page: currentPage, pageSize: 12 }),
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
        <div>
            <div>
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
                <div className="pagination">
                    <div>
                        {/* << 버튼 - 이전 그룹의 첫 페이지로 */}
                        <button
                            onClick={goToFirstGroup}
                            disabled={currentGroupStart <= pageGroupSize}
                        >
                            &lt;&lt;
                        </button>

                        {/* < 버튼 - 이전 페이지로 */}
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {/* 페이지 번호들 */}
                        {getVisiblePages().map(pageNum => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* > 버튼 - 다음 페이지로 */}
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>

                        {/* >> 버튼 - 다음 그룹의 첫 페이지로 */}
                        <button
                            onClick={goToNextGroup}
                            disabled={currentGroupStart + pageGroupSize > totalPages}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}