import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, FileText, Download, LogOut, Search, Clock } from 'lucide-react';

const MarkInput = ({ submission, currentUser, onSave }) => {
  const initialMark = submission.evaluations && currentUser 
    ? submission.evaluations.find(e => e.memberId === currentUser.id || e.memberId === currentUser._id)?.marks 
    : '';
  const [mark, setMark] = useState(initialMark !== undefined && initialMark !== null ? initialMark : '');

  const handleChange = (e) => {
    let val = e.target.value;
    if (val === '') {
      setMark('');
      return;
    }
    let num = Number(val);
    if (num < 0) num = 0;
    if (num > 100) num = 100;
    setMark(num);
  };

  const handleBlur = () => {
    if (mark !== '') {
      onSave(submission._id, mark);
    }
  };

  return (
    <input 
      type="number" 
      min="0" 
      max="100" 
      placeholder="0-100"
      value={mark}
      onChange={handleChange}
      onBlur={handleBlur}
      className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm text-center font-medium text-slate-700"
    />
  );
};

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const handleSaveMarks = async (submissionId, marks) => {
    try {
      const token = localStorage.getItem('specteq_token');
      const res = await fetch(`http://localhost:5000/api/member/submissions/${submissionId}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ marks: Number(marks) })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to save marks: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving marks.');
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('specteq_token');
    const user = JSON.parse(localStorage.getItem('specteq_user') || '{}');

    if (!token || (user.role !== 'professional' && user.role !== 'admin')) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    fetchSubmissions(token);
  }, [navigate]);

  const fetchSubmissions = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/member/submissions', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions.');
      }
      
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('specteq_token');
    localStorage.removeItem('specteq_user');
    navigate('/login');
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.taskName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (sub.teamId?.teamName && sub.teamId.teamName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.teamId?.theme && sub.teamId.theme.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-xl font-bold text-brand-primary">Loading Member Portal...</p></div>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Helmet><title>Evaluator Portal | Specteq</title></Helmet>

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-8 border-b border-slate-800">
          <span className="font-extrabold text-2xl flex items-center">
            <Shield className="mr-2 text-brand-accent" /> Evaluator
          </span>
        </div>
        <nav className="p-4 flex-grow space-y-2">
          <button className="w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors bg-brand-primary text-white">
            <FileText size={20} className="mr-3" /> All Submissions
          </button>
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-3 rounded-xl font-medium transition-colors">
            <LogOut size={20} className="mr-3" /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full h-screen overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Review Submissions</h1>
            <p className="text-slate-500 mt-1">View and evaluate team tasks. Read-only access.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks, teams, or themes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-brand-primary shadow-sm w-64"
            />
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Task Name</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Theme</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4 text-right">Action</th>
                  <th className="px-6 py-4 text-right">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No submissions found matching your search.</td></tr>
                ) : (
                  filteredSubmissions.map(sub => (
                    <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{sub.taskName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{sub.teamId?.teamName || 'Unknown Team'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          {sub.teamId?.theme || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 flex items-center">
                        <Clock size={14} className="mr-1.5" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a 
                          href={`http://localhost:5000${sub.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors"
                        >
                          <Download size={14} className="mr-1.5" /> Download
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <MarkInput 
                          submission={sub} 
                          currentUser={currentUser} 
                          onSave={handleSaveMarks} 
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemberDashboard;
