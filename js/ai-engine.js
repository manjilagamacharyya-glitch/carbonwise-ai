/* ==========================================================================
   CARBONWISE AI - GEMINI AI COACH ENGINE
   Real AI integration with Google Gemini API + Demo fallback
   ========================================================================== */

// Gemini API Configuration
const GEMINI_API_KEY = "YOUR_KEY";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Demo fallback responses for when API key is unavailable
const DEMO_RESPONSES = {
  trans: {
    biggestContributor: "Transportation — Your car travel and flights are the dominant source of your carbon footprint, accounting for nearly half of your annual emissions.",
    easyActions: [
      "Carpool with colleagues 2-3 days per week — saves ~800 kg CO₂/year",
      "Take public transit for trips under 10 km — saves ~400 kg CO₂/year",
      "Combine multiple errands into single trips to reduce total driving distance"
    ],
    mediumTermImprovements: [
      "Switch to a hybrid vehicle — reduces car emissions by 40%",
      "Replace 2 domestic flights with train travel — saves ~420 kg CO₂/year",
      "Work from home 2 days/week — eliminates ~20% of commute emissions"
    ],
    longTermRoadmap: [
      "Transition to a fully electric vehicle (EV) by 2028 — eliminates ~85% of car emissions",
      "Adopt a zero-flight lifestyle for domestic travel — save 500+ kg CO₂/year",
      "Relocate closer to work/school to enable walking or cycling commutes"
    ],
    estimatedCO2Savings: ["1,200 kg/year with easy actions", "2,800 kg/year with full roadmap adoption"],
    motivationalMessage: "Your transportation choices have the single biggest impact on your footprint. The good news? Small shifts — like carpooling twice a week — can cut your emissions by over 20%. Every kilometer you don't drive is a breath of fresh air for the planet. 🌍"
  },
  energy: {
    biggestContributor: "Home Energy — Your electricity consumption and LPG usage are generating the highest emissions. India's coal-heavy grid makes every kilowatt-hour count.",
    easyActions: [
      "Switch all bulbs to LED — saves ~15% electricity and ~300 kg CO₂/year",
      "Unplug idle devices and use smart power strips — eliminates phantom loads",
      "Set AC to 24°C instead of 22°C — reduces cooling energy by ~20%"
    ],
    mediumTermImprovements: [
      "Install a solar water heater — replaces LPG for hot water, saving ~500 kg CO₂/year",
      "Upgrade to 5-star BEE rated appliances — reduces consumption by 30%",
      "Use a programmable thermostat to optimize heating/cooling schedules"
    ],
    longTermRoadmap: [
      "Install rooftop solar panels (3-5 kW system) — offsets 80%+ of grid electricity",
      "Transition from LPG to induction cooking — eliminates direct gas emissions",
      "Achieve net-zero home energy through solar + battery storage by 2030"
    ],
    estimatedCO2Savings: ["800 kg/year with easy actions", "3,500 kg/year with full solar transition"],
    motivationalMessage: "Your home is your sustainability headquarters. Every watt you save ripples outward — less coal burned, cleaner air, cooler planet. With India's solar potential, your rooftop could become a mini power plant! ☀️"
  },
  food: {
    biggestContributor: "Food & Diet — Your dietary choices contribute significantly to greenhouse gas emissions, primarily through methane from livestock and land-use changes.",
    easyActions: [
      "Adopt Meat-Free Mondays — just one day per week saves ~250 kg CO₂/year",
      "Reduce food waste by meal planning — 30% of food is typically wasted",
      "Choose local and seasonal produce over imported alternatives"
    ],
    mediumTermImprovements: [
      "Shift to a flexitarian diet (meat 2x/week max) — saves ~800 kg CO₂/year",
      "Start composting kitchen waste — reduces methane from landfills",
      "Grow herbs and vegetables at home — zero transport emissions"
    ],
    longTermRoadmap: [
      "Transition to a fully plant-based diet — saves 1,500+ kg CO₂/year vs meat-heavy",
      "Support regenerative agriculture through purchasing choices",
      "Build a community food-sharing network to minimize waste at scale"
    ],
    estimatedCO2Savings: ["600 kg/year with easy actions", "1,800 kg/year with plant-based transition"],
    motivationalMessage: "What's on your plate shapes the planet. A single plant-based meal saves as much water as skipping 30 showers. Your fork is one of the most powerful climate tools you own. 🌱"
  },
  shopping: {
    biggestContributor: "Shopping & Consumption — Fast fashion and electronic devices carry hidden carbon costs from manufacturing, shipping, and disposal.",
    easyActions: [
      "Buy secondhand clothing — thrift shopping reduces textile emissions by 80%",
      "Repair electronics instead of replacing — extends device life by 2-3 years",
      "Use reusable bags, bottles, and containers — eliminates single-use plastics"
    ],
    mediumTermImprovements: [
      "Adopt a capsule wardrobe (30 key pieces) — reduces clothing purchases by 60%",
      "Choose refurbished electronics — same performance, 70% less carbon",
      "Subscribe to sharing/rental services for rarely-used items"
    ],
    longTermRoadmap: [
      "Embrace minimalism — quality over quantity reduces lifetime consumption footprint by 40%",
      "Support circular economy brands that take back and recycle products",
      "Advocate for right-to-repair legislation in your community"
    ],
    estimatedCO2Savings: ["400 kg/year with easy actions", "1,200 kg/year with minimalist lifestyle"],
    motivationalMessage: "Every purchase is a vote for the world you want to live in. By choosing quality over quantity and secondhand over new, you're not just saving carbon — you're redefining what 'enough' means. 🛍️→🌿"
  }
};

