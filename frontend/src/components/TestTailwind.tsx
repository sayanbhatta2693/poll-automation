import React from "react";

const TestTailwind = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-4">Tailwind is Working! 🎉</h1>
      <p className="text-lg text-white">This is styled using Tailwind classes.</p>
    </div>
  );
};

export default TestTailwind;
