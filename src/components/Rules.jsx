import React from 'react';
import { BookOpen, Users, Settings, Award } from 'lucide-react';

const Rules = () => {
  const rules = [
    {
      icon: <Users size={24} />,
      title: "Team Composition",
      content: "Teams must consist of 2 to 4 members. Cross-college teams are permitted for the Open category, but strictly prohibited for the Student category."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Originality",
      content: "All code, CAD models, and algorithms must be strictly original. Plagiarism checks will be enforced heavily across all submissions."
    },
    {
      icon: <Settings size={24} />,
      title: "Hardware Limits",
      content: "Robots must adhere to the dimension and weight constraints specified in the official rulebook. Exceeding limits will incur point penalties."
    },
    {
      icon: <Award size={24} />,
      title: "Evaluation",
      content: "Points are awarded based on task completion speed, accuracy, and design innovation. The judge's decision is final and binding."
    }
  ];

  return (
    <section id="rules" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl font-bold text-center text-brand-primary mb-16 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-brand-accent after:mx-auto after:mt-4 after:rounded-full">
          General Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex p-8 glass-panel rounded-3xl hover:border-brand-secondary transition-colors group">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                {rule.icon}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-brand-primary mb-2">{rule.title}</h3>
                <p className="text-slate-600 leading-relaxed">{rule.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rules;
