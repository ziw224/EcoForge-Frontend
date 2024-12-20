import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: '1日', 传统工艺: 3000, 智能优化: 3200 },
  { name: '2日', 传统工艺: 3100, 智能优化: 3300 },
  { name: '3日', 传统工艺: 2900, 智能优化: 3250 },
  { name: '4日', 传统工艺: 3200, 智能优化: 3400 },
  { name: '5日', 传统工艺: 3150, 智能优化: 3350 },
  { name: '6日', 传统工艺: 3050, 智能优化: 3300 },
  { name: '7日', 传统工艺: 3100, 智能优化: 3450 },
]

export function ProductionPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>生产性能追踪</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="传统工艺" stroke="#8884d8" />
            <Line type="monotone" dataKey="智能优化" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

