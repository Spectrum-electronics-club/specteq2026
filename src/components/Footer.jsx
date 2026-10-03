import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between border-b border-slate-700 pb-12 mb-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-3xl font-extrabold mb-4">Specteq<span className="text-brand-accent">.</span></h3>
            <p className="text-slate-400 max-w-sm">Empowering the next generation of roboticists through challenging, industry-relevant competitions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-12">
            <div>
              <h4 className="font-bold text-lg mb-4 text-slate-100">Quick Links</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
                <li><Link to="/rules" className="hover:text-white transition-colors">Rules & Regulations</Link></li>
                <li><a href="/#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-slate-100">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li>support@specteq.site</li>
                <li>1-800-ROBOTICS</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Specteq Robotics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
