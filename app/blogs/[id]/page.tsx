import { getPostById } from '@/lib/api';
import dayjs from "dayjs";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

interface PageProps {
    params: { id: string };
}

export default async function BlogDetail({ params }: PageProps) {
    const blog = await getPostById(Number(params.id));

    return (
        <div className="max-md:container">
            <header>
                <div className="flex items-center gap-1 text-title-4 text-label-700">
                    <span className="cursor-pointer">블로그</span>
                    <ChevronRight size={20} />
                    {/*<Link>운영 팁</Link>*/}
                </div>
                <h2 className="mt-6 text-title-3 font-bold md:text-display-2 md:font-semibold">{blog.title}</h2>
                <p className="mt-2 text-body-3 text-label-500 md:text-title-4">
                    {dayjs(blog.createdAt).format('YYYY-MM-DD')}
                </p>
            </header>
            <div className="mx-auto max-w-[--breakpoint-md]">
                <pre>{JSON.stringify(blog, null, 2)}</pre>
                {/*<h1>{blog.title}</h1>*/}
                {/*<img src={blog.thumbnail} alt={blog.title} />*/}
                {/*<p>{blog.content}</p>*/}
                <div
                    dangerouslySetInnerHTML={{__html: blog.content}}
                    className="mt-8"
                />
            </div>
        </div>
    );
}