'use client';

import {useQuery} from "@tanstack/react-query";
import {getBanners} from "@/lib/api";
import {banner} from "@/types/Items";
import Link from "next/link";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";

export default function BlogBanners() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['banners'],
        queryFn: getBanners,
    });

    const [currentIndex, setCurrentIndex] = useState(0);

    // 자동 슬라이드 (옵션)
    useEffect(() => {
        if (!data || data.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % data.length);
        }, 5000); // 5초마다 자동 슬라이드

        return () => clearInterval(interval);
    }, [data]);

    if (isLoading) return <div>로딩…</div>;
    if (isError)   return <div>에러</div>;

    return (
        <div className="mt-8 md:mt-10">
            {/* pc */}
            <div className="hidden gap-6 md:flex">
                {data?.map((b: banner) => (
                    <div
                        key={b.id}
                        className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-line-200"
                    >
                        <img
                            alt={b.title}
                            src={b.thumbnail}
                            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            {/* 모바일 */}
            <div className="relative md:hidden">
                <div className="overflow-hidden">
                    <div className="flex -ml-6">
                        {data?.map((b: banner, index: number) => (
                            <motion.div
                                key={index}
                                className="min-w-0 shrink-0 grow-0 basis-full pl-6"
                                animate={{
                                    transform: `translate3d(-${currentIndex * 100}%, 0px, 0px)`
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                                drag="x"
                                dragConstraints={{left: -100, right: 100}}
                                dragElastic={0.1}
                                onDragEnd={(event, info) => {
                                    const threshold = 50;
                                    const swipeDistance = info.offset.x;

                                    if (swipeDistance > threshold && currentIndex > 0) {
                                        setCurrentIndex(currentIndex - 1);
                                    } else if (swipeDistance < -threshold && currentIndex < (data?.length || 1) - 1) {
                                        setCurrentIndex(currentIndex + 1);
                                    }
                                }}
                            >
                                <Link href={`/blogs/${b.id}`}>
                                    <div
                                        className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-line-200">
                                        <img
                                            alt={b.title}
                                            src={b.thumbnail}
                                            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105 select-none"
                                            draggable={false}
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
