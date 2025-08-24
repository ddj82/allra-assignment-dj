'use client';

import {useQuery} from "@tanstack/react-query";
import {getBanners} from "@/lib/api";
import {banner} from "@/types/Items";

export default function Banners() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['banners'],
        queryFn: getBanners,
    });

    if (isLoading) return <div>로딩…</div>;
    if (isError)   return <div>에러</div>;

    return (
        <div className="mt-8 md:mt-10">
            <div className="relative md:hidden">
                {data?.map((b: banner) => (
                    <div key={b.id} className="overflow-hidden">
                        <div className="flex -ml-6"> {/* style={{transform: "translate3d(-616px, 0px, 0px)"}} */}
                            <div className="min-w-0 shrink-0 grow-0 basis-full pl-6">
                                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-line-200">
                                    <img alt={b.title} src={b.thumbnail} className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden gap-6 md:flex">
                {data?.map((b: banner) => (
                    <div key={b.id}
                         className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-line-200">
                    <img alt={b.title} src={b.thumbnail} className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"/>
                    </div>
                ))}
            </div>
        </div>
    );
};