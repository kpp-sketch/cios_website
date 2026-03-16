import React, { useState } from 'react';
import { Mail, MapPin, ExternalLink, BookOpen, Users, FileText, ChevronDown, FileDown, Library, Globe } from 'lucide-react';

// ==========================================
// 1. DATA CONFIGURATION
// ==========================================

const workPackages = [
  { id: 'WP1', title: 'Digital Public Sphere', leader: 'Volker Kaul', description: 'Examining how social media influence public discourse and contribute to societal polarization. We analyze the mechanisms of echo chambers and the impact of algorithmic curation on democratic stability.' },
  { id: 'WP2', title: 'Inequality in Justice', leader: 'Michal Šoltés', description: 'Analyzing the causes and consequences of inequalities in court rulings using unique data from Czech and Dutch judges. This package focuses on empirical evidence of systematic disparities in sentencing.' },
  { id: 'WP3', title: 'Information Support for Criminal Justice (PRECID)', leader: 'Josef Montag', description: 'Developing PRECID software to provide judges with data-driven and algorithmic support for decision-making. The goal is to reduce unwarranted sentencing disparities through evidence-based tools.' },
  { id: 'WP4', title: 'Finance, Innovation, and Inequality', leader: 'TBA', description: 'Investigating the macroeconomic links between financial systems, technological innovation, and wealth distribution. We explore how financialization impacts long-term societal equity.' },
  { id: 'WP5', title: 'Legal Aspects of Vulnerability', leader: 'TBA', description: 'Exploring how legal frameworks address and sometimes exacerbate societal vulnerabilities. This research maps the intersection of legal protection and socio-economic fragility.' },
  { id: 'WP6', title: 'The Digitally Vulnerable Consumer', leader: 'TBA', description: 'Researching consumer protection and behavioral impacts in digital markets and online platforms. We study how dark patterns and asymmetric information affect consumer choice.' }
];

