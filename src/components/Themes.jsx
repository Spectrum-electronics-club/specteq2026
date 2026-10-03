import React from 'react';

const Themes = () => {
  const themes = [
    {
      icon: "🤖",
      title: "Autonomous Navigation",
      desc: "Build robots capable of navigating complex terrains without human intervention.",
      tags: ["SLAM", "Computer Vision", "ROS"]
    },
    {
      icon: "⚙️",
      title: "Industrial Automation",
      desc: "Design solutions for modern manufacturing and supply chain challenges.",
      tags: ["Kinematics", "IoT", "Control Systems"]
    },
    {
      icon: "🚀",
      title: "Aerospace Robotics",
      desc: "Develop drones and aerospace mechanisms for specialized tasks.",
      tags: ["UAVs", "Aerodynamics", "Embedded Systems"]
    }
  ];

  return (
    <section id="themes" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl font-bold text-center text-brand-primary mb-16 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-brand-accent after:mx-auto after:mt-4 after:rounded-full">
          Competition Themes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {themes.map((theme, index) => (
            <div key={index} className="glass-card rounded-3xl p-10 text-center hover-card group">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{theme.icon}</div>
              <h3 className="text-2xl font-bold text-brand-primary mb-4">{theme.title}</h3>
              <p className="text-slate-600 mb-6">{theme.desc}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto mb-6">
                {theme.tags.map((tag, tIndex) => (
                  <span key={tIndex} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full py-3 bg-white/50 border-2 border-white text-slate-700 font-bold rounded-xl hover:border-brand-secondary hover:text-brand-secondary transition-colors flex justify-center items-center shadow-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Rulebook
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Themes;
