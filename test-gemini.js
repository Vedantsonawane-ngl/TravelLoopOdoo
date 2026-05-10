const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
      You are an expert travel planner. Create a realistic, highly detailed 3-day travel itinerary for: Paris.
      The traveler has a Standard budget and prefers a Balanced travel style. Tailor the activities, dining options, and costs to match this budget and style.
      Return the response strictly as a JSON object matching this exact structure, with no markdown formatting or extra text outside the JSON:
      {
        "title": "A catchy title for the trip",
        "description": "A brief exciting description of the trip highlighting the Balanced vibe",
        "coverImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop", 
        "stops": [
          {
            "city": "City Name",
            "country": "Country Name",
            "order": 1,
            "activities": [
              {
                "title": "Activity Title",
                "description": "Short description",
                "category": "Sightseeing | Food | Accommodation | Transport | Activity",
                "cost": 50.00,
                "time": "10:00 AM"
              }
            ]
          }
        ]
      }
      
      Important rules:
      1. Provide exactly 3 stops (each stop represents one day. They can be in the same city).
      2. Provide 3-4 activities per stop (day).
      3. The cost should be a realistic number in USD, tailored to a Standard budget.
      4. Only return valid JSON. Do not include \`\`\`json or \`\`\` tags in your response.
  `;
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (err) {
    console.error(err);
  }
}
run();
