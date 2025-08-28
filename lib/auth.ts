export type Tokens = {
    accessToken: string;
    accessTokenExpiresIn: number;   // 서버가 주는 초 단위 (예: 30)
    refreshToken: string;
    refreshTokenExpiresIn: number;  // 서버가 주는 초 단위 (예: 300)
};

const LS = {
    access: "accessToken",
    refresh: "refreshToken",
    accessExpAt: "accessTokenExpiresAt",
    refreshExpAt: "refreshTokenExpiresAt",
};

function toMs(expOrTtl: number) {
    // 이미 ms 단위 절대시각(예: 1.7e12 이상)
    if (expOrTtl > 1e12) return expOrTtl;
    // 초 단위 절대시각(현재 시점 기준 1e9 ~ 2e9대)
    if (expOrTtl > 1e9) return expOrTtl * 1000;
    // TTL(남은 초)로 들어온 경우
    return Date.now() + expOrTtl * 1000;
}

const STATUS_KEY = "authStatus";
const AUTH_EVENT = "auth:changed";
const setStatus = (on: boolean) => {
    on ? localStorage.setItem(STATUS_KEY, "1") : localStorage.removeItem(STATUS_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT)); // ← 추가: 같은 탭 갱신 트리거
};

export { AUTH_EVENT };

export const isLoggedInFlag = () => localStorage.getItem(STATUS_KEY) === "1";

export function saveTokens(t: Tokens) {
    localStorage.setItem(LS.access, t.accessToken);
    localStorage.setItem(LS.refresh, t.refreshToken);
    localStorage.setItem(LS.accessExpAt, String(toMs(t.accessTokenExpiresIn)));
    localStorage.setItem(LS.refreshExpAt, String(toMs(t.refreshTokenExpiresIn)));
    setStatus(true);
}

export function loadTokens() {
    return {
        accessToken: localStorage.getItem(LS.access) || "",
        refreshToken: localStorage.getItem(LS.refresh) || "",
        accessExpAt: Number(localStorage.getItem(LS.accessExpAt) || 0),
        refreshExpAt: Number(localStorage.getItem(LS.refreshExpAt) || 0),
    };
}

export function clearTokens() {
    Object.values(LS).forEach(k => localStorage.removeItem(k));
    setStatus(false);
    localStorage.removeItem("companyName");
}

// 리프레시 루프에서 RT 만료/실패 시 상태도 OFF
let loopId: number | null = null;

export function startRefreshLoop(refreshFn: () => Promise<Tokens>) {
    stopRefreshLoop();

    const tick = async () => {
        const { accessExpAt, refreshExpAt } = loadTokens();
        const now = Date.now();
        if (!refreshExpAt || now >= refreshExpAt - 500) {
            // RT도 만료, 갱신 불가 → 루프 종료
            stopRefreshLoop();
            clearTokens();
            return;
        }
        // Access 만료 5초 전이면 갱신 시도
        if (!accessExpAt || now >= accessExpAt - 5000) {
            try {
                const newTokens = await refreshFn();
                saveTokens(newTokens);
            } catch (e) {
                // 리프레시 실패 시 루프 종료
                stopRefreshLoop();
                clearTokens();
            }
        }
    };

    // 1초 주기로 가볍게 체크
    loopId = window.setInterval(tick, 1000);
    // 첫 진입 즉시 한 번 체크
    tick();
}

export function stopRefreshLoop() {
    if (loopId) {
        clearInterval(loopId);
        loopId = null;
    }
}
