import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC = () => {
  const [data, setData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Votes',
        data: [],
        backgroundColor: [],
      },
    ],
    photos: [], // Add photos to the data object
  });

  useEffect(() => {
    const candidatesQuery = query(collection(db, 'candidates'), orderBy('votes', 'desc'));

    const unsubscribe = onSnapshot(candidatesQuery, (snapshot) => {
      const labels: string[] = [];
      const votes: number[] = [];
      const backgroundColors: string[] = [];
      const photos: string[] = [];

      snapshot.docs.forEach(doc => {
        const candidateData = doc.data();
        labels.push(candidateData.name);
        votes.push(candidateData.votes);
        backgroundColors.push('#42A5F5'); // Example color
        photos.push(candidateData.photoUrl); // Assuming photoUrl is stored in Firestore
      });

      setData({
        labels,
        datasets: [
          {
            label: 'Votes',
            data: votes,
            backgroundColor: backgroundColors,
          },
        ],
        photos,
      });
    });

    // Cleanup function to destroy the chart
    return () => {
      unsubscribe();
      // Add any additional cleanup logic if necessary
    };
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: false, // Disable default tooltips
        external: function(context: any) {
          // Tooltip Element
          let tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.background = '#fff';
            tooltipEl.style.border = '1px solid #ccc';
            tooltipEl.style.padding = '10px';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.borderRadius = '5px';
            tooltipEl.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          if (context.tooltip.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }

          // Set Text
          if (context.tooltip.body) {
            const index = context.tooltip.dataPoints[0].dataIndex;
            const photoUrl = data.photos[index];
            const bodyLines = context.tooltip.body.map((b: any) => b.lines);

            let innerHtml = '<div>';
            bodyLines.forEach((body: any, i: number) => {
              innerHtml += `<div>${body}</div>`;
              if (photoUrl) {
                innerHtml += `<img src="${photoUrl}" alt="Candidate Photo" style="width: 50px; height: 50px; border-radius: 50%; margin-top: 5px;" />`;
              }
            });
            innerHtml += '</div>';

            tooltipEl.innerHTML = innerHtml;
          }

          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = '1';
          tooltipEl.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + context.tooltip.caretY + 'px';
        }
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
