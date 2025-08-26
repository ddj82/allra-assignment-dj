'use client';

import {useEffect, useState} from "react";
import Link from "next/link";
import {Check, ChevronRight} from "lucide-react";
import {verifyBusinessNumber} from "@/lib/api";

interface ValidationConfig {
    [key: string]: {
        pattern?: RegExp;
        customValidation?: (value: string) => boolean;
        errorMessage: string;
        successMessage?: string;
    };
}

export default function Register() {
    const [formData, setFormData] = useState({
        businessNumber: "",
        password: "",
        passwordConfirm: "",
        companyName: "올라핀테크",
        userName: "김올라",
        birthDate: "",
        phone: "",
        email: "",
        checkboxes: [false, false, false, false, false],
    });
    const [isCheckedAll, setIsCheckedAll] = useState(false);

    const checkboxList = [
        { label: "서비스 이용약관 동의", required: true, link: "https://intro.allra.co.kr/policy/terms"},
        { label: "개인(신용)정보 수집 및 이용동의", required: true, link: "https://intro.allra.co.kr/policy/privacy" },
        { label: "개인(신용)정보 제공 및 위탁동의", required: true, link: "https://intro.allra.co.kr/policy/manage" },
        { label: "개인(신용)정보 조회 동의", required: true, link: "https://intro.allra.co.kr/policy/inquiry" },
        { label: "마케팅 활용 및 광고성 정보 수신동의", required: false, link: "" },
    ];

    const handleCheckboxChange = (index: number) => {
        const newCheckboxes = [...formData.checkboxes];
        newCheckboxes[index] = !newCheckboxes[index];
        setFormData(prev => ({ ...prev, checkboxes: newCheckboxes }));
    };

    // 필수 체크박스들이 체크되었는지 확인
    const isAllRequiredChecked = checkboxList
        .map((checkbox, index) => checkbox.required ? formData.checkboxes[index] : true)
        .every(checked => checked);

    // 전체 동의 처리
    const handleCheckAll = () => {
        const newCheckedState = !isCheckedAll;
        setIsCheckedAll(newCheckedState);
        setFormData(prev => ({
            ...prev,
            checkboxes: prev.checkboxes.map(() => newCheckedState)
        }));
    };

    // 전체 동의 상태 업데이트
    useEffect(() => {
        const allChecked = formData.checkboxes.every(checked => checked);
        setIsCheckedAll(allChecked);
    }, [formData.checkboxes]);

    // 입력필드 업데이트
    const handleChange = (field: string, value: string | number | boolean[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNumericChange = (field: string, value: string, maxLength?: number) => {
        let numericValue = value.replace(/[^0-9]/g, '');

        // 최대 길이 제한
        if (maxLength && numericValue.length > maxLength) {
            numericValue = numericValue.slice(0, maxLength);
        }

        handleChange(field, numericValue);
    };

    // 사업자등록번호 검증
    const handleVerifyBusinessNumber = async () => {
        try {
            const result = await verifyBusinessNumber(formData.businessNumber);
            alert('인증이 완료되었습니다.');
        } catch (error: any) {
            alert(error.message);
        }
    };


    // 유효성 검사
    const validationConfig: ValidationConfig = {
        businessNumber: {
            pattern: /^\d{10}$/,
            errorMessage: "사업자등록번호 10자리를 입력해 주세요.",
            successMessage: "사업자등록번호 확인이 완료되었어요.",
        },
        password: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/,
            errorMessage: "8~15자리 영문, 숫자, 특수문자로 조합하여 입력해주세요.",
            successMessage: "사용 가능한 비밀번호에요.",
        },
        passwordConfirm: {
            customValidation: (value: string) => value === formData.password && value.length >= 8,
            errorMessage: "8~15자리 영문, 숫자, 특수문자로 조합하여 입력해주세요.",
        },
        birthDate: {
            pattern: /^\d{8}$/,
            errorMessage: "생년월일은 YYYYMMDD 형식입니다.",
        },
        phone: {
            pattern: /^\d{11}$/,
            errorMessage: "휴대폰 번호는 01012345678 형식입니다.",
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "이메일 형식이 올바르지 않습니다.",
        },
    };

    const [fieldStates, setFieldStates] = useState<{
        [key: string]: {
            isValid: boolean;
            errorMessage: string;
            successMessage: string;
        }
    }>({});

    const handleBlur = (field: string, value: string) => {
        const config = validationConfig[field];
        if (!config) return;

        let isValid = false;

        if (config.customValidation) {
            isValid = config.customValidation(value);
        } else if (config.pattern) {
            isValid = config.pattern.test(value);
        }

        // DOM 요소 찾아서 스타일 변경
        const inputElement = document.getElementById(field) as HTMLInputElement;
        if (inputElement) {
            if (!isValid) {
                inputElement.classList.add('border-red-500', 'focus:ring-red-500');
            } else {
                inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
            }
        }

        setFieldStates(prev => ({
            ...prev,
            [field]: {
                isValid,
                errorMessage: isValid ? "" : config.errorMessage,
                successMessage: isValid && config.successMessage ? config.successMessage : "",
            }
        }));
    };

    return (
        <div className="pt-[80px] max-md:container pb-10 relative mx-auto max-w-[520px] md:px-7 space-y-8">
            <header>
                <h1 className="text-center text-title-2 md:text-title-1 lg:text-display-2">
                    지금 회원가입하면
                    <br/>
                    <span className="font-bold">
                        수수료 지원금 3만원 지급!
                    </span>
                </h1>
            </header>
            <div>
                <div className="relative space-y-0 sm:space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="absolute bottom-0 z-0 h-[100px] w-[10px]"></div>
                        <span className="text-primary relative z-10 text-body-3 font-normal md:text-body-2">
                            최대 1,250만원까지 무료 선정산이 가능해요.
                        </span>
                        <span className="text-primary text-body-3 font-medium md:text-body-2 md:font-semibold">
                            0%
                        </span>
                    </div>
                    <form>
                        {/* 동의 */}
                        <div>
                            <div className="flex items-center gap-4">
                                <input
                                    id="isCheckedAll"
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={isCheckedAll}
                                    onChange={handleCheckAll}
                                />
                                <label
                                    htmlFor="isCheckedAll"
                                    className="
                                        size-5 inline-flex items-center justify-center
                                        rounded-xs border border-component-dark
                                        overflow-hidden cursor-pointer select-none
                                        transition
                                        peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2
                                    "
                                    aria-hidden="true"
                                >
                                    <span className="flex items-center justify-center text-current">
                                        {isCheckedAll && <Check size={13}/>}
                                    </span>
                                </label>

                                <label
                                    htmlFor="isCheckedAll"
                                    className="cursor-pointer text-body-1 font-semibold sm:text-title-4"
                                >
                                    전체 동의
                                </label>
                            </div>
                            <div className="shrink-0 h-px w-full bg-line-400 my-7"/>
                            <div className="flex flex-col gap-7">
                                {checkboxList.map((checkbox, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    id={"checkbox" + index}
                                                    type="checkbox"
                                                    className="peer sr-only"
                                                    checked={formData.checkboxes[index]}
                                                    onChange={() => handleCheckboxChange(index)}
                                                />
                                                <label
                                                    htmlFor={"checkbox" + index}
                                                    className="
                                                        size-5 inline-flex items-center justify-center
                                                        rounded-xs border border-component-dark
                                                        overflow-hidden cursor-pointer select-none
                                                        transition
                                                        peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2
                                                    "
                                                    aria-hidden="true"
                                                >
                                                    <span className="flex items-center justify-center text-current">
                                                        {formData.checkboxes[index] && <Check size={13}/>}
                                                    </span>
                                                </label>
                                                <label
                                                    htmlFor={"checkbox" + index}
                                                    className="flex cursor-pointer items-baseline text-body-2 text-label-700 md:text-body-1"
                                                >
                                                    {checkbox.label} {checkbox.required && "필수"}
                                                </label>
                                            </div>
                                            {checkbox.required && (
                                                <Link href={checkbox.link} target="_blank" rel="noopener noreferrer">
                                                    <ChevronRight size={24} color={'#9CA3AF'}/>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed bg-primary text-label-100 hover:bg-secondary-400 active:bg-secondary-600 disabled:bg-status-disable disabled:text-label-100 h-[48px] md:h-[56px] gap-4 rounded-lg md:rounded-xl px-6 text-title-4 font-semibold w-full"
                                    disabled={!isAllRequiredChecked}
                                >
                                    다음
                                </button>
                            </div>
                        </div>

                        {/* 정보 */}
                        <div>
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="space-y-0">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor=""
                                            className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700 py-0"
                                        >
                                            사업자등록번호 (ID)
                                        </label>
                                        <Link
                                            href=""
                                            target="_blank"
                                            className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed p-0! underline underline-offset-4 hover:bg-label-100 active:bg-background-alternative disabled:text-status-disable h-[32px] gap-1 rounded-sm text-body-3 font-medium text-label-700"
                                        >
                                            사업자 번호가 기억나지 않아요
                                        </Link>
                                    </div>
                                    <div className="flex items-stretch gap-4">
                                        <input
                                            id="businessNumber"
                                            name="businessNumber"
                                            type="text"
                                            value={formData.businessNumber}
                                            onChange={(e) => handleNumericChange("businessNumber", e.target.value, 10)}
                                            onBlur={(e) => handleBlur("businessNumber", e.target.value)}
                                            placeholder="-제외 10자리 입력"
                                            className="ring-offset-background file:text-sm flex w-full rounded-md border bg-background-default px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:text-status-disable disabled:placeholder:text-status-disable h-[48px] focus:ring-1 focus:ring-component-dark outline-none"
                                        />
                                        <button 
                                            type="button"
                                            disabled={!fieldStates.businessNumber?.isValid}
                                            onClick={handleVerifyBusinessNumber}
                                            className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed border border-secondary-300 bg-background-default text-primary hover:border-secondary-300 hover:bg-label-100 active:bg-background-alternative disabled:border-status-disable disabled:bg-background-default disabled:text-status-disable gap-3 rounded-md px-6 text-body-2 font-semibold h-[48px] min-w-[96px]"
                                        >
                                            인증하기
                                        </button>
                                    </div>
                                    {fieldStates.businessNumber?.errorMessage && (
                                        <p className="text-red-500 text-body-3 mt-1 ml-2">
                                            {fieldStates.businessNumber.errorMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-12 flex w-full flex-col">
                                <button 
                                    type="button"
                                    className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed bg-primary text-label-100 hover:bg-secondary-400 active:bg-secondary-600 disabled:bg-status-disable disabled:text-label-100 h-[48px] md:h-[56px] gap-4 rounded-lg md:rounded-xl px-6 text-title-4 font-semibold" disabled
                                >
                                    가입하기
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
