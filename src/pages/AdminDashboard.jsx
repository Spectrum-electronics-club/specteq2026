import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Users, Shield, FileText, CheckCircle, XCircle, Clock, Database, LogOut, Edit3, Settings, Award, List, Calendar, HelpCircle, Image as ImageIcon, Phone } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [cmsTab, setCmsTab] = useState('general'); // Sub-tab for Manage Content

  const [stats, setStats] = useState({ students: 0, teams: 0, submissions: 0 });
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prizeData, setPrizeData] = useState({ first: '10,000', second: '5,000', third: '2,500' });

  // CMS State
  const [themesList, setThemesList] = useState(['Space Exploration', 'Deep Sea Rescue', 'Medical Tech', 'Agri-Bot']);
  const [newTheme, setNewTheme] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Space Exploration');
  const [tasksByTheme, setTasksByTheme] = useState({
    'Space Exploration': [
      { id: 1, title: 'Concept & Simulation', desc: 'Upload CAD models and simulation reports.' },
      { id: 2, title: 'Hardware Prototype', desc: 'Upload a video demonstrating the working physical prototype.' }
    ]
  });

  useEffect(() => {
    const token = localStorage.getItem('specteq_token');
    const user = JSON.parse(localStorage.getItem('specteq_user') || '{}');

    if (!token || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchAdminData(token);
  }, [navigate]);

  const fetchAdminData = async (token) => {
    try {
      const headers = { 'x-auth-token': token };

      const [statsRes, teamsRes, subsRes, prizesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/teams`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/submissions`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings/prizes`)
      ]);

      if (!statsRes.ok) throw new Error('Failed to fetch admin data. Are you an admin?');

      const statsData = await statsRes.json();
      const teamsData = await teamsRes.json();
      const subsData = await subsRes.json();

      setStats(statsData);
      setTeams(teamsData);
      setSubmissions(subsData);

      if (prizesRes.ok) {
        const prizes = await prizesRes.json();
        if (prizes) setPrizeData(prizes);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const token = localStorage.getItem('specteq_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/teams/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        fetchAdminData(token);
      } else {
        alert('Failed to delete team.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      const token = localStorage.getItem('specteq_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/submissions/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        fetchAdminData(token);
      } else {
        alert('Failed to delete submission.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('specteq_token');
    localStorage.removeItem('specteq_user');
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-xl font-bold text-brand-primary">Loading Admin Panel...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-xl font-bold text-red-500">{error}</p></div>;

  const getAverageMark = (sub) => {
    if (!sub.evaluations || sub.evaluations.length === 0) return -1;
    return sub.evaluations.reduce((sum, ev) => sum + (Number(ev.marks) || 0), 0) / sub.evaluations.length;
  };

  const sortedForRank = [...submissions]
    .filter(s => getAverageMark(s) !== -1)
    .sort((a, b) => getAverageMark(b) - getAverageMark(a));

  const rankMap = {};
  let currentRank = 1;
  let prevMark = -1;
  let actualRank = 1;
  sortedForRank.forEach((sub) => {
    const mark = getAverageMark(sub);
    if (mark !== prevMark) {
      actualRank = currentRank;
    }
    rankMap[sub._id] = actualRank;
    prevMark = mark;
    currentRank++;
  });

  const sortedSubmissionsByRank = [...submissions].sort((a, b) => {
    const rankA = rankMap[a._id] || 999999; // Pending goes to the bottom
    const rankB = rankMap[b._id] || 999999;
    return rankA - rankB;
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Helmet><title>Admin Control | Specteq</title></Helmet>

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-8 border-b border-slate-800">
          <span className="font-extrabold text-2xl flex items-center">
            <Shield className="mr-2 text-brand-accent" /> Specteq<span className="text-brand-accent">.</span>
          </span>
        </div>
        <nav className="p-4 flex-grow space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Database size={20} className="mr-3" /> Overview
          </button>
          <button onClick={() => setActiveTab('teams')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'teams' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Users size={20} className="mr-3" /> All Teams
          </button>
          <button onClick={() => setActiveTab('submissions')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'submissions' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <FileText size={20} className="mr-3" /> Submissions
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'content' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Edit3 size={20} className="mr-3" /> Manage Content
          </button>
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-3 rounded-xl font-medium transition-colors">
            <LogOut size={20} className="mr-3" /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full h-screen overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-800 capitalize">
            {activeTab === 'overview' ? 'Command Center' : activeTab === 'content' ? 'Content Manager' : activeTab}
          </h1>
          <div className="bg-white px-4 py-2 rounded-full font-bold text-sm border border-slate-200 text-brand-primary shadow-sm flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Live Status
          </div>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
              <p className="text-sm font-bold text-slate-500 uppercase">Registered Students</p>
              <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.students}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
              <p className="text-sm font-bold text-slate-500 uppercase">Active Teams</p>
              <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.teams}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
              <p className="text-sm font-bold text-slate-500 uppercase">Total Submissions</p>
              <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.submissions}</p>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Team Name</th>
                  <th className="px-6 py-4">Theme</th>
                  <th className="px-6 py-4">College</th>
                  <th className="px-6 py-4">Leader</th>
                  <th className="px-6 py-4">Members</th>
                  <th className="px-6 py-4">Invite Code</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teams.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No teams found.</td></tr>
                ) : (
                  teams.map(team => (
                    <tr key={team._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-primary">{team.teamName}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">{team.theme || 'Uncategorized'}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-600">{team.college}</td>
                      <td className="px-6 py-4 text-sm font-medium">{team.leader?.fullName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-secondary">{team.members.length}/4</td>
                      <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-xs">{team.inviteCode}</span></td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteTeam(team._id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Theme</th>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Marks (Avg)</th>
                  <th className="px-6 py-4">Actions</th>
                  <th className="px-6 py-4 text-center">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedSubmissionsByRank.length === 0 ? (
                  <tr><td colSpan="8" className="px-6 py-8 text-center text-slate-500">No submissions to review.</td></tr>
                ) : (
                  sortedSubmissionsByRank.map(sub => (
                    <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{sub.teamId?.teamName || 'Unknown Team'}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">{sub.teamId?.theme || 'Uncategorized'}</span></td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{sub.taskName}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
                          <Clock size={12} className="mr-1" /> {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {sub.evaluations && sub.evaluations.length > 0
                          ? `${(sub.evaluations.reduce((sum, ev) => sum + (Number(ev.marks) || 0), 0) / sub.evaluations.length).toFixed(1)} / 100`
                          : 'Pending'}
                      </td>
                      <td className="px-6 py-4">
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${sub.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-secondary hover:underline mr-4">
                          Download File
                        </a>
                        <button onClick={() => deleteSubmission(sub._id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                          Delete
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {rankMap[sub._id] ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-sm shadow-sm">
                            #{rankMap[sub._id]}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Content Manager Tab */}
        {activeTab === 'content' && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* CMS Sidebar Nav */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex flex-col space-y-1">
                <button onClick={() => setCmsTab('general')} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${cmsTab === 'general' ? 'bg-slate-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Settings size={18} className="mr-3" /> General & Logos
                </button>
                <button onClick={() => setCmsTab('prizes')} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${cmsTab === 'prizes' ? 'bg-slate-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Award size={18} className="mr-3" /> Prizes & Rewards
                </button>
                <button onClick={() => setCmsTab('tasks')} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${cmsTab === 'tasks' ? 'bg-slate-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <List size={18} className="mr-3" /> Tasks & Themes
                </button>
                <button onClick={() => setCmsTab('timeline')} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${cmsTab === 'timeline' ? 'bg-slate-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Calendar size={18} className="mr-3" /> Timeline
                </button>
                <button onClick={() => setCmsTab('faqs')} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${cmsTab === 'faqs' ? 'bg-slate-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <HelpCircle size={18} className="mr-3" /> FAQs & Rules
                </button>
                <button onClick={() => setCmsTab('contact')} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${cmsTab === 'contact' ? 'bg-slate-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Phone size={18} className="mr-3" /> Contact Details
                </button>
              </div>
            </div>

            {/* CMS Main Area */}
            <div className="flex-grow">

              {/* General CMS */}
              {cmsTab === 'general' && (
                <div className="space-y-6">
                  {/* Active Announcements Editor */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center">📣 Manage Announcements</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <input id="announcementText" type="text" placeholder="Announcement text (e.g., Task 1 deadline extended!)" className="flex-grow px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        <input id="announcementDeadline" type="date" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        <button onClick={async () => {
                          const text = document.getElementById('announcementText').value;
                          const deadline = document.getElementById('announcementDeadline').value;
                          if (!text || !deadline) return alert('Fill both fields');
                          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('specteq_token') },
                            body: JSON.stringify({ text, deadline })
                          });
                          document.getElementById('announcementText').value = '';
                          document.getElementById('announcementDeadline').value = '';
                          alert('Announcement posted successfully!');
                        }} className="bg-brand-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">Post Announcement</button>
                      </div>
                      <p className="text-sm text-slate-500">Announcements will scroll at the top of the website until their deadline expires.</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center"><ImageIcon className="mr-2" /> Website Logos</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50">
                        <ImageIcon className="mx-auto text-slate-400 mb-2" size={24} />
                        <span className="text-sm font-bold text-slate-600">Upload Main Logo (Header)</span>
                      </div>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50">
                        <ImageIcon className="mx-auto text-slate-400 mb-2" size={24} />
                        <span className="text-sm font-bold text-slate-600">Upload Footer Logo</span>
                      </div>
                    </div>
                    <button className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg">Save Logos</button>
                  </div>
                </div>
              )}

              {/* Prizes CMS */}
              {cmsTab === 'prizes' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-brand-primary mb-4">Edit Prize Pool</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">1st Place Prize (INR)</label>
                      <input type="text" value={prizeData.first} onChange={(e) => setPrizeData({ ...prizeData, first: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">2nd Place Prize (INR)</label>
                      <input type="text" value={prizeData.second} onChange={(e) => setPrizeData({ ...prizeData, second: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">3rd Place Prize (INR)</label>
                      <input type="text" value={prizeData.third} onChange={(e) => setPrizeData({ ...prizeData, third: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings/prizes`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('specteq_token') },
                            body: JSON.stringify({ value: prizeData })
                          });
                          alert('Prizes updated successfully!');
                        } catch (err) {
                          alert('Failed to update prizes');
                        }
                      }}
                      className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg mt-4"
                    >
                      Update Prizes
                    </button>
                  </div>
                </div>
              )}

              {/* Tasks & Themes CMS */}
              {cmsTab === 'tasks' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-brand-primary mb-6">Manage Themes</h3>
                  <div className="mb-8">
                    <div className="flex gap-2 flex-wrap mb-4">
                      {themesList.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold cursor-pointer hover:bg-indigo-200" onClick={() => setThemesList(themesList.filter(theme => theme !== t))}>
                          {t} ✕
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Add new theme..."
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTheme.trim() !== '') {
                            setThemesList([...themesList, newTheme.trim()]);
                            setNewTheme('');
                          }
                        }}
                        className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (newTheme.trim() !== '') {
                            setThemesList([...themesList, newTheme.trim()]);
                            setNewTheme('');
                          }
                        }}
                        className="bg-brand-secondary text-white font-bold px-4 py-2 rounded-lg"
                      >
                        Add Theme
                      </button>
                    </div>
                  </div>

                  <hr className="my-8 border-slate-200" />

                  <h3 className="text-xl font-bold text-brand-primary mb-4">Manage Theme Tasks</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Theme to Edit</label>
                      <select
                        className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-slate-50"
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      >
                        {themesList.map((t, idx) => (
                          <option key={idx} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      {(!tasksByTheme[selectedTheme] || tasksByTheme[selectedTheme].length === 0) ? (
                        <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                          No tasks have been added to this theme yet.
                        </div>
                      ) : (
                        tasksByTheme[selectedTheme].map((task, index) => (
                          <div key={task.id} className="border border-slate-200 p-5 rounded-xl bg-slate-50 relative group">
                            <button
                              onClick={() => {
                                const newTasks = tasksByTheme[selectedTheme].filter(t => t.id !== task.id);
                                setTasksByTheme({ ...tasksByTheme, [selectedTheme]: newTasks });
                              }}
                              className="absolute top-4 right-4 text-red-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Delete
                            </button>
                            <h4 className="font-bold text-slate-800 mb-3 text-lg">Task {index + 1}</h4>
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => {
                                const newTasks = [...tasksByTheme[selectedTheme]];
                                newTasks[index].title = e.target.value;
                                setTasksByTheme({ ...tasksByTheme, [selectedTheme]: newTasks });
                              }}
                              placeholder="Task Title"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-brand-accent focus:outline-none"
                            />
                            <textarea
                              rows="3"
                              value={task.desc}
                              onChange={(e) => {
                                const newTasks = [...tasksByTheme[selectedTheme]];
                                newTasks[index].desc = e.target.value;
                                setTasksByTheme({ ...tasksByTheme, [selectedTheme]: newTasks });
                              }}
                              placeholder="Task Description"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                            ></textarea>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => {
                          const currentTasks = tasksByTheme[selectedTheme] || [];
                          const newTask = { id: Date.now(), title: '', desc: '' };
                          setTasksByTheme({ ...tasksByTheme, [selectedTheme]: [...currentTasks, newTask] });
                        }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300"
                      >
                        + Add Another Task
                      </button>
                      <button className="bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-slate-800">Save Theme Tasks</button>
                    </div>
                  </div>

                  <hr className="my-8 border-slate-200" />

                  <h3 className="text-xl font-bold text-brand-primary mb-4">Manage Theme Rulebook</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <p className="text-sm text-slate-600 mb-4">
                      Upload a PDF rulebook specific to <strong>{selectedTheme}</strong>. This will be available for students to download on the Rules page.
                    </p>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer mb-4">
                      <FileText className="mx-auto text-slate-400 mb-2" size={32} />
                      <span className="font-bold text-slate-700">Click to upload PDF for {selectedTheme}</span>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-slate-800">Save Rulebook</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline CMS */}
              {cmsTab === 'timeline' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center justify-between">
                    Event Timeline
                    <button className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-lg">Add Event</button>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input type="date" className="px-4 py-2 border border-slate-300 rounded-lg" />
                      <input type="text" defaultValue="Registration Opens" className="flex-grow px-4 py-2 border border-slate-300 rounded-lg" />
                      <button className="text-red-500 font-bold">Delete</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input type="date" className="px-4 py-2 border border-slate-300 rounded-lg" />
                      <input type="text" defaultValue="Task 1 Deadline" className="flex-grow px-4 py-2 border border-slate-300 rounded-lg" />
                      <button className="text-red-500 font-bold">Delete</button>
                    </div>
                    <button className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg mt-4">Save Timeline</button>
                  </div>
                </div>
              )}

              {/* FAQs CMS */}
              {cmsTab === 'faqs' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center justify-between">
                    Manage FAQs
                    <button className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-lg">Add FAQ</button>
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                      <input type="text" defaultValue="Who can participate?" className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-2 font-bold" />
                      <textarea rows="2" defaultValue="Any college student with a valid ID." className="w-full px-4 py-2 border border-slate-300 rounded-lg"></textarea>
                    </div>
                    <button className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg mt-4">Save FAQs</button>
                  </div>

                  <hr className="my-8" />
                  <h3 className="text-xl font-bold text-brand-primary mb-4">Update Rulebook</h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <FileText className="mx-auto text-slate-400 mb-2" size={32} />
                    <span className="font-bold text-slate-700">Click to upload new Rulebook PDF</span>
                  </div>
                </div>
              )}

              {/* Contact CMS */}
              {cmsTab === 'contact' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-brand-primary mb-4">Update Contact Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Support Email</label>
                      <input type="email" defaultValue="support@specteq.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Address / Venue</label>
                      <textarea rows="2" defaultValue="University Campus, Tech Park, Block C" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"></textarea>
                    </div>
                    <button className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg mt-4">Save Contact Info</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
