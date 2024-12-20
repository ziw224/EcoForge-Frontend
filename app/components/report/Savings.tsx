import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Tank 1', value: 400 },
  { name: 'Tank 2', value: 300 },
  { name: 'Tank 3', value: 200 },
  { name: 'Tank 4', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function Savings() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Savings</CardTitle>
        <Select defaultValue="water">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="time">Time</SelectItem>
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold">$933</div>
          <div className="text-sm text-muted-foreground">Total Savings</div>
        </div>
      </CardContent>
    </Card>
  )
}

