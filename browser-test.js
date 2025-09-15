// Rate Limiting Test - Run this in browser console after logging in
async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting...');
  console.log('Creating 7 buyers rapidly (limit is 5 per minute)');
  
  const testData = {
    fullName: "Rate Test User",
    email: "ratetest@example.com", 
    phone: "9999999999",
    city: "Chandigarh",
    propertyType: "Office",
    purpose: "Buy",
    budgetMin: 1000000,
    budgetMax: 2000000,
    timeline: "Exploring",
    source: "Website"
  };

  for (let i = 1; i <= 7; i++) {
    try {
      console.log(`\n Request #${i}:`);
      
      const response = await fetch('/api/buyers/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This includes the session cookie
        body: JSON.stringify({
          ...testData,
          fullName: `Rate Test User ${i}`,
          email: `ratetest${i}@example.com`
        })
      });
      
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Message:`, data.message || data);
      
      // Show rate limit info
      const limit = response.headers.get('X-RateLimit-Limit');
      const remaining = response.headers.get('X-RateLimit-Remaining');
      
      if (limit) {
        console.log(`Rate Limit: ${remaining}/${limit} remaining`);
      }
      
      if (response.status === 429) {
        console.log('RATE LIMITED!  Rate limiting is working!');
        break;
      }
      
    } catch (error) {
      console.error(` Request #${i} failed:`, error);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\nTest completed!');
}

// Run the test
testRateLimit();
