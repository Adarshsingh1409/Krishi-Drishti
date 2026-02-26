import { NextRequest, NextResponse } from 'next/server';

// Mock disease detection data
const diseaseData = {
  "Tomato Blight": {
    name: "Tomato Blight",
    confidence: 0.96,
    severity: "high",
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
    ]
  },
  "Wheat Rust": {
    name: "Wheat Rust",
    confidence: 0.93,
    severity: "medium",
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
    ]
  },
  "Powdery Mildew": {
    name: "Powdery Mildew",
    confidence: 0.89,
    severity: "low",
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
    ]
  },
  "Leaf Spot": {
    name: "Leaf Spot",
    confidence: 0.87,
    severity: "medium",
    symptoms: [
      "Brown or black spots on leaves",
      "Yellowing around spots",
      "Leaf drop in severe cases",
      "Reduced plant vigor"
    ],
    treatment: [
      "Remove infected leaves",
      "Apply appropriate fungicide",
      "Improve air circulation",
      "Avoid overhead watering"
    ],
    prevention: [
      "Crop rotation",
      "Resistant varieties",
      "Proper sanitation",
      "Balanced fertilization"
    ]
  }
};

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would process the image here using ML models
    // For now, we'll return a mock response
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get a random disease from the data
    const diseases = Object.keys(diseaseData);
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const result = diseaseData[randomDisease as keyof typeof diseaseData];
    
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        detectedAt: new Date().toISOString(),
        model: "disease-model-v1",
        datasets: ["PlantDoc Dataset", "Roboflow Public Datasets"]
      }
    });
    
  } catch (error) {
    console.error('Disease detection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to detect disease',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}