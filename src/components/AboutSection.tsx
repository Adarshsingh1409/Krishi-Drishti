"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Smartphone, Wifi, WifiOff, Shield, Zap, Users, Award } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "AI-Powered",
      description: "Advanced machine learning models for accurate plant identification and disease detection"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      title: "PWA Enabled",
      description: "Works as a progressive web app - installable and works offline"
    },
    {
      icon: <WifiOff className="w-6 h-6 text-orange-600" />,
      title: "Offline Ready",
      description: "Core functionality works without internet connection using local models"
    },
    {
      icon: <Wifi className="w-6 h-6 text-cyan-600" />,
      title: "Online Enhanced",
      description: "When online, get enhanced accuracy with cloud-based AI models"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Privacy Focused",
      description: "Your data stays local - no cloud storage required for basic features"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Fast & Lightweight",
      description: "Optimized for performance and minimal data usage"
    }
  ];

  const capabilities = [
    {
      title: "Plant Identification",
      description: "Identify various plant species using AI-powered image recognition",
      tech: ["TensorFlow.js", "Computer Vision", "Local Models"]
    },
    {
      title: "Disease Detection",
      description: "Detect crop diseases with treatment recommendations",
      tech: ["ML Models", "PlantDoc Dataset", "Roboflow Data"]
    },
    {
      title: "Fertilizer Calculator",
      description: "Calculate optimal fertilizer requirements based on crop and soil",
      tech: ["Smart Algorithms", "Crop Database", "Soil Analysis"]
    },
    {
      title: "Weather Integration",
      description: "Get weather updates with offline caching",
      tech: ["Weather API", "Local Caching", "Forecast Analysis"]
    },
    {
      title: "Voice Assistant",
      description: "Control the app with voice commands in English and Hindi",
      tech: ["Web Speech API", "NLP", "Multi-language"]
    },
    {
      title: "Cultivation Tips",
      description: "Expert farming guidance and best practices",
      tech: ["Agricultural DB", "Expert Knowledge", "Local Storage"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
          About Krishi Drishti
        </h2>
        <p className="text-lg text-green-600 dark:text-green-400 max-w-3xl mx-auto">
          Krishi Drishti is a comprehensive AI-powered agricultural assistant designed to help farmers 
          with plant identification, disease detection, fertilizer calculation, and expert farming guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <span>Made for Farmers</span>
          </CardTitle>
          <CardDescription>
            Designed specifically for the needs of farmers in rural and semi-urban areas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                Key Benefits
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Works offline - no internet required for core features
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Supports voice commands in multiple languages
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Easy-to-use interface designed for all users
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Saves money on expert consultations
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                Technical Highlights
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Built with Next.js 15 and TypeScript
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    TensorFlow.js for on-device machine learning
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Progressive Web App (PWA) technology
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Local storage for offline data persistence
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-purple-800 dark:text-purple-200">
          Core Capabilities
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{capability.title}</CardTitle>
                <CardDescription>{capability.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Technology Stack:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {capability.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Recognition & Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Farmers Helped</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plant Species</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">25+</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diseases Detected</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Our Mission
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              To empower farmers with accessible, affordable, and accurate agricultural technology 
              that improves crop yields, reduces losses, and promotes sustainable farming practices.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Version Information
        </h3>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">Krishi Drishti v1.0</Badge>
          <Badge variant="outline">PWA Enabled</Badge>
          <Badge variant="outline">Offline Ready</Badge>
          <Badge variant="outline">Multi-language</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Built with ❤️ for farmers using cutting-edge web technologies and machine learning. 
          This application is continuously improving with regular updates and new features.
        </p>
      </div>
    </div>
  );
}