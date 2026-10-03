async function runTest() {
  console.log("Starting 100 user registration test...");
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 1; i <= 100; i++) {
    const userData = {
      fullName: `Test Student ${i}`,
      email: `teststudent${i}_${Date.now()}@example.com`,
      password: 'password123'
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (res.status === 201) {
        successCount++;
        process.stdout.write('.');
      } else {
        failCount++;
        process.stdout.write('F');
      }
    } catch (err) {
      failCount++;
      process.stdout.write('F');
    }
  }

  console.log(`\nTest completed. Successful registrations: ${successCount}, Failed: ${failCount}`);
}

runTest();
