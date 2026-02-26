"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Leaf, Bug, Calculator, BookOpen, Cloud, Mic, Home, Info, Smartphone } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import PlantIdentification from "@/components/PlantIdentification";
import DiseaseDetection from "@/components/DiseaseDetection";
import FertilizerCalculator from "@/components/FertilizerCalculator";
import CultivationTips from "@/components/CultivationTips";
import WeatherInfo from "@/components/WeatherInfo";
import VoiceAssistant from "@/components/VoiceAssistant";
import AboutSection from "@/components/AboutSection";
import PWATester from "@/components/PWATester";

export default function KrishiDrishti() {
  const [activeTab, setActiveTab] = useState("home");
  const [isOnline, setIsOnline] = useState(true); // Default to true initially

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">कृषि दृष्टि</h1>
                <p className="text-sm text-green-600 dark:text-green-400">Krishi Drishti</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <VoiceAssistant />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:flex lg:flex-wrap lg:justify-center gap-2 mb-8">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="plant" className="flex items-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">Identify Plant</span>
            </TabsTrigger>
            <TabsTrigger value="disease" className="flex items-center space-x-2">
              <Bug className="w-4 h-4" />
              <span className="hidden sm:inline">Detect Disease</span>
            </TabsTrigger>
            <TabsTrigger value="fertilizer" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Fertilizer</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Tips</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center space-x-2">
              <Cloud className="w-4 h-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="pwa" className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">PWA Test</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-green-800 dark:text-green-200 mb-4">
                Welcome to Krishi Drishti
              </h2>
              <p className="text-lg text-green-600 dark:text-green-400 max-w-2xl mx-auto">
                Your AI-powered agricultural assistant for plant identification, disease detection, 
                fertilizer calculation, and farming guidance - works offline!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("plant")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-6 h-6 text-green-600" />
                    <span>Plant Identification</span>
                  </CardTitle>
                  <CardDescription>
                    Identify plant species using AI-powered image recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("disease")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bug className="w-6 h-6 text-red-600" />
                    <span>Disease Detection</span>
                  </CardTitle>
                  <CardDescription>
                    Detect crop diseases and get treatment recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    <Bug className="w-12 h-12 text-red-600 dark:text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("fertilizer")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-6 h-6 text-blue-600" />
                    <span>Fertilizer Calculator</span>
                  </CardTitle>
                  <CardDescription>
                    Calculate optimal fertilizer requirements for your crops
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Calculator className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("tips")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    <span>Cultivation Tips</span>
                  </CardTitle>
                  <CardDescription>
                    Get expert farming tips and best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("weather")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="w-6 h-6 text-cyan-600" />
                    <span>Weather Information</span>
                  </CardTitle>
                  <CardDescription>
                    Get weather updates and forecasts for your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                    <Cloud className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mic className="w-6 h-6 text-orange-600" />
                    <span>Voice Assistant</span>
                  </CardTitle>
                  <CardDescription>
                    Use voice commands to interact with the app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Mic className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plant">
            <PlantIdentification />
          </TabsContent>

          <TabsContent value="disease">
            <DiseaseDetection />
          </TabsContent>

          <TabsContent value="fertilizer">
            <FertilizerCalculator />
          </TabsContent>

          <TabsContent value="tips">
            <CultivationTips />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherInfo />
          </TabsContent>

          <TabsContent value="pwa">
            <PWATester />
          </TabsContent>

          <TabsContent value="about">
            <AboutSection />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-green-200 dark:border-green-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-green-800 dark:text-green-200 font-semibold">Krishi Drishti v1.0</p>
              <p className="text-sm text-green-600 dark:text-green-400">AI-powered farming assistant</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-green-600 dark:text-green-400">
                Works offline • PWA Enabled • Made with ❤️ for farmers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}