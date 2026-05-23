import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import '../styles/SpendingChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function SpendingChart({ data }) {
  const categories = Object.keys(data);
  const amounts = Object.values(data);

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="spending-chart-container">
      <h2>Spending by Category</h2>
      {categories.length === 0 ? (
        <p className="no-data">No spending data available</p>
      ) : (
        <Doughnut data={chartData} options={options} />
      )}
    </div>
  );
}

export default SpendingChart;
