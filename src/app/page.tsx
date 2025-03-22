"use client"

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useQubicConnect} from "@/contexts/QubicConnectContext";
import {useHM25} from "@/contexts/HM25Context";
import {useRouter} from "next/navigation";

export default function Home() {
    const {connected, toggleConnectModal} = useQubicConnect();
    const {state, balance } = useHM25();
    const [scrolled, setScrolled] = useState(false);

    const router = useRouter();

    const isDisabled = balance === null || balance <= 0

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-col">
            <div className="h-[100dvh] w-full relative overflow-hidden">
                <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover">
                    <source src="./bg-vid.mp4" type="video/mp4"/>
                </video>
                <div className={`relative z-[1] flex flex-col items-center justify-center h-full transition-colors duration-300 ${scrolled ? "bg-black/50" : "bg-transparent"}`}>
                    <p className="text-3xl pt-60 font-thin">Welcome to</p>
                    <p className="text-7xl pb-60 font-stretch-extra-expanded">QuLang</p>

                    <div className="text-2xl inline-flex">
                        bringing together builders accross the
                        <p className="px-2 italic font-extralight">qubic</p>
                        blockchain
                    </div>
                </div>
            </div>

            <div className="bg-black">
                {
                    (!connected) ? (<div className="flex flex-col items-center">
                        <h2 className="text-2xl text-white mb-20 mt-20">Welcome to QuLang - Marketplace Demo DApp</h2>
                        <p className="text-gray-300 mb-4 mt-4 ml-6 mr-4">
                            You are not connected to a wallet. Please connect to proceed.
                        </p>
                        <button
                            className="bg-primary-40 p-3 text-black rounded"
                            onClick={toggleConnectModal}
                        >
                            Connect Wallet
                        </button>
                    </div>) : (
                        <div className="mt-20 px-10 flex flex-col items-center">
                            <h2 className="text-2xl text-white mb-6 mt-6">QuLang Actions</h2>
                            <div className="flex gap-4">
                                <button
                                    className="bg-primary-40 p-3 text-black rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    onClick={() => router.push('/echo')}
                                    disabled={isDisabled}
                                    title={isDisabled ? 'Insufficient balance to echo coins.' : ''}
                                >
                                    Echo Coin
                                </button>
                                <button
                                    className="bg-primary-40 p-3 text-black rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    onClick={() => router.push('/burn')}
                                    disabled={isDisabled}
                                    title={isDisabled ? 'Insufficient balance to burn coins.' : ''}
                                >
                                    Burn Coin
                                </button>
                            </div>
                            <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700 text-white">
                                <p><strong>Number of Echos:</strong> {state.stats.numberOfEchoCalls.toString()}</p>
                                <p><strong>Number of Burns:</strong> {state.stats.numberOfBurnCalls.toString()}</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
