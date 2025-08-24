import {BLOG_CATEGORIES} from "@/types/Items";

interface BlogCategoryProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function BlogCategory({ selectedCategory, onCategoryChange }: BlogCategoryProps) {
    return (
        <div className="mt-8 md:mt-10 lg:mt-11">
            <div className="scrollbar-hide flex items-center overflow-scroll border-b border-b-line-200">
                {BLOG_CATEGORIES.map((category) => (
                    <div key={category.value} className="relative">
                        <button
                            onClick={() => onCategoryChange(category.value)}
                            className={`text-body-1 whitespace-nowrap py-[15px] px-5 relative text-label-900 font-semibold ${
                                selectedCategory === category.value
                                    ? 'text-label-900 font-semibold'
                                    : 'text-label-500 font-normal hover:text-label-700'
                            }`}
                        >
                            {category.label}
                        </button>
                        {selectedCategory === category.value && (
                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-label-900" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}