"use client";

import { useState } from "react";
import Header from "@/components/header";
import ContractInput from "@/components/contract-input";
import ResultsModal from "@/components/results-modal";
import { analyzeContract } from "@/utils/ai-prompt";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analyze = async () => {
    setIsModalOpen(true);
    await analyzeContract(contract, setResults, setLoading);
  };

  const fixIssues = async () => {
    // const suggestions = results.find(
    //   (r) => r.section === "Suggestions for Improvement"
    // ).details;
    // await fixIssues(contract, suggestions, setContract, setLoading);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="bg-neutral-900/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            <Header />
            <div className="mt-12 md:mt-16">
              <ContractInput
                contract={contract}
                setContract={setContract}
                analyze={analyze}
              />
            </div>
          </div>
        </div>

        <ResultsModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          loading={loading}
          results={results}
          fixIssues={fixIssues}
        />
      </div>
    </div>
  );
}