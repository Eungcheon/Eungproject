import { useEffect, useState } from "react";
import { MonthlyBarChart } from "./charts/BarChart";
import { CounselTypePieChart } from "./charts/PieChart";
import './css/CounselStatistics.css';
import { SERVER_URL } from "../../../api/serverURL";

const CounselStatistics = () => {
    const [monthlyData, setMonthlyData] = useState([]);

    const typeData = [
        { name: "재학생", value: 65 },
        { name: "졸업생", value: 25 },
        { name: "일반인", value: 10 }
    ];

    // API 호출
    useEffect(() => {
        fetch(`${SERVER_URL}/api/counsel/stats/monthly`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Data:", data);
                // API 데이터를 적절한 형식으로 가공 (YYYY-MM -> M월)
                const formattedData = data.map(item => ({
                    month: `${parseInt(item.month.split('-')[1], 10)}월`,
                    count: item.count
                }));
                console.log("Fetched Data:", formattedData);
                setMonthlyData(formattedData);
            })
            .catch((error) => {
                console.error("Failed to fetch monthly data:", error);
            });
    }, []);

    return(
        <div className="offline-statistics-container">
            <a href="#">통계다운로드(보류)</a>
            <div className="offline-chart-row">
                <MonthlyBarChart data={monthlyData}/>
                <CounselTypePieChart data={typeData}/>
            </div>
        </div>
    );
};

export default CounselStatistics;