'use client';

import Link from "next/link";
import {useEffect, useState} from "react";
import {AUTH_EVENT, clearTokens, stopRefreshLoop} from "@/lib/auth";
import { usePathname } from 'next/navigation';
import {ChevronRight} from "lucide-react";

export default function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [headerName, setHeaderName] = useState("");
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/sign-up');

    useEffect(() => {
        const sync = () => {
            setIsLogin(localStorage.getItem("authStatus") === "1");
            setHeaderName(localStorage.getItem("companyName") ?? "");
        };
        sync(); // 초기 1회

        // 같은 탭: saveTokens/clearTokens → AUTH_EVENT 발생
        const onAuth = () => sync();
        window.addEventListener(AUTH_EVENT, onAuth);

        // 다른 탭: storage 이벤트로 동기화
        const onStorage = (e: StorageEvent) => {
            if (e.key === "authStatus") sync();
        };
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener(AUTH_EVENT, onAuth);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const handleLogout = () => {
        stopRefreshLoop();
        clearTokens();
        window.location.reload();
    };

    return (
        <header className="flex justify-between">
            <div className="fixed top-0 left-0 z-40 h-[60px] w-full bg-background-default">
                <div className="size-full">
                    <div className="container flex h-full items-center justify-between *:h-full">
                        {/* 로고 */}
                        <div className="flex items-center gap-11">
                            <Link href="/" className="flex items-center justify-center w-24 h-16">
                                <img loading="lazy"  src="/images/Logo/Frame 974.png" alt="allra logo"/>
                            </Link>
                        </div>
                        {isLogin ? (
                            <div className="flex items-center gap-4">
                                <div className="text-body-2 font-bold">{headerName}님</div>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer border bg-background-default text-label-800 hover:bg-label-100 active:bg-background-alternative h-[32px] rounded-sm px-3 text-body-3 font-medium"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            /* 회원가입/로그인 pc */
                            !isAuthPage && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer border border-secondary-300 bg-background-default text-primary hover:border-secondary-300 hover:bg-label-100 active:bg-background-alternative h-[32px] gap-1 rounded-sm px-3 text-body-3 font-medium"
                                    >
                                        <Link href="/sign-up">회원가입</Link>
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer border bg-background-default text-label-800 hover:bg-label-100 active:bg-background-alternative h-[32px] gap-1 rounded-sm px-3 text-body-3 font-medium"
                                    >
                                        <Link href="/login">로그인</Link>
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                    <div className="shrink-0 h-px w-full bg-line-200"></div>
                    {pathname?.startsWith('/login') && (
                        <div className="w-full fixed left-0 z-30 bg-label-100">
                            <div className="container flex items-center justify-end bg-label-100 font-normal text-label-700 h-breadcrumb-mobile text-caption-1 md:h-breadcrumb-tablet md:text-body-3 py-2">
                                <div className="flex items-center gap-1 text-body-3">
                                    <Link href="/">홈</Link>
                                    <ChevronRight size={20}/>
                                    <Link href="/login">로그인</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="shrink-0 block h-[60px] bg-background-default"></div>
        </header>
    );
};
