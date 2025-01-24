import { MonthlyBarChart } from "./charts/BarChart";
import { CounselTypePieChart } from "./charts/PieChart";
import './css/CounselStatistics.css';

const CounselStatistics = () => {
    const monthlyData = [
        { month: "3월", count: 30 },
        { month: "4월", count: 28 },
        { month: "5월", count: 31 },
        { month: "6월", count: 40 },
        { month: "7월", count: 51 },
        { month: "8월", count: 49 }
    ];

    const typeData = [
        { name: "재학생", value: 65 },
        { name: "졸업생", value: 25 },
        { name: "일반인", value: 10 }
    ];

    return(
        <div className="statistics-container">
            <a href="#">통계다운로드(보류)</a>
            <div className="chart-row">
                <MonthlyBarChart data={monthlyData}/>
                <CounselTypePieChart data={typeData}/>
            </div>
        </div>
    );
};

export default CounselStatistics;