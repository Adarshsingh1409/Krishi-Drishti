import { NextRequest, NextResponse } from 'next/server';

// Mock plant identification data
const plantData = {
  tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    confidence: 0.95,
    description: "Tomato plants are herbaceous perennials grown as annuals. They produce edible fruits that are commonly used in cooking."
  },
  potato: {
    name: "Potato",
    scientificName: "Solanum tuberosum",
    confidence: 0.87,
    description: "Potato plants are starchy tuberous crops that are a staple food in many parts of the world."
  },
  wheat: {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    confidence: 0.92,
    description: "Wheat is a cereal grain that is a worldwide staple food. It is grown in more countries than any other commercial crop."
  },
  rice: {
    name: "Rice",
    scientificName: "Oryza sativa",
    confidence: 0.89,
    description: "Rice is a semi-aquatic cereal grain that thrives in warm, wet conditions. It's a primary food source for over half the world's population."
  },
  corn: {
    name: "Corn/Maize",
    scientificName: "Zea mays",
    confidence: 0.91,
    description: "Corn is a warm-season crop that requires plenty of space and nutrients. It's versatile and can be used for food, feed, and industrial purposes."
  }
};

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would process the image here
    // For now, we'll return a mock response
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get a random plant from the data
    const plants = Object.keys(plantData);
    const randomPlant = plants[Math.floor(Math.random() * plants.length)];
    const result = plantData[randomPlant as keyof typeof plantData];
    
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        detectedAt: new Date().toISOString(),
        model: "plant-model-v1"
      }
    });
    
  } catch (error) {
    console.error('Plant identification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to identify plant',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}