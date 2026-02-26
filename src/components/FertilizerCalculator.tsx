"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle, TrendingUp, Droplets, Sun } from "lucide-react";

interface FertilizerResult {
  npkRatio: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  quantity: number;
  schedule: string[];
  tips: string[];
  crop: string;
  soilType: string;
  area: number;
}

const cropOptions = [
  { value: "tomato", label: "Tomato" },
  { value: "wheat", label: "Wheat" },
  { value: "rice", label: "Rice" },
  { value: "corn", label: "Corn/Maize" },
  { value: "potato", label: "Potato" },
  { value: "cotton", label: "Cotton" },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "soybean", label: "Soybean" }
];

const soilTypeOptions = [
  { value: "clay", label: "Clay Soil" },
  { value: "sandy", label: "Sandy Soil" },
  { value: "loamy", label: "Loamy Soil" },
  { value: "silt", label: "Silt Soil" },
  { value: "peat", label: "Peat Soil" },
  { value: "chalk", label: "Chalk Soil" }
];

export default function FertilizerCalculator() {
  const [crop, setCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [area, setArea] = useState("");
  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateFertilizer = async () => {
    if (!crop || !soilType || !area) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate calculation - replace with actual logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const areaNum = parseFloat(area);
      
      // Mock fertilizer recommendations based on crop and soil type
      const fertilizerData: Record<string, Record<string, any>> = {
        tomato: {
          clay: { n: 120, p: 80, k: 100, baseQty: 2.5 },
          sandy: { n: 150, p: 100, k: 120, baseQty: 3.0 },
          loamy: { n: 100, p: 70, k: 90, baseQty: 2.2 },
          silt: { n: 110, p: 75, k: 95, baseQty: 2.3 },
          peat: { n: 80, p: 60, k: 80, baseQty: 2.0 },
          chalk: { n: 140, p: 90, k: 110, baseQty: 2.8 }
        },
        wheat: {
          clay: { n: 100, p: 60, k: 80, baseQty: 2.0 },
          sandy: { n: 120, p: 80, k: 100, baseQty: 2.5 },
          loamy: { n: 90, p: 50, k: 70, baseQty: 1.8 },
          silt: { n: 95, p: 55, k: 75, baseQty: 1.9 },
          peat: { n: 70, p: 40, k: 60, baseQty: 1.5 },
          chalk: { n: 110, p: 70, k: 90, baseQty: 2.2 }
        },
        rice: {
          clay: { n: 80, p: 40, k: 60, baseQty: 1.5 },
          sandy: { n: 100, p: 60, k: 80, baseQty: 2.0 },
          loamy: { n: 70, p: 35, k: 55, baseQty: 1.3 },
          silt: { n: 75, p: 38, k: 58, baseQty: 1.4 },
          peat: { n: 60, p: 30, k: 50, baseQty: 1.2 },
          chalk: { n: 90, p: 50, k: 70, baseQty: 1.8 }
        }
      };

      const cropData = fertilizerData[crop] || fertilizerData.tomato;
      const soilData = cropData[soilType] || cropData.loamy;
      
      const calculationResult: FertilizerResult = {
        npkRatio: {
          nitrogen: soilData.n,
          phosphorus: soilData.p,
          potassium: soilData.k
        },
        quantity: Math.round(soilData.baseQty * areaNum * 100) / 100,
        schedule: getSchedule(crop),
        tips: getTips(crop, soilType),
        crop: cropOptions.find(c => c.value === crop)?.label || crop,
        soilType: soilTypeOptions.find(s => s.value === soilType)?.label || soilType,
        area: areaNum
      };

      setResult(calculationResult);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSchedule = (cropType: string): string[] => {
    const schedules: Record<string, string[]> = {
      tomato: [
        "Basal application: 2 weeks before transplanting",
        "First top dressing: 3-4 weeks after transplanting",
        "Second top dressing: 6-8 weeks after transplanting",
        "Final application: At flowering stage"
      ],
      wheat: [
        "Basal application: At sowing time",
        "First top dressing: 25-30 days after sowing",
        "Second top dressing: 50-60 days after sowing",
        "Final application: At boot leaf stage"
      ],
      rice: [
        "Basal application: During final field preparation",
        "First top dressing: 20-25 days after transplanting",
        "Second top dressing: 45-50 days after transplanting",
        "Final application: At panicle initiation stage"
      ]
    };
    return schedules[cropType] || schedules.tomato;
  };

  const getTips = (cropType: string, soil: string): string[] => {
    const tips: Record<string, string[]> = {
      tomato: [
        "Apply fertilizers in split doses for better absorption",
        "Ensure adequate moisture after fertilizer application",
        "Use organic manure along with chemical fertilizers",
        "Monitor plant growth and adjust fertilizer application accordingly"
      ],
      wheat: [
        "Apply fertilizers based on soil test results",
        "Avoid excessive nitrogen application to prevent lodging",
        "Use balanced NPK ratio for better grain quality",
        "Consider micronutrients if deficiency symptoms appear"
      ],
      rice: [
        "Use slow-release nitrogen fertilizers for better efficiency",
        "Apply phosphorus and potassium as basal dose",
        "Consider zinc application in zinc-deficient soils",
        "Manage water level after fertilizer application"
      ]
    };
    return tips[cropType] || tips.tomato;
  };

  const resetForm = () => {
    setCrop("");
    setSoilType("");
    setArea("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-4">
          Fertilizer Calculator
        </h2>
        <p className="text-lg text-blue-600 dark:text-blue-400 max-w-2xl mx-auto">
          Calculate optimal fertilizer requirements for your crops based on soil type and area.
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Crop Information</span>
          </CardTitle>
          <CardDescription>
            Enter your crop details to get personalized fertilizer recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Crop Type</label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Soil Type</label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Area (in acres)</label>
            <Input
              type="number"
              placeholder="Enter area in acres"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              min="0.1"
              step="0.1"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={calculateFertilizer} 
              className="flex-1"
              disabled={!crop || !soilType || !area || loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Fertilizer
                </>
              )}
            </Button>
            
            <Button 
              onClick={resetForm} 
              variant="outline"
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Fertilizer Recommendation</span>
            </CardTitle>
            <CardDescription>
              Personalized fertilizer plan for {result.crop} on {result.area} acres of {result.soilType}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  NPK Ratio
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nitrogen (N)</span>
                    <Badge variant="outline">{result.npkRatio.nitrogen} kg/acre</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Phosphorus (P)</span>
                    <Badge variant="outline">{result.npkRatio.phosphorus} kg/acre</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Potassium (K)</span>
                    <Badge variant="outline">{result.npkRatio.potassium} kg/acre</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center">
                  <Droplets className="w-4 h-4 mr-2" />
                  Total Quantity
                </h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {result.quantity} kg
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For {result.area} acres
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Application Schedule
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{result.schedule.length} applications</p>
                  <p className="text-xs">Split application recommended</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300">
                  Application Schedule
                </h4>
                <div className="space-y-2">
                  {result.schedule.map((schedule, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{schedule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-teal-700 dark:text-teal-300">
                  Pro Tips
                </h4>
                <div className="space-y-2">
                  {result.tips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Important Information
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This recommendation is based on general guidelines. For precise fertilizer application, 
                conduct a soil test and consult with local agricultural experts. Weather conditions, 
                crop variety, and previous cropping history may affect fertilizer requirements.
              </p>
            </div>

            <Button 
              onClick={resetForm} 
              variant="outline" 
              className="w-full"
            >
              Calculate for Another Crop
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This calculator provides general fertilizer recommendations. For commercial farming, 
          always conduct soil tests and consult with agricultural experts.
        </p>
      </div>
    </div>
  );
}