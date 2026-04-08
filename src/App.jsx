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
      bio: "Professor of Economics at the University of Cologne. Her research focuses, among other topics, on gender disparities in judicial decision-making, sanctions and recidivism, and the impact of crime on its victims."
    },
    {
      name: "Susann Fiedler",
      link: "https://scholar.google.com/citations?user=r3RGGrsAAAAJ&hl=en",
      bio: "Professor of Psychology and Head of the Institute for Cognition and Behavior at the Department of Strategy and Innovation, Vienna University of Economics and Business. Her specialization includes research on human decision-making, discrimination, and perceptions of inequality."
    },
    {
      name: "Barbara Havelková",
      link: "https://scholar.google.com/citations?user=r3RGGrsAAAAJ&hl=en",
      bio: "Professor of Law at the Faculty of Law, University of Oxford, and Tutorial Fellow in Law at St Hilda’s College. Her extensive research and publications cover equality and anti-discrimination law, constitutional law, and gender legal studies."
    },
    {
      name: "Elena Kantorowicz-Reznichenko",
      link: "https://kantorowicz-reznichenko.weebly.com/",
      bio: "Professor of Quantitative Empirical Legal Studies at Erasmus University Rotterdam and Director of the international PhD program European Doctorate in Law and Economics (EDLE). Her research focuses on crime, behavioral and economic analysis of law, and international criminal law."
    },
    {
      name: "Keren Weinshall",
      link: "https://scholar.google.com/citations?user=xtCNx-8AAAAJ&hl=en",
      bio: "Professor of Law and Edward S. Silver Chair in Civil Procedure at the Faculty of Law, Hebrew University of Jerusalem. She has authored numerous books and academic articles using comparative and empirical methods to study judicial decision-making and the influence of factors such as workload, court composition diversity, and ideological preferences."
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
            groups: p.
