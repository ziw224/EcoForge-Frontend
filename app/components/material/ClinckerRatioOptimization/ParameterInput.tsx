// // import { useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Label } from "@/components/ui/label";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Switch } from "@/components/ui/switch";
// // import { startOptimization } from "../../../fetch/startOptimization";

// // type LocalParameter = {
// //   id: string;
// //   name: string;
// //   unit: string;
// //   visible: boolean;
// //   value?: string;
// // };

// // type ParameterCategory = "basic" | "coal" | "chemical";

// // const defaultStoragePath = "/data/predictions/cement-strength/";

// // const coalParameters: LocalParameter[] = [
// //   { id: "Wf", name: "内水", unit: "Wf", visible: true },
// //   { id: "Minh", name: "外水", unit: "Minh", visible: true },
// //   { id: "Aad", name: "灰分", unit: "Aad", visible: true },
// //   { id: "Vad", name: "挥发分", unit: "Vad", visible: true },
// //   { id: "FC", name: "固定碳", unit: "FC", visible: true },
// //   { id: "S", name: "硫含量", unit: "S", visible: true },
// //   { id: "GAR", name: "煤粉细度", unit: "GAR", visible: true },
// //   { id: "JG", name: "热值", unit: "J/G", visible: true },
// //   { id: "Qgr", name: "热功率", unit: "Qgr", visible: true },
// // ];

// // const chemicalParameters: LocalParameter[] = [
// //   { id: "I-LOSS", name: "烧失量", unit: "I-LOSS", visible: true },
// //   { id: "I-SiO2", name: "二氧化硅", unit: "I-SiO2", visible: true },
// //   { id: "I-Al2O3", name: "三氧化二铝", unit: "I-Al2O3", visible: true },
// //   { id: "I-Fe2O3", name: "三氧化二铁", unit: "I-Fe2O3", visible: true },
// //   { id: "I-CaO", name: "氧化钙", unit: "I-CaO", visible: true },
// //   { id: "I-MgO", name: "氧化镁", unit: "I-MgO", visible: true },
// //   { id: "I-SO3", name: "三氧化硫", unit: "I-SO3", visible: true },
// //   { id: "I-Na2O", name: "氧化钠", unit: "I-Na2O", visible: true },
// //   { id: "I-K2O", name: "氧化钾", unit: "I-K2O", visible: true },
// //   { id: "I-R2O", name: "碱含量", unit: "I-R2O", visible: true },
// //   { id: "I-CL", name: "氯离子", unit: "I-CL", visible: true },
// // ];

// // interface ParameterInputProps {
// //   uid: string;
// //   taskId: string;
// //   companyId: string;
// //   onOptimizeStart: () => void;
// // }

// // export function ParameterInput({
// //   uid,
// //   taskId,
// //   companyId,
// //   onOptimizeStart,
// // }: ParameterInputProps) {
// //   const [parameters, setParameters] = useState({
// //     basic: {
// //       date: new Date().toISOString().split("T")[0],
// //       batchNumber: "",
// //       operator: "",
// //       modelVersion: "v2.0",
// //       storagePath: defaultStoragePath,
// //     },
// //     coal: coalParameters,
// //     chemical: chemicalParameters,
// //   });

// //   const [editMode, setEditMode] = useState<{
// //     coal: boolean;
// //     chemical: boolean;
// //   }>({
// //     coal: false,
// //     chemical: false,
// //   });

// //   const handleOptimizationStart = async () => {
// //     try {
// //       // // Combine all parameters into a single flat object
// //       // const rawMaterials = {
// //       //   // ...parameters.basic, // Add basic parameters
// //       //   ...Object.fromEntries(
// //       //     parameters.coal
// //       //       .filter((param) => param.visible)
// //       //       .map(({ id, value }) => [id, value]) // Add visible coal parameters
// //       //   ),
// //       //   ...Object.fromEntries(
// //       //     parameters.chemical
// //       //       .filter((param) => param.visible)
// //       //       .map(({ id, value }) => [id, value]) // Add visible chemical parameters
// //       //   ),
// //       // };

// //       // Create FormData with the combined parameters
// //       let formData = new FormData();

// //       // Append each key-value pair for company YZ
// //       // formData.append("I-LOSS", "35.94");
// //       // formData.append("I-SiO2", "13.58");
// //       // formData.append("I-Al2O3", "3.14");
// //       // formData.append("I-Fe2O3", "2.1");
// //       // formData.append("I-CaO", "42.6");
// //       // formData.append("I-MgO", "1.44");
// //       // formData.append("I-CL", "0.025");
// //       // formData.append("I-R2O", "0.51");
// //       // formData.append("I-SO3", "0.26");
// //       // formData.append("Vad", "28.66");
// //       // formData.append("Aad", "7.77");
// //       // formData.append("Qgr", "5548");
// //       // formData.append("S", "0.62");

