import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CrapsTracker() {
  const [rolls, setRolls] = useState([]);

  const addRoll = (num: number) => setRolls([...rolls, num]);
  const undo = () => setRolls(rolls.slice(0, -1));
  const reset = () => setRolls([]);

  const counts = Array(13).fill(0);
  rolls.forEach((r) => counts[r]++);

  const total = rolls.length || 1;
  const expected = [
    0,
    0,
    1 / 36,
    2 / 36,
    3 / 36,
    4 / 36,
    5 / 36,
    6 / 36,
    5 / 36,
    4 / 36,
    3 / 36,
    2 / 36,
    1 / 36,
  ];

  const bias = counts.map((c, i) => c / total - expected[i]);

  const advice = (() => {
    const pointNums = [4, 5, 6, 8, 9, 10];
    const pointBias = pointNums.map((n) => ({ n, bias: bias[n] }));
    pointBias.sort((a, b) => a.bias - b.bias); // lowest bias (less frequent) is better for Lay
    return `Lay ${pointBias[0].n} が有利です（理論値より出現頻度が低い）`;
  })();

  const data = {
    labels: counts.map((_, i) => i),
    datasets: [
      {
        label: "実際の出目数",
        data: counts,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
      {
        label: "理論値×ロール数",
        data: expected.map((e) => e * total),
        backgroundColor: "rgba(153,102,255,0.6)",
      },
    ],
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">クラップス出目トラッカー</h1>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
          <button
            key={n}
            onClick={() => addRoll(n)}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={undo} className="bg-yellow-500 text-white px-3 py-1 rounded">戻す</button>
        <button onClick={reset} className="bg-red-500 text-white px-3 py-1 rounded">リセット</button>
      </div>
      <div className="mb-4">
        <Bar data={data} />
      </div>
      <div className="bg-green-100 text-green-800 p-3 rounded">
        📊 {advice}
      </div>
    </div>
  );
}
