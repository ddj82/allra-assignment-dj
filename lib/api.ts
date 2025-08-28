export async function getBanners() {
    const res = await fetch('https://allra-front-assignment.vercel.app/api/blogs/banners', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getPosts(params?: { page?: number; pageSize?: number; category?: string; term?: string; }) {
    const base = 'https://allra-front-assignment.vercel.app/api/blogs';
    const url = new URL(base);

    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
        });
    }

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json(); // 그대로 반환
}

export async function getPostById(id: number) {
    const base = `https://allra-front-assignment.vercel.app/api/blogs/${id}`;
    const url = new URL(base);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}