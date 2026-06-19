/* ==========================================================================
   CARBONWISE AI - GAMIFICATION & ECO CHALLENGES ENGINE
   ========================================================================== */

export function initEcoChallenges() {
  const questsContainer = document.getElementById('quests-list-container');
  const badgesContainer = document.getElementById('badges-grid-container');
  
  // Header HUD display updates
  const xpVal = document.getElementById('user-xp');
  const levelVal = document.getElementById('user-level');
  const rankVal = document.getElementById('user-rank-title');

  // Achievement Toast displays
  const toast = document.getElementById('achievement-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');

  // Quest configurations
  const quests = [
    { id: 'nocar', title: 'No-Car Week', desc: 'Commute via public transit or walking for 7 days.', progress: 4, target: 7, xp: 250, icon: 'car', claimed: false },
    { id: 'plant', title: 'Plant 5 Trees', desc: 'Plant or sponsor 5 saplings in local community forests.', progress: 5, target: 5, xp: 450, icon: 'tree-pine', claimed: false },
    { id: 'meatfree', title: 'Meat-Free Monday', desc: 'Switch to vegetarian meals for a day.', progress: 1, target: 1, xp: 150, icon: 'salad', claimed: false },
    { id: 'cycle7', title: 'Cycle for 7 Days', desc: 'Use bicycle for short utility trips.', progress: 3, target: 7, xp: 300, icon: 'bike', claimed: false },
    { id: 'reduceelec', title: 'Reduce Power by 10%', desc: 'Reduce monthly grid power consumption.', progress: 9, target: 10, xp: 200, icon: 'zap', claimed: false }
  ];

  // Badges configurations
  const badges = [
    { id: 'warrior', title: 'Eco Warrior', desc: 'Unlock by completing 1 challenge', icon: 'shield-check', unlocked: true },
    { id: 'hero', title: 'Green Hero', desc: 'Unlock by completing 3 challenges', icon: 'award', unlocked: false },
    { id: 'ninja', title: 'Carbon Ninja', desc: 'Save over 400 kg of CO2 in simulator', icon: 'zap', unlocked: false },
    { id: 'protector', title: 'Planet Protector', desc: 'Reach Level 4 status', icon: 'globe', unlocked: false }
  ];

  function renderQuests() {
    if (!questsContainer) return;
    questsContainer.innerHTML = '';

    quests.forEach((q) => {
      const card = document.createElement('div');
      card.className = `quest-card ${q.progress >= q.target ? 'completed' : ''}`;
      
      const pct = Math.round((q.progress / q.target) * 100);

      // Construct quest card content
      let rightColumn = '';
      if (q.claimed) {
        rightColumn = `<span class="claimed-text text-muted" style="font-size: 0.75rem; font-weight:600;"><i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle;margin-right:2px;color:var(--emerald-glow);"></i> Claimed</span>`;
      } else if (q.progress >= q.target) {
        rightColumn = `<button class="claim-btn" data-id="${q.id}">Claim XP</button>`;
      } else {
        rightColumn = `
          <div class="quest-progress-bar-wrap">
            <div class="quest-progress-track">
              <div class="quest-progress-fill" style="width: ${pct}%;"></div>
            </div>
            <span class="quest-progress-text">${q.progress}/${q.target}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="quest-left">
          <div class="quest-icon-wrapper">
            <i data-lucide="${q.icon}"></i>
          </div>
          <div class="quest-details">
            <h4>${q.title}</h4>
            <p>${q.desc}</p>
          </div>
        </div>
        <div class="quest-right">
          <div class="quest-xp-reward">
            <i data-lucide="zap"></i>
            <span>+${q.xp} XP</span>
          </div>
          ${rightColumn}
        </div>
      `;

      questsContainer.appendChild(card);
    });

    // Re-initialize Lucide Icons inside dynamically generated components
    lucide.createIcons();

    // Bind event listeners to newly generated buttons
    const buttons = questsContainer.querySelectorAll('.claim-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        claimReward(id);
      });
    });
  }

  function renderBadges() {
    if (!badgesContainer) return;
    badgesContainer.innerHTML = '';

    badges.forEach((b) => {
      const card = document.createElement('div');
      card.className = `badge-card glass-panel ${b.unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="badge-graphic">
          <i data-lucide="${b.icon}"></i>
        </div>
        <h4>${b.title}</h4>
        <p>${b.desc}</p>
      `;
      badgesContainer.appendChild(card);
    });

    lucide.createIcons();
  }

  // Handle Reward Collection
  function claimReward(id) {
    const quest = quests.find(q => q.id === id);
    if (!quest || quest.claimed) return;

    // Mark claimed
    quest.claimed = true;

    // Increment XP
    const state = window.CarbonWiseState;
    state.xp += quest.xp;

    // Level calculator: level increases every 1000 XP
    const prevLevel = state.level;
    state.level = Math.floor(state.xp / 1000) + 1;
    
    // Check level up or new badges
    checkBadgeUnlocks(state);

    // Save completed quests
    state.completedQuests.push(quest.id);

    // Re-render
    renderQuests();
    renderBadges();

    // Update Header displays
    if (xpVal) xpVal.textContent = state.xp.toLocaleString();
    if (levelVal) levelVal.textContent = state.level;

    // Trigger full screen confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Show custom toast alert
    showToast('Quest Claimed!', `You received +${quest.xp} XP for completing ${quest.title}.`);

    // Level up notification
    if (state.level > prevLevel) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          colors: ['#06b6d4', '#10b981', '#3b82f6']
        });
        showToast('Level Up!', `Congratulations! You reached Level ${state.level}.`);
      }, 1000);
    }
  }

  // Badge unlock checks
  function checkBadgeUnlocks(state) {
    const claimedCount = quests.filter(q => q.claimed).length;

    // Warrior: unlocked by default
    badges.find(b => b.id === 'warrior').unlocked = true;

    // Green Hero: complete 3 challenges
    if (claimedCount >= 3) {
      const heroB = badges.find(b => b.id === 'hero');
      if (!heroB.unlocked) {
        heroB.unlocked = true;
        showToast('Badge Unlocked!', 'You unlocked the Green Hero badge!');
        if (rankVal) rankVal.textContent = 'Green Hero';
      }
    }

    // Planet Protector: level 4
    if (state.level >= 4) {
      const protB = badges.find(b => b.id === 'protector');
      if (!protB.unlocked) {
        protB.unlocked = true;
        showToast('Badge Unlocked!', 'You unlocked the Planet Protector badge!');
        if (rankVal) rankVal.textContent = 'Planet Protector';
      }
    }
  }

  // Simulator savings checker (Carbon Ninja unlock condition)
  window.addEventListener('carbonStateUpdated', (e) => {
    // If savings in simulator is > 400 kg
    const simSavedKg = parseFloat(document.getElementById('sim-saved-val').textContent) * 1000;
    if (simSavedKg >= 400) {
      const ninjaB = badges.find(b => b.id === 'ninja');
      if (!ninjaB.unlocked) {
        ninjaB.unlocked = true;
        renderBadges();
        showToast('Badge Unlocked!', 'You earned the Carbon Ninja badge for simulator reductions!');
      }
    }
  });

  // Display Custom Toast Message
  function showToast(title, msg) {
    if (!toast) return;
    toastTitle.textContent = title;
    toastMsg.textContent = msg;

    toast.classList.add('show');

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Initial render
  renderQuests();
  renderBadges();
}
