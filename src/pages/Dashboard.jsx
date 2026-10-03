import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, FileText, Settings, LogOut, Bell, Upload, AlertCircle, Users, User, ChevronDown, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  // Forms state
  const [teamForm, setTeamForm] = useState({ teamName: '', college: '', theme: 'Space Exploration' });
  const [joinForm, setJoinForm] = useState({ inviteCode: '' });
  const [fileToUpload, setFileToUpload] = useState(null);

  // Dropdown states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('specteq_token');
    const userData = localStorage.getItem('specteq_user');
    
    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchTeamData(token);
      fetchSubmissions(token);
    }

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const fetchTeamData = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/teams/my-team', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/submissions/my-submissions', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('specteq_token');
    try {
      const res = await fetch('http://localhost:5000/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(teamForm)
      });
      if (res.ok) {
        alert('Team created successfully!');
        fetchTeamData(token);
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('specteq_token');
    try {
      const res = await fetch('http://localhost:5000/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(joinForm)
      });
      if (res.ok) {
        alert('Joined team successfully!');
        fetchTeamData(token);
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return alert('Please select a file to upload.');
    
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('taskName', 'Task 1: Concept & Simulation');

    const token = localStorage.getItem('specteq_token');
    try {
      const res = await fetch('http://localhost:5000/api/submissions/upload', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      });
      if (res.ok) {
        alert('File uploaded successfully!');
        setFileToUpload(null);
        fetchSubmissions(token);
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('specteq_token');
    localStorage.removeItem('specteq_user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderDashboardOverview = () => (
    <>
      {!team && (
        <div className="flex items-start p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl mb-8 shadow-sm">
          <AlertCircle size={24} className="mr-3 shrink-0 text-amber-500" />
          <div>
            <strong className="font-bold">Action Required:</strong> You are not in a team yet. Please go to Team Settings to create or join one.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Task 1 Status</h3>
          <div className="text-4xl font-extrabold text-brand-accent mb-2">
            {submissions.length > 0 ? 'Submitted' : 'Pending'}
          </div>
          <p className="text-sm text-slate-500 font-medium">Due in 15 days</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Team Members</h3>
          <div className="text-4xl font-extrabold text-brand-primary mb-2">{team ? team.members.length : 0}/4</div>
          <p className="text-sm text-slate-500 font-medium">{team ? `${4 - team.members.length} spots remaining` : 'No team'}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Current Rank</h3>
          <div className="text-4xl font-extrabold text-brand-primary mb-2">--</div>
          <p className="text-sm text-slate-500 font-medium">Available after Task 1</p>
        </div>
      </div>
    </>
  );

  const renderSubmissions = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-lg font-bold text-brand-primary">My Submissions</h3>
      </div>
      <div className="p-8">
        {!team ? (
          <p className="text-center text-red-500 font-bold">You must join a team to upload submissions.</p>
        ) : (
          <>
            <form onSubmit={handleFileUpload} className="mb-8 p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
              <Upload size={32} className="mx-auto mb-2 text-slate-400" />
              <p className="font-semibold text-slate-700 mb-4">Upload your Task 1 ZIP file</p>
              <input type="file" onChange={(e) => setFileToUpload(e.target.files[0])} className="mb-4" />
              <button type="submit" className="block w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Submit File
              </button>
            </form>

            <h4 className="font-bold text-lg mb-4 text-brand-primary">Submission History</h4>
            {submissions.length === 0 ? (
              <p className="text-slate-500">No submissions yet.</p>
            ) : (
              <ul className="space-y-3">
                {submissions.map(sub => (
                  <li key={sub._id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-white">
                    <div>
                      <p className="font-bold text-brand-primary">{sub.taskName}</p>
                      <a href={`http://localhost:5000${sub.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm text-brand-secondary hover:underline">
                        View File
                      </a>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{sub.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-lg font-bold text-brand-primary">Team Configuration</h3>
      </div>
      <div className="p-8">
        {team ? (
          <div>
            <h4 className="text-2xl font-bold text-brand-primary mb-2">{team.teamName}</h4>
            <p className="text-slate-500 font-medium mb-6">{team.college}</p>
            <div className="bg-brand-secondary/10 text-brand-secondary p-4 rounded-xl inline-block mb-8 font-bold border border-brand-secondary/20">
              Invite Code: {team.inviteCode}
            </div>
            
            <h5 className="font-bold text-lg mb-4">Team Members</h5>
            <ul className="space-y-2 max-w-md">
              {team.members.map(member => (
                <li key={member._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-semibold">{member.fullName}</span>
                  {member._id === team.leader._id && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">Leader</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50">
              <h4 className="text-xl font-bold text-brand-primary mb-4">Create a New Team</h4>
              <form onSubmit={handleCreateTeam}>
                <input type="text" placeholder="Team Name" required value={teamForm.teamName} onChange={e => setTeamForm({...teamForm, teamName: e.target.value})} className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-brand-secondary/20" />
                <input type="text" placeholder="College / Institution" required value={teamForm.college} onChange={e => setTeamForm({...teamForm, college: e.target.value})} className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-brand-secondary/20" />
                <select value={teamForm.theme} onChange={e => setTeamForm({...teamForm, theme: e.target.value})} className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-brand-secondary/20 bg-white">
                  <option value="Space Exploration">Space Exploration</option>
                  <option value="Deep Sea Rescue">Deep Sea Rescue</option>
                  <option value="Medical Tech">Medical Tech</option>
                  <option value="Agri-Bot">Agri-Bot</option>
                </select>
                <button type="submit" className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-slate-800">Create Team</button>
              </form>
            </div>
            
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50">
              <h4 className="text-xl font-bold text-brand-primary mb-4">Join Existing Team</h4>
              <form onSubmit={handleJoinTeam}>
                <input type="text" placeholder="6-digit Invite Code" required value={joinForm.inviteCode} onChange={e => setJoinForm({...joinForm, inviteCode: e.target.value})} className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-brand-secondary/20 uppercase" />
                <button type="submit" className="w-full py-3 bg-brand-accent text-white font-bold rounded-xl hover:bg-orange-600">Join Team</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Helmet><title>Team Dashboard | Specteq</title></Helmet>
      
      {/* Sidebar */}
      <aside className="w-64 bg-brand-primary text-white flex flex-col shrink-0 border-r border-slate-800 hidden md:flex">
        <div className="p-8 border-b border-white/10">
          <Link to="/"><span className="font-extrabold text-2xl">Specteq<span className="text-brand-accent">.</span></span></Link>
        </div>
        <nav className="p-4 flex-grow space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={20} className={`mr-3 ${activeTab === 'dashboard' ? 'text-brand-secondary' : ''}`} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('submissions')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'submissions' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileText size={20} className={`mr-3 ${activeTab === 'submissions' ? 'text-brand-secondary' : ''}`} /> Submissions
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Settings size={20} className={`mr-3 ${activeTab === 'settings' ? 'text-brand-secondary' : ''}`} /> Team Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-y-auto w-full">
        {/* Topbar */}
        <header className="bg-white px-6 md:px-8 py-5 flex justify-between items-center border-b border-slate-200 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-brand-primary capitalize">{activeTab === 'dashboard' ? 'Team Overview' : activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center space-x-6 relative">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-slate-400 hover:text-brand-primary transition-colors focus:outline-none relative">
                <Bell size={22} /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center focus:outline-none">
                <span className="mr-3 font-semibold text-slate-700 hidden sm:block">{user ? user.fullName : 'Student'}</span>
                <div className="w-10 h-10 bg-brand-secondary text-white rounded-full flex items-center justify-center font-bold shadow-sm">{getInitials(user?.fullName)}</div>
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center mt-1"><LogOut size={16} className="mr-2" /> Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'dashboard' && renderDashboardOverview()}
          {activeTab === 'submissions' && renderSubmissions()}
          {activeTab === 'settings' && renderTeamSettings()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
