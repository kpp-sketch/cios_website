import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Mail, ExternalLink, Users, ChevronDown, FileDown, Library, Globe, Lock, 
  BookOpen, ShoppingCart, ArrowLeft, Plane,
  Handshake, Coins, Map, CreditCard, Send, AlertTriangle, CheckCircle, Clock, Upload, FileCheck, FileText
} from 'lucide-react';

export default function App() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [publicationsData, setPublicationsData] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [hoverTab, setHoverTab] = useState(null);
  
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeResource, setActiveResource] = useState(null);

  const [formData, setFormData] = useState({ travel: '', orders: '' });
  const [selectedFiles, setSelectedFiles] = useState({ travel: null, orders: null });
  const [uploadStatus, setUploadStatus] = useState({ travel: false, orders: false });

  const colors = {
    navy: '#0A192F', 
    red: '#D12E41',
    midBlueText: '#4A6582',
    borderGray: '#E5E7EB',
    warningBg: '#FFFBEB',
    warningText: '#92400E'
  };

  const INTRANET_PASSWORD = "heslo123";

  // Funkce pro navigaci na konkrétního člena týmu
  const goToMember = (name) => {
    setActiveTab('people');
    setTimeout(() => {
      const element = document.getElementById(name);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.transition = 'background-color 0.5s';
        element.style.backgroundColor = '#fef2f2';
        setTimeout(() => element.style.backgroundColor = 'transparent', 2000);
      }
    }, 150);
  };

  // Data pro aktuality s vloženými odkazy
  const newsData = [
    {
      date: "May 2026",
      title: "Michal Šoltés at the London School of Economics",
      desc: (
        <>
          <button onClick={() => goToMember("Michal Šoltés")} className="font-bold underline decoration-red-200 hover:text-red-600 transition-colors">Michal Šoltés</button>
          {" has presented at the "}
          <a href="https://www.lse.ac.uk/" target="_blank" rel="noreferrer" className="font-bold underline decoration-red-200 hover:text-red-600 transition-colors">London School of Economics and Political Science</a>
          {". His presentation on the Role of Expertise in Consistency in Decision-Making: Experimental Evidence with Public Prosecutors and Law Students has been a part of the "}
          <a href="https://cep.lse.ac.uk/_new/events/economics-of-crime/" target="_blank" rel="noreferrer" className="font-bold underline decoration-red-200 hover:text-red-600 transition-colors">European Seminars on the Economics of Crime</a>
          {" series."}
        </>
      ),
      source: "https://cep.lse.ac.uk/_new/events/event.asp?index=10552",
      pdf: null
    }
  ];

  const handleInputChange = (resource, value) => {
    setFormData(prev => ({ ...prev, [resource]: value }));
  };

  const handleFileChange = (resource, e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => ({ ...prev, [resource]: e.target.files[0] }));
      setUploadStatus(prev => ({ ...prev, [resource]: false }));
    }
  };

  const simulateUpload = (resource) => {
    if (!selectedFiles[resource]) return;
    setUploadStatus(prev => ({ ...prev, [resource]: true }));
    setTimeout(() => {
        alert(`File "${selectedFiles[resource].name}" was successfully attached.`);
    }, 500);
  };

  const sendEmail = (resource) => {
    const to = "katerina.pospichalovapavlov@prf.cuni.cz";
    const cc = "anna.mala@prf.cuni.cz, eva.mysakova@prf.cuni.cz";
    const subject = resource === 'travel' ? "Travel Notification" : "Order Notification";
    const body = formData[resource];
    window.location.href = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const navStructure = [
    { id: 'home', label: 'Home' },
    { id: 'people', label: 'People' },
    { 
      id: 'publications', 
      label: 'Publications',
      sub: [
        { label: 'Working Papers', id: 'working-papers' },
        { label: 'Articles', id: 'journal-articles' },
        { label: 'Chapters', id: 'book-chapters' }
      ]
    },
    { 
      id: 'about', 
      label: 'About',
      sub: [
        { label: 'Overview', id: 'the-project' },
        { label: 'Work Packages', id: 'work-packages' },
        { label: 'Management', id: 'management' },
        { label: 'Advisory Board', id: 'isab-board' },
        { label: 'Resources for Researchers', id: 'intranet' }
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await fetch('/team.xlsx?t=' + new Date().getTime());
        if (teamRes.ok) {
          const teamBuf = await teamRes.arrayBuffer();
          const teamWb = XLSX.read(teamBuf);
          const teamData = XLSX.utils.sheet_to_json(teamWb.Sheets[teamWb.SheetNames[0]]);
          setTeamMembers(teamData.map(p => ({
            ...p,
            groups: p.groups ? p.groups.toString().split(',').map(g => g.trim().replace('researcher', 'research')) : []
          })));
        }
        const pubRes = await fetch('/publications.xlsx');
        if (pubRes.ok) {
          const pubBuf = await pubRes.arrayBuffer();
          const pubWb = XLSX.read(pubBuf);
          const pubData = XLSX.utils.sheet_to_json(pubWb.Sheets[pubWb.SheetNames[0]]);
          setPublicationsData(pubData.sort((a, b) => (b.year || 0) - (a.year || 0)));
        }
      } catch (error) {
        console.error("Load Error:", error);
      }
    };
    fetchData();
  }, []);

  const handleNavClick = (tabId, sectionId = null) => {
    if (sectionId === 'intranet') {
      setActiveTab('intranet');
      setActiveResource(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab(tabId);
      if (tabId !== 'intranet') setActiveResource(null);
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const offset = 140; 
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (passwordInput === INTRANET_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const scrollToPublication = (title) => {
    setActiveTab('publications');
    setTimeout(() => {
      const elements = document.getElementsByTagName('h3');
      const target = Array.from(elements).find(el => el.innerText.trim() === title.trim());
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const container = target.closest('.mb-8');
        if (container) {
          container.style.backgroundColor = '#f1f5f9';
          setTimeout(() => container.style.backgroundColor = 'transparent', 1500);
        }
      }
    }, 150);
  };

  const PublicationItem = ({ pub }) => {
    return (
      <div className="mb-8 last:mb-0 text-left p-2 rounded-lg transition-colors">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold" style={{ color: colors.navy }}>{pub.year}</span>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded" style={{ color: colors.red }}>
            {pub.journal || (pub.type || '').replace('-', ' ')}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 leading-snug" style={{ color: colors.navy }}>{pub.title}</h3>
        <p className="text-base font-medium mb-3" style={{ color: colors.midBlueText }}>{pub.authors}</p>
        <div className="flex gap-6 text-sm font-bold">
          {pub.pdf && pub.pdf !== '#' && <a href={pub.pdf} target="_blank" rel="noreferrer" className="flex items-center hover:underline" style={{ color: colors.navy }}><FileDown className="w-4 h-4 mr-2" /> PDF</a>}
          {(pub.link || pub.repo) && <a href={pub.link || pub.repo} target="_blank" rel="noreferrer" className="flex items-center hover:underline" style={{ color: colors.navy }}><Library className="w-4 h-4 mr-2" /> {pub.type === 'working-paper' ? 'Repository' : 'Journal Link'}</a>}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        const recentUpdates = publicationsData.slice(0, 4);
        return (
          <div className="py-12 px-6 sm:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center mb-16 mt-8">
              <h1 className="text-4xl sm:text-6xl font-black mb-6" style={{ color: colors.navy }}>Center for Inequality and <br className="hidden sm:block" /> Open Society</h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.midBlueText }}>An interdisciplinary initiative applying empirical research to address challenges in modern open societies.</p>
            </div>

            <div className="max-w-6xl mx-auto border-t pt-16" style={{ borderColor: colors.borderGray }}>
              <div className="grid md:grid-cols-3 gap-16 mb-20">
                {/* Horní část: Latest Publications */}
                <div className="md:col-span-2 text-left">
                  <h2 className="text-2xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Latest Publications</h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {recentUpdates.map((pub, idx) => (
                      <div key={idx} className="cursor-pointer group" onClick={() => scrollToPublication(pub.title)}>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{pub.type}</span>
                        <h3 className="text-lg font-bold mt-1 mb-2 leading-tight group-hover:underline decoration-slate-300" style={{ color: colors.navy }}>{pub.title}</h3>
                        <p className="text-xs font-medium opacity-70">{pub.authors}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sidebar: Semináře */}
                <div className="p-8 bg-slate-50 rounded-xl border h-fit text-left" style={{ borderColor: colors.borderGray }}>
                  <h3 className="text-xl font-bold mb-4">Research Seminars</h3>
                  <p className="text-sm mb-6">Join our regular sessions on empirical legal studies and economics.</p>
                  <a href="https://www.prf.cuni.cz/en/department-economics-and-empirical-legal-studies/vspee-research-seminars-law-economics-and-empirics" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest flex items-center hover:underline" style={{ color: colors.red }}>View Schedule <ExternalLink className="w-3 h-3 ml-2" /></a>
                </div>
              </div>

              {/* Dolní část: News & Events */}
              <div className="text-left pt-16 border-t" style={{ borderColor: colors.borderGray }}>
                <h2 className="text-2xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>News & Events</h2>
                <div className="space-y-16">
                  {newsData.map((news, idx) => (
                    <div key={idx} className="max-w-4xl">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-3">{news.date}</span>
                      <h4 className="text-2xl font-bold mb-4" style={{ color: colors.navy }}>{news.title}</h4>
                      <p className="text-lg leading-relaxed mb-6" style={{ color: colors.midBlueText }}>
                        {news.desc}
                      </p>
                      <div className="flex gap-8">
                        {news.source && (
                          <a href={news.source} target="_blank" rel="noreferrer" className="text-[11px] font-black uppercase tracking-widest flex items-center hover:underline" style={{ color: colors.red }}>
                            <ExternalLink className="w-4 h-4 mr-2" /> Full Event Details
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'people':
        const alphabeticalTeam = teamMembers
          .filter(m => m.groups && (m.groups.includes('research') || m.groups.includes('admin')))
          .sort((a, b) => (a.surname || '').localeCompare((b.surname || ''), 'cs')); 
        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto text-left">
            <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Our People</h2>
            <div className="space-y-10">
              {alphabeticalTeam.map((member, idx) => (
                <div key={idx} id={member.name} className="flex flex-col sm:flex-row gap-8 items-start p-4 rounded-xl transition-colors duration-1000">
                  <div className="w-32 h-32 shrink-0 bg-slate-100 flex items-center justify-center rounded-lg overflow-hidden border border-slate-200">
                    {member.photo ? <img src={`/${member.photo}`} alt={member.name} className="w-full h-full object-cover object-top" /> : <Users className="w-10 h-10 opacity-20" />}
                  </div>
                  <div className="flex-grow pt-1">
                    <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                    <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>{member.role} {member.affiliation && <> <span className="mx-2 text-slate-300 font-normal">|</span> {member.affiliation}</>}</p>
                    <p className="text-sm mb-3" style={{ color: colors.midBlueText }}>{member.bio}</p>
                    <div className="flex flex-col gap-2 mt-2">
                      {member.email && <a href={`mailto:${member.email}`} className="flex items-center text-sm font-bold hover:underline"><Mail className="w-4 h-4 mr-2" /> {member.email}</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'intranet':
        if (!isAuthenticated) {
          return (
            <div className="py-24 px-6 max-w-md mx-auto text-center">
              <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200">
                <Lock className="w-12 h-12 mx-auto mb-6 opacity-20" />
                <h2 className="text-2xl font-bold mb-2">Restricted Access</h2>
                <p className="text-sm mb-8" style={{ color: colors.midBlueText }}>Please enter the password to access resources for researchers.</p>
                <form onSubmit={handleAuth} className="space-y-4">
                  <input type="password" placeholder="Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2" style={{ borderColor: authError ? colors.red : colors.borderGray }} />
                  {authError && <p className="text-xs font-bold" style={{ color: colors.red }}>Incorrect password.</p>}
                  <button type="submit" className="w-full py-3 rounded-lg font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90" style={{ backgroundColor: colors.navy }}>Login</button>
                </form>
              </div>
            </div>
          );
        }
        return (
          <div className="py-12 px-6 sm:px-12 max-w-6xl mx-auto text-left">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.navy }}>Resources for Researchers</h2>
            <p className="text-lg mb-12 border-b-2 inline-block pb-2" style={{ color: colors.red, borderColor: colors.red }}>Internal Support & Administration</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'travel', label: 'Travel Arrangements', icon: <Plane className="w-10 h-10"/> },
                { id: 'orders', label: 'Procurement & Orders', icon: <ShoppingCart className="w-10 h-10"/> },
                { id: 'grants', label: 'Grant Applications', icon: <Coins className="w-10 h-10" /> }
              ].map((item) => (
                <button key={item.id} onClick={() => setActiveResource(item.id)} className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all min-h-[220px] group">
                  <div className="mb-6 text-slate-300 group-hover:text-red-500 transition-colors">{item.icon}</div>
                  <span className="text-sm font-bold text-center" style={{ color: colors.navy }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'publications':
        const wps = publicationsData.filter(p => p.type === 'working-paper');
        const articles = publicationsData.filter(p => p.type === 'journal-article');
        const chapters = publicationsData.filter(p => p.type === 'book-chapter');
        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto text-left">
            <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Publications</h2>
            <section id="working-papers" className="mb-16 pt-4"><h3 className="text-2xl font-bold mb-6">Working Papers</h3>{wps.map((p, i) => <PublicationItem key={i} pub={p} />)}</section>
            <section id="journal-articles" className="pt-10 border-t mb-16"><h3 className="text-2xl font-bold mb-6">Journal Articles</h3>{articles.map((p, i) => <PublicationItem key={i} pub={p} />)}</section>
            <section id="book-chapters" className="pt-10 border-t"><h3 className="text-2xl font-bold mb-6">Book Chapters</h3>{chapters.map((p, i) => <PublicationItem key={i} pub={p} />)}</section>
          </div>
        );
      case 'about':
        return (
          <div className="py-12 px-6 sm:px-12 max-w-5xl mx-auto text-left">
            <h2 id="the-project" className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>About the Project</h2>
            <p className="text-lg leading-relaxed mb-16">The Center for Inequality and Open Society (CIOS) is an interdisciplinary research initiative addressing the critical challenges and disparities faced by modern open societies in the digital age.</p>
            
            <h2 id="work-packages" className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Work Packages</h2>
            <div className="grid gap-10 mb-20">
              {[
                { id: 'WP1', title: 'Digital Public Sphere', leader: 'Volker Kaul' },
                { id: 'WP2', title: 'Inequality in Justice', leader: 'Michal Šoltés' },
                { id: 'WP3', title: 'PRECID', leader: 'Josef Montag' },
                { id: 'WP4', title: 'Finance & Inequality', leader: 'Eva Horváthová' },
                { id: 'WP5', title: 'Legal Aspects of Vulnerability', leader: 'Veronika Bílková' },
                { id: 'WP6', title: 'Digitally Vulnerable Consumer', leader: 'Jakub Harašta' }
              ].map(wp => (
                <div key={wp.id} className="border-l-4 pl-6 py-2" style={{ borderColor: colors.red }}>
                  <h4 className="text-xl font-bold"><span style={{ color: colors.red }}>{wp.id}</span> {wp.title}</h4>
                  <p className="text-sm font-bold my-1">Leader: <span className="font-normal" style={{ color: colors.midBlueText }}>{wp.leader}</span></p>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const displayNav = navStructure.find(n => n.id === (hoverTab || (activeTab === 'intranet' ? 'about' : activeTab)));

  return (
    <div className="min-h-screen flex flex-col font-montserrat bg-white" style={{ color: colors.navy }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <nav className="sticky top-0 z-50 bg-white shadow-sm py-6" onMouseLeave={() => setHoverTab(null)}>
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex justify-between items-center">
          <div className="cursor-pointer shrink-0" onClick={() => handleNavClick('home')}>
            <img src="/CIOS_Logo_Color.png" alt="CIOS Logo" className="h-20 object-contain" />
          </div>
          
          <div className="flex flex-col items-end gap-3 mt-2">
            <div className="flex gap-8">
              {navStructure.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => handleNavClick(item.id)} 
                  onMouseEnter={() => setHoverTab(item.id)} 
                  className="text-[11px] font-black uppercase tracking-widest pb-1 transition-colors"
                  style={{ 
                    color: activeTab === item.id || (activeTab === 'intranet' && item.id === 'about') ? colors.navy : colors.midBlueText, 
                    borderBottom: activeTab === item.id || (activeTab === 'intranet' && item.id === 'about') ? `2px solid ${colors.red}` : '2px solid transparent' 
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-6 h-5">
              {displayNav && displayNav.sub && displayNav.sub.map(subItem => (
                <button 
                  key={subItem.id} 
                  onClick={() => handleNavClick(displayNav.id, subItem.id)} 
                  className="text-[10px] font-black uppercase tracking-widest hover:text-navy transition-colors" 
                  style={{ color: colors.midBlueText }}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">{renderContent()}</main>

      <footer className="pt-16 pb-12 bg-white border-t" style={{ borderColor: colors.borderGray }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-12 text-center">
          <p className="text-[11px] opacity-60">Co-funded by the European Regional Development Fund, project CIOS, no. CZ.02.01.01/00/23_025/0008690.</p>
        </div>
      </footer>
    </div>
  );
}
