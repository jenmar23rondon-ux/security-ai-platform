import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors: Record<string, string> = {
  bajo: "#14b8a6",
  medio: "#f59e0b",
  alto: "#ef4444",
  critico: "#7c3aed"
};

export function RiskChart({ risks, eventsByType }: { risks: { name: string; value: number }[]; eventsByType: { name: string; value: number }[] }) {
  return (
    <div className="chart-grid">
      <section className="panel">
        <h3>Riesgo detectado</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={risks} dataKey="value" nameKey="name" outerRadius={90} label>
              {risks.map((entry) => <Cell key={entry.name} fill={colors[entry.name] ?? "#2563eb"} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <section className="panel">
        <h3>Eventos por tipo</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={eventsByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#253047" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

