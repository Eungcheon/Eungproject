import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const MonthlyBarChart = ({ data }) => {
    return (
        <div>
            <h3>월간 상담 통계</h3>
            <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="상담수" />
            </BarChart>
        </div>
    );
};