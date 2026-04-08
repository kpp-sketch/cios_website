import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Mail, ExternalLink, Users, ChevronDown, FileDown, Library, Globe } from 'lucide-react';

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

  const isabMembers = [
    {
      name: "Anna Louisa Bindler",
      link: "https://sites.google.com/site/annabindler/",
      bio: "Professor of Economics at the University of Gothenburg. Her research focuses, among other topics, on gender disparities in judicial decision-making, sanctions and recidivism, and the impact of crime on its victims."
    },
    {
      name: "Susann Fiedler",
      link: "https://scholar.google.com/citations?user=r3RGGrsAAAAJ&hl=en",
      bio: "Professor of Psychology and Head of the Institute for Cognition and Behavior at the Department of Strategy and Innovation, Vienna University of Economics and Business. Her specialization includes research on human decision-making, discrimination, and perceptions of inequality."
    },
    {
      name: "Barbara Havelková",
      link: "https://scholar.google.com/citations?user=r3RGGrsAAAAJ&hl=en",
      bio: "Associate Professor of Law at the Faculty of Law, University of Oxford, and Tutorial Fellow in Law at St Hilda’s College. Her extensive research and publications cover equality and anti-discrimination law, constitutional law, and gender legal studies."
    },
    {
      name: "Elena Kantorowicz-Reznichenko",
      link: "https://kantorowicz-reznichenko.weebly.com/",
      bio: "Professor of Quantitative Empirical Legal Studies at Erasmus University Rotterdam and Director of the international PhD program European Doctorate in Law and Economics (EDLE). Her research focuses on crime, behavioral and economic analysis of law, and international criminal law."
    },
    {
      name: "Keren Weinshall",
      link: "https://scholar.google.com/citations?user=xtCNx-8AAAAJ&hl=en",
      bio: "Professor of Law and Edward S. Silver Chair in Civil Procedure at the Faculty of Law, Hebrew University of Jerusalem. She has authored numerous books and academic articles using comparative and empirical methods to study judicial decision-making."
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

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  <div className="w-32 h-32 shrink-0 bg-slate-100 flex items-center justify-center rounded-lg"><Users className="w-10 h-10 opacity-20" /></div>
                  <div className="flex-grow pt-1">
                    <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                    <p className="text-sm font-bold mb-3" style={{ color: colors.red }}>{member.role} {member.affiliation && <><span className="mx-2 text-slate-300 font-normal">|</span> <span style={{ color: colors.midBlueText }}>{member.affiliation}</span></>}</p>
                    {member.email && <a href={`mailto:${member.email}`} className="flex items-center text-sm font-bold hover:underline"><Mail className="w-4 h-4 mr-2" /> {member.email}</a>}
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
            <section className="mb-16"><h3 className="text-2xl font-bold mb-6">Working Papers</h3>{wps.map((p, i) => <PublicationItem key={i} pub={p} />)}</section>
            <section className="pt-10 border-t mb-16"><h3 className="text-2xl font-bold mb-6">Journal Articles</h3>{articles.map((p, i) => <PublicationItem key={i} pub={p} />)}</section>
            <section className="pt-10 border-t"><h3 className="text-2xl font-bold mb-6">Book Chapters</h3>{chapters.map((p, i) => <PublicationItem key={i} pub={p} />)}</section>
          </div>
        );
      case 'about':
        return (
          <div className="py-12 px-6 sm:px-12 max-w-5xl mx-auto text-left">
            <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>About the Project</h2>
            <div className="space-y-6 text-lg leading-relaxed mb-16">
              <p>The Center for Inequality and Open Society (CIOS) is a major interdisciplinary research initiative bringing together experts from philosophy, law, economics, political science, and psychology. Supported by a nearly 150 million CZK grant, our goal is to conduct cutting-edge research on the critical challenges and disparities faced by modern open societies in the digital age.</p>
              <p>While our research produces rigorous theoretical frameworks, it is heavily rooted in <strong>empirical and experimental methodologies</strong>. Across our six work packages, our teams leverage advanced quantitative methods, machine learning, and field experiments to analyze critical issues.</p>
              <p>The project is coordinated by the <strong>Faculty of Law, Charles University</strong>, in partnership with the <strong>Faculty of Social Sciences, Charles University</strong>, the <strong>Faculty of Law, Masaryk University</strong>, and the <strong>Prague University of Economics and Business</strong>.</p>
            </div>

            <h2 className="text-3xl font-bold mb-8 border-b-2 inline-block pb-2" style={{ color: colors.navy, borderColor: colors.red }}>Work Packages</h2>
            <div className="grid gap-10 mb-20">
              {[
                { id: 'WP1', title: 'Digital Public Sphere', leader: 'Volker
