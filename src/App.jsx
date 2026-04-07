import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Mail, ExternalLink, Users, ChevronDown, FileDown, Library, Heart } from 'lucide-react';

// ==========================================
// 1. DATA & POMOCNÉ FUNKCE
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

const formatLink = (url) => {
  if (!url || url === '#' || url === '') return null;
  const cleanUrl = String(url).trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
  return `https://${cleanUrl}`;
};

// ==========================================
// 2. KOMPONENTY
// ==========================================

const PublicationItem = ({ pub, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const finalLink = formatLink(pub.link || pub.repo);
  
  return (
    <div className="mb-8 last:mb-0 text-left">
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
          <button onClick={() => setIsOpen(!isOpen)} className="text-xs font-black uppercase tracking-widest flex items-center transition hover:opacity-70" style={{ color: colors.red }}>
            Abstract {isOpen ? <ChevronDown className="w-3 h-3 ml-1 rotate-180" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </button>
          {isOpen && <p className="mt-3 p-4 bg-slate-50 rounded text-sm italic leading-relaxed" style={{ color: colors.midBlueText }}>{pub.abstract}</p>}
        </div>
      )}

      <div className="flex gap-6 text-sm font-bold">
        {pub.pdf && pub.pdf !== '#' && (
          <a href={formatLink(pub.pdf)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline" style={{ color: colors.navy }}>
            <FileDown className="w-4 h-4 mr-2" /> PDF
          </a>
        )}
        {finalLink && (
          <a href={finalLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline" style={{ color: colors.navy }}>
            <Library className="w-4 h-4 mr-2" /> 
            {pub.type === 'working-paper' ? 'Repository' : 'Journal Link'}
          </a>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. HLAVNÍ APLIKACE
// ==========================================

export default function App() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [publicationsData, setPublicationsData] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  const colors = {
    navy: '#0A192F', 
    red: '#D12E41',
    midBlueText: '#4A6582',
    borderGray: '#E5E7EB'
  };

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

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        const recentUpdates = publicationsData.slice(0, 3);
        return (
          <div className="py-12 px-6 sm:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center mb-16 mt-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ color: colors.navy }}>Center for Inequality and <br className="hidden sm:block" /> Open Society</h1>
              <p className="text-xl leading-relaxed font-medium max-w-3xl mx-auto" style={{ color: colors.midBlueText }}>An interdisciplinary initiative applying empirical research to address challenges in modern open societies.</p>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 border-t pt-16" style={{ borderColor: colors.borderGray }}>
              <div className="md:col-span-2 text-left">
                <h2 className="text-2xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Latest Updates</h2>
                <div className="space-y-8">
                  {recentUpdates.length > 0 ? recentUpdates.map((pub, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{pub.type}</span>
                      <h3 className="text-xl font-bold mt-1 mb-2 leading-snug" style={{ color: colors.navy }}>{pub.title}</h3>
                      <p className="text-sm font-medium" style={{ color: colors.midBlueText }}>{pub.authors}</p>
                    </div>
                  )) : <p className="italic">New updates coming soon.</p>}
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-xl border shadow-sm h-fit text-left" style={{ borderColor: colors.borderGray }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.navy }}>Research Seminars</h3>
                <p className="text-sm font-medium mb-6">Join our regular sessions on empirical legal studies and economics.</p>
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
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Our People</h2>
            <div className="space-y-10">
              {alphabeticalTeam.map((member, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-8 items-start text-left">
                  <div className="w-32 h-32 shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden rounded-lg"><Users className="w-10 h-10 opacity-20" style={{ color: colors.navy }}/></div>
                  <div className="flex-grow pt-1">
                    <h4 className="text-xl font-bold mb-1" style={{ color: colors.navy }}>{member.name}</h4>
                    <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>{member.role} {member.affiliation && <><span className="mx-2 text-slate-300 font-normal">|</span> <span style={{ color: colors.midBlueText }}>{member.affiliation}</span></>}</p>
                    <div className="flex flex-wrap gap-6 text-sm font-bold">{member.email && <a href={`mailto:${member.email}`} className="flex items-center hover:underline" style={{ color: colors.navy }}><Mail className="w-4 h-4 mr-2 opacity-70" /> {member.email}</a>}</div>
                  </div>
                </div>
              ))}
            </div>
            <section className="pt-10 border-t mt-20">
              <div className="flex items-center gap-3 mb-8"><Heart className="w-6 h-6" style={{ color: colors.red }} /><h2 className="text-3xl font-bold" style={{ color: colors.navy }}>Future Generation</h2></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {futureGeneration.map((baby, idx) => (
                  <div key={idx} className="text-center">
                    <div className="aspect-square bg-slate-100 rounded-full mb-4 flex items-center justify-center"><Heart className="w-8 h-8 opacity-10" /></div>
                    <h4 className="font-bold text-sm">{baby.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.red }}>{baby.year}</p>
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
          <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Publications</h2>
            <section className="mb-16"><h3 className="text-2xl font-bold mb-6 text-left">Working Papers</h3>{wps.length > 0 ? wps.map((p, i) => <PublicationItem key={i} pub={p} colors={colors} />) : <p className="italic text-left">No working papers yet.</p>}</section>
            <section className="pt-10 border-t mb-16"><h3 className="text-2xl font-bold mb-6 text-left">Journal Articles</h3>{articles.length > 0 ? articles.map((p, i) => <PublicationItem key={i} pub={p} colors={colors} />) : <p className="italic text-left">No articles yet.</p>}</section>
            <section className="pt-10 border-t"><h3 className="text-2xl font-bold mb-6 text-left">Book Chapters</h3>{chapters.length > 0 ? chapters.map((p, i) => <PublicationItem key={i} pub={p} colors={colors} />) : <p className="italic text-left">No book
