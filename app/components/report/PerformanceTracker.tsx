import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', Traditional: 30000, PrecisionCIP: 25000 },
  { name: 'Feb', Traditional: 35000, PrecisionCIP: 29000 },
  { name: 'Mar', Traditional: 33000, PrecisionCIP: 31000 },
  { name: 'Apr', Traditional: 38000, PrecisionCIP: 35000 },
  { name: 'May', Traditional: 40000, PrecisionCIP: 38000 },
  { name: 'Jun', Traditional: 45000, PrecisionCIP: 42000 },
  { name: 'Jul', Traditional: 48000, PrecisionCIP: 45000 },
]

export function PerformanceTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Traditional" stroke="#8884d8" />
            <Line type="monotone" dataKey="PrecisionCIP" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

