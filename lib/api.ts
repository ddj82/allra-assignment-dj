import {userData} from "@/types/Items";

const BASE_URL = 'https://allra-front-assignment.vercel.app/api';

export async function getBanners() {
    const res = await fetch(BASE_URL + '/blogs/banners', { cache: 'no-store' });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
}

export async function getPosts(params?: { page?: number; pageSize?: number; category?: string; term?: string; }) {
    const base = BASE_URL + '/blogs';
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
    const res = await fetch(BASE_URL + `/blogs/${id}`, { cache: 'no-store' });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
}

export async function verifyBusinessNumber(businessNumber: string) {
    const res = await fetch(BASE_URL + '/auth/verify-business-number', {
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
        throw new Error(data.errorMessage);
    }

    return data;
}

export async function insertUser(userFormData: userData) {
    const res = await fetch(BASE_URL + '/auth/register', {
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

export async function login(formData: {businessNumber: string, password: string}) {
    const res = await fetch(BASE_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...formData,
        }),
        cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    const loginInfo = await getMyInfo(data.accessToken);
    console.log("loginInfol",loginInfo);
    console.log("loginInfo.companyName",loginInfo.companyName);

    localStorage.setItem("companyName", loginInfo.companyName);
    window.dispatchEvent(new Event("auth:changed"));

    return data;
}

export async function getMyInfo(token: string) {
    const res = await fetch(BASE_URL + '/auth/me', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMessage);
    }

    return data;
}