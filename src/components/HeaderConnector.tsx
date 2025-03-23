import { useQubicConnect } from "@/contexts/QubicConnectContext";
import { useQuLang } from "@/contexts/QuLangContext";
import { formatQubicAmount, truncateMiddle } from "@/components/qubic/util";
import ConnectModal from "@/components/qubic/connect/ConnectModal";
import React, { useEffect, useState } from "react";

export default function HeaderConnector() {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { balance, state, fetchBalance, walletPublicIdentity } = useQuLang();


  const handleBalanceClick = async (e: any) => {
    e.stopPropagation();
    if (walletPublicIdentity) await fetchBalance(walletPublicIdentity);
  };

  return (
    <>
      <div
        className="absolute right-12 flex gap-2 items-center"
        onClick={toggleConnectModal}
      >
        <span className="flex flex-col text-center cursor-pointer text-black font-mono bg-primary-50 hover:bg-primary-70 transition-all duration-100 px-3 py-2">
          {connected ? truncateMiddle(walletPublicIdentity, 40) : "Connect wallet"}
        </span>
      </div>
      <ConnectModal open={showConnectModal} onClose={toggleConnectModal} />
    </>
  );
}
