"use client"
import { useEffect, useState } from "react"
import { useQubicConnect } from "@/contexts/QubicConnectContext"
import { useQuLang } from "@/contexts/QuLangContext"
import { useRouter } from "next/navigation"

export default function Home() {
    const { connected, toggleConnectModal } = useQubicConnect()
    const { state, balance } = useQuLang()
    const [scrolled, setScrolled] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const router = useRouter()

    const isDisabled = balance === null || balance <= 0

    const [status, setStatus] = useState<any[]>([])
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/getEndpointStatus`)
                const data = await res.json()
                setLoaded(true)
                setStatus(data)
            } catch (error) {
                // Gestion d'erreur si besoin
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="flex flex-col">
            <div className="h-[100dvh] w-full relative overflow-hidden">
                <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover">
                    <source src="./bg-vid.mp4" type="video/mp4" />
                </video>
                <div
                    className={`relative z-[1] flex flex-col items-center justify-center h-full transition-colors duration-300 ${scrolled ? "bg-black/50" : "bg-transparent"}`}
                >
                    <p className="text-3xl pt-60 font-thin">Welcome to</p>
                    <p className="text-7xl pb-60 font-stretch-extra-expanded">QuLang</p>

                    <div className="text-2xl inline-flex">
                        bringing together builders accross the
                        <p className="px-2 italic font-extralight">qubic</p>
                        blockchain
                    </div>
                </div>
            </div>

            <div className="bg-black py-16 px-4 md:px-8">
                {!loaded ? (
                    <div className="flex justify-center items-center h-40">
                        <h1 className="text-2xl font-thin animate-pulse">Loading....</h1>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-thin mb-12 text-center">Available Providers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {status &&
                                status.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-zinc-900 overflow-hidden hover:shadow-lg hover:shadow-primary-50/20 transition-all duration-300 border border-zinc-800 flex flex-col"
                                    >
                                        <div className="h-48 relative w-full">
                                            {item.status.picturePath ? (
                                                <img
                                                    src={item.status.picturePath || "/placeholder.svg"}
                                                    alt={item.status.provider_name || "Provider"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600 text-xl">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-medium mb-2">{item.status.provider_name || "Unknown Provider"}</h3>
                                            <p className="text-zinc-400 text-sm mb-4 flex-1">
                                                {item.status.provider_description || "No description available"}
                                            </p>
                                            <div className="pt-4 border-t border-zinc-800">
                                                <p className="text-xs text-zinc-500 font-mono break-all">
                                                    <span className="text-zinc-400 block mb-1">Identity:</span>
                                                    {item.wallet_identity}
                                                </p>
                                            </div>
                                            <button
                                                className="mt-6 w-full py-2 px-4 bg-primary-50 hover:bg-primary-70 transition-colors text-black cursor-pointer duration-200"
                                                onClick={() => router.push(`/playground?ID=${item.wallet_identity}`)}
                                            >
                                                Try in playground
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

