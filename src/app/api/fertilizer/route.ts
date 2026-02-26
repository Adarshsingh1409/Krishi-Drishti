import { NextRequest, NextResponse } from 'next/server';

// Mock fertilizer recommendation data
const fertilizerData = {
  tomato: {
    clay: { nitrogen: 120, phosphorus: 80, potassium: 100, baseQty: 2.5 },
    sandy: { nitrogen: 150, phosphorus: 100, potassium: 120, baseQty: 3.0 },
    loamy: { nitrogen: 100, phosphorus: 70, potassium: 90, baseQty: 2.2 },
    silt: { nitrogen: 110, phosphorus: 75, potassium: 95, baseQty: 2.3 },
    peat: { nitrogen: 80, phosphorus: 60, potassium: 80, baseQty: 2.0 },
    chalk: { nitrogen: 140, phosphorus: 90, potassium: 110, baseQty: 2.8 }
  },
  wheat: {
    clay: { nitrogen: 100, phosphorus: 60, potassium: 80, baseQty: 2.0 },
    sandy: { nitrogen: 120, phosphorus: 80, potassium: 100, baseQty: 2.5 },
    loamy: { nitrogen: 90, phosphorus: 50, potassium: 70, baseQty: 1.8 },
    silt: { nitrogen: 95, phosphorus: 55, potassium: 75, baseQty: 1.9 },
    peat: { nitrogen: 70, phosphorus: 40, potassium: 60, baseQty: 1.5 },
    chalk: { nitrogen: 110, phosphorus: 70, potassium: 90, baseQty: 2.2 }
  },
  rice: {
    clay: { nitrogen: 80, phosphorus: 40, potassium: 60, baseQty: 1.5 },
    sandy: { nitrogen: 100, phosphorus: 60, potassium: 80, baseQty: 2.0 },
    loamy: { nitrogen: 70, phosphorus: 35, potassium: 55, baseQty: 1.3 },
    silt: { nitrogen: 75, phosphorus: 38, potassium: 58, baseQty: 1.4 },
    peat: { nitrogen: 60, phosphorus: 30, potassium: 50, baseQty: 1.2 },
    chalk: { nitrogen: 90, phosphorus: 50, potassium: 70, baseQty: 1.8 }
  },
  corn: {
    clay: { nitrogen: 160, phosphorus: 90, potassium: 120, baseQty: 3.2 },
    sandy: { nitrogen: 180, phosphorus: 110, potassium: 140, baseQty: 3.5 },
    loamy: { nitrogen: 140, phosphorus: 80, potassium: 110, baseQty: 3.0 },
    silt: { nitrogen: 150, phosphorus: 85, potassium: 115, baseQty: 3.1 },
    peat: { nitrogen: 120, phosphorus: 70, potassium: 100, baseQty: 2.8 },
    chalk: { nitrogen: 170, phosphorus: 100, potassium: 130, baseQty: 3.4 }
  },
  potato: {
    clay: { nitrogen: 130, phosphorus: 100, potassium: 160, baseQty: 2.8 },
    sandy: { nitrogen: 150, phosphorus: 120, potassium: 180, baseQty: 3.2 },
    loamy: { nitrogen: 120, phosphorus: 90, potassium: 150, baseQty: 2.6 },
    silt: { nitrogen: 125, phosphorus: 95, potassium: 155, baseQty: 2.7 },
    peat: { nitrogen: 110, phosphorus: 80, potassium: 140, baseQty: 2.4 },
    chalk: { nitrogen: 140, phosphorus: 110, potassium: 170, baseQty: 3.0 }
  },
  cotton: {
    clay: { nitrogen: 110, phosphorus: 70, potassium: 90, baseQty: 2.4 },
    sandy: { nitrogen: 130, phosphorus: 90, potassium: 110, baseQty: 2.8 },
    loamy: { nitrogen: 100, phosphorus: 60, potassium: 80, baseQty: 2.2 },
    silt: { nitrogen: 105, phosphorus: 65, potassium: 85, baseQty: 2.3 },
    peat: { nitrogen: 90, phosphorus: 50, potassium: 70, baseQty: 2.0 },
    chalk: { nitrogen: 120, phosphorus: 80, potassium: 100, baseQty: 2.6 }
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
    ],
    corn: [
      "Basal application: At planting",
      "First top dressing: When plants are 8-10 inches tall",
      "Second top dressing: At tasseling stage",
      "Final application: At silking stage"
    ],
    potato: [
      "Basal application: At planting",
      "First top dressing: 30 days after planting",
      "Second top dressing: 60 days after planting",
      "Final application: 90 days after planting"
    ],
    cotton: [
      "Basal application: At planting",
      "First top dressing: 30 days after planting",
      "Second top dressing: 60 days after planting",
      "Final application: At square formation stage"
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
    ],
    corn: [
      "Side-dress with nitrogen when plants are knee-high",
      "Apply fertilizers in bands for better efficiency",
      "Consider sulfur application in sulfur-deficient soils",
      "Monitor for nutrient deficiencies during rapid growth"
    ],
    potato: [
      "Avoid excessive nitrogen to prevent lush foliage",
      "Ensure adequate potassium for tuber development",
      "Apply fertilizers in hills rather than broadcast",
      "Monitor for specific nutrient deficiencies"
    ],
    cotton: [
      "Apply nitrogen in split doses to prevent vegetative growth",
      "Ensure adequate potassium for boll development",
      "Consider boron application in boron-deficient soils",
      "Time fertilizer applications with growth stages"
    ]
  };
  return tips[cropType] || tips.tomato;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop')?.toLowerCase();
    const soilType = searchParams.get('soilType')?.toLowerCase();
    const area = searchParams.get('area');

    if (!crop || !soilType || !area) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters',
          message: 'crop, soilType, and area are required'
        },
        { status: 400 }
      );
    }

    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid area',
          message: 'area must be a positive number'
        },
        { status: 400 }
      );
    }

    // Get fertilizer data
    const cropData = fertilizerData[crop as keyof typeof fertilizerData];
    if (!cropData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid crop',
          message: `Crop '${crop}' not supported`
        },
        { status: 400 }
      );
    }

    const soilData = cropData[soilType as keyof typeof cropData];
    if (!soilData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid soil type',
          message: `Soil type '${soilType}' not supported`
        },
        { status: 400 }
      );
    }

    // Calculate recommendation
    const recommendation = {
      npkRatio: {
        nitrogen: soilData.nitrogen,
        phosphorus: soilData.phosphorus,
        potassium: soilData.potassium
      },
      quantity: Math.round(soilData.baseQty * areaNum * 100) / 100,
      schedule: getSchedule(crop),
      tips: getTips(crop, soilType),
      crop: crop.charAt(0).toUpperCase() + crop.slice(1),
      soilType: soilType.charAt(0).toUpperCase() + soilType.slice(1),
      area: areaNum,
      calculatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Fertilizer calculation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate fertilizer recommendation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}