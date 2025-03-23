import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen  pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            About Qubic Marketplace
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Welcome to Qubic Marketplace, the decentralized platform that revolutionizes access to AI models.
          </p>
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Our Team
              </h2>
              <p className="text-gray-600">
                Our team is composed of passionate experts in innovation, blockchain, and artificial intelligence. We are committed to offering a secure and innovative platform.
              </p>
            </section>
            <section>
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                The Concept
              </h2>
              <p className="text-gray-600 mb-4">
                Qubic Marketplace allows users to leverage AI models provided by various providers. Anyone can become a provider and offer their model in exchange for remuneration.
              </p>
              <p className="text-gray-600">
                All transactions are handled via Qubic, using a smart contract that ensures security, transparency, and decentralization.
              </p>
            </section>
            <section>
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Why Qubic Marketplace?
              </h2>
              <p className="text-gray-600">
                Join us to test innovative AI models or become a provider. Our platform offers a comprehensive ecosystem where every interaction is secure and verified through blockchain technology.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
