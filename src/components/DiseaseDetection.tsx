"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bug, Loader2, CheckCircle, AlertTriangle, Wifi, WifiOff, Shield } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface DiseaseResult {
  name: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

export default function DiseaseDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [useOnlineMode, setUseOnlineMode] = useState(navigator.onLine);

  // Handle online/offline status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const handleImageCapture = async (imageData: string) => {
    await processImage(imageData);
  };

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      await processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate disease detection - replace with actual API call or local model inference
      await new Promise(resolve => setTimeout(resolve, useOnlineMode ? 3000 : 2500));
      
      // Mock results based on online/offline mode
      const mockResults: DiseaseResult[] = [
        {
          name: "Tomato Blight",
          confidence: useOnlineMode ? 0.96 : 0.88,
          symptoms: [
            "Dark spots on leaves",
            "Yellowing of foliage",
            "White fungal growth on undersides",
            "Leaf curling and wilting"
          ],
          treatment: [
            "Remove infected leaves immediately",
            "Apply copper-based fungicide",
            "Improve air circulation around plants",
            "Avoid overhead watering"
          ],
          prevention: [
            "Crop rotation every 2-3 years",
            "Use disease-resistant varieties",
            "Maintain proper plant spacing",
            "Water at base of plants"
          ],
          severity: 'high'
        },
        {
          name: "Wheat Rust",
          confidence: useOnlineMode ? 0.93 : 0.85,
          symptoms: [
            "Reddish-brown pustules on leaves",
            "Yellow streaks on foliage",
            "Reduced plant growth",
            "Premature leaf death"
          ],
          treatment: [
            "Apply fungicide at first sign",
            "Remove infected plant material",
            "Balance soil nutrients",
            "Monitor weather conditions"
          ],
          prevention: [
            "Plant resistant varieties",
            "Adjust planting timing",
            "Monitor weather for infection periods",
            "Practice field sanitation"
          ],
          severity: 'medium'
        },
        {
          name: "Powdery Mildew",
          confidence: useOnlineMode ? 0.89 : 0.82,
          symptoms: [
            "White powdery coating on leaves",
            "Leaf distortion",
            "Yellowing and premature drop",
            "Stunted growth"
          ],
          treatment: [
            "Apply neem oil or sulfur spray",
            "Improve air circulation",
            "Reduce humidity around plants",
            "Remove affected leaves"
          ],
          prevention: [
            "Ensure proper plant spacing",
            "Water in morning only",
            "Choose resistant varieties",
            "Maintain good garden hygiene"
          ],
          severity: 'low'
        }
      ];

      // Randomly select a result for demonstration
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);

    } catch (err) {
      setError('Failed to detect disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-4">
          Disease Detection
        </h2>
        <p className="text-lg text-red-600 dark:text-red-400 max-w-2xl mx-auto">
          Detect crop diseases and get treatment recommendations. Works offline with local models.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <Badge variant={isOnline ? "default" : "secondary"}>
          {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
          {isOnline ? "Online" : "Offline"}
        </Badge>
        
        {isOnline && (
          <div className="flex items-center space-x-2">
            <Badge variant={useOnlineMode ? "default" : "outline"}>
              Online Mode
            </Badge>
            <Badge variant={useOnlineMode ? "outline" : "default"}>
              Offline Mode
            </Badge>
          </div>
        )}
        
        <Badge variant="outline">AI-Powered</Badge>
      </div>

      {isOnline && (
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            onClick={() => setUseOnlineMode(true)}
            variant={useOnlineMode ? "default" : "outline"}
            disabled={!isOnline}
          >
            <Wifi className="w-4 h-4 mr-2" />
            Use Online Model (More Accurate)
          </Button>
          <Button
            onClick={() => setUseOnlineMode(false)}
            variant={useOnlineMode ? "outline" : "default"}
          >
            <WifiOff className="w-4 h-4 mr-2" />
            Use Offline Model (Works Without Internet)
          </Button>
        </div>
      )}

      <ImageUpload
        onImageCapture={handleImageCapture}
        onImageUpload={handleImageUpload}
        loading={loading}
        title="Detect Disease"
        description="Capture or upload a leaf image for disease detection"
      />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Disease Detected</span>
            </CardTitle>
            <CardDescription>
              {useOnlineMode ? "Online analysis result" : "Offline analysis result"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {result.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getSeverityColor(result.severity)}>
                    {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {Math.round(result.confidence * 100)}% confidence
                  </Badge>
                </div>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700 dark:text-red-300 flex items-center">
                  <Bug className="w-4 h-4 mr-2" />
                  Symptoms
                </h4>
                <ul className="space-y-1">
                  {result.symptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Treatment
                </h4>
                <ul className="space-y-1">
                  {result.treatment.map((treatment, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Prevention
                </h4>
                <ul className="space-y-1">
                  {result.prevention.map((prevention, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {prevention}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Important Notice
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is an AI-powered detection system. For severe infections or commercial crops, 
                please consult with agricultural experts or local extension services for confirmation 
                and treatment recommendations.
              </p>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              variant="outline" 
              className="w-full"
            >
              Detect Another Disease
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          {useOnlineMode 
            ? "Using online model for higher accuracy. Requires internet connection."
            : "Using offline model. Works without internet but may have lower accuracy."
          }
        </p>
        <p className="mt-1">
          For best results, capture clear images of affected leaves with good lighting.
        </p>
      </div>
    </div>
  );
}