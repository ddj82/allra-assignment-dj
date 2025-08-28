import {getPostById} from "@/lib/api";
import BlogDetail from "@/components/blogs/BlogDetail";
import {BlogDetailData} from "@/types/Items";

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