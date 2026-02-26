import { NextRequest, NextResponse } from 'next/server';

// Mock weather data
const weatherLocations = {
  "new delhi": {
    location: "New Delhi, India",
    temperature: 28,
    humidity: 65,
    rainfall: 2.5,
    windSpeed: 12,
    description: "Partly cloudy",
    icon: "partly-cloudy"
  },
  "mumbai": {
    location: "Mumbai, India",
    temperature: 32,
    humidity: 78,
    rainfall: 0,
    windSpeed: 8,
    description: "Sunny",
    icon: "sunny"
  },
  "bangalore": {
    location: "Bangalore, India",
    temperature: 25,
    humidity: 58,
    rainfall: 5.2,
    windSpeed: 6,
    description: "Light rain",
    icon: "rainy"
  },
  "kolkata": {
    location: "Kolkata, India",
    temperature: 30,
    humidity: 82,
    rainfall: 8.7,
    windSpeed: 10,
    description: "Cloudy",
    icon: "cloudy"
  },
  "chennai": {
    location: "Chennai, India",
    temperature: 35,
    humidity: 70,
    rainfall: 0,
    windSpeed: 14,
    description: "Sunny",
    icon: "sunny"
  }
};

const getForecast = (baseTemp: number, baseRainfall: number) => {
  const forecast = [];
  const descriptions = ["Sunny", "Partly cloudy", "Cloudy", "Light rain", "Clear"];
  
  for (let i = 0; i < 5; i++) {
    const tempVariation = Math.random() * 6 - 3; // ±3 degrees
    const rainVariation = Math.random() * 10 - 5; // ±5mm
    
    forecast.push({
      date: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `Day ${i + 1}`,
      temperature: Math.round(baseTemp + tempVariation),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      rainfall: Math.max(0, Math.round(baseRainfall + rainVariation * 10) / 10)
    });
  }
  
  return forecast;
};

const getRecommendations = (weather: any) => {
  const recommendations = [];
  
  if (weather.rainfall > 5) {
    recommendations.push({
      type: "warning",
      message: "Heavy rainfall expected - postpone irrigation and field activities"
    });
  } else {
    recommendations.push({
      type: "info",
      message: "Good conditions for field work and light irrigation"
    });
  }
  
  if (weather.humidity > 70) {
    recommendations.push({
      type: "warning",
      message: "High humidity - monitor for fungal diseases"
    });
  } else {
    recommendations.push({
      type: "info",
      message: "Moderate humidity - good conditions for plant growth"
    });
  }
  
  if (weather.temperature > 35) {
    recommendations.push({
      type: "warning",
      message: "High temperature - ensure adequate irrigation and shade for sensitive crops"
    });
  } else if (weather.temperature < 15) {
    recommendations.push({
      type: "warning",
      message: "Low temperature - protect sensitive crops from frost"
    });
  }
  
  return recommendations;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location')?.toLowerCase() || 'new delhi';
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get weather data for location or use default
    let weatherData = weatherLocations[location as keyof typeof weatherLocations];
    
    if (!weatherData) {
      // If location not found, use default with slight variations
      weatherData = {
        ...weatherLocations["new delhi"],
        location: location.charAt(0).toUpperCase() + location.slice(1),
        temperature: weatherLocations["new delhi"].temperature + Math.floor(Math.random() * 10 - 5),
        humidity: weatherLocations["new delhi"].humidity + Math.floor(Math.random() * 20 - 10),
        rainfall: Math.max(0, weatherLocations["new delhi"].rainfall + Math.random() * 10 - 5),
        windSpeed: weatherLocations["new delhi"].windSpeed + Math.floor(Math.random() * 6 - 3)
      };
    }

    // Generate forecast
    const forecast = getForecast(weatherData.temperature, weatherData.rainfall);
    
    // Get recommendations
    const recommendations = getRecommendations(weatherData);

    const response = {
      ...weatherData,
      forecast,
      recommendations,
      coordinates: lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : null,
      requestedAt: new Date().toISOString(),
      source: "Mock Weather API (Replace with real OpenWeather API)"
    };

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch weather data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}