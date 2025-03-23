import { useQubicConnect } from "@/contexts/QubicConnectContext";
import { useQuLang } from "@/contexts/QuLangContext";
import { formatQubicAmount, truncateMiddle } from "@/components/qubic/util";
import ConnectModal from "@/components/qubic/connect/ConnectModal";
import React, { useEffect, useState } from "react";
import { createUser } from "@/pages/api/db_api";

export default function HeaderConnector() {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { balance, fetchBalance, walletPublicIdentity } = useQuLang();

  useEffect(() => {
    if (connected && walletPublicIdentity) {
      (async () => {
        try {
          const response = await fetch("/api/db_api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity: walletPublicIdentity })
          });
          const data = await response.json();
          console.log("User initialized:", data);
        } catch (error) {
          console.error("Error during user initialization:", error);
        }
      })();
    }
  }, [connected, walletPublicIdentity]);


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
        <div className=" cursor-pointer">
          {connected ? (
            <div className="flex flex-col text-center">
            <span className="font-mono bg-primary-50 px-3 py-2 text-black">
              {truncateMiddle(walletPublicIdentity, 40)}
            </span>
              <span className="text-xs">balance : {balance}</span>
            </div>
          ) : (
            <span className="font-mono bg-primary-50 px-3 py-2 text-black">Connect wallet</span>
          )}
        </div>
      </div>
      <ConnectModal open={showConnectModal} onClose={toggleConnectModal} />
    </>
  );
}
