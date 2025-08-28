'use client';

import Link from "next/link";
import {Dot} from "lucide-react";

export default function Footer() {
    return (
        <footer>
            <div className="shrink-0 block h-[60px] bg-background-default"></div>
            <div className="lg:gap-20 container flex flex-wrap-reverse items-start gap-8 py-10 md:flex-nowrap md:gap-11 lg:py-[60px]">
                <div className="grow">
                    <img
                        alt="allra logo"
                        loading="lazy"
                        width="95"
                        height="24"
                        className="w-[95px]"
                        src="/images/Logo/Normal.svg"
                    />
                    <div className="mt-6 flex flex-col gap-4 md:mt-9">
                        <main className="">
                            <div className="flex flex-wrap items-center gap-1 text-body-3 text-label-700">
                                <Link href="/" className="hover:font-bold">회사소개</Link>
                                <Dot size={10} />
                                <Link href="/" className="hover:font-bold">서비스 이용약관</Link>
                                <Dot size={10} />
                                <Link className="font-bold" href="/">개인정보 처리방침</Link>
                                <Dot size={10} />
                                <Link href="/" className="hover:font-bold">공지사항</Link>
                                <Dot size={10} />
                                <Link href="/" className="hover:font-bold">FAQ</Link>
                                <Dot size={10} />
                                <Link href="/" className="hover:font-bold">블로그</Link>
                                <Dot size={10} />
                                <Link href="/" className="hover:font-bold">채용정보</Link>
                            </div>
                        </main>
                        <main className="">
                            <div className="text-body-3 font-normal text-label-500 lg:text-body-2">
                                <p>
                                    (주)올라핀테크 ㅣ 사업자등록번호 : 509-86-01645 ㅣ 통신판매업신고 : 제2022-서울강남-02369호
                                </p>
                                <p>
                                    대표이사 김상수 ㅣ 주소 : 서울특별시 강남구 봉은사로 327, 11층(논현동, 궁도빌딩)
                                </p>
                            </div>
                        </main>
                        <p className="text-body-3 font-normal text-label-500">
                            © 2020. Allra Fintech Corp. All Rights Reserved.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 flex-wrap items-center md:grid-cols-4 lg:flex mt-3 md:mt-7">
                        <picture><img src="/images/KB금융그룹.svg" alt="partner"/></picture>
                        <picture><img src="/images/KB국민카드.svg" alt="partner"/></picture>
                        <picture><img src="/images/키움캐피탈.svg" alt="partner"/></picture>
                        <picture><img src="/images/금융위원회.svg" alt="partner"/></picture>
                        <picture><img src="/images/아기유니콘.svg" alt="partner"/></picture>
                        <picture><img src="/images/하나캐피탈.svg" alt="partner"/></picture>
                        <picture><img src="/images/기술보증기금.svg" alt="partner"/></picture>
                    </div>
                </div>
                <div className="shrink-0 h-px w-full bg-line-400 md:hidden"/>
                <div className="flex flex-col">
                    <h3 className="text-body-3 font-medium text-label-700 lg:text-body-2 lg:font-semibold">
                        고객센터
                    </h3>
                    <Link
                        href="tel:1811-1463"
                        className="font-mukta text-display-2 font-bold text-nowrap text-primary md:text-[44px] lg:text-display-1"
                    >
                        1811-1463
                    </Link>
                    <div className="flex flex-col gap-4 text-body-3 font-medium text-label-700">
                        <div className="flex flex-col gap-0">
                            <h3 className="font-medium text-label-500">운영시간</h3>
                            <div className="font-normal">
                                <p className="flex flex-wrap gap-1">
                                    <span>평일 10:00 ~ 17:00 </span>
                                    <span>(점심시간 11:30 ~ 13:00)</span>
                                </p>
                                <p>주말, 공휴일 휴무</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0">
                            <h3 className="font-medium text-label-500">E-mail</h3>
                            <div className="font-normal">
                                <Link href="mailto:help@allra.co.kr">help@allra.co.kr</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
