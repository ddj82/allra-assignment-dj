import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {Search, X} from "lucide-react";

interface BlogHeaderProps {
    onSearch: (query: string) => void;
}

export interface BlogHeaderRef {
    clearInput: () => void;
}

const BlogHeader = forwardRef<BlogHeaderRef, BlogHeaderProps>(({ onSearch }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [hasValue, setHasValue] = useState(false);

    const handleSearch = () => {
        const query = inputRef.current?.value || '';
        onSearch(query);
    };

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            setHasValue(false);
            inputRef.current.focus();
        }
    };

    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            setHasValue(false);
        }
    };

    // 부모 컴포넌트에서 clearInput 함수를 호출할 수 있도록 노출
    useImperativeHandle(ref, () => ({
        clearInput
    }));

    const handleInputChange = () => {
        const value = inputRef.current?.value || '';
        setHasValue(value.length > 0);
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
                <Search
                    size={16}
                    className={`absolute top-1/2 left-5 -translate-y-1/2 text-label-700 ${
                        hasValue ? 'cursor-pointer' : 'pointer-events-none'
                    }`}
                    onClick={hasValue ? handleSearch : undefined}
                />
                <input
                    ref={inputRef}
                    className="ring-offset-background file:text-sm flex rounded-md border bg-background-default px-6 py-[12.5px] file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:text-status-disable disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] border-line-200 pl-11 text-body-1 placeholder:font-normal placeholder:text-label-500 w-full md:w-[400px] lg:w-[468px]"
                    autoComplete="off"
                    placeholder="검색어를 입력해주세요"
                    onKeyPress={handleKeyPress}
                    onChange={handleInputChange}
                />
                {hasValue && (
                    <X
                        size={16}
                        className="absolute top-1/2 right-5 -translate-y-1/2 text-label-700 cursor-pointer hover:text-label-800"
                        onClick={handleClear}
                    />
                )}
            </div>
        </header>
    );
});

BlogHeader.displayName = 'BlogHeader';

export default BlogHeader;