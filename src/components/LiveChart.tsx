import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface LiveChartProps {
  data: { time: string; load: number; voltage: number }[];
  title: string;
}

export function LiveChart({ data, title }: LiveChartProps) {
  return (
    <div className="scada-panel">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 40%, 8%)',
              border: '1px solid hsl(222, 30%, 16%)',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono',
            }}
            labelStyle={{ color: 'hsl(200, 20%, 90%)' }}
          />
          <Line type="monotone" dataKey="load" stroke="hsl(192, 100%, 42%)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="voltage" stroke="hsl(38, 95%, 55%)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block" /> Load %</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-accent inline-block" /> Voltage</span>
      </div>
    </div>
  );
}
