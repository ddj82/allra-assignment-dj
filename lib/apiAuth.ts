import {loadTokens, Tokens} from "@/lib/auth";


const BASE_URL = 'https://allra-front-assignment.vercel.app/api';

export async function refreshAccessToken(): Promise<Tokens> {
    const { refreshToken } = loadTokens();
    const res = await fetch(BASE_URL + "/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        throw new Error("refresh-failed");
    }

    const data = await res.json();
    return {
        accessToken: data.accessToken,
        accessTokenExpiresIn: data.accessTokenExpiresIn,
        refreshToken: data.refreshToken,
        refreshTokenExpiresIn: data.refreshTokenExpiresIn,
    };
}