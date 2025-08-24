'use client';

import BlogList from "@/components/blog/BlogList";
import BlogBanners from "@/components/blog/BlogBanners";
import BlogHeader from "@/components/common/BlogHeader";
import {useState} from "react";

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <BlogHeader onSearch={setSearchQuery}/>
            <BlogBanners/>
            <BlogList searchQuery={searchQuery}/>
        </div>
    );
};
