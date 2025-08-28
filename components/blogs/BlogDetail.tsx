'use client';

import dayjs from "dayjs";
import Link from "next/link";
import {ChevronRight, Link2} from "lucide-react";
import {BlogDetailProps, getCategoryLabel} from "@/types/Items";
import {useRouter} from "next/navigation";

export default function BlogDetail({ blog }: BlogDetailProps ) {
    const router = useRouter();

    const handleBackToList = () => {
        router.back();
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('링크가 복사되었습니다!');
        } catch (err) {
            console.error('복사 실패:', err);
        }
    };

    return (
        <div className="max-md:container">
            <div className="mx-auto max-w-[--breakpoint-md]">
                <header>
                    <div className="flex items-center gap-1 text-title-4 text-label-700">
                        <Link href="/" className="cursor-pointer">블로그</Link>
                        <ChevronRight size={20} />
                        <Link href={`/?category=${blog.category}`}>{getCategoryLabel(blog.category)}</Link>
                    </div>
                    <h2 className="mt-6 text-title-3 font-bold md:text-display-2 md:font-semibold">{blog.title}</h2>
                    <p className="mt-2 text-body-3 text-label-500 md:text-title-4">
                        {dayjs(blog.createdAt).format('YYYY-MM-DD')}
                    </p>
                </header>
                <div
                    dangerouslySetInnerHTML={{__html: blog.content}}
                    className="mx-auto prose min-w-full prose-p:my-0 prose-img:my-0"
                />
                <div className="flex items-center justify-center gap-2 font-semibold md:gap-6 mt-7 md:mt-10 lg:mt-14">
                    <button
                        type="button"
                        onClick={handleBackToList}
                        className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer border bg-background-default text-label-800 hover:bg-label-100 active:bg-background-alternative h-[48px] gap-2 rounded-lg px-4 text-body-1 font-semibold"
                    >
                        목록으로 돌아가기
                    </button>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer border border-secondary-300 bg-background-default text-primary hover:border-secondary-300 hover:bg-label-100 active:bg-background-alternative h-[48px] gap-2 rounded-lg px-4 text-body-1 font-semibold"
                    >
                        <Link2 size={20}/>공유하기
                    </button>
                </div>
            </div>
        </div>
    );
}