import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Mail, ExternalLink, Users, ChevronDown, FileDown, Library, Globe } from 'lucide-react';

export default function App() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [publicationsData, setPublicationsData] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [hoverTab, setHoverTab] = useState(null);

  const colors = {
    navy: '#0A192F', 
    red: '#D12E41',
    midBlueText: '#4A6582',
    borderGray: '#E5E7EB'
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
        { label: 'Advisory Board', id: 'isab-board' }
      ]
    }
  ];

const isabMembers = [
    {
      name: "Anna Louisa Bindler",
      role: "Professor of Economics",
      institution: "University of Gothenburg",
      link: "https://sites.google.com/site/annabindler/",
      email: "anna.bindler@gu.se",
      bio: "Leading expertise in empirical legal studies and the economics of crime."
    },
    {
      name: "Susann Fiedler",
      role: "Professor of Business Psychology",
      institution: "Vienna University of Economics",
      link: "https://scholar.google.com/citations?user=r3RGGrsAAAAJ&hl=en",
      email: "susann.fiedler@wu.ac.at",
      bio: "Prominent researcher in behavioral economics and psychology."
    },
    {
      name: "Barbara Havelková",
      role: "Associate Professor of Law",
      institution: "University of Oxford",
      link: "https://www.law.ox.ac.uk/people/barbara-havelkova",
      email: "barbara.havelkova@law.ox.ac.uk",
      bio: "Specialist in gender legal studies, equality law, and comparative legal systems."
    },
    {
      name: "Elena Kantorowicz-Reznichenko",
      role: "Professor of Quantitative Empirical Legal Studies",
      institution: "Erasmus University",
      link: "https://kantorowicz-reznichenko.weebly.com/",
      email: "kantorowicz@law.eur.nl",
      bio: "Expert in the economic analysis of law and criminal justice systems."
    },
    {
      name: "Keren Weinshall",
      role: "Professor of Law",
      institution: "Hebrew University",
      link: "https://scholar.google.com/citations?user=xtCNx-8AAAAJ&hl=en",
      email: "keren.weinshall@mail.huji.ac.il",
      bio: "Empirical researcher focusing on judicial decision-making and public law."
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await fetch('/team.xlsx');
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
    setActiveTab(tabId);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 140; 
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
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
          container.style.transition = 'background-color 0.5s';
          container.style.backgroundColor = '#f1f5f9';
          setTimeout(() => container.style.backgroundColor = 'transparent', 1500);
        }
      }
    }, 150);
  };

  const PublicationItem = ({ pub }) => {
    const [isOpen, setIsOpen] = useState(false);
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
        {pub.abstract && (
          <div className="mb-4 text-left">
            <button onClick={() => setIsOpen(!isOpen)} className="text-xs font-black uppercase tracking-widest flex items-center" style={{ color: colors.red }}>
              Abstract {isOpen ? <ChevronDown className="w-3 h-3 ml-1 rotate-180" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>
            {isOpen && <p className="mt-3 p-4 bg-slate-50 rounded text-sm italic" style={{ color: colors.midBlueText }}>{pub.abstract}</p>}
          </div>
        )}
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
        const recentUpdates = publicationsData.slice(0, 3);
        return (
          <div className="py-12 px-6 sm:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center mb-16 mt-8">
              <h1 className="text-4xl sm:text-6xl font-black mb-6" style={{ color: colors.navy }}>Center for Inequality and <br className="hidden sm:block" /> Open Society</h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.midBlueText }}>An interdisciplinary initiative applying empirical research to address challenges in modern open societies.</p>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 border-t pt-16" style={{ borderColor: colors.borderGray }}>
              <div className="md:col-span-2 text-left">
                <h2 className="text-2xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Latest Updates</h2>
                <div className="space-y-8">
                  {recentUpdates.map((pub, idx) => (
                    <div key={idx} className="cursor-pointer group" onClick={() => scrollToPublication(pub.title)}>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{pub.type}</span>
                      <h3 className="text-xl font-bold mt-1 mb-2 leading-snug group-hover:underline decoration-slate-300" style={{ color: colors.navy }}>{pub.title}</h3>
                      <p className="text-sm font-medium" style={{ color: colors.midBlueText }}>{pub.authors}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-xl border h-fit text-left" style={{ borderColor: colors.borderGray }}>
                <h3 className="text-xl font-bold mb-4">Research Seminars</h3>
                <p className="text-sm mb-6">Join our regular sessions on empirical legal studies and economics.</p>
                <a href="https://www.prf.cuni.cz/en/department-economics-and-empirical-legal-studies/vspee-research-seminars-law-economics-and-empirics" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest flex items-center hover:underline" style={{ color: colors.red }}>View Schedule <ExternalLink className="w-3 h-3 ml-2" /></a>
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
                <div key={idx} className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="w-32 h-32 shrink-0 bg-slate-100 flex items-center justify-center rounded-lg overflow-hidden border border-slate-200">
                    {member.photo ? (
                      <img src={`/people/${member.photo}`} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 opacity-20" />
                    )}
                  </div>
                  <div className="flex-grow pt-1">
                    <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                    <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>
                      {member.role} {member.affiliation && <><span className="mx-2 text-slate-300 font-normal">|</span> <span style={{ color: colors.midBlueText }}>{member.affiliation}</span></>}
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center text-sm font-bold hover:underline">
                          <Mail className="w-4 h-4 mr-2" /> {member.email}
                        </a>
                      )}
                      {member.website && (
                        <a href={member.website} target="_blank" rel="noreferrer" className="flex items-center text-sm font-bold hover:underline" style={{ color: colors.midBlueText }}>
                          <Globe className="w-4 h-4 mr-2" /> Personal Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
            <div className="space-y-6 text-lg leading-relaxed mb-16">
              <p>The Center for Inequality and Open Society (CIOS) is an interdisciplinary research initiative bringing together experts from philosophy, law, economics, political science, and psychology. Supported by a nearly 150 million CZK grant, our goal is to conduct cutting-edge research on the critical challenges and disparities faced by modern open societies in the digital age.</p>
              <p>While our research produces rigorous theoretical frameworks, it is heavily rooted in <strong>empirical and experimental methodologies</strong>. Across our six work packages, our teams leverage advanced qualitative and quantitative methods, machine learning, and field experiments to analyze critical issues.</p>
              <p>The project is coordinated by the <strong>Faculty of Law, Charles University</strong>, in partnership with the <strong>Faculty of Social Sciences, Charles University</strong>, the <strong>Faculty of Law, Masaryk University</strong>, and the <strong>Prague University of Economics and Business</strong>.</p>
            </div>

            <h2 id="work-packages" className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Work Packages</h2>
            <div className="grid gap-10 mb-20">
              {[
                { id: 'WP1', title: 'Digital Public Sphere', leader: 'Volker Kaul', desc: 'Examining how social media influence public discourse and contribute to societal polarization.' },
                { id: 'WP2', title: 'Inequality in Justice', leader: 'Michal Šoltés', desc: 'Analyzing the causes and consequences of inequalities in court rulings using unique data from Czech and Dutch judges.' },
                { id: 'WP3', title: 'Information Support for Criminal Justice (PRECID)', leader: 'Josef Montag', desc: 'Developing PRECID software to provide judges with data-driven and algorithmic support for decision-making.' },
                { id: 'WP4', title: 'Finance, Innovation, and Inequality', leader: 'Eva Horváthová', desc: 'Investigating the macroeconomic links between financial systems, technological innovation, and wealth distribution.' },
                { id: 'WP5', title: 'Legal Aspects of Vulnerability', leader: 'Veronika Bílková', desc: 'Exploring how legal frameworks address and sometimes exacerbate societal vulnerabilities.' },
                { id: 'WP6', title: 'The Digitally Vulnerable Consumer', leader: 'Jakub Harašta', desc: 'Researching consumer protection and behavioral impacts in digital markets and online platforms.' }
              ].map(wp => (
                <div key={wp.id} className="border-l-4 pl-6 py-2" style={{ borderColor: colors.red }}>
                  <h4 className="text-xl font-bold"><span style={{ color: colors.red }}>{wp.id}</span> {wp.title}</h4>
                  <p className="text-sm font-bold my-1">Leader: <span className="font-normal" style={{ color: colors.midBlueText }}>{wp.leader}</span></p>
                  <p className="text-base" style={{ color: colors.midBlueText }}>{wp.desc}</p>
                </div>
              ))}
            </div>

            <h2 id="management" className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Management and Administration</h2>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 mb-20">
              {[
                { name: 'Josef Montag', role: 'Principal Investigator', email: 'montagj@prf.cuni.cz' },
                { name: 'Anna Malá', role: 'Project Manager', email: 'anna.mala@prf.cuni.cz' },
                { name: 'Eva Myšáková', role: 'Financial Manager', email: 'eva.mysakova@prf.cuni.cz' },
                { name: 'Kateřina Pospíchalová Pavlov', role: 'Administrator', email: 'katerina.pospichalovapavlov@prf.cuni.cz' },
                { name: 'Karolína Martínek', role: 'Data Steward & Open Access Officer', email: 'karolina.martinek@prf.cuni.cz' }
              ].map((m, i) => (
                <div key={i} className="text-left">
                  <p className="font-bold text-lg mb-0">{m.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.red }}>{m.role}</p>
                  <a href={`mailto:${m.email}`} className="text-sm hover:underline opacity-80">{m.email}</a>
                </div>
              ))}
            </div>

            <h2 id="isab-board" className="text-3xl font-bold mb-12 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>International Scientific Advisory Board</h2>
            <div className="space-y-10">
              {isabMembers.map((member, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-8 items-start pb-8 border-b border-slate-100 last:border-0">
                  <div className="w-24 h-24 shrink-0 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100">
                    <Users className="w-8 h-8 opacity-10" />
                  </div>
                  <div className="flex-grow pt-1">
                    <h4 className="text-xl font-bold mb-1" style={{ color: colors.navy }}>{member.name}</h4>
                    <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>
                      {member.role} <span className="mx-1 text-slate-300 font-normal">|</span> <span style={{ color: colors.midBlueText }}>{member.institution}</span>
                    </p>
                    <p className="text-base mb-4 leading-relaxed" style={{ color: colors.midBlueText }}>{member.bio}</p>
                    <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm font-bold">
                      <a href={`mailto:${member.email}`} className="hover:underline flex items-center" style={{ color: colors.navy }}>
                        <Mail className="w-4 h-4 mr-2" /> {member.email}
                      </a>
                      <a href={member.link} target="_blank" rel="noreferrer" className="hover:underline flex items-center" style={{ color: colors.navy }}>
                        <Globe className="w-4 h-4 mr-2" /> Personal Website
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const displayNav = navStructure.find(n => n.id === (hoverTab || activeTab));

  return (
    <div className="min-h-screen flex flex-col font-montserrat bg-white" style={{ color: colors.navy }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <nav 
        className="sticky top-0 z-50 bg-white shadow-sm py-6 transition-all duration-300" 
        onMouseLeave={() => setHoverTab(null)}
      >
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
                    color: activeTab === item.id || hoverTab === item.id ? colors.navy : colors.midBlueText, 
                    borderBottom: activeTab === item.id ? `2px solid ${colors.red}` : '2px solid transparent' 
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-6 h-5 transition-opacity duration-200">
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
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-10">Contacts</h4>
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              {[
                { name: 'Josef Montag', role: 'Principal Investigator', email: 'montagj@prf.cuni.cz' },
                { name: 'Eva Myšáková', role: 'Financial Manager', email: 'eva.mysakova@prf.cuni.cz' },
                { name: 'Anna Malá', role: 'Project Manager', email: 'anna.mala@prf.cuni.cz' },
                { name: 'Kateřina Pospíchalová Pavlov', role: 'Administrator', email: 'katerina.pospichalovapavlov@prf.cuni.cz' }
              ].map((c, i) => (
                <div key={i} className="text-left"><p className="font-bold text-sm mb-1">{c.name}</p><p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.red }}>{c.role}</p><a href={`mailto:${c.email}`} className="text-xs hover:underline opacity-80">{c.email}</a></div>
              ))}
            </div>
          <div className="pt-12 border-t flex flex-col items-center">
            <img src="/CIOS_Logos_partners.png" className="h-20 w-auto mb-10 object-contain" alt="CIOS Partners" />
            <p className="text-[11px] text-center max-w-3xl leading-relaxed">Co-funded by the European Regional Development Fund, project CIOS, no. CZ.02.01.01/00/23_025/0008690.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
