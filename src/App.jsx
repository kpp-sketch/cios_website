import React, { useState } from 'react';
import { Mail, MapPin, ExternalLink, BookOpen, Users, FileText, ChevronDown, FileDown, Library, Globe, Heart } from 'lucide-react';

import siteData from './data.json'; // UNCOMMENT THIS FOR PRODUCTION BUILDS

// ==========================================
// 1. DATA CONFIGURATION (MOCK JSON FOR PREVIEW)
// ==========================================

const workPackages = [
  { id: 'WP1', title: 'Digital Public Sphere', leader: 'Volker Kaul', description: 'Examining how social media influence public discourse and contribute to societal polarization.' },
  { id: 'WP2', title: 'Inequality in Justice', leader: 'Michal Šoltés', description: 'Analyzing the causes and consequences of inequalities in court rulings using unique data from Czech and Dutch judges.' },
  { id: 'WP3', title: 'Information Support for Criminal Justice (PRECID)', leader: 'Josef Montag', description: 'Developing PRECID software to provide judges with data-driven and algorithmic support for decision-making.' },
  { id: 'WP4', title: 'Finance, Innovation, and Inequality', leader: 'Eva Horváthová', description: 'Investigating the macroeconomic links between financial systems, technological innovation, and wealth distribution.' },
  { id: 'WP5', title: 'Legal Aspects of Vulnerability', leader: 'Veronika Bílková', description: 'Exploring how legal frameworks address and sometimes exacerbate societal vulnerabilities.' },
  { id: 'WP6', title: 'The Digitally Vulnerable Consumer', leader: 'Jakub Harašta', description: 'Researching consumer protection and behavioral impacts in digital markets and online platforms.' }
];

const futureGeneration = [
  { name: 'Placeholder Baby 1', parent: 'Josef Montag', year: '2024' },
  { name: 'Placeholder Baby 2', parent: 'Michal Šoltés', year: '2025' }
];

const teamMembers = siteData.team || [];
const publicationsData = siteData.publications || [];

/**
 * Robustly resolve asset paths.
 * We hardcode the production base but allow local preview to work via relative paths.
 */
