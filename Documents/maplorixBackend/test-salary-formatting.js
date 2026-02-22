// Test salary formatting function
const formatSalary = (salary) => {
  if (!salary) return 'Not specified';
  
  if (typeof salary === 'string') {
    try {
      salary = JSON.parse(salary);
    } catch (e) {
      return salary;
    }
  }
  
  if (typeof salary === 'object' && salary !== null) {
    const { min, max, currency = 'USD' } = salary;
    
    if (min && max) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${formatter.format(min)}+`;
    } else if (max) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `Up to ${formatter.format(max)}`;
    } else if (currency) {
      return currency;
    }
  }
  
  return 'Not specified';
};

// Test cases
console.log('🔍 Testing salary formatting...');

const testCases = [
  { currency: 'USD' },  // Current case from your data
  { min: 50000, max: 80000, currency: 'USD' },
  { min: 60000, currency: 'EUR' },
  { max: 100000, currency: 'GBP' },
  { min: 75000, max: 75000, currency: 'AED' },
  null,
  undefined,
  'Not specified',
  '{"min": 40000, "max": 60000, "currency": "USD"}'
];

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}:`, testCase);
  console.log('Result:', formatSalary(testCase));
});

console.log('\n✅ Salary formatting test completed!');
