"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import ConnectLink from "@/components/qubic/connect/ConnectLink";
import HeaderConnector from "@/components/HeaderConnector";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed h-[100px] flex w-full z-10 top-0 gap-10 justify-start items-center transition-colors duration-300 px-12 ${scrolled ? "bg-black" : "bg-transparent"}`}
        >
            <Link href="/" className="flex items-center">
                <img src="logo_white.svg" alt="QuLang logo" className="h-14 w-auto" />
                <h1 className="text-2xl font-stretch-extra-expanded pr-10">QuLang</h1>
            </Link>
            <Link href="/" className="flex items-center">
                <h1 className="text-xl font-thin text-gray-300 hover:text-white transition-all">Marketplace</h1>
            </Link>
            <Link href="/playground" className="flex items-center">
                <h1 className="text-xl font-thin text-gray-300 hover:text-white transition-all">Playground</h1>
            </Link>
            <Link href="/provider" className="flex items-center">
                <h1 className="text-xl font-thin text-gray-300 hover:text-white transition-all">Provider Portal</h1>
            </Link>
            <HeaderConnector />
        </div>
    );
}
