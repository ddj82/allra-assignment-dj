'use client';

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Check, ChevronRight, Eye, EyeOff} from "lucide-react";
import {insertUser, verifyBusinessNumber} from "@/lib/api";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {useRouter} from "next/navigation";

dayjs.extend(customParseFormat);

interface ValidationConfig {
    [key: string]: {
        pattern?: RegExp;
        customValidation?: (value: string) => boolean;
        errorMessage: string;
        successMessage?: string;
    };
}


export default function Register() {
    const router = useRouter();
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
        businessNumberVerifyToken: "",
    });

    // 필수 동의 완료 후 다음 단계 상태
    const [isTermsComplete, setIsTermsComplete] = useState(false);

    // 체크박스 상태
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const checkboxList = [
        { label: "서비스 이용약관 동의", required: true, link: "https://intro.allra.co.kr/policy/terms"},
        { label: "개인(신용)정보 수집 및 이용동의", required: true, link: "https://intro.allra.co.kr/policy/privacy" },
        { label: "개인(신용)정보 제공 및 위탁동의", required: true, link: "https://intro.allra.co.kr/policy/manage" },
        { label: "개인(신용)정보 조회 동의", required: true, link: "https://intro.allra.co.kr/policy/inquiry" },
        { label: "마케팅 활용 및 광고성 정보 수신동의", required: false, link: "" },
    ];

    // 비밀번호 보이게
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // 사업자등록번호 인증 상태
    const [isVerifyBusinessNumber, setIsVerifyBusinessNumber] = useState(false);
    // 핸드폰 앞자리
    const validPhoneNumber = ['010', '011', '016', '017', '018', '019'];
    // 사업자등록번호 포멧
    const [displayBusinessNumber, setDisplayBusinessNumber] = useState('');
    // 핸드폰 번호 포멧
    const [displayPhone, setDisplayPhone] = useState('');
    // 생년월일 포멧
    const [displayBirthDate, setDisplayBirthDate] = useState('');

    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 진행도 상태
    const [progress, setProgress] = useState(0);
    const [validFields, setValidFields] = useState(new Set());

    // 동의 완료 후 기본 점수
    const BASE_PROGRESS = 15;

    // 완료된 필드 개수에 따른 점수 계산
    const calculateProgress = (validFieldsCount: number) => {
        let additionalScore = 0;

        for (let i = 1; i <= validFieldsCount; i++) {
            if (i % 2 === 1) {
                // 홀수번째
                additionalScore += 11;
            } else {
                // 짝수번째
                additionalScore += 10;
            }
        }

        // 8개 모든 필드가 완료되면 추가로 1점 더하기
        if (validFieldsCount === 8) {
            additionalScore += 1;
        }

        return Math.min(BASE_PROGRESS + additionalScore, 100);
    };

    const handleTermsComplete = () => {
        setIsTermsComplete(true);
        setProgress(BASE_PROGRESS);
    };

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

    // "-" 포맷팅 함수
    const formatNumberValue = (field: string, value: string) => {
        if (field === "phone") {
            if (!value || value.length !== 11) return value;
            return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
        } else if (field === "birthDate") {
            if (!value || value.length !== 8) return value;
            return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
        } else {
            if (!value || value.length !== 10) return value;
            return `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
        }
    };

    // 사업자등록번호 검증
    const handleVerifyBusinessNumber = async () => {
        try {
            const result = await verifyBusinessNumber(formData.businessNumber);
            if (result.businessNumberVerifyToken) {
                formData.businessNumberVerifyToken = result.businessNumberVerifyToken;
                alert('인증이 완료되었습니다.');
                setIsVerifyBusinessNumber(true);
                setDisplayBusinessNumber(formatNumberValue("businessNumber", formData.businessNumber));

                // 인증 성공을 validFields에 추가
                setValidFields(prev => {
                    const newValidFields = new Set(prev);

                    // 대표자 이름을 넣어놨기 때문에 대표자명 필드 추가
                    newValidFields.add('userName');
                    // 인증 성공을 별도 필드로 추가
                    newValidFields.add('businessNumberVerified');

                    const newProgress = calculateProgress(newValidFields.size);
                    setProgress(newProgress);

                    return newValidFields;
                });
            }
        } catch (error: any) {
            alert(error.message);
            const config = validationConfig["businessNumber"];
            config.errorMessage = error.message;
            setFieldStates({
                ["businessNumber"]: {
                    isValid: true,
                    errorMessage: config.errorMessage,
                }
            });
        }
    };

    // 유효성 검사
    const validationConfig: ValidationConfig = {
        businessNumber: {
            pattern: /^\d{10}$/,
            errorMessage: "사업자등록번호 10자리를 입력해 주세요.",
        },
        password: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/,
            errorMessage: "8~15자리 영문, 숫자, 특수문자로 조합하여 입력해주세요.",
        },
        passwordConfirm: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/,
            errorMessage: "8~15자리 영문, 숫자, 특수문자로 조합하여 입력해주세요.",
            successMessage: "사용 가능한 비밀번호에요.",
        },
        userName: {
            customValidation: (value: string) => !(value === "" || (value.trim() === "")),
            errorMessage: "대표자명을 입력해주세요.",
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
            pattern: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
            errorMessage: "이메일 형식이 올바르지 않습니다.",
        },
    };

    const [fieldStates, setFieldStates] = useState<{
        [key: string]: {
            isValid: boolean;
            errorMessage: string;
            successMessage?: string;
        }
    }>({});

    const handleBlur = (field: string, value: string) => {
        // 인증 완료 된 사업자등록번호 유효성 아웃
        if (field === "businessNumber" && isVerifyBusinessNumber) {
            return;
        }
        
        const config = validationConfig[field];
        let isValid = false;

        if (!config) return;

        if (config.customValidation) {
            isValid = config.customValidation(value);
        } else if (config.pattern) {
            isValid = config.pattern.test(value);
            if (isValid) {
                if (field === "passwordConfirm") {
                    if (!(value === formData.password)) {
                        config.errorMessage = "비밀번호가 일치하지 않습니다.";
                        isValid = false;
                    }
                } else if (field === "birthDate") {
                    const inputDate = dayjs(value, 'YYYYMMDD');
                    const today = dayjs();

                    // 날짜 유효성 및 미래 날짜 체크
                    if (!inputDate.isValid() ||
                        inputDate.format('YYYYMMDD') !== value ||
                        inputDate.isAfter(today, 'day')) {
                        config.errorMessage = "생년월일이 올바르지 않거나 미래 날짜입니다.";
                        isValid = false;
                    }
                } else if (field === "phone") {
                    if (!validPhoneNumber.some(num => value.startsWith(num))) {
                        isValid = false;
                    }
                }
            }
        }

        // 유효성 검사 결과에 따라 validFields 업데이트
        setValidFields(prev => {
            const newValidFields = new Set(prev);

            if (isValid) {
                newValidFields.add(field);
            } else {
                newValidFields.delete(field);
            }

            // 진행도 업데이트
            const newProgress = calculateProgress(newValidFields.size);
            setProgress(newProgress);

            return newValidFields;
        });

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
                successMessage: isValid ? config.successMessage : "",
            }
        }));

        // 포맷팅 처리
        if (field === "phone" && value.length === 11) {
            setDisplayPhone(formatNumberValue(field, value));
        }
        if (field === "birthDate" && value.length === 8) {
            setDisplayBirthDate(formatNumberValue(field, value));
        }
    };

    // focus할 때 원래 숫자로 되돌리기
    const handleFocusValue = (field: string) => {
        if (field === 'phone') {
            setDisplayPhone('');
        } else {
            setDisplayBirthDate('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userFormData = {
            businessNumber: formData.businessNumber,
            userName: formData.userName,
            password: formData.password,
            companyName: formData.companyName,
            phone: formData.phone,
            email: formData.email,
            partnerId: "string",
            birthDate: formData.birthDate,
            isMarketingConsent: formData.checkboxes[4], // 마케팅 동의 체크박스 (5번째)
            businessNumberVerifyToken: formData.businessNumberVerifyToken
        };

        try {
            const res = await insertUser(userFormData);
            if (res.success) {
                setIsModalOpen(true);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';  // 스크롤 막기
        } else {
            document.body.style.overflow = 'unset';   // 스크롤 복원
        }

        return () => {
            document.body.style.overflow = 'unset';   // 컴포넌트 언마운트 시 복원
        };
    }, [isModalOpen]);

    const handleMain = () => {
        router.push('/');
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
                <div className="relative space-y-0 sm:space-y-2 mb-10">
                    <div className="flex items-center justify-between">
                        <div className="absolute bottom-0 z-0 h-[100px] w-[10px]"></div>
                        <span className="text-primary relative z-10 text-body-3 font-normal md:text-body-2">
                            최대 1,250만원까지 무료 선정산이 가능해요.
                        </span>
                        <span className="text-primary text-body-3 font-medium md:text-body-2 md:font-semibold">
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        {/* 진행도 바 */}
                        <div
                            className={`h-full bg-primary transition-all duration-500 ease-out rounded-full`}
                            style={{width: `${Math.min(Math.max(progress, 0), 100)}%`}}
                        />
                    </div>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        {!isTermsComplete ? (
                            /* 동의 */
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
                                        onClick={handleTermsComplete}
                                        className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed bg-primary text-label-100 hover:bg-secondary-400 active:bg-secondary-600 disabled:bg-status-disable disabled:text-label-100 h-[48px] md:h-[56px] gap-4 rounded-lg md:rounded-xl px-6 text-title-4 font-semibold w-full"
                                        disabled={!isAllRequiredChecked}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* 정보 입력 */
                            <div>
                                <div className="flex flex-col gap-6 mt-8">
                                    {/* 사업자등록번호 */}
                                    <div className="space-y-0">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="businessNumber"
                                                className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700 py-0"
                                            >
                                                사업자등록번호 (ID)
                                            </label>
                                            {!isVerifyBusinessNumber &&
                                                <Link
                                                    href="https://www.ftc.go.kr/www/selectBizCommList.do?key=253&token=71FB05C5-4829-80F4-C230-B0FB890B3E892EB62DA22EDEFB1080D78429A22093C1"
                                                    target="_blank"
                                                    className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed p-0! underline underline-offset-4 hover:bg-label-100 active:bg-background-alternative disabled:text-status-disable h-[32px] gap-1 rounded-sm text-body-3 font-medium text-label-700"
                                                >
                                                    사업자 번호가 기억나지 않아요
                                                </Link>
                                            }
                                        </div>
                                        <div className="flex items-stretch gap-4">
                                            <div className="relative w-full">
                                                {isVerifyBusinessNumber &&
                                                    <Check size={13} className="text-status-correct absolute top-1/2 right-4 -translate-y-1/2"/>
                                                }
                                                <input
                                                    id="businessNumber"
                                                    name="businessNumber"
                                                    type="text"
                                                    value={displayBusinessNumber || formData.businessNumber}
                                                    onChange={(e) => handleNumericChange("businessNumber", e.target.value, 10)}
                                                    onBlur={(e) => handleBlur("businessNumber", e.target.value)}
                                                    placeholder="-제외 10자리 입력"
                                                    className={`ring-offset-background file:text-sm flex w-full rounded-md border bg-background-default px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:text-status-disable disabled:placeholder:text-status-disable h-[48px] focus:ring-1 focus:ring-component-dark outline-none
                                                    ${isVerifyBusinessNumber && "bg-background-alternative"}`}
                                                    readOnly={isVerifyBusinessNumber}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                disabled={isVerifyBusinessNumber}
                                                onClick={handleVerifyBusinessNumber}
                                                className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed border border-secondary-300 bg-background-default text-primary hover:border-secondary-300 hover:bg-label-100 active:bg-background-alternative disabled:border-status-disable disabled:bg-background-default disabled:text-status-disable gap-3 rounded-md px-6 text-body-2 font-semibold h-[48px] min-w-[96px]"
                                            >
                                                {isVerifyBusinessNumber ? "인증 성공" : "인증하기"}
                                            </button>
                                        </div>
                                        {fieldStates.businessNumber?.errorMessage && (
                                            <p className="text-caption-1 font-medium text-status-error">
                                                {fieldStates.businessNumber.errorMessage}
                                            </p>
                                        )}
                                        {isVerifyBusinessNumber && (
                                            <p className="text-caption-1 text-status-correct">
                                                사업자등록번호 확인이 완료되었어요.
                                            </p>
                                        )}
                                    </div>
                                    {/* 비밀번호 */}
                                    <div className="space-y-2">
                                        <div className="space-y-0">
                                            <label
                                                className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                                htmlFor="password"
                                            >
                                                비밀번호
                                            </label>
                                            <div className="relative w-full">
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 bg-background-default px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:text-status-disable disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] outline-none"
                                                    placeholder="8~15자리/영문, 숫자, 특수문자 조합 입력"
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    onChange={(e) => handleChange("password", e.target.value)}
                                                    onBlur={(e) => handleBlur("password", e.target.value)}
                                                    value={formData.password}
                                                    name="password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-7 top-1/2 transform -translate-y-1/2 text-label-500 outline-none"
                                                >
                                                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                                </button>
                                            </div>
                                            {fieldStates.password?.errorMessage && (
                                                <p className="text-caption-1 font-medium text-status-error">
                                                    {fieldStates.password.errorMessage}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-0">
                                            <div className="relative w-full">
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:text-status-disable disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] outline-none"
                                                    placeholder="8~15자리/영문, 숫자, 특수문자 조합 재입력"
                                                    id="passwordConfirm"
                                                    type={showPasswordConfirm ? "text" : "password"}
                                                    onChange={(e) => handleChange("passwordConfirm", e.target.value)}
                                                    onBlur={(e) => handleBlur("passwordConfirm", e.target.value)}
                                                    value={formData.passwordConfirm}
                                                    name="passwordConfirm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                    className="absolute right-7 top-1/2 transform -translate-y-1/2 text-label-500 outline-none"
                                                >
                                                    {showPasswordConfirm ? <EyeOff size={24}/> : <Eye size={24}/>}
                                                </button>
                                            </div>
                                            {fieldStates.passwordConfirm?.errorMessage && (
                                                <p className="text-caption-1 font-medium text-status-error">
                                                    {fieldStates.passwordConfirm.errorMessage}
                                                </p>
                                            )}
                                            {fieldStates.passwordConfirm?.successMessage && (
                                                <p className="text-caption-1 text-status-correct">
                                                    {fieldStates.passwordConfirm.successMessage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {isVerifyBusinessNumber && (
                                        <>
                                            {/* 상호명 */}
                                            <div className="space-y-0">
                                                <label
                                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                                    htmlFor="companyName"
                                                >
                                                    상호명
                                                </label>
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] disabled:text-label-700 outline-none"
                                                    id="companyName"
                                                    value={formData.companyName}
                                                    disabled
                                                />
                                            </div>
                                            {/* 대표자 */}
                                            <div className="space-y-0">
                                                <label
                                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                                    htmlFor="userName"
                                                >
                                                    대표자
                                                </label>
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] disabled:text-label-700 outline-none"
                                                    placeholder="사업자등록증에 기재된 대표자명 입력"
                                                    id="userName"
                                                    value={formData.userName}
                                                    onChange={(e) => handleChange("userName", e.target.value)}
                                                    onBlur={(e) => handleBlur("userName", e.target.value)}
                                                />
                                                {fieldStates.userName?.errorMessage && (
                                                    <p className="text-caption-1 font-medium text-status-error">
                                                        {fieldStates.userName.errorMessage}
                                                    </p>
                                                )}
                                            </div>
                                            {/* 대표자 생년월일 */}
                                            <div className="space-y-0">
                                                <label
                                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                                    htmlFor="birthDate"
                                                >
                                                    대표자 생년월일
                                                </label>
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] disabled:text-label-700 outline-none"
                                                    placeholder="생년월일 8자리 입력 (19900101)"
                                                    id="birthDate"
                                                    value={displayBirthDate || formData.birthDate}
                                                    onChange={(e) => handleNumericChange("birthDate", e.target.value, 8)}
                                                    onBlur={(e) => handleBlur("birthDate", e.target.value)}
                                                    onFocus={(e) => handleFocusValue(e.target.id)}

                                                />
                                                {fieldStates.birthDate?.errorMessage && (
                                                    <p className="text-caption-1 font-medium text-status-error">
                                                        {fieldStates.birthDate.errorMessage}
                                                    </p>
                                                )}
                                            </div>
                                            {/* 대표자 휴대폰 번호 */}
                                            <div className="space-y-0">
                                                <label
                                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                                    htmlFor="phone"
                                                >
                                                    대표자 휴대폰 번호
                                                </label>
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] disabled:text-label-700 outline-none"
                                                    placeholder="계약서 송부를 위해 꼭 본인정보 입력"
                                                    id="phone"
                                                    value={displayPhone || formData.phone}
                                                    onChange={(e) => {
                                                        setDisplayPhone('');
                                                        handleNumericChange("phone", e.target.value.replace(/-/g, ''), 11);
                                                    }}
                                                    onBlur={(e) => handleBlur("phone", e.target.value.replace(/-/g, ''))}
                                                    onFocus={(e) => handleFocusValue(e.target.id)}
                                                />
                                                {fieldStates.phone?.errorMessage && (
                                                    <p className="text-caption-1 font-medium text-status-error">
                                                        {fieldStates.phone.errorMessage}
                                                    </p>
                                                )}
                                            </div>
                                            {/* 대표자 이메일 */}
                                            <div className="space-y-0">
                                                <label
                                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                                    htmlFor="email"
                                                >
                                                    대표자 이메일
                                                </label>
                                                <input
                                                    className="ring-offset-background file:text-sm flex w-full rounded-md border border-line-200 px-6 py-[12.5px] text-body-3 file:border-0 file:bg-transparent file:font-medium placeholder:text-body-2 placeholder:text-label-500 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-0 disabled:bg-background-alternative disabled:placeholder:text-status-disable focus:ring-1 focus:ring-component-dark h-[48px] disabled:text-label-700 outline-none"
                                                    placeholder="이메일 입력"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleChange("email", e.target.value)}
                                                    onBlur={(e) => handleBlur("email", e.target.value)}
                                                />
                                                {fieldStates.email?.errorMessage && (
                                                    <p className="text-caption-1 font-medium text-status-error">
                                                        {fieldStates.email.errorMessage}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* 가입하기 */}
                                <div className="mt-12 flex w-full flex-col">
                                    <button
                                        type="submit"
                                        disabled={progress !== 100}
                                        className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed bg-primary text-label-100 hover:bg-secondary-400 active:bg-secondary-600 disabled:bg-status-disable disabled:text-label-100 h-[48px] md:h-[56px] gap-4 rounded-lg md:rounded-xl px-6 text-title-4 font-semibold"
                                    >
                                        가입하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* 배경 오버레이 */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

                    <div className="fixed top-[50%] left-[50%] z-50 scrollbar-hide grid max-h-[90vh] w-[calc(100vw-40px)] translate-x-[-50%] translate-y-[-50%] overflow-x-hidden overflow-y-scroll border bg-[#fff] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 max-w-[400px] gap-5 rounded-2xl p-7">
                        <div className="text-body-1 font-semibold md:text-title-3 md:font-bold">
                            올라 가입을 환영합니다 🎉
                        </div>
                        <div className="text-body-2 text-label-700 max-md:text-body-3">
                            <div className="text-body-3 md:text-body-2">
                                <p>이제 첫 정산을 신청해보세요!</p>
                                <p>
                                    정산금을 <span className="text-primary">30초만에 조회</span>하고, <span className="text-primary">바로 신청</span>할 수 있어요.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    handleMain();
                                }}
                                className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer bg-primary text-label-100 hover:bg-secondary-400 active:bg-secondary-600 h-[48px] md:h-[56px] rounded-lg md:rounded-xl px-6 text-title-4 font-semibold mt-5 w-full"
                            >
                                정산금 조회하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
