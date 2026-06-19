/* ==========================================================================
   CARBONWISE AI - ANALYTICS TRENDS & HEATMAP ENGINE
   ========================================================================== */

export function initDashboardAnalytics() {
  const chartCanvas = document.getElementById('emissionsTrendChart');
  const gradeVal = document.getElementById('dashboard-grade-val');
  const gradeLabel = document.getElementById('grade-label');
  const gradeDesc = document.getElementById('grade-desc');
  const gradeCircle = document.querySelector('.grade-glow-circle');
  const heatmapGrid = document.getElementById('heatmap-grid-element');
  const periodTabs = document.querySelectorAll('.dash-tab');

  if (!chartCanvas) return;

  let trendChart;

  // Mock trend data configurations
  const datasets = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [12.4, 14.1, 13.8, 11.2, 14.5, 9.8, 8.2],
      label: 'Daily Emissions (kg CO₂)'
    },
    weekly: {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'],
      data: [98.5, 94.2, 91.0, 96.4, 88.2, 85.0, 78.4, 76.2],
      label: 'Weekly Emissions (kg CO₂)'
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [410, 395, 420, 380, 375, 360, 342, 335, 320, 310, 305, 300],
      label: 'Monthly Emissions (kg CO₂)'
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025', '2026 (Est.)'],
      data: [5800, 5620, 5400, 4980, 4750, 4500],
      label: 'Yearly Carbon Footprint (kg CO₂)'
    }
  };

  // 1. Initial Chart setup
  const ctx = chartCanvas.getContext('2d');
  
  // Custom linear gradient for area chart glow fill
  const gradientFill = ctx.createLinearGradient(0, 0, 0, 250);
  gradientFill.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
  gradientFill.addColorStop(1, 'rgba(6, 182, 212, 0.00)');

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datasets.daily.labels,
      datasets: [{
        label: datasets.daily.label,
        data: datasets.daily.data,
        borderColor: '#06b6d4',
        borderWidth: 3,
        backgroundColor: gradientFill,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#06b6d4',
        pointHoverRadius: 6,
        shadowColor: 'rgba(6, 182, 212, 0.4)',
        shadowBlur: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.03)'
          },
          ticks: {
            color: '#64748b',
            font: {
              family: 'Space Grotesk'
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.03)'
          },
          ticks: {
            color: '#64748b',
            font: {
              family: 'Space Grotesk'
            }
          }
        }
      }
    }
  });

  // Tab switching handler
  periodTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      periodTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const period = tab.dataset.period;
      const config = datasets[period];

      // Update chart data
      trendChart.data.labels = config.labels;
      trendChart.data.datasets[0].data = config.data;
      trendChart.data.datasets[0].label = config.label;

      // Swap gradient color based on period
      const newGrad = ctx.createLinearGradient(0, 0, 0, 250);
      if (period === 'monthly') {
        newGrad.addColorStop(0, 'rgba(16, 185, 129, 0.45)'); // Emerald theme
        newGrad.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        trendChart.data.datasets[0].borderColor = '#10b981';
        trendChart.data.datasets[0].pointBackgroundColor = '#10b981';
      } else {
        newGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)'); // Cyan theme
        newGrad.addColorStop(1, 'rgba(6, 182, 212, 0.00)');
        trendChart.data.datasets[0].borderColor = '#06b6d4';
        trendChart.data.datasets[0].pointBackgroundColor = '#06b6d4';
      }
      trendChart.data.datasets[0].backgroundColor = newGrad;

      trendChart.update();
    });
  });

  // 2. Heatmap Generator (Draws 52 blocks corresponding to weeks)
  function renderHeatmap(totalCO2) {
    if (!heatmapGrid) return;
    heatmapGrid.innerHTML = '';

    // Decide distribution of levels based on current emissions
    // Low emissions: mostly lvl-1 & lvl-2. High emissions: mostly lvl-3 & lvl-4
    for (let i = 0; i < 52; i++) {
      const block = document.createElement('div');
      block.className = 'heatmap-block';
      
      let lvl = 1;
      const rand = Math.random();

      if (totalCO2 < 3000) {
        // low carbon lifestyle
        lvl = rand < 0.65 ? 1 : rand < 0.9 ? 2 : 3;
      } else if (totalCO2 < 5500) {
        // average carbon lifestyle
        lvl = rand < 0.25 ? 1 : rand < 0.6 ? 2 : rand < 0.9 ? 3 : 4;
      } else {
        // high carbon crisis lifestyle
        lvl = rand < 0.1 ? 1 : rand < 0.35 ? 2 : rand < 0.7 ? 3 : 4;
      }

      block.classList.add(`lvl-${lvl}`);
      block.title = `Week ${i + 1}: ${lvl === 1 ? 'Low Impact' : lvl === 2 ? 'Average' : lvl === 3 ? 'Elevated' : 'High Impact'}`;
      
      heatmapGrid.appendChild(block);
    }
  }

  // 3. Carbon Grade calculation
  function updateCarbonGrade(totalCO2) {
    if (!gradeVal || !gradeLabel || !gradeDesc || !gradeCircle) return;

    let letter = 'B';
    let label = 'Moderate Performance';
    let desc = 'Your emissions fall within the regional average. Upgrade your transport options to reach rating A.';
    let ratingClass = 'grade-b';

    if (totalCO2 <= 2200) {
      letter = 'A+';
      label = 'Eco Warrior Elite';
      desc = 'Outstanding environmental preservation index! You are actively contributing to stabilizing global temperatures.';
      ratingClass = 'grade-a';
    } else if (totalCO2 <= 3500) {
      letter = 'A';
      label = 'Exceptional';
      desc = 'Excellent carbon management. Small adjustments to diet or electronics waste can elevate you to A+.';
      ratingClass = 'grade-a';
    } else if (totalCO2 <= 5000) {
      letter = 'B';
      label = 'Average Index';
      desc = 'Typical consumer carbon profile. Reducing home energy usage is your biggest shortcut to rating A.';
      ratingClass = 'grade-b';
    } else if (totalCO2 <= 7500) {
      letter = 'C';
      label = 'Below Average';
      desc = 'Noticeable carbon waste detected. Review transportation settings and install energy saving nodes.';
      ratingClass = 'grade-c';
    } else {
      letter = 'D';
      label = 'High Carbon Footprint';
      desc = 'Critical ecological index. Prompt reductions required in flight frequency, energy grid usage, or gas vehicle use.';
      ratingClass = 'grade-d';
    }

    // Reset grades classes
    gradeCircle.className = 'grade-glow-circle';
    gradeCircle.classList.add(ratingClass);
    gradeVal.textContent = letter;
    gradeLabel.textContent = label;
    gradeDesc.textContent = desc;
  }

  // Hook state changes to recalculate grade/heatmap
  window.addEventListener('carbonStateUpdated', (e) => {
    const totalCO2 = e.detail.calculated.co2;
    updateCarbonGrade(totalCO2);
    renderHeatmap(totalCO2);

    // Sync estimated yearly value to the trend chart
    datasets.yearly.data[datasets.yearly.data.length - 1] = Math.round(totalCO2);
    if (trendChart.data.datasets[0].label.includes('Yearly')) {
      trendChart.update();
    }
  });

  // Initial runs
  renderHeatmap(window.CarbonWiseState.calculated.co2);
  updateCarbonGrade(window.CarbonWiseState.calculated.co2);
}
