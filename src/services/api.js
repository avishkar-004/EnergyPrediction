// services/api.js
// API service functions for communicating with the backend

// Dashboard data API call
export const fetchDashboardData = async () => {
  // In a real application, this would be a fetch call to your backend API
  // For demo purposes, returning mock data
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  return {
    totalMachines: 12,
    totalConsumption: 45678,
    avgEfficiency: 87,
    predictionAccuracy: 92,
    recentAlerts: [
      { id: 1, machine: 'Machine 3', message: 'Consumption above threshold', timestamp: '2025-05-12T14:30:00' },
      { id: 2, machine: 'Machine 7', message: 'Efficiency declining', timestamp: '2025-05-12T10:15:00' }
    ]
  };
};

// Summary stats for dashboard
export const fetchSummaryStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  return [
    { name: 'Jan', actual: 3200, predicted: 3150 },
    { name: 'Feb', actual: 2800, predicted: 2900 },
    { name: 'Mar', actual: 3300, predicted: 3250 },
    { name: 'Apr', actual: 3700, predicted: 3600 },
    { name: 'May', actual: 3900, predicted: 4000 }
  ];
};

// Fetch machine IDs
export const fetchMachineIds = async () => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
  
  return ['M001', 'M002', 'M003', 'M004', 'M005'];
};

// Fetch machine consumption data
export const fetchMachineConsumptionData = async (machineId) => {
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
  
  // Generate past 30 days of data
  const past = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      consumption: 100 + Math.random() * 50,
      prediction: null
    };
  });
  
  // Generate next 6 days of predictions
  const prediction = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + (i + 1));
    
    return {
      date: date.toISOString().split('T')[0],
      prediction: 100 + Math.random() * 50
    };
  });
  
  return { past, prediction };
};

// Fetch ideal values for machines
export const fetchIdealValues = async () => {
  await new Promise(resolve => setTimeout(resolve, 900)); // Simulate API delay
  
  return [
    { id: 1, machineId: 'M001', machineName: 'Compressor A', idealConsumption: 120.5, tolerancePercentage: 5, status: 'optimal' },
    { id: 2, machineId: 'M002', machineName: 'Conveyor Belt B', idealConsumption: 85.3, tolerancePercentage: 8, status: 'warning' },
    { id: 3, machineId: 'M003', machineName: 'Pump C', idealConsumption: 45.7, tolerancePercentage: 3, status: 'critical' },
    { id: 4, machineId: 'M004', machineName: 'Cooling Unit D', idealConsumption: 210.0, tolerancePercentage: 10, status: 'optimal' },
    { id: 5, machineId: 'M005', machineName: 'Mixer E', idealConsumption: 95.2, tolerancePercentage: 7, status: 'optimal' }
  ];
};

// Fetch report data
export const fetchReportData = async (config) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  
  // Generate mock report data based on config
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  // Adjust days based on report type
  let reportPoints = daysDiff;
  if (config.reportType === 'weekly') {
    reportPoints = Math.ceil(daysDiff / 7);
  } else if (config.reportType === 'monthly') {
    reportPoints = Math.ceil(daysDiff / 30);
  }
  
  // Generate the report data
  const reportData = [];
  
  for (let i = 0; i < reportPoints; i++) {
    const currentDate = new Date(startDate);
    
    if (config.reportType === 'daily') {
      currentDate.setDate(startDate.getDate() + i);
    } else if (config.reportType === 'weekly') {
      currentDate.setDate(startDate.getDate() + (i * 7));
    } else if (config.reportType === 'monthly') {
      currentDate.setMonth(startDate.getMonth() + i);
    }
    
    if (currentDate > endDate) break;
    
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // If 'all' machines is selected, generate data for each machine
    if (config.machineId === 'all') {
      ['M001', 'M002', 'M003', 'M004', 'M005'].forEach(machine => {
        const consumption = 100 + Math.random() * 50;
        const ideal = 100 + Math.random() * 10;
        const difference = ((consumption - ideal) / ideal) * 100;
        
        reportData.push({
          date: dateStr,
          machine,
          consumption,
          ideal,
          difference
        });
      });
    } else {
      // Generate data for just the selected machine
      const consumption = 100 + Math.random() * 50;
      const ideal = 100 + Math.random() * 10;
      const difference = ((consumption - ideal) / ideal) * 100;
      
      reportData.push({
        date: dateStr,
        machine: config.machineId,
        consumption,
        ideal,
        difference
      });
    }
  }
  
  return reportData;
};

// Download report in various formats
export const downloadReport = async (config) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  // In a real application, this would trigger a download from the server
  // For demo purposes, we'll just log it
  console.log(`Downloading report in ${config.format} format with config:`, config);
  
  // In a real application, we would return the download URL or blob
  alert(`Report download started in ${config.format.toUpperCase()} format`);
  
  return true;
};
