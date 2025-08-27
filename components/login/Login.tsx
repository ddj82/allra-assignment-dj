'use client';

import React, {useEffect, useState} from 'react';
import {FieldStates, ValidationConfig} from "@/types/Items";
import {Check, Eye, EyeOff} from "lucide-react";
import Link from "next/link";
import {login} from "@/lib/api";
import {saveTokens, startRefreshLoop} from "@/lib/auth";
import {refreshAccessToken} from "@/lib/apiAuth";
import {useRouter} from "next/navigation";

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        businessNumber: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberUserId, setRememberUserId] = useState(false);

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

    const validationConfig: ValidationConfig = {
        businessNumber: {
            pattern: /^\d{10}$/,
            errorMessage: "사업자등록번호 10자리를 입력해 주세요.",
        },
        password: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/,
            errorMessage: "8~15자리 영문, 숫자, 특수문자로 조합하여 입력해주세요.",
        },
    };

    const [fieldStates, setFieldStates] = useState<{
        [key: string]: {
            isValid: boolean;
            errorMessage: string;
            successMessage?: string;
        }
    }>({});

    const [disableSubmit, setDisableSubmit] = useState(true);

    const recomputeDisableSubmit = (states: FieldStates) => {
        const targetFields = Object.keys(validationConfig);
        const hasAnyInvalid = targetFields.some((f) => !states[f]?.isValid);
        setDisableSubmit(hasAnyInvalid);
    };

    const handleBlur = (field: string, value: string) => {
        const config = validationConfig[field];
        let isValid = false;

        if (!config) return;

        if (config.pattern) {
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

        setFieldStates(prev => {
            const next: FieldStates = {
                ...prev,
                [field]: {
                    isValid,
                    errorMessage: isValid ? "" : config.errorMessage,
                    successMessage: isValid ? config.successMessage : "",
                }
            };
            recomputeDisableSubmit(next);
            return next;
        });
    };

    // 제출 중 상태
    const [isSubmitting, setIsSubmitting] = useState(false);
    // 지연 유틸
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const targetFields = Object.keys(validationConfig);
        let hasInvalid = false;

        for (const f of targetFields) {
            const cfg = validationConfig[f];
            const value = String((formData as any)[f] ?? "");
            const ok = cfg.pattern ? cfg.pattern.test(value) : true;
            if (!ok) {
                hasInvalid = true;
                const inputElement = document.getElementById(f) as HTMLInputElement | null;
                inputElement?.classList.add('border-red-500', 'focus:ring-red-500');
            }
        }

        if (hasInvalid || disableSubmit) {
            const firstInvalid = targetFields.find(f =>
                !validationConfig[f].pattern!.test(String((formData as any)[f] ?? ""))
            );
            const el = document.getElementById(firstInvalid!) as HTMLInputElement | null;
            el?.focus();

            setFieldStates(prev => {
                const next: FieldStates = {...prev};
                for (const f of targetFields) {
                    const cfg = validationConfig[f];
                    const value = String((formData as any)[f] ?? "");
                    const ok = cfg.pattern ? cfg.pattern.test(value) : true;
                    next[f] = {isValid: ok, errorMessage: ok ? "" : cfg.errorMessage};
                }
                recomputeDisableSubmit(next);
                return next;
            });
            return;
        }

        // 제출 시작: 버튼 비활성 + 에러메시지 초기화 + 경계선 클래스 제거
        setIsSubmitting(true);
        setFieldStates({}); // ← 에러메시지 초기화
        for (const f of targetFields) {
            const inputElement = document.getElementById(f) as HTMLInputElement | null;
            inputElement?.classList.remove('border-red-500', 'focus:ring-red-500');
        }

        // 아이디 저장
        if (rememberUserId && formData.businessNumber) {
            localStorage.setItem("rememberedBusinessNumber", formData.businessNumber);
        } else {
            localStorage.removeItem("rememberedBusinessNumber");
        }

        try {
            await sleep(5);

            const res = await login(formData);
            if (res) {
                // 로컬스토리지에 저장 → "웹사이트 유지되는 동안 로그인 유지" 충족
                saveTokens({
                    accessToken: res.accessToken,
                    accessTokenExpiresIn: res.accessTokenExpiresIn,
                    refreshToken: res.refreshToken,
                    refreshTokenExpiresIn: res.refreshTokenExpiresIn,
                });

                // 리프레시 루프 시작 → "세션 만료되지 않도록 리프레시" 충족
                startRefreshLoop(refreshAccessToken);

                alert("로그인 성공");
                router.push("/");
            }
        } catch (error: any) {
            const config = validationConfig["businessNumber"];
            config.errorMessage = "로그인 정보가 일치하지 않아요. 다시 확인해 주세요.";
            setFieldStates({
                ["businessNumber"]: {
                    isValid: true,
                    errorMessage: config.errorMessage,
                }
            });
            const inputElement = document.getElementById("businessNumber") as HTMLInputElement;
            if (inputElement) {
                inputElement.classList.add('border-red-500', 'focus:ring-red-500');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 아이디 저장
    useEffect(() => {
        const saved = localStorage.getItem("rememberedBusinessNumber");
        if (saved) {
            setFormData(prev => ({ ...prev, businessNumber: saved }));
            setRememberUserId(true);
        }
    }, []);

    return (
        <div className="mx-auto mt-header max-w-[480px] h-full max-md:container">
            <div className="max-md:container pb-10 relative mx-auto max-w-[520px] md:px-7 space-y-8">
                <header>
                    <h3 className="text-title-3 font-medium md:text-title-2">로그인</h3>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="space-y-1">
                            <div className="space-y-0">
                                <label
                                    htmlFor="businessNumber"
                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
                                >
                                    사업자등록번호(ID로 사용돼요)
                                </label>
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
                            </div>
                            {fieldStates.businessNumber?.errorMessage && (
                                <p className="text-caption-1 font-medium text-status-error">
                                    {fieldStates.businessNumber.errorMessage}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="space-y-0">
                                <label
                                    htmlFor="password"
                                    className="peer-disabled:cursor-not-allowed peer-disabled:text-status-disable text-body-3 font-medium text-label-700"
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
                                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-label-500 outline-none"
                                    >
                                        {showPassword ? <EyeOff size={24}/> : <Eye size={24}/>}
                                    </button>
                                </div>
                            </div>
                            {fieldStates.password?.errorMessage && (
                                <p className="text-caption-1 font-medium text-status-error">
                                    {fieldStates.password.errorMessage}
                                </p>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center justify-between space-y-0">
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="checkbox"
                                                className="
                                                size-5 inline-flex items-center justify-center
                                                rounded-xs border border-component-dark
                                                overflow-hidden cursor-pointer select-none
                                                transition
                                                peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2
                                                "
                                            >
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    className="peer sr-only"
                                                    checked={rememberUserId}
                                                    onChange={() => {
                                                        const next = !rememberUserId;
                                                        setRememberUserId(next);
                                                        if (!next) {
                                                            localStorage.removeItem("rememberedBusinessNumber");
                                                        }
                                                    }}
                                                />
                                                <span className="flex items-center justify-center text-current">
                                                    {rememberUserId && <Check size={13}/>}
                                                </span>
                                            </label>
                                            <div className="text-body-3 font-medium text-label-700">
                                                아이디 저장
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-9 flex w-full flex-col gap-2 lg:mt-10">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed bg-primary text-label-100 hover:bg-secondary-400 active:bg-secondary-600 disabled:bg-status-disable disabled:text-label-100 h-[48px] md:h-[56px] gap-4 rounded-lg md:rounded-xl px-6 text-title-4 font-semibold"
                                >
                                    로그인
                                </button>
                                <Link
                                    href="/sign-up"
                                    className="inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:cursor-not-allowed border border-secondary-300 bg-background-default text-primary hover:border-secondary-300 hover:bg-label-100 active:bg-background-alternative disabled:border-status-disable disabled:bg-background-default disabled:text-status-disable h-[48px] md:h-[56px] gap-4 rounded-lg md:rounded-xl px-6 text-title-4 font-semibold"
                                >
                                    회원가입
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