// //       // Company PY
// //       formData.append("Wf", String(10.0));
// //       formData.append("Minh", String(2.22));
// //       formData.append("Aad", String(17.77));
// //       formData.append("Vad", String(28.66));
// //       formData.append("S", String(0.62));
// //       formData.append("GAR", String(5548.0));
// //       formData.append("I-LOSS", String(35.94));
// //       formData.append("I-SiO2", String(13.58));
// //       formData.append("I-Al2O3", String(3.14));
// //       formData.append("I-Fe2O3", String(2.1));
// //       formData.append("I-CaO", String(42.6));
// //       formData.append("I-MgO", String(1.44));
// //       formData.append("I-R2O", String(0.51));
// //       formData.append("I-CL", String(0.02));

// //       // Print FormData for debugging
// //       console.log("FormData Contents:");
// //       Array.from(formData.entries()).forEach(([key, value]) => {
// //         console.log(`${key}: ${value}`);
// //       });

// //       // Send data to API
// //       const response = await startOptimization(
// //         uid,
// //         taskId,
// //         companyId,
// //         formData
// //       );

// //       console.log("Optimization started successfully:", response.msg);
// //       onOptimizeStart();
// //     } catch (error) {
// //       console.error("Error starting optimization:", error);
// //     }
// //   };

// //   const handleParameterChange = (
// //     category: ParameterCategory,
// //     id: string,
// //     value: string
// //   ) => {
// //     setParameters((prev) => ({
// //       ...prev,
// //       [category]:
// //         category === "basic"
// //           ? { ...prev[category], [id]: value }
// //           : (prev[category] as LocalParameter[]).map((param) =>
// //               param.id === id ? { ...param, value } : param
// //             ),
// //     }));
// //   };

// //   const renderParameter = (
// //     category: ParameterCategory,
// //     param: LocalParameter
// //   ) => (
// //     <div
// //       key={param.id}
// //       className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-0"
// //     >
// //       {editMode[category as keyof typeof editMode] && (
// //         <Switch
// //           checked={param.visible}
// //           onCheckedChange={() =>
// //             setParameters((prev) => ({
// //               ...prev,
// //               [category]: (prev[category] as LocalParameter[]).map((p) =>
// //                 p.id === param.id ? { ...p, visible: !p.visible } : p
// //               ),
// //             }))
// //           }
// //           aria-label={`Toggle ${param.name}`}
// //         />
// //       )}
// //       <Label className="w-40 text-sm">
// //         {param.name} ({param.unit})
// //       </Label>
// //       {param.visible && (
// //         <Input
// //           type="number"
// //           value={
// //             (parameters[category] as LocalParameter[]).find(
// //               (p) => p.id === param.id
// //             )?.value || ""
// //           }
// //           onChange={(e) =>
// //             handleParameterChange(category, param.id, e.target.value)
// //           }
// //           className="max-w-[120px]"
// //           placeholder="参数输入"
// //         />
// //       )}
// //     </div>
// //   );

// //   return (
// //     <div className="space-y-6">
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>基本生产信息</CardTitle>
// //         </CardHeader>
// //         <CardContent className="space-y-4">
// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <Label>日期</Label>
// //               <Input
// //                 type="date"
// //                 value={parameters.basic.date}
// //                 onChange={(e) =>
// //                   handleParameterChange("basic", "date", e.target.value)
// //                 }
// //               />
// //             </div>
// //             <div>
// //               <Label>编号</Label>
// //               <Input
// //                 value={parameters.basic.batchNumber}
// //                 onChange={(e) =>
// //                   handleParameterChange("basic", "batchNumber", e.target.value)
// //                 }
// //               />
// //             </div>
// //             <div>
// //               <Label>操作员</Label>
// //               <Input
// //                 value={parameters.basic.operator}
// //                 onChange={(e) =>
// //                   handleParameterChange("basic", "operator", e.target.value)
// //                 }
// //               />
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <div className="grid md:grid-cols-2 gap-6">
// //         <Card>
// //           <CardHeader>
// //             <CardTitle>焦煤参数</CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-1">
// //             {parameters.coal.map((param) => renderParameter("coal", param))}
// //             <Button
// //               variant="outline"
// //               className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
// //               onClick={() => {
// //                 setEditMode((prev) => ({ ...prev, coal: !prev.coal }));
// //               }}
// //             >
// //               {editMode.coal ? "保存" : "编辑参数"}
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle>生料化学成分</CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-1">
// //             {parameters.chemical.map((param) =>
// //               renderParameter("chemical", param)
// //             )}
// //             <Button
// //               variant="outline"
// //               className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
// //               onClick={() =>
// //                 setEditMode((prev) => ({ ...prev, chemical: !prev.chemical }))
// //               }
// //             >
// //               {editMode.chemical ? "保存" : "编辑参数"}
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <Button
// //         onClick={handleOptimizationStart}
// //         size="lg"
// //         className="bg-blue-500 w-full"
// //       >
// //         开始优化
// //       </Button>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// type LocalParameter = {
//   id: string;
//   name: string;
//   unit: string;
//   visible: boolean;
//   value?: string;
// };

