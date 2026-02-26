import { NextRequest, NextResponse } from 'next/server';

// Mock cultivation tips data
const cultivationData = {
  tomato: {
    crop: "Tomato",
    overview: "Tomatoes are warm-season crops that require plenty of sunlight and well-drained soil. They are versatile and can be grown in various climates.",
    planting: {
      season: "Spring to early summer",
      spacing: "24-36 inches between plants, 36-48 inches between rows",
      depth: "1/4 inch deep for seeds, deeper for seedlings",
      method: "Start seeds indoors 6-8 weeks before last frost, transplant after danger of frost has passed"
    },
    care: {
      watering: "Water deeply 1-2 times per week, avoid overhead watering to prevent disease",
      sunlight: "Full sun (6-8 hours daily)",
      temperature: "70-85°F (21-29°C) during day, above 55°F (13°C) at night",
      fertilization: "Apply balanced fertilizer at planting, side-dress with nitrogen when fruits begin to form"
    },
    harvest: {
      duration: "65-90 days from transplanting",
      signs: ["Firm but slightly soft when gently squeezed", "Full color development", "Easy separation from vine"],
      method: "Twist and pull gently, or use pruning shears for tough stems"
    },
    pests: {
      common: ["Aphids", "Tomato hornworm", "Whiteflies", "Spider mites"],
      prevention: ["Use row covers", "Plant companion plants like marigolds", "Regular monitoring", "Organic pesticides"]
    },
    tips: [
      "Mulch around plants to retain moisture and control weeds",
      "Provide support with stakes or cages for indeterminate varieties",
      "Prune suckers to improve air circulation and fruit production",
      "Rotate crops annually to prevent soil-borne diseases"
    ]
  },
  wheat: {
    crop: "Wheat",
    overview: "Wheat is a cool-season cereal grain that is a staple food worldwide. It's relatively easy to grow and adaptable to various soil types.",
    planting: {
      season: "Fall for winter wheat, early spring for spring wheat",
      spacing: "1-2 inches between seeds, 6-8 inches between rows",
      depth: "1-1.5 inches deep",
      method: "Broadcast or drill seeds into prepared seedbed"
    },
    care: {
      watering: "Moderate water needs, drought-tolerant once established",
      sunlight: "Full sun (6-8 hours daily)",
      temperature: "60-75°F (15-24°C) optimal, can tolerate light frost",
      fertilization: "Apply nitrogen fertilizer at planting and during tillering stage"
    },
    harvest: {
      duration: "90-120 days for spring wheat, 120-150 days for winter wheat",
      signs: ["Golden brown color", "Hard kernels", "Dry stalks", "Grain moisture below 15%"],
      method: "Combine harvesting when grain is fully mature and dry"
    },
    pests: {
      common: ["Aphids", "Hessian fly", "Wheat stem sawfly", "Rust diseases"],
      prevention: ["Crop rotation", "Resistant varieties", "Proper planting timing", "Scout regularly"]
    },
    tips: [
      "Test soil pH and adjust to 6.0-7.0 for optimal growth",
      "Control weeds in early growth stages",
      "Monitor for diseases during wet periods",
      "Store harvested grain in cool, dry conditions"
    ]
  },
  rice: {
    crop: "Rice",
    overview: "Rice is a semi-aquatic cereal grain that thrives in warm, wet conditions. It's a primary food source for over half the world's population.",
    planting: {
      season: "Late spring to early summer",
      spacing: "6-12 inches between plants, 12-18 inches between rows",
      depth: "1/2-1 inch deep",
      method: "Transplant seedlings or direct seed into flooded fields"
    },
    care: {
      watering: "Maintain 2-4 inches of water during growing season, drain before harvest",
      sunlight: "Full sun (6-8 hours daily)",
      temperature: "70-95°F (21-35°C) optimal, sensitive to frost",
      fertilization: "Apply nitrogen in split doses, phosphorus and potassium as basal dose"
    },
    harvest: {
      duration: "90-150 days depending on variety",
      signs: ["Golden yellow panicles", "Hard grains", "Lower leaves drying", "Moisture content 20-22%"],
      method: "Harvest when grains are mature, thresh and dry to 12-14% moisture"
    },
    pests: {
      common: ["Rice blast", "Stem borers", "Leaf folders", "Brown plant hopper"],
      prevention: ["Resistant varieties", "Proper water management", "Balanced fertilization", "Biological control"]
    },
    tips: [
      "Maintain proper water levels throughout growth stages",
      "Use integrated pest management practices",
      "Apply fertilizers based on soil test results",
      "Ensure proper drainage to prevent root diseases"
    ]
  },
  corn: {
    crop: "Corn/Maize",
    overview: "Corn is a warm-season crop that requires plenty of space and nutrients. It's versatile and can be used for food, feed, and industrial purposes.",
    planting: {
      season: "Spring after last frost",
      spacing: "8-12 inches between plants, 30-36 inches between rows",
      depth: "1-2 inches deep",
      method: "Plant in blocks rather than rows for better pollination"
    },
    care: {
      watering: "1-2 inches of water per week, more during tasseling and ear formation",
      sunlight: "Full sun (8+ hours daily)",
      temperature: "60-95°F (15-35°C) optimal, frost-sensitive",
      fertilization: "Heavy feeder, apply nitrogen at planting and side-dress when plants are knee-high"
    },
    harvest: {
      duration: "60-100 days depending on variety",
      signs: ["Silks dry and turn brown", "Kernels feel full and firm", "Husks are tight and green"],
      method: "Twist and pull downward when ears are mature"
    },
    pests: {
      common: ["Corn earworm", "European corn borer", "Corn rootworm", "Cutworms"],
      prevention: ["Crop rotation", "Resistant hybrids", "Early planting", "Biological control"]
    },
    tips: [
      "Plant in blocks of at least 4 rows for proper pollination",
      "Side-dress with nitrogen when plants are 8-10 inches tall",
      "Monitor for pests during tasseling and silking stages",
      "Harvest in early morning for best quality"
    ]
  },
  potato: {
    crop: "Potato",
    overview: "Potatoes are cool-season root vegetables that grow best in loose, well-drained soil. They're nutritious and store well for extended periods.",
    planting: {
      season: "Early spring 2-4 weeks before last frost",
      spacing: "10-12 inches between pieces, 24-36 inches between rows",
      depth: "3-4 inches deep",
      method: "Plant seed pieces with 2-3 eyes each, cut side down"
    },
    care: {
      watering: "1-2 inches per week, consistent moisture important",
      sunlight: "Full sun (6-8 hours daily)",
      temperature: "60-70°F (15-21°C) optimal, tubers form best in cool soil",
      fertilization: "Apply balanced fertilizer at planting, avoid excessive nitrogen"
    },
    harvest: {
      duration: "70-120 days depending on variety",
      signs: ["Vines yellow and die back", "Skin is firm and doesn't rub off easily", "Desired size reached"],
      method: "Dig carefully with fork or spade, avoid bruising tubers"
    },
    pests: {
      common: ["Colorado potato beetle", "Aphids", "Potato blight", "Wireworms"],
      prevention: ["Crop rotation", "Certified seed potatoes", "Proper spacing", "Resistant varieties"]
    },
    tips: [
      "Hill soil around plants as they grow to protect tubers from sun",
      "Plant in well-drained soil to prevent rot",
      "Avoid planting near tomatoes to prevent disease spread",
      "Cure harvested potatoes in cool, dark place before storage"
    ]
  },
  cotton: {
    crop: "Cotton",
    overview: "Cotton is a warm-season fiber crop that requires a long growing season. It's drought-tolerant and grows well in hot, dry conditions.",
    planting: {
      season: "Spring after soil warms to 60°F",
      spacing: "3-6 inches between plants, 30-40 inches between rows",
      depth: "1 inch deep",
      method: "Plant in well-prepared seedbed, thin to desired spacing"
    },
    care: {
      watering: "Drought-tolerant, water deeply but infrequently",
      sunlight: "Full sun (8+ hours daily)",
      temperature: "70-95°F (21-35°C) optimal, frost-sensitive",
      fertilization: "Apply nitrogen at planting and during early growth stages"
    },
    harvest: {
      duration: "150-180 days",
      signs: ["Bolls open and fluff is visible", "Leaves begin to drop", "Bolls are dry and brown"],
      method: "Hand-pick or machine harvest when bolls are fully open"
    },
    pests: {
      common: ["Boll weevil", "Cotton bollworm", "Aphids", "Spider mites"],
      prevention: ["Crop rotation", "Resistant varieties", "Scout regularly", "Biological control"]
    },
    tips: [
      "Plant in well-drained soil to prevent root diseases",
      "Monitor for pests during flowering and boll development",
      "Apply growth regulators if needed for plant height control",
      "Time defoliation properly for efficient harvesting"
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop')?.toLowerCase();

    if (!crop) {
      // Return all available crops
      const crops = Object.keys(cultivationData).map(c => ({
        value: c,
        label: cultivationData[c as keyof typeof cultivationData].crop
      }));
      
      return NextResponse.json({
        success: true,
        data: {
          crops,
          message: "Available crops for cultivation tips"
        }
      });
    }

    const cropData = cultivationData[crop as keyof typeof cultivationData];
    if (!cropData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Crop not found',
          message: `Cultivation tips for '${crop}' not available`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...cropData,
        requestedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Cultivation tips error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cultivation tips',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}