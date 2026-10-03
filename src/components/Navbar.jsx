import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/rules') {
        setActiveSection('rules');
        return;
      }

      const sections = ['about', 'themes', 'timeline', 'prizes', 'rules', 'faq'];
      let current = '';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Adjust threshold to detect section while scrolling
          if (rect.top <= 350) {
            current = section;
          }
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-7xl rounded-2xl glass-card">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-brand-primary">
          Specteq<span className="text-brand-accent">.</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {[
            { id: 'about', label: 'About', href: '/#about' },
            { id: 'themes', label: 'Themes', href: '/#themes' },
            { id: 'timeline', label: 'Timeline', href: '/#timeline' },
            { id: 'prizes', label: 'Prizes', href: '/#prizes' },
            { id: 'rules', label: 'Rules', href: '/rules', isLink: true },
            { id: 'faq', label: 'FAQ', href: '/#faq' },
          ].map((item) => (
            item.isLink ? (
              <Link 
                key={item.id} 
                to={item.href} 
                className={`font-medium transition-all duration-300 relative py-1 ${activeSection === item.id ? 'text-brand-accent' : 'text-slate-600 hover:text-brand-secondary'}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-accent rounded-full" />
                )}
              </Link>
            ) : (
              <a 
                key={item.id}
                href={item.href} 
                className={`font-medium transition-all duration-300 relative py-1 ${activeSection === item.id ? 'text-brand-accent' : 'text-slate-600 hover:text-brand-secondary'}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-accent rounded-full" />
                )}
              </a>
            )
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="px-5 py-2 rounded-md font-semibold text-brand-primary border-2 border-slate-200 hover:border-brand-primary transition-colors">
            Login
          </Link>
          <Link to="/login" className="px-5 py-2.5 rounded-md font-semibold bg-brand-accent text-white hover:bg-orange-600 hover:-translate-y-0.5 shadow-md transition-all">
            Register Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-600 hover:text-brand-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full left-0">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-100">About</a>
            <a href="/#themes" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-100">Themes</a>
            <a href="/#timeline" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-100">Timeline</a>
            <a href="/#prizes" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-100">Prizes</a>
            <Link to="/rules" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-100">Rules</Link>
            <a href="/#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-100">FAQ</a>
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-5 py-2 rounded-md font-semibold text-brand-primary border-2 border-slate-200">
                Login
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-5 py-2.5 rounded-md font-semibold bg-brand-accent text-white shadow-md">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
