
import React, { useState, useEffect } from 'react';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { INITIAL_RESUME_DATA, EMPTY_RESUME_DATA } from './constants';
import { ResumeData, ResumeVersion } from './types';
import { StorageService } from './services/storage';
import { Printer, CheckCircle, LogOut, Save, Trash2, ArrowLeft, FileText, History, User as UserIcon, X } from 'lucide-react';

type ViewState = 'LANDING' | 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'EDITOR';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // Editor State
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [currentVersionName, setCurrentVersionName] = useState<string>('');
  
  // UI State
  const [scale, setScale] = useState(0.8);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor'); // Mobile only
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Dashboard State
  const [versions, setVersions] = useState<ResumeVersion[]>([]);

  // Auth Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Resize Logic
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        const previewWidth = window.innerWidth * 0.5; 
        const a4Width = 210 * 3.78; 
        const margin = 40;
        const availableWidth = previewWidth - (margin * 2);
        let newScale = Math.min(1.1, Math.max(0.5, availableWidth / a4Width));
        setScale(newScale);
      } else {
        setScale(0.6);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth Handlers
  const handleLogin = async () => {
    const loggedIn = await StorageService.login({ username, password });
    if (loggedIn) {
      setCurrentUser(username);
      await loadDashboard(username);
      setAuthError('');
    } else {
      setAuthError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
        setAuthError('Please fill in all fields');
        return;
    }
    const registered = await StorageService.register({ username, password });
    if (registered) {
      setCurrentUser(username);
      await loadDashboard(username);
      setAuthError('');
    } else {
      setAuthError('Username already exists');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setView('LANDING');
    setUsername('');
    setPassword('');
  };

  // Data Handlers
  const loadDashboard = async (user: string) => {
    const userVersions = await StorageService.getVersions(user);
    setVersions(userVersions);
    setView('DASHBOARD');
  };

  const loadVersion = (version: ResumeVersion) => {
    setResumeData(version.data);
    setCurrentVersionId(version.id);
    setCurrentVersionName(version.name);
    setView('EDITOR');
  };

  const createNewVersion = () => {
    // Load completely empty data for a fresh start
    setResumeData(EMPTY_RESUME_DATA);
    setCurrentVersionId(null); // No ID yet, it's a draft
    setCurrentVersionName("My New Resume");
    setView('EDITOR');
  };

  const initiateSave = () => {
    setSaveName(currentVersionName || "My Resume");
    setShowSaveModal(true);
  };

  const handleSaveConfirm = async (mode: 'UPDATE' | 'NEW') => {
    if (!currentUser) return;
    
    if (mode === 'UPDATE' && currentVersionId) {
      // Update existing
      const updated = await StorageService.updateVersion(currentUser, currentVersionId, saveName, resumeData);
      if (updated) {
        setCurrentVersionName(updated.name);
        alert('Version updated successfully!');
      }
    } else {
      // Create new
      const newVer = await StorageService.saveNewVersion(currentUser, saveName, resumeData);
      setCurrentVersionId(newVer.id);
      setCurrentVersionName(newVer.name);
      alert('Saved as new version!');
    }
    
    setShowSaveModal(false);
    // Update dashboard list silently if we go back
  };

  const deleteVersion = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this version?")) {
        await StorageService.deleteVersion(currentUser!, id);
        setVersions(await StorageService.getVersions(currentUser!));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // --- VIEWS ---

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white p-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <CheckCircle className="text-blue-600" /> BuildMyCV
          </div>
          <div className="space-x-4">
            <button onClick={() => setView('LOGIN')} className="text-slate-600 font-medium hover:text-blue-600">Login</button>
            <button onClick={() => setView('REGISTER')} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Get Started</button>
          </div>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Build Your Professional <span className="text-blue-600">Engineer Resume</span></h1>
            <p className="text-xl text-slate-600 max-w-2xl mb-10">
                AI-powered text enhancement, version control, and clean, ATS-friendly templates. 
                Free for everyone. No Google Account required.
            </p>
            <div className="flex gap-4">
                <button onClick={() => setView('REGISTER')} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition">Create Account</button>
                <button onClick={() => setView('LOGIN')} className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold text-lg hover:bg-slate-50 transition">Login</button>
            </div>
        </main>
      </div>
    );
  }

  if (view === 'LOGIN' || view === 'REGISTER') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{view === 'LOGIN' ? 'Welcome Back' : 'Create Account'}</h2>
            
            {authError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{authError}</div>}
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                </div>
                
                <button 
                    onClick={view === 'LOGIN' ? handleLogin : handleRegister}
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
                >
                    {view === 'LOGIN' ? 'Login' : 'Register'}
                </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                {view === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setAuthError(''); }} className="text-blue-600 font-bold hover:underline">
                    {view === 'LOGIN' ? 'Sign Up' : 'Login'}
                </button>
            </p>
            <button onClick={() => setView('LANDING')} className="w-full mt-6 text-gray-400 text-sm hover:text-gray-600">Back to Home</button>
        </div>
      </div>
    );
  }

  if (view === 'DASHBOARD') {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-md">
            <div className="flex items-center gap-2 font-bold text-lg">
                 <CheckCircle size={20} /> BuildMyCV <span className="font-normal opacity-50 mx-2">|</span> Dashboard
            </div>
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-gray-300"><UserIcon size={14}/> {currentUser}</span>
                <button onClick={logout} className="text-gray-400 hover:text-white"><LogOut size={18} /></button>
            </div>
        </nav>
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Your Resumes</h1>
                <button onClick={createNewVersion} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 shadow-md transition">
                    <FileText size={18} /> Create New Empty Resume
                </button>
            </div>

            <div className="grid gap-4">
                {versions.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                        No resumes found. Create one to get started!
                    </div>
                )}
                {versions.map((ver) => (
                    <div key={ver.id} onClick={() => loadVersion(ver)} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition flex justify-between items-center group">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600">{ver.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><History size={14} /> Last updated: {new Date(ver.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button onClick={(e) => deleteVersion(e, ver.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                                <Trash2 size={18} />
                             </button>
                             <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition font-medium text-sm">Edit &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  // EDITOR VIEW
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Save Resume</h3>
                    <button onClick={() => setShowSaveModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume Name / Version</label>
                    <input 
                        type="text" 
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        placeholder="e.g., Software Engineer v2"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    {currentVersionId && (
                        <button 
                            onClick={() => handleSaveConfirm('UPDATE')}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
                        >
                            <Save size={18} /> Update Current Version
                        </button>
                    )}
                    
                    <button 
                        onClick={() => handleSaveConfirm('NEW')}
                        className={`w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex justify-center items-center gap-2 ${!currentVersionId ? 'bg-blue-600 text-white border-none hover:bg-blue-700' : ''}`}
                    >
                        <FileText size={18} /> {currentVersionId ? 'Save as New Version' : 'Save New Resume'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-md z-20 shrink-0 no-print">
        <div className="flex items-center gap-4">
          <button onClick={() => loadDashboard(currentUser!)} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium">
             <ArrowLeft size={16} /> Back
          </button>
          <div className="h-6 w-px bg-gray-700"></div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline">{currentVersionName || "Untitled Resume"}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={initiateSave}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-medium transition-colors text-sm"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save Version</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md font-medium transition-colors text-sm"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Tabs */}
        {isMobile && (
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t flex z-30 no-print">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`flex-1 font-medium text-sm ${activeTab === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
            >
              Editor
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex-1 font-medium text-sm ${activeTab === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
            >
              Preview
            </button>
          </div>
        )}

        {/* Editor Pane */}
        <div className={`
          flex-1 lg:flex lg:w-1/2 bg-white h-full
          ${isMobile && activeTab === 'preview' ? 'hidden' : 'block'}
        `}>
          <ResumeEditor data={resumeData} onChange={setResumeData} />
        </div>

        {/* Preview Pane */}
        <div className={`
          flex-1 lg:flex lg:w-1/2 bg-slate-200 h-full flex-col items-center justify-start pt-8 overflow-auto custom-scrollbar
          ${isMobile && activeTab === 'editor' ? 'hidden' : 'flex'}
        `}>
          <div className="no-print mb-4 text-gray-500 text-sm font-medium flex items-center gap-2">
            Live Preview (A4) 
          </div>
          <div className="shadow-2xl mb-20 lg:mb-8 transition-transform duration-200 ease-out print:shadow-none print:m-0 print:transform-none">
             <ResumePreview data={resumeData} scale={isMobile ? scale : scale} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
