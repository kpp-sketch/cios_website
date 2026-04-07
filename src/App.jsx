import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Mail, MapPin, ExternalLink, BookOpen, Users, FileText, ChevronDown, FileDown, Library, Globe, Heart } from 'lucide-react';

// ==========================================
// 1. DATA CONFIGURATION
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

const getAssetUrl = (filename) => {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const prodBase = '/';
  const base = isLocal ? '/' : prodBase;
  const normalizedBase = base.endsWith('/') ? base : base + '/';
  const normalizedFile = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${normalizedBase}${normalizedFile}`;
};

// ==========================================
// 2. WEBSITE COMPONENTS
// ==========================================

export default function App() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [publicationsData, setPublicationsData] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);

  const colors = {
    navy: '#0A192F', 
    red: '#D12E41',
    midBlueText: '#4A6582',
    lightGray: '#F9FAFB',
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

  const formatLink = (url) => {
    if (!url || url === '#' || url === '') return null;
    const cleanUrl = String(url).trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
    return `https://${cleanUrl}`;
  };

  const PublicationItem = ({ pub }) => {
    const [isOpen, setIsOpen] = useState(false);
    const finalLink = formatLink(pub.link || pub.repo);
    return (
      <div id={pub.id} className="mb-8 last:mb-0 scroll-mt-32 text-left">
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

  const PersonVignette = ({ member }) => {
    const isAdminOnly = member.groups && member.groups.includes('admin') && !member.groups.includes('research');
    return (
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-10 last:mb-0 text-left">
        <div className="w-32 h-32 shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden rounded-lg">
          <Users className="w-10 h-10 opacity-20" style={{ color: colors.navy }}/>
        </div>
        <div className="flex-grow pt-1">
          <h4 className="text-xl font-bold mb-1" style={{ color: colors.navy }}>{member.name}</h4>
          <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>
            {member.role} {member.affiliation && <><span className="mx-2 text-slate-300 font-normal">|</span> <span style={{ color: colors.midBlueText }}>{member.affiliation}</span></>}
          </p>
          {!isAdminOnly && <p className="text-base font-medium leading-relaxed mb-4 max-w-2xl" style={{ color: colors.midBlueText }}>{member.bio}</p>}
          <div className="flex flex-wrap gap-6 text-sm font-bold">
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center hover:underline" style={{ color: colors.navy }}>
                <Mail className="w-4 h-4 mr-2 opacity-70" /> {member.email}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        const recentUpdates = publicationsData.slice(0, 3);
