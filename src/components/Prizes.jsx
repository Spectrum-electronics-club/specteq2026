import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Prizes = () => {
  const [prizes, setPrizes] = useState({ first: '10,000', second: '5,000', third: '2,500' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings/prizes`)
      .then(res => res.json())
      .then(data => {
        if (data) setPrizes(data);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="prizes" className="py-24 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl font-bold text-center text-brand-primary mb-16 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-brand-accent after:mx-auto after:mt-4 after:rounded-full">
          Prizes & Rewards
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
          {/* 2nd Place */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-3xl p-8 text-center hover-card relative order-2 md:order-1 h-[90%]"
          >
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-slate-500">
              <Medal size={40} />
            </div>
            <h3 className="text-2xl font-bold text-brand-primary mb-2">2nd Place</h3>
            <p className="text-brand-accent font-extrabold text-3xl mb-4">₹{prizes.second}</p>
            <ul className="text-slate-600 text-sm space-y-3 mb-6">
              <li>Silver Medal</li>
              <li>Internship Opportunities</li>
              <li>Featured on Platform</li>
            </ul>
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-brand-primary/90 backdrop-blur-xl text-white border-2 border-brand-accent rounded-3xl p-10 text-center hover-card shadow-2xl shadow-brand-accent/20 relative order-1 md:order-2 z-10 md:scale-110"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-accent text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap">
              Grand Prize
            </div>
            <div className="w-24 h-24 bg-yellow-400/20 border-4 border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-400">
              <Trophy size={48} />
            </div>
            <h3 className="text-3xl font-extrabold mb-2 text-white">1st Place</h3>
            <p className="text-brand-accent font-black text-5xl mb-6">₹{prizes.first}</p>
            <ul className="text-slate-300 space-y-3 mb-6 font-medium">
              <li>Gold Trophy</li>
              <li>Direct Job Interviews</li>
              <li>Incubation Support</li>
            </ul>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-3xl p-8 text-center hover-card relative order-3 h-[90%]"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-amber-700">
              <Award size={40} />
            </div>
            <h3 className="text-2xl font-bold text-brand-primary mb-2">3rd Place</h3>
            <p className="text-brand-accent font-extrabold text-3xl mb-4">₹{prizes.third}</p>
            <ul className="text-slate-600 text-sm space-y-3 mb-6">
              <li>Bronze Medal</li>
              <li>Mentorship Sessions</li>
              <li>Swag Kit</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Prizes;