// type ParameterCategory = "basic" | "coal" | "chemical";

// const modelVersions = [
//   { id: "v1.0", name: "Version 1.0 - 基础版" },
//   { id: "v1.1", name: "Version 1.1 - 优化版" },
//   { id: "v2.0", name: "Version 2.0 - 高级版" },
// ];

// const defaultStoragePath = "/data/predictions/cement-strength/";

// const coalParameters: LocalParameter[] = [
//   { id: "Wf", name: "内水", unit: "Wf", visible: true },
//   { id: "Minh", name: "外水", unit: "Minh", visible: true },
//   { id: "Aad", name: "灰分", unit: "Aad", visible: true },
//   { id: "FC", name: "固定碳", unit: "FC", visible: true },
//   { id: "S", name: "硫含量", unit: "S", visible: true },
//   { id: "GAR", name: "煤粉细度", unit: "GAR", visible: true },
//   { id: "JG", name: "热值", unit: "J/G", visible: true },
//   { id: "Qgr", name: "热功率", unit: "Qgr", visible: true },
// ];

// const chemicalParameters: LocalParameter[] = [
//   { id: "l-LOSS", name: "烧失量", unit: "l-LOSS", visible: true },
//   { id: "l-SiO2", name: "二氧化硅", unit: "l-SiO2", visible: true },
//   { id: "l-Al2O3", name: "三氧化二铝", unit: "l-Al2O3", visible: true },
//   { id: "l-Fe2O3", name: "三氧化二铁", unit: "l-Fe2O3", visible: true },
//   { id: "l-CaO", name: "氧化钙", unit: "l-CaO", visible: true },
//   { id: "l-MgO", name: "氧化镁", unit: "l-MgO", visible: true },
//   { id: "l-SO3", name: "三氧化硫", unit: "l-SO3", visible: true },
//   { id: "l-Na2O", name: "氧化钠", unit: "l-Na2O", visible: true },
//   { id: "l-K2O", name: "氧化钾", unit: "l-K2O", visible: true },
//   { id: "l-R2O", name: "碱含量", unit: "l-R2O", visible: true },
//   { id: "l-CL", name: "氯离子", unit: "l-CL", visible: true },
// ];

// interface ParameterInputProps {
//   onOptimizeStart: () => void; // Callback to trigger optimization in parent
// }

// export function ParameterInput({ onOptimizeStart }: ParameterInputProps) {
//   const [parameters, setParameters] = useState({
//     basic: {
//       date: new Date().toISOString().split("T")[0],
//       batchNumber: "",
//       operator: "",
//       modelVersion: "v2.0",
//       storagePath: defaultStoragePath,
//     },
//     coal: coalParameters,
//     chemical: chemicalParameters,
//   });

//   const renderParameter = (
//     category: ParameterCategory,
//     param: LocalParameter
//   ) => (
//     <div
//       key={param.id}
//       className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-0"
//     >
//       <Label className="w-40 text-sm">
//         {param.name} ({param.unit})
//       </Label>
//       <Input
//         type="number"
//         value={
//           (parameters[category] as LocalParameter[]).find(
//             (p) => p.id === param.id
//           )?.value || ""
//         }
//         onChange={(e) =>
//           setParameters((prev) => ({
//             ...prev,
//             [category]: (prev[category] as LocalParameter[]).map((p) =>
//               p.id === param.id ? { ...p, value: e.target.value } : p
//             ),
//           }))
//         }
//         className="max-w-[120px]"
//         placeholder="参数输入"
//       />
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>基本生产信息</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>日期</Label>
//               <Input
//                 type="date"
//                 value={parameters.basic.date}
//                 onChange={(e) =>
//                   setParameters((prev) => ({
//                     ...prev,
//                     basic: { ...prev.basic, date: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div>
//               <Label>编号</Label>
//               <Input
//                 value={parameters.basic.batchNumber}
//                 onChange={(e) =>
//                   setParameters((prev) => ({
//                     ...prev,
//                     basic: { ...prev.basic, batchNumber: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//             <div>
//               <Label>操作员</Label>
//               <Input
//                 value={parameters.basic.operator}
//                 onChange={(e) =>
//                   setParameters((prev) => ({
//                     ...prev,
//                     basic: { ...prev.basic, operator: e.target.value },
//                   }))
//                 }
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>焦煤参数</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-1">
//             {parameters.coal.map((param) => renderParameter("coal", param))}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>生料化学成分</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-1">
//             {parameters.chemical.map((param) =>
//               renderParameter("chemical", param)
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Button
//         onClick={onOptimizeStart} // Notify parent when clicked
//         size="lg"
//         className="bg-blue-500 w-full"
//       >
//         开始优化
//       </Button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LocalParameter = {
  id: string;
  name: string;
  unit: string;
  visible: boolean;
  value?: string;
};

