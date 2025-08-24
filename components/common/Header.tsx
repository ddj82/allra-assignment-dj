export default function Header() {
    return (
        <header className="flex justify-between">
            <div className="fixed top-0 left-0 z-40 h-header w-full bg-background-default">
                <div className="size-full">
                    <div className="container flex h-full items-center justify-between *:h-full">
                        {/* 로고 */}
                        <div className="flex items-center gap-11">
                            로고
                        </div>
                        {/* 회원가입/로그인 pc */}
                        <div className="flex items-center gap-4 max-lg:hidden">
                            <button className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed border border-secondary-300 bg-background-default text-primary hover:border-secondary-300 hover:bg-label-100 active:bg-background-alternative disabled:border-status-disable disabled:bg-background-default disabled:text-status-disable h-[32px] gap-1 rounded-sm px-6 text-body-3 font-medium">
                                회원가입
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed border bg-background-default text-label-800 hover:bg-label-100 active:bg-background-alternative disabled:border-line-400 disabled:text-status-disable h-[32px] gap-1 rounded-sm px-6 text-body-3 font-medium">
                                로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
