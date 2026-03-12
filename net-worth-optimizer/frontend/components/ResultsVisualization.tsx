'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ResultsVisualizationProps {
  monthlyBreakdown: Array<{
    month: number;
    debt_path_net_worth: number;
    invest_path_net_worth: number;
  }>;
  recommendation: string;
}

export default function ResultsVisualization({
  monthlyBreakdown,
  recommendation
}: ResultsVisualizationProps) {
  const chartData = {
    labels: monthlyBreakdown.map(d => d.month % 6 === 0 ? `Month ${d.month}` : ''),
    datasets: [
      {
        label: 'Pay Debt Strategy',
        data: monthlyBreakdown.map(d => d.debt_path_net_worth),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Invest Strategy',
        data: monthlyBreakdown.map(d => d.invest_path_net_worth),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(161, 161, 170)',
          font: {
            size: 13,
            weight: 'normal'
          },
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Net Worth Projection Over Time',
        color: 'rgb(244, 244, 245)',
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        titleColor: 'rgb(244, 244, 245)',
        bodyColor: 'rgb(161, 161, 170)',
        borderColor: 'rgb(63, 63, 70)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed.y ?? 0);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(113, 113, 122)',
          callback: function(value) {
            return '$' + Number(value).toLocaleString();
          }
        },
        grid: {
          color: 'rgba(63, 63, 70, 0.3)'
        }
      },
      x: {
        ticks: {
          color: 'rgb(113, 113, 122)',
          maxTicksLimit: 12
        },
        grid: {
          color: 'rgba(63, 63, 70, 0.3)'
        }
      }
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-zinc-800/50 border border-zinc-800 rounded-lg">
          <div className="text-xs text-zinc-500 mb-1">Pay Debt Path</div>
          <div className="text-lg font-semibold text-red-400">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(monthlyBreakdown[monthlyBreakdown.length - 1].debt_path_net_worth)}
          </div>
        </div>
        <div className="p-3 bg-zinc-800/50 border border-zinc-800 rounded-lg">
          <div className="text-xs text-zinc-500 mb-1">Invest Path</div>
          <div className="text-lg font-semibold text-green-400">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(monthlyBreakdown[monthlyBreakdown.length - 1].invest_path_net_worth)}
          </div>
        </div>
      </div>
    </div>
  );
}
