import { useQubicConnect } from "@/contexts/QubicConnectContext";
import { useHM25 } from "@/contexts/HM25Context";
import { formatQubicAmount, truncateMiddle } from "@/components/qubic/util";
import ConnectModal from "@/components/qubic/connect/ConnectModal";
import React, { useEffect, useState } from "react";
import { createUser } from "@/api/db_api";

export default function HeaderConnector() {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { balance, fetchBalance, walletPublicIdentity } = useHM25();
  const [previousConnectedState, setPreviousConnectedState] = useState(false);

  const handleBalanceClick = async (e: any) => {
    e.stopPropagation();
    if (walletPublicIdentity) await fetchBalance(walletPublicIdentity);
  };

  useEffect(() => {
    if (connected && !previousConnectedState && walletPublicIdentity) {
      // Register user in database when wallet connects
      createUser(walletPublicIdentity)
        .then(user => {
          console.log('User registered or found:', user);
        })
        .catch(error => {
          console.error('Error registering user:', error);
        });
    }
    
    setPreviousConnectedState(connected);
  }, [connected, walletPublicIdentity]);

  return (
    <>
      <div
        className="absolute right-12 flex gap-2 items-center"
        onClick={toggleConnectModal}
      >
        <div className="bg-primary-50 px-3 py-2 text-black cursor-pointer">
          {connected ? (
            <span className="font-mono">
              {truncateMiddle(walletPublicIdentity, 40)}
            </span>
          ) : (
            <span className="font-mono">Connect wallet</span>
          )}
        </div>
      </div>

      <ConnectModal open={showConnectModal} onClose={toggleConnectModal} />
    </>
  );
}
