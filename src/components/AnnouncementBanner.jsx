import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch(err => console.error('Failed to fetch announcements', err));
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-brand-accent text-white overflow-hidden whitespace-nowrap py-2 relative z-50">
      <div className="animate-marquee inline-block flex items-center">
        {announcements.map((ann, idx) => (
          <span key={ann._id} className="mx-8 flex items-center text-sm font-bold tracking-wide">
            <AlertCircle size={16} className="mr-2" />
            {ann.text}
            <span className="ml-4 opacity-75 font-normal text-xs uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Deadline: {new Date(ann.deadline).toLocaleDateString()}
            </span>
            {idx < announcements.length - 1 && <span className="mx-8 opacity-50">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;
