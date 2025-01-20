import onlineCouns from "./images/onlineCouns.png";
import offlineCouns from "./images/offlineCouns.png";
import realTimeCouns from "./images/realTimeCouns.png";
import "./css/CounselingList.css";
import { Link } from "react-router-dom";

const CounselingList = () => {


    return (
        <div className="counsContainer">
            <div className="list">
                <div className="online">
                    <Link to="./online">
                        <img src={onlineCouns} alt="onlineCounseling" />
                        <p>온라인 상담</p>
                    </Link>
                </div>
                <div className="offline">
                    <Link to="./offline">
                        <img src={offlineCouns} alt="offlineCounseling" />
                        <p>오프라인 상담</p>
                    </Link>
                </div>
                <div className="realTime">
                    <Link to="./realTime">
                        <img src={realTimeCouns} alt="realTimeCounseling" />
                        <p>실시간 상담</p>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default CounselingList;