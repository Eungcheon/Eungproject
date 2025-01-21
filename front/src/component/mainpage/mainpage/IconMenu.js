import React from 'react';
import { Briefcase, GraduationCap, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import './IconMenu.css'; // 분리된 스타일 파일

const IconMenu = () => {
  const menuItems = [
    { icon: <Briefcase size={32} />, text: '채용정보', link: '/jobs' },
    { icon: <GraduationCap size={32} />, text: '교육프로그램', link: '/programs' },
    { icon: <Users size={32} />, text: '상담예약', link: '/counseling' },
    { icon: <FileText size={32} />, text: '자료실', link: '/resources' },
  ];

  return (
    <div className="icon-menu-container">
      {menuItems.map((item, index) => (
        <Link 
          key={index} 
          to={item.link} 
          className="icon-menu-item"
        >
          {item.icon}
          <span className="icon-menu-text">{item.text}</span>
        </Link>
      ))}
    </div>
  );
};

export default IconMenu;
