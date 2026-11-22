import { useState } from "react";

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-300 py-6">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="flex w-full items-center justify-between"
  >
    <h3 className="font-serif text-xl text-white">
      {question}
    </h3>

    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-400 text-xl">
      {isOpen ? "−" : "+"}
    </div>
  </button>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      isOpen ? "max-h-96 pt-4" : "max-h-0"
    }`}
  >
    <p className="text-white">
      {answer}
    </p>
  </div>
</div>
  );
}