const teamMembers = [
  { name: 'doc. Ing. Josef Montag, Ph.D.', surname: 'Montag', role: 'Principal Investigator', email: 'montagj@prf.cuni.cz', affiliation: 'Faculty of Law, Charles University', groups: ['management', 'research', 'admin'], bio: 'Specializes in empirical legal studies and the economics of crime. Currently chairs the Economics Panel at the Czech Science Foundation.', photo: '', website: 'https://josefmontag.github.io' },
  { name: 'Anna Malá', surname: 'Malá', role: 'Project Manager', email: 'mala@prf.cuni.cz', affiliation: 'Faculty of Law, Charles University', groups: ['management', 'admin'], bio: 'Strategic project management and institutional coordination.', photo: '' },
  { name: 'Eva Myšáková', surname: 'Myšáková', role: 'Financial Manager', email: 'mysakova@prf.cuni.cz', affiliation: 'Faculty of Law, Charles University', groups: ['management', 'admin'], bio: 'Financial oversight, budgeting, and reporting for large-scale European research grants.', photo: '' },
  { name: 'Kateřina Pospíchalová Pavlov', surname: 'Pospíchalová Pavlov', role: 'Administrator', email: 'pavlov@prf.cuni.cz', affiliation: 'Faculty of Law, Charles University', groups: ['management', 'admin'], bio: 'Coordinates administrative support, logistics, and institutional communication for the CIOS project.', photo: '' },
  { name: 'Karolína Martínek', surname: 'Martínek', role: 'Data Steward & Open Access Officer', email: 'martinek@prf.cuni.cz', affiliation: 'Faculty of Law, Charles University', groups: ['management', 'admin'], bio: 'Responsible for data management planning and ensuring open access to research outputs.', photo: '' },
  { name: 'Mgr. Michal Šoltés, M.A., Ph.D.', surname: 'Šoltés', role: 'Work Package Leader', email: 'michal.soltes@prf.cuni.cz', groups: ['research'], bio: 'Focuses on empirical criminal law and judicial decision-making. Researcher at IDEA (CERGE-EI).', photo: '', website: 'https://michalsoltes.com' },
  { name: 'Volker Kaul', surname: 'Kaul', role: 'Work Package Leader', email: 'volker.kaul@fsv.cuni.cz', groups: ['research'], bio: 'Researches political philosophy and the digital public sphere, with a focus on polarization and democracy.', photo: '' },
  { name: 'Alice Dvořáková', surname: 'Dvořáková', role: 'Senior Researcher', affiliation: 'Prague University of Economics and Business', groups: ['research'], bio: 'Research interests include macroeconomic links between financial systems, technological innovation, and wealth distribution.', photo: '', email: 'alice.dvorakova@vse.cz' },
  { name: 'Petr Novák', surname: 'Novák', role: 'Junior Researcher', affiliation: 'Faculty of Law, Masaryk University', groups: ['research'], bio: 'Focuses on consumer protection law and behavioral impacts in online digital marketplaces.', photo: '', email: 'petr.novak@law.muni.cz', website: '#' },
  { name: 'Anna Louisa Bindler', surname: 'Bindler', role: 'Professor of Economics', affiliation: 'University of Gothenburg', groups: ['isab'], bio: 'Leading expertise in empirical legal studies and the economics of crime.', photo: '', email: 'anna.bindler@gu.se', website: 'https://www.gu.se/en/about/find-staff/annabindler' },
  { name: 'Susann Fiedler', surname: 'Fiedler', role: 'Professor of Business Psychology', affiliation: 'Vienna University of Economics', groups: ['isab'], bio: 'Prominent researcher in behavioral economics and psychology.', photo: '', email: 'susann.fiedler@wu.ac.at', website: 'https://www.wu.ac.at/en/psyeco/team/susann-fiedler/' },
  { name: 'Barbara Havelková', surname: 'Havelková', role: 'Associate Professor of Law', affiliation: 'University of Oxford', groups: ['isab'], bio: 'Specialist in gender legal studies, equality law, and comparative legal systems.', photo: '', email: 'barbara.havelkova@law.ox.ac.uk', website: 'https://www.law.ox.ac.uk/people/barbara-havelkova' },
  { name: 'Elena Kantorowicz-Reznichenko', surname: 'Kantorowicz-Reznichenko', role: 'Professor of Quantitative Empirical Legal Studies', affiliation: 'Erasmus University', groups: ['isab'], bio: 'Expert in the economic analysis of law and criminal justice systems.', photo: '', email: 'kantorowicz@law.eur.nl', website: 'https://www.eur.nl/en/people/elena-kantorowicz-reznichenko' },
  { name: 'Keren Weinshall', surname: 'Weinshall', role: 'Professor of Law', affiliation: 'Hebrew University', groups: ['isab'], bio: 'Empirical researcher focusing on judicial decision-making and public law.', photo: '', email: 'keren.weinshall@mail.huji.ac.il', website: 'https://en.law.huji.ac.il/people/keren-weinshall' }
];

const publicationsData = [
  { 
    id: 'pub-algorithmic-support', 
    title: 'The Impact of Algorithmic Support on Judicial Decision Making', 
    authors: 'Montag, J., Šoltés, M.', 
    type: 'working-paper', 
    year: '2025', 
    abstract: 'This paper evaluates the rollout of the PRECID algorithmic support system among Czech judges. Using a difference-in-differences approach, we find that access to predictive sentencing guidelines reduces unwarranted disparities in sentencing outcomes by 14% without altering the overall severity of punishments. The findings suggest that data-driven tools can effectively guide human discretion in the criminal justice system.', 
    pdf: '#', 
    repo: 'https://ssrn.com' 
  },
  { 
    id: 'pub-sentencing-disparities', 
    title: 'Understanding Sentencing Disparities in the Digital Age', 
    authors: 'Šoltés, M., et al.', 
    type: 'journal-article', 
    year: '2025', 
    journal: 'Journal of Empirical Legal Studies', 
    abstract: 'In this study, we analyze the impact of digital transformation on judicial sentencing consistency. By leveraging a longitudinal dataset of over 50,000 cases, we identify how information availability correlates with sentencing variance across different jurisdictions.',
    pdf: '#',
    link: 'https://onlinelibrary.wiley.com/journal/17401461' 
  },
  { 
    id: 'pub-digital-justice-chapter', 
    title: 'Digital Governance and Rule of Law: A European Perspective', 
    authors: 'Montag, J., Šoltés, M.', 
    type: 'book-chapter', 
    year: '2025', 
    journal: 'In: Oxford Handbook of Digital Justice', 
    abstract: 'This chapter explores the evolving landscape of digital governance within the European Union. It examines how automated decision-making systems intersect with fundamental rights and the traditional rule of law frameworks, proposing a new regulatory paradigm for algorithmic accountability.',
    pdf: '#',
    link: 'https://global.oup.com' 
  },
  { 
    id: 'pub-digital-public-sphere', 
    title: 'Digital Public Sphere and Societal Polarization', 
    authors: 'Kaul, V.', 
    type: 'working-paper', 
    year: '2025', 
    abstract: 'We examine how algorithmically curated social media environments affect political polarization. Through a series of behavioral experiments, we demonstrate that exposure to opposing viewpoints in a highly digitized public sphere often backfires, increasing affective polarization rather than mitigating it.', 
    pdf: '#', 
    repo: 'https://repec.org' 
  }
];

