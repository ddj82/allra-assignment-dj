import {useRef} from "react";

interface BlogHeaderProps {
    onSearch: (query: string) => void;
}

export default function BlogHeader({ onSearch }: BlogHeaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        const query = inputRef.current?.value || '';
        onSearch(query);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="flex flex-col max-md:gap-8 md:flex-row md:items-center md:justify-between">
            <h2 className="text-title-3 font-bold text-label-800 md:text-title-2 lg:text-title-1">
                블로그
            </h2>
            <div className="relative">
                {/* 검색 버튼 */}
                <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-label-500 hover:text-label-700"
                >
                    🔍
                </button>
                <input
                    ref={inputRef}
                    className="ring-offset-background file:text-sm flex rounded-md border bg-background-default px-6 py-[12.5px] file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:text-status-disable disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] border-line-200 pl-11 text-body-1 placeholder:font-normal placeholder:text-label-500 w-full md:w-[400px] lg:w-[468px]"
                    autoComplete="off"
                    placeholder="검색어를 입력해주세요"
                    onKeyPress={handleKeyPress}
                />
            </div>
        </header>
    );
};
