export interface OptimizationResult {
  id: number;
  KH: number;
  N: number;
  P: number;
  strength: {
    "1d": number;
    "3d": number;
    "28d": number;
  };
  chemical: Record<string, number>;
}

export interface Parameter {
  id: string;
  name: string;
  unit: string;
  visible: boolean;
  value?: string;
}
