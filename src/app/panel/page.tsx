"use client";

import { useRef, useState } from "react";
import { useQuLang } from "@/contexts/QuLangContext";
import FormHead from "@/components/qubic/ui/FormHead";
import InputNumbers from "@/components/qubic/ui/InputNumbers";
import { useQubicConnect } from "@/contexts/QubicConnectContext";
import ConfirmTxModal from "@/components/qubic/connect/ConfirmTxModal";

export default function GetUser() {
  const [response, setResponse] = useState("à run");
  const [id, setId] = useState("");
  const { topup, withdraw, balance } = useQuLang();

  // Top up states
  const topupRef = useRef<typeof InputNumbers>(null);
  const [amount, setAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Withdraw states
  const withdrawRef = useRef<typeof InputNumbers>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawConfirmModal, setShowWithdrawConfirmModal] =
    useState(false);

  // @ts-ignore
  const handleValidate = () => topupRef.current.validate();
  const handleSubmit = async () => {
    if (!handleValidate()) return;
    setShowConfirmModal(true);
  };
  const confirmTopUp = async () => await topup(amount);
  const handleTransactionComplete = () => {
    setShowConfirmModal(false);
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
  };

  async function query() {
    if (!id) return;

    try {
      const res = await fetch(`/api/getUser?ID=${id}`);
      const data = await res.json();
      setResponse(`The user has ${data.balance} coins.`);
    } catch (error) {
      setResponse("Error fetching data");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-40 text-white">
      <h1>Get user balance</h1>
      <input
        type="text"
        placeholder="Enter Identity"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="p-2 mb-4 w-full z-10"
      />
      <button className="bg-primary-50 text-black p-5 w-full" onClick={query}>
        Get balance
      </button>
      <p className="mt-4">{response}</p>

      {/* TopUp Section */}
      <div className="max-w-md mx-auto mt-[90px] text-white">
        <div className="space-y-4">
          <InputNumbers
            id="topUpAmount"
            ref={topupRef}
            labelComponent={
              <span className="text-white">Amount to Top up</span>
            }
            minLimit={1}
            onChange={setAmount}
            placeholder="0"
          />
          <button
            className="bg-primary-40 text-black w-full p-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            Top up!
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

      {/* Withdraw Section */}
      <div className="max-w-md mx-auto mt-10 text-white">
        <div className="space-y-4">
          <InputNumbers
            id="withdrawAmount"
            ref={withdrawRef}
            labelComponent={
              <span className="text-white">Amount to Withdraw</span>
            }
            minLimit={1}
            onChange={setWithdrawAmount}
            placeholder="0"
          />
          <button
            className="bg-primary-40 text-black w-full p-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            Withdraw!
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
  );
}
