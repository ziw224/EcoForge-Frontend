'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/ui/card"
import { Button } from "@/ui/button"
import { Progress } from "@/ui/progress"
import { ParameterInput } from './ParameterInput'
import { OptimizationResults } from './OptimizationResults'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/ui/alert-dialog"
import { LoadingSpinner } from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import { OptimizationResult } from '@/types/common'

interface ClinkerRatioOptimizationProps {
  onStepChange: (stepId: number, completed: boolean) => void
}

export function ClinkerRatioOptimization({ onStepChange }: ClinkerRatioOptimizationProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<OptimizationResult[] | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setProgress(0)
    setError(null)
    onStepChange(1, true)
    onStepChange(2, false)

    try {
      // 模拟优化过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setProgress(i)
      }

      // 模拟结果数据
      const optimizationResults: OptimizationResult[] = [
        {
          id: 1,
          KH: 0.92,
          N: 2.35,
          P: 1.45,
          strength: {
            '1d': 15.5,
            '3d': 31.4,
            '28d': 58.7
          },
          chemical: {
            'SiO₂': 22.120,
            'Al₂O₃': 5.080,
            'Fe₂O₃': 3.410,
            'CaO': 64.590,
            'MgO': 2.540,
            'SO₃': 0.530,
            'f-CaO': 0.990,
            'Na₂O': 0.250,
            'K₂O': 0.900,
            'Cl⁻': 0.025
          }
        },
        {
          id: 2,
          KH: 0.90,
          N: 2.40,
          P: 1.50,
          strength: {
            '1d': 14.8,
            '3d': 30.9,
            '28d': 59.2
          },
          chemical: {
            'SiO₂': 21.980,
            'Al₂O₃': 5.120,
            'Fe₂O₃': 3.380,
            'CaO': 64.210,
            'MgO': 2.560,
            'SO₃': 0.540,
            'f-CaO': 0.970,
            'Na₂O': 0.260,
            'K₂O': 0.910,
            'Cl⁻': 0.024
          }
        },
        {
          id: 3,
          KH: 0.94,
          N: 2.30,
          P: 1.40,
          strength: {
            '1d': 16.2,
            '3d': 32.1,
            '28d': 58.3
          },
          chemical: {
            'SiO₂': 22.260,
            'Al₂O₃': 5.040,
            'Fe₂O₃': 3.440,
            'CaO': 64.970,
            'MgO': 2.520,
            'SO₃': 0.520,
            'f-CaO': 1.010,
            'Na₂O': 0.240,
            'K₂O': 0.890,
            'Cl⁻': 0.026
          }
        }
      ]

      setResults(optimizationResults)
      onStepChange(2, true)
      onStepChange(3, false)
    } catch (err) {
      setError('优化过程中发生错误，请重试。')
      onStepChange(2, false)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleSave = () => {
    setShowSaveDialog(true)
  }

  const handleConfirmSave = () => {
    setShowSaveDialog(false)
    onStepChange(3, true)
    onStepChange(4, false)
    // 实际保存逻辑
  }

  return (
    <ErrorBoundary fallback={<div>出错了，请刷新页面重试。</div>}>
      <div className="space-y-6">
        <ParameterInput excludeParameters={['KH', 'N', 'P']} />
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-x-4">
                <Button 
                  onClick={handleOptimize} 
                  disabled={isOptimizing}
                  size="lg"
                  className={isOptimizing ? 'bg-gray-500' : results ? 'bg-green-500' : ''}
                >
                  {isOptimizing ? '正在优化...' : results ? '优化完成' : '开始优化'}
                </Button>
                {isOptimizing && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOptimizing(false)}
                  >
                    取消
                  </Button>
                )}
              </div>
              {isOptimizing && (
                <div className="flex-1 ml-4">
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
        )}

        {isOptimizing && <LoadingSpinner />}

        {results && (
          <>
            <OptimizationResults results={results} />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleSave}>
                保存优化结果
              </Button>
              <Button onClick={handleSave}>
                采纳建议并保存
              </Button>
            </div>
          </>
        )}

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>保存优化方案</AlertDialogTitle>
              <AlertDialogDescription>
                是否确认保存当前优化方案？保存后可在数据库中查看和管理。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSave}>确认保存</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  )
}