const getAssetUrl = (filename) => {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Hardcoded production base for GitHub Pages
  const prodBase = '/cios_website/';
  const base = isLocal ? '/' : prodBase;

  const normalizedBase = base.endsWith('/') ? base : base + '/';
  const normalizedFile = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${normalizedBase}${normalizedFile}`;
};

// ==========================================
// 2. WEBSITE COMPONENTS
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);

  const colors = {
    navy: '#0A192F', 
    red: '#D12E41',
    midBlueText: '#4A6582',
    lightGray: '#F9FAFB',
    borderGray: '#E5E7EB'
  };

  const handleNavClick = (tab, sectionId = null) => {
    setActiveTab(tab);
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 130;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const PersonVignette = ({ member }) => {
    const isAdminOnly = member.groups.includes('admin') && !member.groups.includes('research') && !member.groups.includes('isab');
    return (
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-10 last:mb-0">
        <div className="w-32 h-32 shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden rounded-lg">
          <Users className="w-10 h-10 opacity-20" style={{ color: colors.navy }}/>
        </div>
        <div className="flex-grow pt-1">
          <h4 className="text-xl font-bold mb-1" style={{ color: colors.navy }}>{member.name}</h4>
          <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>
            {member.role} {member.affiliation && <><span className="mx-2 text-slate-300 font-normal">|</span> <span style={{ color: colors.midBlueText }}>{member.affiliation}</span></>}
          </p>
          {!isAdminOnly && (
            <p className="text-base font-medium leading-relaxed mb-4 max-w-2xl" style={{ color: colors.midBlueText }}>{member.bio}</p>
          )}
          <div className="flex flex-wrap gap-6 text-sm font-bold">
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center hover:underline" style={{ color: colors.navy }}>
                <Mail className="w-4 h-4 mr-2 opacity-70" /> {member.email}
              </a>
            )}
            {member.website && (
              <a href={member.website} target="_blank" rel="noreferrer" className="flex items-center hover:underline" style={{ color: colors.navy }}>
                <Globe className="w-4 h-4 mr-2 opacity-70" /> Personal Website
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PublicationItem = ({ pub }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div id={pub.id} className="mb-8 last:mb-0 scroll-mt-32">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold" style={{ color: colors.navy }}>{pub.year}</span>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded" style={{ color: colors.red }}>
            {pub.journal || (pub.type || '').replace('-', ' ')}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 leading-snug" style={{ color: colors.navy }}>{pub.title}</h3>
        <p className="text-base font-medium mb-3" style={{ color: colors.midBlueText }}>{pub.authors}</p>
        {pub.abstract && (
          <div className="mb-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-xs font-black uppercase tracking-widest flex items-center transition hover:opacity-70" 
              style={{ color: colors.red }}
            >
              Abstract {isOpen ? <ChevronDown className="w-3 h-3 ml-1 rotate-180" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>
            {isOpen && <p className="mt-3 p-4 bg-slate-50 rounded text-sm italic leading-relaxed" style={{ color: colors.midBlueText }}>{pub.abstract}</p>}
          </div>
        )}
        <div className="flex gap-6 text-sm font-bold">
          {pub.pdf && pub.pdf !== '#' && <a href={pub.pdf} className="flex items-center hover:underline" style={{ color: colors.navy }}><FileDown className="w-4 h-4 mr-2" /> PDF</a>}
          {(pub.repo || pub.link) && (
            <a href={pub.repo || pub.link} target="_blank" rel="noreferrer" className="flex items-center hover:underline" style={{ color: colors.navy }}>
              <Library className="w-4 h-4 mr-2" /> {pub.type === 'working-paper' ? 'Repository' : 'Journal Link'}
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        const featuredPub = publicationsData[0] || {};
        const recentUpdates = publicationsData.slice(1, 4);
        return (
          <div className="animate-in fade-in duration-500 py-12 px-6 sm:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center mb-16 mt-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight px-4" style={{ color: colors.navy }}>
                Center for Inequality and <br className="hidden sm:block" /> Open Society
              </h1>
              <p className="text-xl leading-relaxed font-medium max-w-3xl mx-auto" style={{ color: colors.midBlueText }}>
                An interdisciplinary initiative applying empirical, experimental, and theoretical research across philosophy, law, economics, political science, and psychology to address critical challenges in modern open societies.
              </p>
            </div>
            {featuredPub.title && (
              <div className="max-w-6xl mx-auto mb-20">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-center" style={{ color: colors.red }}>Featured Research</h2>
                <div className="bg-slate-50 border rounded-2xl p-8 sm:p-12 relative overflow-hidden" style={{ borderColor: colors.borderGray }}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-50 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 w-full max-w-none">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-white shadow-sm rounded" style={{ color: colors.red }}>
                        {(featuredPub.type || '').replace('-', ' ')}
                      </span>
                      <span className="text-sm font-bold" style={{ color: colors.navy }}>{featuredPub.year}</span>
                    </div>
                    {/* Scale down the title slightly: 3xl to 4xl is often more proportionate than 5xl */}
                    <h3 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight cursor-pointer hover:underline transition-colors w-full" 
                      style={{ color: colors.navy }}
                      onClick={() => handleNavClick('publications', featuredPub.id)}
                    >
                      {featuredPub.title}
                    </h3>
                    <p className="text-lg font-bold mb-6" style={{ color: colors.midBlueText }}>{featuredPub.authors}</p>
                    {featuredPub.abstract && (
                      <div className="mb-4">
                        <button 
                          onClick={() => setIsFeaturedOpen(!isFeaturedOpen)} 
                          className="text-xs font-black uppercase tracking-widest flex items-center transition hover:opacity-70" 
                          style={{ color: colors.red }}
                        >
                          Abstract {isFeaturedOpen ? <ChevronDown className="w-3 h-3 ml-1 rotate-180" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                        </button>
                        {isFeaturedOpen && (
                          <p className="mt-4 p-5 bg-white/60 rounded-lg text-base italic leading-relaxed font-medium max-w-4xl border border-slate-100" style={{ color: colors.midBlueText }}>
                            {featuredPub.abstract}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 border-t pt-16" style={{ borderColor: colors.borderGray }}>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Latest Updates</h2>
                <div className="space-y-8">
                  {recentUpdates.map((pub, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{(pub.type || '').replace('-', ' ')}</span>
                      <h3 className="text-xl font-bold mt-1 mb-2 leading-snug cursor-pointer hover:underline" style={{ color: colors.navy }} onClick={() => handleNavClick('publications', pub.id)}>{pub.title}</h3>
                      <p className="text-sm font-medium" style={{ color: colors.midBlueText }}>{pub.authors}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="p-8 bg-slate-50 rounded-xl h-fit border shadow-sm" style={{ borderColor: colors.borderGray }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: colors.navy }}>Research Seminars</h3>
                  <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: colors.midBlueText }}>Join our regular sessions on empirical legal studies and economics.</p>
                  <a href="https://www.prf.cuni.cz/en/department-economics-and-empirical-legal-studies/vspee-research-seminars-law-economics-and-empirics" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest flex items-center hover:underline transition-opacity" style={{ color: colors.red }}>View Schedule <ExternalLink className="w-3 h-3 ml-2" /></a>
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
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <section id="researchers" className="mb-20 scroll-mt-32">
              <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Our People</h2>
              <div>{alphabeticalTeam.map((member, idx) => <PersonVignette key={idx} member={member} />)}</div>
            </section>
            <section id="future-generation" className="scroll-mt-32 pt-10 border-t">
              <div className="flex items-center gap-3 mb-8">
                <Heart className="w-6 h-6" style={{ color: colors.red }} />
                <h2 className="text-3xl font-bold" style={{ color: colors.navy }}>Future Generation</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {futureGeneration.map((baby, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="aspect-square bg-slate-100 rounded-full mb-4 flex items-center justify-center border-4 border-transparent group-hover:border-slate-200 transition-all">
                      <Heart className="w-8 h-8 opacity-10" />
                    </div>
                    <h4 className="font-bold text-sm" style={{ color: colors.navy }}>{baby.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{baby.year}</p>
                    <p className="text-[10px] font-medium italic mt-1" style={{ color: colors.midBlueText }}>Child of {baby.parent}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'publications':
        const wps = publicationsData.filter(p => p.type === 'working-paper');
        const articles = publicationsData.filter(p => p.type === 'journal-article');
        const chapters = publicationsData.filter(p => p.type === 'book-chapter');
        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <section id="pub-working-papers" className="mb-16 scroll-mt-32">
              <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Working Papers</h2>
              <div className="space-y-10">{wps.map((pub, idx) => <PublicationItem key={idx} pub={pub} />)}</div>
            </section>
            <section id="pub-articles" className="pt-10 mt-10 mb-16 scroll-mt-32 border-t" style={{ borderColor: colors.borderGray }}>
              <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Journal Articles</h2>
              <div className="space-y-10">{articles.map((pub, idx) => <PublicationItem key={idx} pub={pub} />)}</div>
            </section>
            <section id="pub-chapters" className="pt-10 mt-10 scroll-mt-32 border-t" style={{ borderColor: colors.borderGray }}>
              <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Book Chapters</h2>
              <div className="space-y-10">{chapters.map((pub, idx) => <PublicationItem key={idx} pub={pub} />)}</div>
            </section>
          </div>
        );
      case 'about':
        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>About the Project</h2>
            <p className="text-lg leading-relaxed font-medium mb-6" style={{ color: colors.midBlueText }}>
              The <strong>Center for Inequality and Open Society (CIOS)</strong> is a major interdisciplinary research initiative bringing together experts from philosophy, law, economics, political science, and psychology. Supported by a nearly 150 million CZK grant, our goal is to conduct cutting-edge research on the critical challenges and disparities faced by modern open societies in the digital age.
            </p>
            <p className="text-lg leading-relaxed font-medium mb-6" style={{ color: colors.midBlueText }}>
              While our research produces rigorous theoretical frameworks, it is heavily rooted in <strong>empirical and experimental methodologies</strong>. Across our six work packages, our teams leverage advanced quantitative methods, machine learning, and field experiments to analyze critical issues.
            </p>
            <p className="text-lg leading-relaxed font-medium mb-12" style={{ color: colors.midBlueText }}>
              The project is coordinated by the <strong>Faculty of Law, Charles University</strong>, in partnership with the <strong>Faculty of Social Sciences, Charles University</strong>, the <strong>Faculty of Law, Masaryk University</strong>, and the <strong>Prague University of Economics and Business</strong>.
            </p>
            <div id="about-wp" className="pt-10 mt-10 scroll-mt-32 border-t" style={{ borderColor: colors.borderGray }}>
              <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Work Packages</h2>
              <div className="space-y-12">
                {workPackages.map((wp, idx) => (
                  <div key={idx} className="last:mb-0">
                    <div className="flex gap-4 items-center mb-4">
                      <span className="font-black text-2xl" style={{ color: colors.red }}>{wp.id}</span>
                      <h3 className="text-xl font-bold" style={{ color: colors.navy }}>{wp.title}</h3>
                    </div>
                    <p className="text-sm mb-2 font-bold" style={{ color: colors.navy }}>Leader: <span className="font-medium text-slate-500">{wp.leader}</span></p>
                    <p className="text-base font-medium leading-relaxed" style={{ color: colors.midBlueText }}>{wp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="about-management" className="pt-10 mt-10 scroll-mt-32 border-t" style={{ borderColor: colors.borderGray }}>
              <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Management and Administration</h2>
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12">
                {teamMembers.filter(m => m.groups && m.groups.includes('management')).map((m, idx) => (
                  <div key={idx}>
                    <h4 className="font-bold text-lg" style={{ color: colors.navy }}>{m.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.red }}>{m.role}</p>
                    <a href={`mailto:${m.email}`} className="text-sm font-medium hover:underline block" style={{ color: colors.midBlueText }}>{m.email}</a>
                  </div>
                ))}
              </div>
            </div>
            <div id="about-isab" className="pt-10 mt-10 scroll-mt-32 border-t" style={{ borderColor: colors.borderGray }}>
              <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>International Scientific Advisory Board</h2>
              <div className="space-y-12">
                {teamMembers.filter(m => m.groups && m.groups.includes('isab')).map((member, idx) => (
                  <PersonVignette key={idx} member={member} />
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-montserrat bg-white" style={{ color: colors.navy }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`}</style>
      <nav className="sticky top-0 z-50 bg-white shadow-sm h-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex justify-between items-center h-full">
          <div className="cursor-pointer flex items-center h-full" onClick={() => handleNavClick('home')}>
            <img src={getAssetUrl('CIOS_Logo_Color.png')} alt="CIOS Logo" className="h-24 object-contain" onError={e => e.target.style.display='none'} />
          </div>
          <div className="flex h-full">
            {['home', 'people', 'publications', 'about'].map(tab => (
              <div key={tab} className="h-full flex flex-col justify-center px-5 relative group">
                <button 
                  onClick={() => handleNavClick(tab)} 
                  className="text-[11px] font-black uppercase tracking-[0.2em] transition pb-1" 
                  style={{ 
                    color: activeTab === tab ? colors.navy : colors.midBlueText,
                    borderBottom: activeTab === tab ? `2px solid ${colors.red}` : '2px solid transparent'
                  }}
                >
                  {tab}
                </button>
                {(tab === 'people' || tab === 'publications' || tab === 'about') && activeTab === tab && (
                  <div className="absolute top-[70%] right-5 flex gap-6 w-max pt-0">
                    {tab === 'people' && (
                      <>
                        <button onClick={() => handleNavClick('people')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Researchers</button>
                        <button onClick={() => handleNavClick('people', 'future-generation')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Future Generation</button>
                      </>
                    )}
                    {tab === 'publications' && (
                      <>
                        <button onClick={() => handleNavClick('publications')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Working Papers</button>
                        <button onClick={() => handleNavClick('publications', 'pub-articles')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Articles</button>
                        <button onClick={() => handleNavClick('publications', 'pub-chapters')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Chapters</button>
                      </>
                    )}
                    {tab === 'about' && (
                      <>
                        <button onClick={() => handleNavClick('about')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Overview</button>
                        <button onClick={() => handleNavClick('about', 'about-wp')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Work Packages</button>
                        <button onClick={() => handleNavClick('about', 'about-management')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Management</button>
                        <button onClick={() => handleNavClick('about', 'about-isab')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Advisory Board</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-grow">{renderContent()}</main>
      <footer className="pt-16 pb-12 bg-white border-t" style={{ borderColor: colors.borderGray }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-12 text-center sm:text-left">
          <div className="mb-12">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-10" style={{ color: colors.navy }}>Contacts</h4>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-12 gap-y-10">
              {[
                { name: 'Josef Montag', role: 'Principal Investigator', email: 'montagj@prf.cuni.cz' },
                { name: 'Anna Malá', role: 'Project Manager', email: 'anna.mala@prf.cuni.cz' },
                { name: 'Eva Myšáková', role: 'Financial Manager', email: 'eva.mysakova@prf.cuni.cz' },      
                { name: 'Kateřina Pospíchalová Pavlov', role: 'Administrator', email: 'katerina.pospichalovapavlov@prf.cuni.cz' }
              ].map((c, i) => (
                <div key={i} className="min-w-[150px]">
                  <p className="font-bold text-sm mb-1" style={{ color: colors.navy }}>{c.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.red }}>{c.role}</p>
                  <a href={`mailto:${c.email}`} className="text-xs font-medium hover:underline block opacity-80" style={{ color: colors.midBlueText }}>{c.email}</a>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-12 border-t flex flex-col items-center" style={{ borderColor: colors.borderGray }}>
            <img 
              src={getAssetUrl('CIOS_Logos_partners.png')} 
              className="h-20 w-auto mb-10 object-contain" 
              style={{ imageRendering: 'high-quality' }}
              alt="CIOS Partners" 
              onError={e => e.target.style.display='none'} 
            />
            <p className="text-[11px] font-medium text-center max-w-3xl leading-relaxed" style={{ color: '#4A6582' }}>Co-funded by the European Regional Development Fund, project Center for Inequality and Open Society, no. CZ.02.01.01/00/23_025/0008690.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
