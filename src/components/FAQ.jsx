import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Who is eligible to participate?",
      a: "The competition is open to undergraduate students, postgraduates, and working professionals. We have separate categories (Student vs. Non-student) to ensure fair competition."
    },
    {
      q: "Is there a registration fee?",
      a: "Yes, there is a nominal fee per team which covers the cost of access to the simulation platform, MOOCs, and the hardware kit provided in Stage 2."
    },
    {
      q: "Do we need prior robotics experience?",
      a: "While helpful, it is not strictly required. We provide comprehensive training materials and MOOCs during the first phase of the competition."
    },
    {
      q: "When will the hardware kits be dispatched?",
      a: "Hardware kits are dispatched only to teams that successfully qualify through the Stage 1 simulation and conceptual design phase."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-bold text-center text-brand-primary mb-16 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-brand-accent after:mx-auto after:mt-4 after:rounded-full">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`glass-card overflow-hidden transition-all duration-300 rounded-xl ${openIndex === index ? 'shadow-lg shadow-brand-primary/10' : 'hover:shadow-md'}`}
            >
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-bold text-lg text-brand-primary">{faq.q}</span>
                <ChevronDown 
                  className={`text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40 border-t border-slate-200/50' : 'max-h-0'}`}
              >
                <div className="p-6 text-slate-700 bg-white/20">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
