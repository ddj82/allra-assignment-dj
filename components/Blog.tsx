'use client';

import Blogs from "@/app/items/Blogs";
import Banners from "@/app/items/Banners";
import BlogHeader from "@/components/common/BlogHeader";
import {useState} from "react";

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <BlogHeader onSearch={setSearchQuery}/>
            <Banners/>
            <Blogs searchQuery={searchQuery}/>
        </div>
    );
};
