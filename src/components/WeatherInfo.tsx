"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, RefreshCw, Wifi, WifiOff, MapPin } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: {
    date: string;
    temperature: number;
    description: string;
    rainfall: number;
  }[];
  lastUpdated: string;
  isCached: boolean;
}

export default function WeatherInfo() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Load weather data on component mount
  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to load cached data first
      const cachedData = localStorage.getItem('krishi-weather-cache');
      let weatherData: WeatherData | null = null;

      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const cacheTime = new Date(parsed.lastUpdated).getTime();
        const now = new Date().getTime();
        const cacheAge = now - cacheTime;
        
        // Use cached data if less than 1 hour old or offline
        if (cacheAge < 3600000 || !isOnline) {
          weatherData = { ...parsed, isCached: true };
        }
      }

      // Fetch fresh data if online
      if (isOnline) {
        try {
          // Simulate API call - replace with actual OpenWeather API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock weather data
          const freshData: WeatherData = {
            location: "New Delhi, India",
            temperature: 28,
            humidity: 65,
            rainfall: 2.5,
            windSpeed: 12,
            description: "Partly cloudy",
            icon: "partly-cloudy",
            forecast: [
              { date: "Today", temperature: 28, description: "Partly cloudy", rainfall: 2.5 },
              { date: "Tomorrow", temperature: 30, description: "Sunny", rainfall: 0 },
              { date: "Day 3", temperature: 27, description: "Light rain", rainfall: 8 },
              { date: "Day 4", temperature: 29, description: "Clear", rainfall: 0 },
              { date: "Day 5", temperature: 31, description: "Sunny", rainfall: 0 }
            ],
            lastUpdated: new Date().toISOString(),
            isCached: false
          };

          // Cache the fresh data
          localStorage.setItem('krishi-weather-cache', JSON.stringify(freshData));
          weatherData = freshData;
        } catch (apiError) {
          console.error('API error:', apiError);
          if (!weatherData) {
            throw new Error('Failed to fetch weather data and no cached data available');
          }
        }
      }

      if (weatherData) {
        setWeather(weatherData);
      } else {
        throw new Error('No weather data available');
      }

    } catch (err) {
      setError('Failed to load weather data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return 'text-blue-600';
    if (temp < 20) return 'text-green-600';
    if (temp < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-800 dark:text-cyan-200 mb-4">
          Weather Information
        </h2>
        <p className="text-lg text-cyan-600 dark:text-cyan-400 max-w-2xl mx-auto">
          Get current weather conditions and forecasts for your farming area.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-2 mb-6">
        <Badge variant={isOnline ? "default" : "secondary"}>
          {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
          {isOnline ? "Online" : "Offline"}
        </Badge>
        
        <Button 
          onClick={loadWeatherData} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {isOnline ? "Fetching weather data..." : "Loading cached weather data..."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <Cloud className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {weather && (
        <div className="space-y-6">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                  <span>{weather.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {weather.isCached && (
                    <Badge variant="outline">Cached Data</Badge>
                  )}
                  <Badge variant={isOnline ? "default" : "secondary"}>
                    {isOnline ? "Live" : "Offline"}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Last updated: {formatDate(weather.lastUpdated)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {getWeatherIcon(weather.icon)}
                  </div>
                  <div className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                    {weather.temperature}°C
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                  <p className="text-xs text-gray-500 mt-1">{weather.description}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="text-3xl font-bold text-cyan-600">
                    {weather.humidity}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <CloudRain className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {weather.rainfall}mm
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rainfall</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Wind className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {weather.windSpeed}km/h
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
              <CardDescription>
                Weather forecast for the next 5 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium text-sm mb-2">{day.date}</div>
                    <div className="flex items-center justify-center mb-2">
                      {getWeatherIcon(day.description.toLowerCase().replace(' ', '-'))}
                    </div>
                    <div className={`text-lg font-semibold ${getTemperatureColor(day.temperature)}`}>
                      {day.temperature}°C
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {day.description}
                    </p>
                    <div className="flex items-center justify-center text-xs text-blue-600">
                      <CloudRain className="w-3 h-3 mr-1" />
                      {day.rainfall}mm
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Farming Recommendations</CardTitle>
              <CardDescription>
                Weather-based farming suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 dark:text-green-300">
                    Today's Recommendations
                  </h4>
                  <div className="space-y-2">
                    {weather.rainfall > 5 ? (
                      <div className="flex items-start">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Heavy rainfall expected - postpone irrigation and field activities
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Good conditions for field work and light irrigation
                        </p>
                      </div>
                    )}
                    
                    {weather.humidity > 70 ? (
                      <div className="flex items-start">
                        <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          High humidity - monitor for fungal diseases
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Moderate humidity - good conditions for plant growth
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                    General Tips
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Check weather forecast before planning field activities
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Adjust irrigation based on rainfall predictions
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Monitor pest activity during humid conditions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Weather data is cached for offline use. Lasts for 1 hour when online, 
          available indefinitely when offline. For most accurate data, ensure 
          location services are enabled.
        </p>
      </div>
    </div>
  );
}