// ==========================================
// 2. WEBSITE COMPONENTS
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

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
            {pub.journal || pub.type.replace('-', ' ')}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 leading-snug" style={{ color: colors.navy }}>{pub.title}</h3>
        <p className="text-base font-medium mb-3" style={{ color: colors.midBlueText }}>{pub.authors}</p>
        
        {pub.abstract && (
          <div className="mb-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              onMouseEnter={() => setIsOpen(true)}
              className="text-xs font-black uppercase tracking-widest flex items-center transition hover:opacity-70" 
              style={{ color: colors.red }}
            >
              Abstract {isOpen ? <ChevronDown className="w-3 h-3 ml-1 rotate-180" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>
            {isOpen && <p className="mt-3 p-4 bg-slate-50 rounded text-sm italic leading-relaxed" style={{ color: colors.midBlueText }}>{pub.abstract}</p>}
          </div>
        )}
        
        <div className="flex gap-6 text-sm font-bold">
          {pub.pdf && (
            <a href={pub.pdf} className="flex items-center hover:underline" style={{ color: colors.navy }}>
              <FileDown className="w-4 h-4 mr-2" /> PDF
            </a>
          )}
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
        return (
          <div className="animate-in fade-in duration-500">
            <div className="py-12 px-6 sm:px-12 bg-white text-center">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight max-w-2xl mx-auto" style={{ color: colors.navy }}>
                  Center for Inequality and <br />Open Society
                </h1>
                <p className="text-xl mb-12 leading-relaxed font-medium max-w-3xl mx-auto" style={{ color: colors.midBlueText }}>
                  Connecting economics, law, and psychology to explore how technological changes, innovation, and decision-making in public administration affect justice and equal opportunities.
                </p>
                <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-8">
                  <div className="text-center group cursor-pointer" onClick={() => handleNavClick('about', 'about-wp')}>
                    <div className="text-4xl font-black mb-1 tracking-tighter" style={{ color: colors.red }}>6</div>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.navy }}>Work Packages</div>
                  </div>
                  <div className="text-center group cursor-pointer" onClick={() => handleNavClick('people')}>
                    <div className="text-4xl font-black mb-1 tracking-tighter" style={{ color: colors.red }}>70</div>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.navy }}>Researchers</div>
                  </div>
                  <div className="text-center group cursor-pointer" onClick={() => handleNavClick('about', 'about-overview')}>
                    <div className="text-4xl font-black mb-1 tracking-tighter" style={{ color: colors.red }}>4</div>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.navy }}>Partners</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-12 px-6 sm:px-12 max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Latest Updates</h2>
                <div className="space-y-10">
                  {publicationsData.slice(0, 3).map((pub, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{pub.type.replace('-', ' ')}</span>
                      <h3 className="text-xl font-bold mt-1 mb-2 leading-snug cursor-pointer hover:underline" 
                          style={{ color: colors.navy }}
                          onClick={() => handleNavClick('publications', pub.id)}
                      >
                        {pub.title}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: colors.midBlueText }}>{pub.authors}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Events</h2>
                <div className="p-6 bg-slate-50 rounded-lg h-fit">
                  <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: colors.midBlueText }}>
                    Regular research seminars combining law, economics, and empirical studies.
                  </p>
                  <a href="https://www.prf.cuni.cz/en/department-economics-and-empirical-legal-studies/vspee-research-seminars-law-economics-and-empirics" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest flex items-center hover:underline" style={{ color: colors.red }}>
                    Seminar Schedule <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'people':
        const alphabeticalTeam = teamMembers
          .filter(m => m.groups.includes('research') || m.groups.includes('admin'))
          .sort((a, b) => a.surname.localeCompare(b.surname, 'cs')); 

        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Our People</h2>
            <div>
              {alphabeticalTeam.map((member, idx) => (
                <PersonVignette key={idx} member={member} />
              ))}
            </div>
          </div>
        );
      case 'publications':
        const mergedPublications = publicationsData.filter(p => p.type === 'journal-article' || p.type === 'book-chapter');
        
        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div id="pub-working-papers">
              <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Working Papers</h2>
              <div className="space-y-10">
                {publicationsData.filter(p => p.type === 'working-paper').map((pub, idx) => (
                  <PublicationItem key={idx} pub={pub} />
                ))}
              </div>
            </div>
            <div id="pub-articles" className="pt-6 mt-10">
              <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Publications</h2>
              <div className="space-y-10">
                {mergedPublications.map((pub, idx) => (
                  <PublicationItem key={idx} pub={pub} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div id="about-overview">
              <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>About the Project</h2>
              <p className="text-lg leading-relaxed font-medium mb-6" style={{ color: colors.midBlueText }}>
                The aim of the project is to conduct cutting-edge research on issues of inequality and other challenges faced by open societies, to develop excellent research teams, and to strengthen international doctoral education and research collaboration with leading academics.
              </p>
              <p className="text-lg leading-relaxed font-medium mb-12" style={{ color: colors.midBlueText }}>
                The project is coordinated by the <strong>Faculty of Law, Charles University</strong>, in partnership with the <strong>Faculty of Social Sciences, Charles University</strong>, the <strong>Faculty of Law, Masaryk University</strong>, and the <strong>Prague University of Economics and Business</strong>.
              </p>
            </div>
            <div id="about-wp" className="pt-10 mt-10">
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
            <div id="about-management" className="pt-10 mt-10">
               <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Management and Administration</h2>
               <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12">
                  {teamMembers.filter(m => m.groups.includes('management')).map((m, idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-lg" style={{ color: colors.navy }}>{m.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.red }}>{m.role}</p>
                      <a href={`mailto:${m.email}`} className="text-sm font-medium hover:underline block" style={{ color: colors.midBlueText }}>{m.email}</a>
                    </div>
                  ))}
               </div>
            </div>
            <div id="about-isab" className="pt-10 mt-10">
              <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>International Scientific Advisory Board</h2>
              <div className="space-y-12">
                {teamMembers.filter(m => m.groups.includes('isab')).map((member, idx) => (
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
      
      <nav className="sticky top-0 z-50 bg-white shadow-sm h-28 sm:h-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex justify-between items-center h-full">
          <div className="cursor-pointer flex items-center h-full" onClick={() => handleNavClick('home')}>
            <img 
              src="/CIOS_Logo_Color.png" 
              alt="CIOS Logo" 
              className="h-20 sm:h-24 object-contain"
              onError={e => e.target.style.display='none'}
            />
          </div>
          <div className="flex h-full">
            {['home', 'people', 'publications', 'about'].map(tab => (
              <div key={tab} className="h-full flex flex-col justify-center px-5 relative">
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

                {(tab === 'publications' || tab === 'about') && activeTab === tab && (
                  <div className="absolute top-[70%] right-5 flex gap-6 w-max pt-0">
                    {tab === 'publications' && (
                      <>
                        <button onClick={() => handleNavClick('publications', 'pub-working-papers')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Working Papers</button>
                        <button onClick={() => handleNavClick('publications', 'pub-articles')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Publications</button>
                      </>
                    )}
                    {tab === 'about' && (
                      <>
                        <button onClick={() => handleNavClick('about', 'about-overview')} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A6582] hover:text-[#0A192F]">Overview</button>
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
                { name: 'doc. Ing. Josef Montag, Ph.D.', role: 'Principal Investigator', email: 'montagj@prf.cuni.cz' },
                { name: 'Anna Malá', role: 'Project Manager', email: 'mala@prf.cuni.cz' },
                { name: 'Kateřina Pospíchalová Pavlov', role: 'Administrator', email: 'pavlov@prf.cuni.cz' }
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
              src="/CIOS_Logos_partners.png" 
              className="max-h-20 w-auto mb-10" 
              alt="CIOS Partners" 
              onError={e => e.target.style.display='none'}
            />
            <p className="text-[11px] font-medium text-center max-w-3xl leading-relaxed" style={{ color: '#4A6582' }}>
              Co-funded by the European Regional Development Fund, project Center for Inequality and Open Society, no. CZ.02.01.01/00/23_025/0008690.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
