/* ======================================================================
   CARBONWISE AI - PERSONA & CLIMATE TWIN EXPERIENCE
   Creates playful carbon identities and impact equivalences for emotional storytelling.
   ====================================================================== */

export function initCarbonPersona() {
  const personaTitle = document.getElementById('persona-title');
  const personaEmoji = document.getElementById('persona-emoji');
  const personaScore = document.getElementById('persona-score');
  const personaTraits = document.getElementById('persona-traits-list');
  const personaSummary = document.getElementById('persona-summary');

  const twinDriving = document.getElementById('twin-driving');
  const twinTrees = document.getElementById('twin-trees');
  const twinHome = document.getElementById('twin-home');
  const twinFlights = document.getElementById('twin-flights');

  const personaSection = document.getElementById('persona');
  const twinSection = document.getElementById('persona');

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function computeCarbonScore(state) {
    const total = state.calculated.co2;
    let score = 100 - ((total - 2400) / 60);
    score -= state.inputs.flights * 1.8;
    score -= state.inputs.lpg > 25 ? 6 : 0;
    score -= state.inputs.diet === 'meat' ? 5 : state.inputs.diet === 'mixed' ? 2 : 0;
    score += state.inputs.renewable * 0.08;
    score += state.inputs.bike * 0.02;
    return clamp(Math.round(score), 20, 100);
  }

  function choosePersona(state) {
    const score = computeCarbonScore(state);
    const categories = state.calculated.percentages;
    const travel = categories.trans;
    const energy = categories.energy;
    const food = categories.food;
    const shopping = categories.shopping;

    let persona = {
      title: 'Eco Explorer',
      emoji: '🌱',
      traits: ['✓ Sustainable diet', '✓ Low electricity usage', '⚠ Transportation needs improvement'],
      summary: 'Your profile combines strong daily choices with a big opportunity in transport. Small emotional steps today create a calmer world tomorrow.'
    };

    if (travel >= 45) {
      persona.title = '🚗 Carbon Heavy Traveler';
      persona.emoji = '🚗';
      persona.traits = ['✓ Efficient home energy', '⚠ High air travel', '⚠ Excessive car dependency'];
      persona.summary = 'Your lifestyle is modern and mobile. The greatest gains come from reclaiming travel with transit, bikes and fewer flights.';
    } else if (energy >= 40) {
      persona.title = '⚡ Power Guardian';
      persona.emoji = '⚡';
      persona.traits = ['✓ Smart electricity habits', '⚠ Renewables can still grow', '⚠ LPG is a key focus zone'];
      persona.summary = 'Your home runs efficiently, but the grid still holds carbon. Swapping to renewables and induction cooking will transform your score.';
    } else if (food >= 35) {
      persona.title = '🥦 Food Future Architect';
      persona.emoji = '🥦';
      persona.traits = ['✓ Conscious food choices', '⚠ Diet emissions remain high', '⚠ Opportunity for plant-based growth'];
      persona.summary = 'Your plate is a powerful climate lever. Add more plant-based meals and your footprint will feel lighter and more hopeful.';
    } else if (shopping >= 30) {
      persona.title = '♻️ Circular Consumer';
      persona.emoji = '♻️';
      persona.traits = ['✓ Thoughtful purchases', '⚠ Fast fashion causes spikes', '⚠ Electronics refresh rate is high'];
      persona.summary = 'You care about quality, but some consumption still carries hidden carbon. Repair, reuse and reduce, and your score will climb fast.';
    }

    persona.score = computeCarbonScore(state);
    persona.level = persona.score >= 85 ? 'Elite' : persona.score >= 70 ? 'Advanced' : persona.score >= 50 ? 'Balanced' : 'Emerging';
    return persona;
  }

  function formatEquivalent(totalCO2) {
    const drivingKm = Math.round(totalCO2 / 0.192);
    const trees = Math.round(totalCO2 / 21.8);
    const houseMonths = Math.round((totalCO2 / 400) * 12 / 12); // approximate home power use
    const flights = Math.max(1, Math.round(totalCO2 / 1100));

    return {
      driving: `Driving ${drivingKm.toLocaleString()} km`,
      trees: `Cutting ${trees.toLocaleString()} mature trees`,
      home: `Powering a house for ${houseMonths} months`,
      flights: `Flying Delhi to London ${flights} times`
    };
  }

  function renderPersona(state) {
    const persona = choosePersona(state);
    if (personaTitle) personaTitle.textContent = persona.title;
    if (personaEmoji) personaEmoji.textContent = persona.emoji;
    if (personaScore) personaScore.innerHTML = `Carbon Score: <strong>${persona.score} / 100</strong>`;
    if (personaSummary) personaSummary.textContent = persona.summary;

    if (personaTraits) {
      personaTraits.innerHTML = '';
      persona.traits.forEach((trait) => {
        const traitEl = document.createElement('div');
        traitEl.className = 'trait-item';
        traitEl.textContent = trait;
        personaTraits.appendChild(traitEl);
      });
    }

    const equivalents = formatEquivalent(state.calculated.co2);
    if (twinDriving) twinDriving.textContent = equivalents.driving;
    if (twinTrees) twinTrees.textContent = equivalents.trees;
    if (twinHome) twinHome.textContent = equivalents.home;
    if (twinFlights) twinFlights.textContent = equivalents.flights;
  }

  function animatePersonaSections() {
    const sections = document.querySelectorAll('#persona .glass-card');
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(16px)';
      setTimeout(() => {
        section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  window.addEventListener('carbonStateUpdated', (e) => {
    renderPersona(e.detail);
  });

  window.addEventListener('storytellingFlow', () => {
    animatePersonaSections();
  });

  // Initial render in case state already exists
  if (window.CarbonWiseState) {
    renderPersona(window.CarbonWiseState);
  }
}
