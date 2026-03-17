const aiService = require("./services/aiService");

async function testAi() {
  const tests = [
    {
      text: "There is a massive pothole in the middle of the road near the park. It's very dangerous for bikes.",
      expectedCategory: "Infrastructure",
      expectedUrgency: 8
    },
    {
      text: "The street lights are not working and it's very dark at night.",
      expectedCategory: "Electricity",
      expectedUrgency: 5
    },
    {
      text: "Garbage is piling up near the entrance and it smells terrible.",
      expectedCategory: "Sanitation",
      expectedUrgency: 5
    },
    {
      text: "Pipe burst in our street, water is everywhere!",
      expectedCategory: "Water",
      expectedUrgency: 8
    }
  ];

  console.log("--- AI Service Verification ---");
  for (const test of tests) {
    const result = await aiService.analyzeComplaint(test.text);
    console.log(`Input: "${test.text.substring(0, 50)}..."`);
    console.log(`Result: Category: ${result.category}, Type: ${result.type}, Urgency: ${result.urgency}`);
    
    if (result.category === test.expectedCategory && result.urgency === test.expectedUrgency) {
      console.log("✅ PASSED");
    } else {
      console.log("❌ FAILED (Expected Category: " + test.expectedCategory + ", Urgency: " + test.expectedUrgency + ")");
    }
    console.log("-------------------");
  }
}

testAi();
