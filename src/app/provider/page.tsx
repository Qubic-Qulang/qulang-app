"use client";

import React, { useEffect, useState } from "react";
import { useQuLang } from "@/contexts/QuLangContext";
import { useQubicConnect } from "@/contexts/QubicConnectContext";
import { useRouter } from "next/navigation";
import InputNumbers from "@/components/qubic/ui/InputNumbers";
import ConfirmTxModal from "@/components/qubic/connect/ConfirmTxModal";

export default function UpdateProvider() {
  const { updateProvider, walletPublicIdentity } = useQuLang();
  const { connected, toggleConnectModal } = useQubicConnect();
  const router = useRouter();

  const [isProvider, setIsProvider] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Etats pour les champs du formulaire
  const [endpointUrl, setEndpointUrl] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [priceOutput, setPriceOutput] = useState("");
  const [burnRate, setBurnRate] = useState("");

  // Etat pour la modale de confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!walletPublicIdentity) return;
      try {
        const res = await fetch(`/api/getProvider?ID=${walletPublicIdentity}`);
        const data = await res.json();
        setLoaded(true);
        setIsProvider(data.isProvider);
        console.log(data);
      } catch (error) {
        // Gestion d'erreur si besoin
      }
    }
    fetchData();
  }, [walletPublicIdentity]);

  // Quand on clique sur "Update Provider", on affiche la modale de confirmation
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Ici tu pourrais ajouter de la validation
    setShowConfirmModal(true);
  };

  // La fonction appelée après confirmation
  const confirmUpdate = async () => {
    try {
      // Appel de updateProvider pour les paramètres liés aux prix et burn rate
      await updateProvider(Number(priceInput), Number(priceOutput), Number(burnRate));
      // Appel séparé pour l'endpoint inference
      const res = await fetch(
          `/api/updateProvider?ID=${walletPublicIdentity}&endpoint_inference=${endpointUrl}`
      );
      console.log("Mise à jour effectuée :", res);
      handleTransactionComplete();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du provider :", error);
    }
  };

  const handleTransactionComplete = () => {
    setShowConfirmModal(false);
    router.push("/");
  };

  return (
      <div className="min-h-screen">
        {/* Banner */}
        <div className="h-24"></div>
        <div className="relative h-56 w-full">
          <img src="bg.png" alt="Banner" className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">
              {isProvider ? "Edit Provider Settings" : "Add Provider Settings"}
            </h1>
          </div>
        </div>
        {!connected ? (
            <div className="max-w-3xl mx-auto p-4">
              <div className="flex flex-col gap-2 justify-around items-center text-white my-8">
                Please connect wallet in order to setup your provider profile!
                <button
                    className="bg-primary-50 hover:bg-primary-70 transition-all duration-100 cursor-pointer text-black w-full p-3"
                    onClick={toggleConnectModal}
                >
                  Connect wallet
                </button>
              </div>
            </div>
        ) : (
            <div className="max-w-6xl mx-auto p-4">
              {!loaded ? (
                  <p>Please wait...</p>
              ) : (
                  <div className="max-w-md mx-auto text-white">
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label className="block mb-1">Endpoint URL:</label>
                        <input
                            type="text"
                            value={endpointUrl}
                            onChange={(e) => setEndpointUrl(e.target.value)}
                            placeholder="Enter endpoint URL"
                            className="w-full p-4 bg-gray-80 border border-gray-70 text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Price per input token:</label>
                        <InputNumbers
                            onChange={(e) => setPriceInput(e)}
                            placeholder="Price per input token" id={""}
                            labelComponent={undefined}                        />
                      </div>
                      <div>
                        <label className="block mb-1">Price per output token:</label>
                        <InputNumbers
                            onChange={(e) => setPriceOutput(e)}
                            placeholder="Price per output token" id={""}
                            labelComponent={undefined}                        />
                      </div>
                      <div>
                        <label className="block mb-1">Burn rate (int / 10000):</label>
                        <InputNumbers
                            onChange={(e) => setBurnRate(e)}
                            placeholder="Burn rate (int / 10000)" id={""}
                            labelComponent={undefined}                        />
                      </div>
                      <button
                          type="submit"
                          className="bg-primary-50 hover:bg-primary-70 transition-all duration-100 cursor-pointer text-black w-full p-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Update Provider
                      </button>
                    </form>
                    <ConfirmTxModal
                        open={showConfirmModal}
                        onClose={() => setShowConfirmModal(false)}
                        tx={{
                          title: "Update Provider Settings",
                          details: `Price per input: ${priceInput}, Price per output: ${priceOutput}, Burn rate: ${burnRate}`
                        }}
                        onConfirm={confirmUpdate}
                        onTransactionComplete={handleTransactionComplete}
                    />
                  </div>
              )}
            </div>
        )}
      </div>
  );
}
