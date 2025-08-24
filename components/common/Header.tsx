export default function Header() {
    return (
        <header className="flex justify-between">
            <div>올라 이미지</div>
            <div className="flex gap-2">
                <div className="border border-blue-400 text-blue-400 rounded py-1 px-3 font-bold text-sm">회원가입</div>
                <div className="border border-gray-300 text-gray-700 rounded py-1 px-3 font-bold text-sm">로그인</div>
            </div>
        </header>
    );
};
