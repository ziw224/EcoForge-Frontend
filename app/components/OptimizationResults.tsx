import { Card, CardContent } from "@/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const mockData = {
  khValues: Array(5).fill(null).map((_, i) => ({
    id: i + 1,
    方案: `方案 ${i + 1}`,
    KH值1: 0.989,
    KH值2: 0.989,
    KH值3: 0.989,
    KH值4: 0.989,
    价格: '+84%',
  })),
  strengthData: Array(5).fill(null).map((_, i) => ({
    id: i + 1,
    方案: `方案 ${i + 1}`,
    '1天强度': 0.989,
    '3天强度': 0.989,
    '28天强度': 0.989,
    价格: '+84%',
  })),
  chemicalData: Array(5).fill(null).map((_, i) => ({
    id: i + 1,
    方案: `方案 ${i + 1}`,
    LOSS: 0.989,
    Fe2O3: 0.989,
    Al2O3: 0.989,
    MgO: 0.989,
    'f-CaO': 0.989,
    价格: '+84%',
  })),
  comparisonData: [
    { name: '方案1', 指标1: 1, 指标2: 2.5, 指标3: 1.3 },
    { name: '方案2', 指标1: 1, 指标2: 2.5, 指标3: 1.3 },
    { name: '方案3', 指标1: 1, 指标2: 2.5, 指标3: 1.3 },
    { name: '方案4', 指标1: 1, 指标2: 2.5, 指标3: 1.3 },
  ],
}

export default function OptimizationResults() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">最优配比参数</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>方案</TableHead>
                  <TableHead>KH值1</TableHead>
                  <TableHead>KH值2</TableHead>
                  <TableHead>KH值3</TableHead>
                  <TableHead>KH值4</TableHead>
                  <TableHead>价格</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.khValues.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.方案}</TableCell>
                    <TableCell>{row.KH值1}</TableCell>
                    <TableCell>{row.KH值2}</TableCell>
                    <TableCell>{row.KH值3}</TableCell>
                    <TableCell>{row.KH值4}</TableCell>
                    <TableCell className="text-green-600">{row.价格}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">最优配比强度预测</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>方案</TableHead>
                  <TableHead>1天强度</TableHead>
                  <TableHead>3天强度</TableHead>
                  <TableHead>28天强度</TableHead>
                  <TableHead>价格</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.strengthData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.方案}</TableCell>
                    <TableCell>{row['1天强度']}</TableCell>
                    <TableCell>{row['3天强度']}</TableCell>
                    <TableCell>{row['28天强度']}</TableCell>
                    <TableCell className="text-green-600">{row.价格}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">最优配比化料成分</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>方案</TableHead>
                <TableHead>LOSS</TableHead>
                <TableHead>Fe2O3</TableHead>
                <TableHead>Al2O3</TableHead>
                <TableHead>MgO</TableHead>
                <TableHead>f-CaO</TableHead>
                <TableHead>价格</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.chemicalData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.方案}</TableCell>
                  <TableCell>{row.LOSS}</TableCell>
                  <TableCell>{row.Fe2O3}</TableCell>
                  <TableCell>{row.Al2O3}</TableCell>
                  <TableCell>{row.MgO}</TableCell>
                  <TableCell>{row['f-CaO']}</TableCell>
                  <TableCell className="text-green-600">{row.价格}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">参数对比</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="指标1" fill="#4F46E5" />
                <Bar dataKey="指标2" fill="#EF4444" />
                <Bar dataKey="指标3" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}