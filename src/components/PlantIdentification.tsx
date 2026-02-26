"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Loader2, CheckCircle, AlertTriangle, Info, Wifi, WifiOff } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { offlineManager } from "@/lib/offlineManager";

interface PlantResult {
  name: string;
  confidence: number;
  scientificName?: string;
  description?: string;
  timestamp?: number;
  isOffline?: boolean;
}

export default function PlantIdentification() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlantResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to true initially
  const [offlineResults, setOfflineResults] = useState<PlantResult[]>([]);

  // Handle online/offline status
  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline results on mount
  useEffect(() => {
    loadOfflineResults();
  }, []);

  const loadOfflineResults = async () => {
    try {
      const results = await offlineManager.getCachedData('recent_plant_identifications') || [];
      setOfflineResults(results);
    } catch (error) {
      console.error('Failed to load offline results:', error);
    }
  };

  const loadModel = async () => {
    try {
      // Simulate model loading - in real implementation, load TensorFlow.js model
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModelLoaded(true);
    } catch (err) {
      setError('Failed to load plant identification model');
    }
  };

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
      if (!modelLoaded) {
        await loadModel();
      }

      // Simulate plant identification - replace with actual TensorFlow.js inference
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - in real implementation, this would come from the model
      const mockResults: PlantResult[] = [
        {
          name: "Tomato",
          confidence: 0.95,
          scientificName: "Solanum lycopersicum",
          description: "Tomato plants are herbaceous perennials grown as annuals. They produce edible fruits that are commonly used in cooking."
        },
        {
          name: "Potato",
          confidence: 0.87,
          scientificName: "Solanum tuberosum",
          description: "Potato plants are starchy tuberous crops that are a staple food in many parts of the world."
        },
        {
          name: "Wheat",
          confidence: 0.92,
          scientificName: "Triticum aestivum",
          description: "Wheat is a cereal grain that is a worldwide staple food. It is grown in more countries than any other commercial crop."
        }
      ];

      // Randomly select a result for demonstration
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      const resultWithMetadata: PlantResult = {
        ...randomResult,
        timestamp: Date.now(),
        isOffline: !isOnline
      };

      setResult(resultWithMetadata);

      // Save to offline storage
      if (isOnline) {
        try {
          await offlineManager.queueOperation('plant_identification', {
            imageData,
            result: resultWithMetadata
          });
        } catch (error) {
          console.error('Failed to queue operation:', error);
        }
      }

      // Update recent results cache
      const updatedResults = [resultWithMetadata, ...offlineResults.slice(0, 9)];
      setOfflineResults(updatedResults);
      await offlineManager.cacheData('recent_plant_identifications', updatedResults, 86400000); // 24 hours

    } catch (err) {
      setError('Failed to identify plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineData = async () => {
    try {
      await offlineManager.syncPendingOperations();
      await loadOfflineResults(); // Refresh the results
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
          Plant Identification
        </h2>
        <p className="text-lg text-green-600 dark:text-green-400 max-w-2xl mx-auto">
          Identify plant species using AI-powered image recognition. Works offline with local models.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-2 mb-6">
        <Badge variant={modelLoaded ? "default" : "secondary"}>
          {modelLoaded ? "Model Ready" : "Model Loading..."}
        </Badge>
        <Badge variant={isOnline ? "default" : "secondary"}>
          {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
          {isOnline ? "Online" : "Offline"}
        </Badge>
        <Badge variant="outline">Offline Capable</Badge>
        
        {!isOnline && offlineResults.length > 0 && (
          <Button onClick={syncOfflineData} variant="outline" size="sm">
            Sync Data
          </Button>
        )}
      </div>

      <ImageUpload
        onImageCapture={handleImageCapture}
        onImageUpload={handleImageUpload}
        loading={loading}
        title="Identify Plant"
        description="Capture or upload a plant image for identification"
      />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Plant Identified</span>
              {result.isOffline && (
                <Badge variant="secondary">Offline Mode</Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-powered plant identification result
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {result.name}
                </h3>
                {result.scientificName && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {result.scientificName}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="text-sm">
                {Math.round(result.confidence * 100)}% confidence
              </Badge>
            </div>

            {result.description && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Description</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {result.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  Growing Tips
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Ensure proper sunlight exposure</li>
                  <li>• Maintain consistent watering</li>
                  <li>• Use well-draining soil</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Care Instructions
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Monitor for pests regularly</li>
                  <li>• Apply appropriate fertilizers</li>
                  <li>• Prune as needed for growth</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              variant="outline" 
              className="w-full"
            >
              Identify Another Plant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Results Section */}
      {offlineResults.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Recent Identifications</CardTitle>
            <CardDescription>
              Your recent plant identification results (stored offline)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offlineResults.slice(0, 6).map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800 dark:text-green-200">
                      {item.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(item.confidence * 100)}%
                    </Badge>
                  </div>
                  {item.scientificName && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-2">
                      {item.scientificName}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.isOffline ? 'Offline' : 'Online'}</span>
                    <span>
                      {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This feature uses local machine learning models and works offline. 
          For best results, ensure clear lighting and focus on the plant's leaves.
          {!isOnline && ' You are currently in offline mode - results will be synced when online.'}
        </p>
      </div>
    </div>
  );
}