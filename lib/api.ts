export async function getBanners() {
    const res = await fetch('https://allra-front-assignment.vercel.app/api/blogs/banners', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}