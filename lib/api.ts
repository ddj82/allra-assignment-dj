import {userData} from "@/types/Items";

export async function getBanners() {
    const res = await fetch('https://allra-front-assignment.vercel.app/api/blogs/banners', { cache: 'no-store' });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
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
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
}

export async function getPostById(id: number) {
    const res = await fetch(`https://allra-front-assignment.vercel.app/api/blogs/${id}`, { cache: 'no-store' });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
}

export async function verifyBusinessNumber(businessNumber: string) {
    const res = await fetch('https://allra-front-assignment.vercel.app/api/auth/verify-business-number', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            businessNumber: businessNumber
        }),
        cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        // 409는 이미 등록된 사업자번호
        if (res.status === 409) {
            throw new Error(data.errorMessage);
        }
        throw new Error(data.errorMessage);
    }

    return data;
}

export async function insertUser(userFormData: userData) {
    const res = await fetch('https://allra-front-assignment.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...userFormData,
        }),
        cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
}