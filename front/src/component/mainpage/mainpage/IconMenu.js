import React from "react"
import { Briefcase, GraduationCap, Users, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import "./IconMenu.css"

const IconMenu = () => {
  const menuItems = [
    { icon: <Briefcase size={32} color="#ff6347" />, text: "채용정보", link: "/mainRecruitment" },
    { icon: <GraduationCap size={32} color="#4682b4" />, text: "교육프로그램", link: "/programs" },
    { icon: <Users size={32} color="#32cd32" />, text: "상담예약", link: "/counseling" },
    { icon: <FileText size={32} color="#78d4ff" />, text: "자료실", link: "/resources" },
  ];
  

  return (
    <div className="icon-menu">
      {menuItems.map((item, index) => (
        <Link key={index} to={item.link} className="icon-menu-item">
          {item.icon}
          <span className="icon-menu-text">{item.text}</span>
        </Link>
      ))}
    </div>
  )
}

export default IconMenu