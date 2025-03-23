"use client";

import React, {useEffect, useRef, useState} from "react";
import { useQuLang } from "@/contexts/QuLangContext";
import InputNumbers, { InputNumbersRef } from "@/components/qubic/ui/InputNumbers";
import ConfirmTxModal from "@/components/qubic/connect/ConfirmTxModal";
import { truncateMiddle } from "@/components/qubic/util";
import {useRouter} from "next/navigation";
import {useQubicConnect} from "@/contexts/QubicConnectContext";

export default function GetUser() {
  const { topup, withdraw, balance, state, walletPublicIdentity } = useQuLang();

  const {connected, toggleConnectModal} = useQubicConnect();

  // Top up states
  const topupRef = useRef<InputNumbersRef>(null);
  const [amount, setAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Withdraw states
  const withdrawRef = useRef<InputNumbersRef>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawConfirmModal, setShowWithdrawConfirmModal] = useState(false);

  const router = useRouter();

  // @ts-ignore
  const handleValidate = () => topupRef.current.validate();
  const handleSubmit = async () => {
    if (!handleValidate()) return;
    setShowConfirmModal(true);
  };
  const confirmTopUp = async () => await topup(amount);
  const handleTransactionComplete = () => {
    setShowConfirmModal(false);
    router.push("/")
  };

  // @ts-ignore
  const handleWithdrawValidate = () => withdrawRef.current.validate();
  const handleWithdrawSubmit = async () => {
    if (!handleWithdrawValidate()) return;
    setShowWithdrawConfirmModal(true);
  };
  const confirmWithdraw = async () => await withdraw(withdrawAmount);
  const handleWithdrawTransactionComplete = () => {
    setShowWithdrawConfirmModal(false);
    router.push("/")

  };

  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    if (walletPublicIdentity) {
      console.log('Current wallet public identity: ', walletPublicIdentity);
      navigator.clipboard.writeText(walletPublicIdentity);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }
  };

  return (
      <div className="min-h-screen ">
        {/* Banner */}
        <div className="h-24"></div>
        <div className="relative h-56 w-full">
          <img src="bg.png" alt="Banner" className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">
              My account
            </h1>
          </div>
        </div>
        {!connected ? (
            <div className="max-w-3xl mx-auto p-4">
              <div className="flex flex-col gap-2 justify-around items-center text-white my-8">
                Please connect wallet in other to top up / withdraw form QuLang !

                <button className="bg-primary-50 hover:bg-primary-70 transition-all duration-100 cursor-pointer text-black w-full p-3" onClick={toggleConnectModal}>
                  Connect wallet
                </button>
                </div>

            </div>
            ) : (
        <div className="max-w-6xl mx-auto p-4">
          {/* Stats Row */}
          <div className="flex justify-around items-center text-white my-8">
            <div>
              <p>Connected as:</p>
              <div className="flex items-center space-x-2">
                <span className="font-mono">{truncateMiddle(walletPublicIdentity, 40)}</span>
                <button onClick={handleCopyClick} className="p-1 hover:bg-gray-600 " title="Copy full address">
                  {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.39 7.39a1 1 0 01-1.414 0l-3.29-3.29a1 1 0 011.414-1.414l2.583 2.583 6.683-6.683a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                        <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
                      </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <p>QuLang balance:</p>
              <div className="flex items-center space-x-2">
                <span className="font-mono">{state.data.balance}</span>
                <img src="qubic-coin.svg" alt="Coin" />
              </div>
            </div>
            <div>
              <p>Qubic blockchain balance:</p>
              <div className="flex items-center space-x-2">
                <span className="font-mono">{balance}</span>
                <img src="qubic-coin.svg" alt="Coin" />
              </div>
            </div>
          </div>

          {/* Forms Row */}
          <div className="flex flex-col md:flex-row justify-around items-start space-y-8 md:space-y-0 md:space-x-8">
            {/* Top Up Form */}
            <div className="flex-1  p-4 ">
              <div className="space-y-4">
                <InputNumbers
                    id="topUpAmount"
                    ref={topupRef}
                    labelComponent={<span className="text-white">Amount to Top up</span>}
                    minLimit={1}
                    onChange={setAmount}
                    placeholder="0"
                />
                <button
                    className="bg-primary-50 hover:bg-primary-70 transition-all duration-100 cursor-pointer text-black w-full p-3  disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={balance <= 0 || Number(amount) > Number(balance)}
                    title={
                      balance <= 0
                          ? "Insufficient balance."
                          : Number(amount) > Number(balance)
                              ? "Amount exceeds balance."
                              : ""
                    }
                >
                  Top up
                </button>
              </div>
              <ConfirmTxModal
                  open={showConfirmModal}
                  onClose={() => setShowConfirmModal(false)}
                  tx={{ title: "Top up Coins", amount }}
                  onConfirm={confirmTopUp}
                  onTransactionComplete={handleTransactionComplete}
              />
            </div>

            {/* Withdraw Form */}
            <div className="flex-1 = p-4 ">
              <div className="space-y-4">
                <InputNumbers
                    id="withdrawAmount"
                    ref={withdrawRef}
                    labelComponent={<span className="text-white">Amount to Withdraw</span>}
                    minLimit={1}
                    onChange={setWithdrawAmount}
                    placeholder="0"
                />
                <button
                    className="bg-primary-50 hover:bg-primary-70 transition-all duration-100 cursor-pointer text-black w-full p-3  disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleWithdrawSubmit}
                    disabled={balance <= 0 || Number(withdrawAmount) > Number(balance)}
                    title={
                      balance <= 0
                          ? "Insufficient balance."
                          : Number(withdrawAmount) > Number(balance)
                              ? "Amount exceeds balance."
                              : ""
                    }
                >
                  Withdraw
                </button>
              </div>
              <ConfirmTxModal
                  open={showWithdrawConfirmModal}
                  onClose={() => setShowWithdrawConfirmModal(false)}
                  tx={{ title: "Withdraw Coins", amount: withdrawAmount }}
                  onConfirm={confirmWithdraw}
                  onTransactionComplete={handleWithdrawTransactionComplete}
              />
            </div>
          </div>
        </div>)}
      </div>
  );
}
