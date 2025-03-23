import React from 'react';

export default function About() {
  return (
    <div className="flex flex-col">
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">About Qubic Marketplace</h1>
      <p className="text-lg mb-6">
        Welcome to Qubic Marketplace, the decentralized platform that revolutionizes access to AI models.
      </p>

      <h2 className="text-3xl font-bold mb-4">Our Team</h2>
      <p className="text-lg mb-6">
        Our team is composed of passionate experts in innovation, blockchain, and artificial intelligence. We are committed to offering a secure and innovative platform.
      </p>

      <h2 className="text-3xl font-bold mb-4">The Concept</h2>
      <p className="text-lg mb-6">
        Qubic Marketplace allows users to leverage AI models provided by various providers. Anyone can become a provider and offer their model in exchange for remuneration.
      </p>
      <p className="text-lg mb-6">
        All transactions are handled via Qubic, using a smart contract that ensures security, transparency, and decentralization.
      </p>

      <h2 className="text-3xl font-bold mb-4">Why Qubic Marketplace?</h2>
      <p className="text-lg">
        Join us to test innovative AI models or become a provider. Our platform offers a comprehensive ecosystem where every interaction is secure and verified through blockchain technology.
      </p>
    </div>
    </div>
  );
}
