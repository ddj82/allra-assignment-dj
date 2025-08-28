import {getPostById} from "@/lib/api";
import {BlogDetailData} from "@/types/Items";
import BlogDetail from "@/components/blogs/BlogDetail";

interface PageProps {
    params: Promise<{ id: string }>,
}

export default async function Detail({params}: PageProps) {
    const {id} = await params;
    const blog: BlogDetailData = await getPostById(Number(id));

    return (
        <div>
            <BlogDetail blog={blog}/>
        </div>
    );
}