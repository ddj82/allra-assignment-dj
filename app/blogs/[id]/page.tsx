import { getPostById } from '@/lib/api';
import dayjs from "dayjs";
import Link from "next/link";
import {ChevronRight} from "lucide-react";
import {getCategoryLabel} from "@/types/Items";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetail({ params }: PageProps) {
    const { id } = await params;
    const blog = await getPostById(Number(id));

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
                {/*<pre>{JSON.stringify(blog, null, 2)}</pre>*/}
                <div
                    dangerouslySetInnerHTML={{__html: blog.content}}
                    className="mx-auto prose min-w-full prose-p:my-0 prose-img:my-0"
                />
            </div>
        </div>
    );
}