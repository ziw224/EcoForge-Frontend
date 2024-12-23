import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "强度", value: 40 },
  { name: "细度", value: 30 },
  { name: "凝结时间", value: 20 },
  { name: "化学成分", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function QualityAnalysis() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>质量分析</CardTitle>
        <Select defaultValue="compressive">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择指标" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compressive">抗压强度</SelectItem>
            <SelectItem value="fineness">细度</SelectItem>
            <SelectItem value="setting">凝结时间</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold">98.7%</div>
          <div className="text-sm text-muted-foreground">总体合格率</div>
        </div>
      </CardContent>
    </Card>
  );
}
