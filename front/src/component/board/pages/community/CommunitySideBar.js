import { Link } from "react-router-dom";
import "./css/CommunitySideBar.css";

const CommunitySideBar = () => {


    return (
        <div className="community-side-bar">
            <h2>MENU</h2>
            <div className="community-side-bar-menu">
                <Link to="/community/notice">
                    공지사항
                </Link>
                <Link to="/community/faq">
                    FAQ
                </Link>
                <Link to="/community/archive">
                    자료실
                </Link>
            </div>
        </div>
    );
}

export default CommunitySideBar;