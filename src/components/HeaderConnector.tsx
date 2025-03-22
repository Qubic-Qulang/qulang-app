import {useQubicConnect} from "@/contexts/QubicConnectContext";
import {useHM25} from "@/contexts/HM25Context";
import {formatQubicAmount, truncateMiddle} from "@/components/qubic/util";
import ConnectModal from "@/components/qubic/connect/ConnectModal";
import React from "react";

export default function HeaderConnector() {
    const {connected, showConnectModal, toggleConnectModal} = useQubicConnect()
    const {balance, fetchBalance, walletPublicIdentity} = useHM25()

    const handleBalanceClick = async (e: any) => {
        e.stopPropagation()
        if (walletPublicIdentity) await fetchBalance(walletPublicIdentity)
    }

    return (
        <>
            <div
                className="absolute right-12 flex gap-2 items-center"
                onClick={toggleConnectModal}
            >
                {connected ? (
                    <div>
                        <span className="font-mono">{truncateMiddle(walletPublicIdentity, 40)}</span>
                        {/* Desktop View
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-white">
                                <img src="lock.svg" alt="Lock icon" className="w-5 h-5"/>
                                <span className="font-space text-[16px]">Lock Wallet</span>
                            </div>
                            {balance != null && (
                                <div
                                    className="text-white mt-1 text-sm cursor-pointer"
                                    onClick={handleBalanceClick}
                                    title="Click to refresh balance"
                                >
                                    Balance: {formatQubicAmount(balance)} QUBIC
                                </div>
                            )}
                        </div>*/}
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <span className="hidden md:block font-space text-[16px] text-white">
                            Unlock Wallet
                        </span>

                        {/* Mobile View */}
                        <img src="unlocked.svg" alt="unlocked"/>
                    </>
                )}
            </div>

            <ConnectModal
                open={showConnectModal}
                onClose={toggleConnectModal}
            />
        </>
    )
}