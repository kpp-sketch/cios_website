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
      roles: [
        { title: "Professor for Applied Microeconomics", inst: "University of Potsdam" },
        { title: "Head of the Crime, Labor and Inequality Department", inst: "DIW Berlin" }
      ],
      link: "https://sites.google.com/site/annabindler/",
      email: "abindler@diw.de",
      bio: "Leading expertise in empirical legal studies and the economics of crime."
    },
    {
      name: "Susann Fiedler",
      roles: [{ title: "Professor of Business Psychology", inst: "Vienna University of Economics" }],
      link: "https://scholar.google.com/citations?user=r3RGGrsAAAAJ&hl=en",
      email: "susann.fiedler@wu.ac.at",
      bio: "Prominent researcher in behavioral economics and psychology."
    },
    {
      name: "Barbara Havelková",
      roles: [{ title: "Associate Professor of Law", inst: "University of Oxford" }],
      link: "https://www.law.ox.ac.uk/people/barbara-havelkova",
      email: "barbara.havelkova@law.ox.ac.uk",
      bio: "Specialist in gender legal studies, equality law, and comparative legal systems."
    },
    {
      name: "Elena Kantorowicz-Reznichenko",
      roles: [{ title: "Professor of Quantitative Empirical Legal Studies", inst: "Erasmus University" }],
      link: "https://kantorowicz-reznichenko.weebly.com/",
      email: "kantorowicz@law.eur.nl",
      bio: "Expert in the economic analysis of law and criminal justice systems."
    },
    {
      name: "Keren Weinshall",
      roles: [{ title: "Professor of Law", inst: "Hebrew University" }],
      link: "https://scholar.google.com/citations?user=xtCNx-8AAAAJ&hl=en",
      email: "keren.weinshall@mail.huji.ac.il",
      bio: "Empirical researcher focusing on judicial decision-making and public law."
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
            groups: p.groups ? p.groups.toString().split(',').map(g => g.trim().replace('researcher',
