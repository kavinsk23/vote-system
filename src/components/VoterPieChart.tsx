import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart } from 'chart.js'; // Import ArcElement from chart.js
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Register the ArcElement
Chart.register(ArcElement);

const VoterPieChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const labels: string[] = [];
      const votes: number[] = [];
      const backgroundColors: string[] = [];

      snapshot.docs.forEach(doc => {
        labels.push(doc.data().name);
        votes.push(doc.data().votes);
        backgroundColors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`); // Random color
      });

      setChartData({
        labels,
        datasets: [
          {
            data: votes,
            backgroundColor: backgroundColors,
          },
        ],
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Vote Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default VoterPieChart;
