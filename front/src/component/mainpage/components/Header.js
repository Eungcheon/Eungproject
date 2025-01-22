import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
// import useAuth, { LOGIN_STATUS, ROLES } from '../../login/hooks/useAuth';
// import { LoginContext } from '../../login/security/contexts/LoginContextProvider';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerHeight, setHeaderHeight] = useState("120px");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const { logout } = useContext(LoginContext);
  // const { loginStatus, loginId, roles, } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []); // 로그인 기능 구현

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };      // 로그아웃 기능 구현

  const handleMenuHover = (index) => {
    setActiveSubmenu(index);
    setHeaderHeight(index !== null ? "500px" : "135px");
  };

  // 화면 크기가 변경될 때마다 모바일 여부를 설정
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)
      if (newIsMobile !== isMobile) {
        setIsMobileMenuOpen(false)
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 화면 크기 체크

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems = [
    {
      title: '센터소개',
      submenu: ['부서소개', '진로 취업 로드맵', '진로 취업 프로그램'],
    },
    {
      title: '채용정보',
      submenu: ['채용정보', '취업솔루션'],
    },
    {
      title: '프로그램',
      submenu: ['전체 프로그램', '취업 프로그램', '진로 프로그램', '창업 프로그램', '신청내역'],
    },
    {
      title: 'community',
      submenu: ['notice', 'FAQ', 'archive', 'counsel', '실시간 상담'],
    },
    {
      title: '마이페이지',
      submenu: ['회원 정보', '내가 신청한 프로그램', '즐겨찾기', '상담 결과 조회'],
    },
  ];

  return (
    <header className="header" style={{ height: headerHeight }}>
      <div className="header-container">
        <div className="header-top">
          <div className="flex items-center">
            <a href="https://www.jobpluscenter.com" target="_blank" rel="noopener noreferrer" className="logo">
              <img src="/images/logos/logo.png" alt="일자리플러스센터 로고" />
            </a>
            <Link to="/" className="text-xl font-bold hover:text-blue-600 transition-colors">
              일자리플러스센터
            </Link>
          </div>
          <div>
            {/* {
              loginStatus === LOGIN_STATUS.LOGGED_IN ? (
                <>
                  <div id="top_login" className="header-login-container">
                    <div className="flex-container">
                      <p className="userid">{loginId}님</p>
                      <button
                        type="button"
                        style={{ marginLeft: "10px" }}
                        className="auth-button"
                        onClick={() => logout()}
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              ) : ( */}
                <div id="top_login" className="login-container">
                  <a className="auth-button" href="/login">
                    로그인
                  </a>
                  <span> | </span>
                  <a className="auth-button" href="/join">
                    회원가입
                  </a>
                </div>
              {/* ) */}
            {/* } */}

          </div>
        </div>

        {/* 메뉴 아이콘 버튼 (작은 화면에서만 표시) */}
        {isMobile && (
          <>
            <button className="menu-toggle" onClick={toggleMobileMenu}>
              ☰
            </button>
            {isMobileMenuOpen && (
              <div className="mobile-menu">
                <button className="close-menu" onClick={toggleMobileMenu}>
                  ×
                </button>
                <ul className="mobile-nav-menu">
                  {menuItems.map((item, index) => (
                    <li key={index} className="mobile-nav-item">
                      <button onClick={() => setActiveSubmenu(activeSubmenu === index ? null : index)}>
                        {item.title}
                      </button>
                      {activeSubmenu === index && (
                        <ul className="mobile-submenu">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={`/${item.title.toLowerCase()}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                                className="mobile-submenu-item"
                                onClick={toggleMobileMenu}
                              >
                                {subItem}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {!isMobile && (
          <nav className="header-nav">
            <ul className="nav-menu">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="nav-item"
                  onMouseEnter={() => handleMenuHover(index)}
                  onMouseLeave={() => handleMenuHover(null)}
                >
                  {/* 버튼 클릭 시 첫 번째 세부목록으로 이동 */}
                  <Link
                    to={`/${item.title.toLowerCase()}/${item.submenu[0].toLowerCase().replace(/ /g, '-')}`}
                    className="nav-button"
                  >
                    {item.title}
                  </Link>
                  {/* 서브메뉴 */}
                  <div className="submenu">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/${item.title.toLowerCase()}/${subItem.toLowerCase().replace(/ /g, '-')}`}
                        className="submenu-item"
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        )} {/* !isMobile */}
      </div>
    </header>
  );
};

export default Header;

