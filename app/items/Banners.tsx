'use client';

import {useQuery} from "@tanstack/react-query";
import {getBanners} from "@/lib/api";

export default function Banners() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['banners'],
        queryFn: getBanners,
    });

    if (isLoading) return <div>로딩…</div>;
    if (isError)   return <div>에러</div>;

    return (
        <div>
            <div className="flex">
                {data?.map(b => (
                    <div key={b.id}>
                        <img alt={b.title} src={b.thumbnail}/>
                    </div>
                ))}
            </div>
        </div>
    );
};