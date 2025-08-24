import { getPostById } from '@/lib/api';

interface PageProps {
    params: { id: string };
}

export default async function BlogDetail({ params }: PageProps) {
    const blog = await getPostById(Number(params.id));

    return (
        <div>
            <h1>{blog.title}</h1>
            <img src={blog.thumbnail} alt={blog.title} />
            <p>{blog.content}</p>
        </div>
    );
}