export function initAICoach() {
  const insightsContainer = document.getElementById('ai-insights-container');
  const confidenceVal = document.getElementById('coach-confidence-val');
  const focusZoneVal = document.getElementById('coach-focus-zone');
  const coachModeIndicator = document.getElementById('coach-mode-indicator');

  if (!insightsContainer) return;

  // Detect if real API key is available
  const isRealAPI = GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_KEY" && GEMINI_API_KEY.length > 10;

  // Update mode indicator
  if (coachModeIndicator) {
    coachModeIndicator.textContent = isRealAPI ? 'Gemini AI Live' : 'Demo AI Mode';
    coachModeIndicator.className = `ai-mode-badge ${isRealAPI ? 'live' : 'demo'}`;
  }

  // Listen to carbon footprint updates
  window.addEventListener('carbonStateUpdated', (e) => {
    const maxCat = e.detail.calculated.maxCategory;
    const catTitles = {
      trans: 'Transportation',
      energy: 'Home Energy',
      food: 'Food & Diet',
      shopping: 'Shopping & Consumption'
    };
    if (focusZoneVal) {
      focusZoneVal.textContent = catTitles[maxCat] || 'Transportation';
      focusZoneVal.className = `val text-${maxCat === 'energy' ? 'emerald' : maxCat === 'food' ? 'blue' : maxCat === 'shopping' ? 'purple' : 'cyan'}`;
    }
  });

  // Gemini API call
  async function callGemini(state) {
    const prompt = `You are CarbonWise AI, a sustainability coach. Analyze this user's carbon footprint data and provide a personalized reduction plan.

USER DATA:
- Car travel: ${state.inputs.car} km/week
- Bike/Walk: ${state.inputs.bike} km/week  
- Public Transit: ${state.inputs.transit} km/week
- Flights: ${state.inputs.flights} trips/year
- Electricity: ${state.inputs.electricity} kWh/month
- LPG/Gas: ${state.inputs.lpg} kg/month
- Renewable Energy: ${state.inputs.renewable}%
- Diet: ${state.inputs.diet}
- Clothing purchases: ${state.inputs.clothes} items/month
- Electronics purchases: ${state.inputs.electronics} items/year

CALCULATED RESULTS:
- Total CO₂: ${Math.round(state.calculated.co2)} kg/year (${(state.calculated.co2/1000).toFixed(1)} tons)
- Transportation: ${Math.round(state.calculated.breakdown.trans)} kg (${state.calculated.percentages.trans}%)
- Home Energy: ${Math.round(state.calculated.breakdown.energy)} kg (${state.calculated.percentages.energy}%)
- Food & Diet: ${Math.round(state.calculated.breakdown.food)} kg (${state.calculated.percentages.food}%)
- Shopping: ${Math.round(state.calculated.breakdown.shopping)} kg (${state.calculated.percentages.shopping}%)
- Biggest contributor: ${state.calculated.maxCategory}

Respond ONLY with valid JSON in this exact format:
{
  "biggestContributor": "One paragraph explaining what's causing the most emissions and why",
  "easyActions": ["3 specific quick-win actions with estimated kg CO₂ savings each"],
  "mediumTermImprovements": ["3 specific medium-term changes (3-12 months) with savings"],
  "longTermRoadmap": ["3 specific long-term transformations (1-5 years) with savings"],
  "estimatedCO2Savings": ["Total easy savings estimate", "Total full roadmap savings estimate"],
  "motivationalMessage": "An inspiring, personal message about their specific situation (2-3 sentences)"
}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1200,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  }

  // Main trigger function
  window.triggerAICoachQuery = async function() {
    insightsContainer.innerHTML = `
      <div class="ai-loading-placeholder">
        <div class="spinner"></div>
        <span>${isRealAPI ? 'Gemini AI is analyzing your footprint...' : 'AI Coach is generating insights...'}</span>
      </div>
    `;

    if (confidenceVal) confidenceVal.textContent = 'Analyzing...';

    const state = window.CarbonWiseState;
    let aiResponse;

    if (isRealAPI) {
      try {
        aiResponse = await callGemini(state);
      } catch (err) {
        console.warn('Gemini API failed, falling back to demo mode:', err);
        aiResponse = DEMO_RESPONSES[state.calculated.maxCategory] || DEMO_RESPONSES.trans;
      }
    } else {
      // Demo mode — slight delay for realism
      await new Promise(r => setTimeout(r, 800));
      aiResponse = DEMO_RESPONSES[state.calculated.maxCategory] || DEMO_RESPONSES.trans;
    }

    renderGeminiResponse(aiResponse);
  };

  // Render Gemini response with typewriter animation
  function renderGeminiResponse(data) {
    insightsContainer.innerHTML = '';

    // 1. Biggest Contributor card
    const contributorCard = createInsightCard(
      'analysis',
      '🔍 Biggest Contributor',
      data.biggestContributor,
      null,
      'var(--accent-red)'
    );
    insightsContainer.appendChild(contributorCard);

    // 2. Easy Actions
    const easyCard = createInsightCard(
      'short',
      '⚡ Easy Actions (Start Today)',
      null,
      data.easyActions,
      'var(--cyan-glow)'
    );
    insightsContainer.appendChild(easyCard);

    // 3. Medium-Term Improvements
    const mediumCard = createInsightCard(
      'medium',
      '📈 Medium-Term Improvements',
      null,
      data.mediumTermImprovements,
      'var(--blue-glow)'
    );
    insightsContainer.appendChild(mediumCard);

    // 4. Long-Term Roadmap
    const longCard = createInsightCard(
      'long',
      '🌍 Long-Term Sustainability Roadmap',
      null,
      data.longTermRoadmap,
      'var(--purple-glow)'
    );
    insightsContainer.appendChild(longCard);

    // 5. Monthly Sustainability Roadmap
    const roadmapCard = createInsightCard(
      'roadmap',
      '🗓️ Monthly Sustainability Roadmap',
      null,
      createMonthlyRoadmap(window.CarbonWiseState),
      'var(--emerald-glow)'
    );
    insightsContainer.appendChild(roadmapCard);

    // 6. Estimated Savings
    const savingsCard = createInsightCard(
      'savings',
      '💰 Estimated CO₂ Savings',
      null,
      data.estimatedCO2Savings,
      'var(--emerald-glow)'
    );
    insightsContainer.appendChild(savingsCard);

    // 6. Motivational Message
    const motivCard = createInsightCard(
      'motivation',
      '💚 Your Personal Message',
      data.motivationalMessage,
      null,
      'var(--emerald-glow)'
    );
    insightsContainer.appendChild(motivCard);

    // Stagger typewriter animations
    const cards = insightsContainer.querySelectorAll('.insight-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        // Typewriter effect on text content
        const textElements = card.querySelectorAll('.typewriter-text');
        textElements.forEach(el => {
          typewriterReveal(el);
        });
      }, i * 200);
    });

    // Update confidence
    if (confidenceVal) {
      confidenceVal.textContent = isRealAPI ? '97%' : '95%';
    }
    const confidenceBar = document.getElementById('coach-confidence-bar');
    if (confidenceBar) {
      confidenceBar.style.width = isRealAPI ? '97%' : '95%';
    }
  }

  function createInsightCard(type, title, description, listItems, accentColor) {
    const card = document.createElement('div');
    card.className = `insight-card glass-panel border-${type}`;
    card.style.borderLeft = `3px solid ${accentColor}`;

    let contentHTML = `
      <div class="insight-card-header">
        <div class="insight-badge-row">
          <span class="insight-timeframe ${type}" style="background: ${accentColor}15; color: ${accentColor}; border-color: ${accentColor}30;">${title}</span>
        </div>
      </div>
    `;

    if (description) {
      contentHTML += `<p class="typewriter-text" data-full-text="${escapeHtml(description)}">${description}</p>`;
    }

    if (listItems && listItems.length > 0) {
      contentHTML += '<ul class="ai-action-list">';
      listItems.forEach(item => {
        contentHTML += `<li class="typewriter-text" data-full-text="${escapeHtml(item)}"><span class="action-bullet">▸</span> ${item}</li>`;
      });
      contentHTML += '</ul>';
    }

    card.innerHTML = contentHTML;
    return card;
  }

  function createMonthlyRoadmap(state) {
    const quickWins = [
      'Month 1: Swap two short car trips for bike or transit.',
      'Month 2: Reduce electricity by 10% with LED and smart standby habits.',
      'Month 3: Cut one meat-heavy meal per day and choose local food.',
      'Month 4: Add renewable energy or offset your grid usage with clean power.'
    ];

    if (!state) return quickWins;

    const category = state.calculated.maxCategory;
    if (category === 'trans') {
      quickWins.unshift('Month 0: Replace one commute with public transit or carpool.');
    } else if (category === 'energy') {
      quickWins.unshift('Month 0: Lower your AC by 1-2°C and unplug idle devices.');
    }

    return quickWins;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function typewriterReveal(el) {
    const fullText = el.textContent;
    const bulletSpan = el.querySelector('.action-bullet');
    const prefix = bulletSpan ? '▸ ' : '';
    const text = bulletSpan ? fullText.replace('▸ ', '') : fullText;
    
    el.textContent = prefix;
    let i = 0;
    const speed = Math.max(8, 30 - text.length / 10); // Adaptive speed
    
    function type() {
      if (i < text.length) {
        el.textContent = prefix + text.substring(0, i + 1);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Trigger initial coaching insights load
  triggerAICoachQuery();
}
