'use client';

import { useEffect } from "react";
import { loadTokens, startRefreshLoop } from "@/lib/auth";
import { refreshAccessToken } from "@/lib/apiAuth";

export default function RefreshToken() {
    useEffect(() => {
        const { refreshToken, refreshExpAt } = loadTokens();
        // RT가 있고 아직 유효하면 루프 재시작
        if (refreshToken && refreshExpAt > Date.now()) {
            startRefreshLoop(refreshAccessToken);
        }
    }, []);
    return null;
}