type ParameterCategory = "basic" | "coal" | "chemical";

const modelVersions = [
  { id: "v1.0", name: "Version 1.0 - 基础版" },
  { id: "v1.1", name: "Version 1.1 - 优化版" },
  { id: "v2.0", name: "Version 2.0 - 高级版" },
];

const defaultStoragePath = "/data/predictions/cement-strength/";

const coalParameters: LocalParameter[] = [
  { id: "Wf", name: "全水", unit: "Wf", visible: true },
  { id: "Minh", name: "内水", unit: "Minh", visible: true },
  { id: "Aad", name: "灰分", unit: "Aad", visible: true },
  { id: "Vad", name: "挥发分", unit: "Vad", visible: true },
  { id: "FC", name: "固定碳", unit: "FC", visible: true },
  { id: "S", name: "硫含量", unit: "S", visible: true },
  { id: "GAR", name: "煤粉细度", unit: "GAR", visible: true },
  { id: "JG", name: "热值", unit: "J/G", visible: true },
  { id: "Qgr", name: "空干基发热量", unit: "Qgr", visible: true },
];

const chemicalParameters: LocalParameter[] = [
  { id: "l-LOSS", name: "烧失量", unit: "l-LOSS", visible: true },
  { id: "l-SiO2", name: "二氧化硅", unit: "l-SiO2", visible: true },
  { id: "l-Al2O3", name: "三氧化二铝", unit: "l-Al2O3", visible: true },
  { id: "l-Fe2O3", name: "三氧化二铁", unit: "l-Fe2O3", visible: true },
  { id: "l-CaO", name: "氧化钙", unit: "l-CaO", visible: true },
  { id: "l-MgO", name: "氧化镁", unit: "l-MgO", visible: true },
  { id: "l-SO3", name: "三氧化硫", unit: "l-SO3", visible: true },
  { id: "l-Na2O", name: "氧化钠", unit: "l-Na2O", visible: true },
  { id: "l-K2O", name: "氧化钾", unit: "l-K2O", visible: true },
  { id: "l-R2O", name: "碱含量", unit: "l-R2O", visible: true },
  { id: "l-CL", name: "氯离子", unit: "l-CL", visible: true },
];

interface ParameterInputProps {
  onOptimizeStart: () => void; // Callback to trigger optimization in parent
}

export function ParameterInput({ onOptimizeStart }: ParameterInputProps) {
  const [parameters, setParameters] = useState({
    basic: {
      date: new Date().toISOString().split("T")[0],
      batchNumber: "",
      operator: "",
      modelVersion: "v2.0",
      storagePath: defaultStoragePath,
    },
    coal: coalParameters,
    chemical: chemicalParameters,
  });

  const renderParameter = (
    category: ParameterCategory,
    param: LocalParameter
  ) => (
    <div
      key={param.id}
      className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-0"
    >
      <Label className="w-40 text-sm">
        {param.name} ({param.unit})
      </Label>
      <Input
        type="number"
        value={
          (parameters[category] as LocalParameter[]).find(
            (p) => p.id === param.id
          )?.value || ""
        }
        onChange={(e) =>
          setParameters((prev) => ({
            ...prev,
            [category]: (prev[category] as LocalParameter[]).map((p) =>
              p.id === param.id ? { ...p, value: e.target.value } : p
            ),
          }))
        }
        className="max-w-[120px]"
        placeholder="参数输入"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本生产信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>日期</Label>
              <Input
                type="date"
                value={parameters.basic.date}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    basic: { ...prev.basic, date: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>编号</Label>
              <Input
                value={parameters.basic.batchNumber}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    basic: { ...prev.basic, batchNumber: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>操作员</Label>
              <Input
                value={parameters.basic.operator}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    basic: { ...prev.basic, operator: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>焦煤参数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {parameters.coal.map((param) => renderParameter("coal", param))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>生料化学成分</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {parameters.chemical.map((param) =>
              renderParameter("chemical", param)
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={onOptimizeStart} // Notify parent when clicked
        size="lg"
        className="bg-blue-500 w-full"
      >
        开始优化
      </Button>
    </div>
  );
}
