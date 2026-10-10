"use strict";

const STORAGE_KEY = "cyberquest-save-v1";
const MISSIONS = [
  {
    id: "virus",
    name: "Virus Outbreak",
    description: "Contain a spreading malware infection before it consumes the local network.",
    enemy: "Virus",
    health: 60,
    attack: 15,
    icon: "☣",
    color: "",
    threat: "LOW THREAT"
  },
  {
    id: "hacker",
    name: "Rogue Hacker",
    description: "Track down a hostile operator hiding behind a chain of encrypted proxies.",
    enemy: "Rogue Hacker",
    health: 80,
    attack: 20,
    icon: "⌘",
    color: "blue",
    threat: "MODERATE THREAT"
  },
  {
    id: "firewall",
    name: "Firewall Fortress",
    description: "Break through a hardened defense system and reclaim the secured data.",
    enemy: "Firewall",
    health: 100,
    attack: 10,
    icon: "ϟ",
    color: "orange",
    threat: "HIGH THREAT"
  }
];

const screen = document.getElementById("screen");
const modal = document.getElementById("name-modal");
const nameInput = document.getElementById("operative-name");
const toast = document.getElementById("toast");
let activeView = "overview";
let toastTimer;
let state = loadState();

function newState(name) {
  return {
    name,
    health: 100,
    maxHealth: 100,
    energy: 100,
    xp: 0,
    coins: 50,
    level: 1,
    inventory: ["Health Patch"],
    completedMissions: [],
    statistics: { "Battles Won": 0, "Battles Lost": 0, "Missions Completed": 0 },
    activity: [],
    battle: null
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.name === "string") {
      return { ...newState(saved.name), ...saved, statistics: { ...newState(saved.name).statistics, ...saved.statistics } };
    }
  } catch (error) {
    console.error("Unable to load the CyberQuest save.", error);
  }
  return null;
}

function persist() {
  if (!state) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save CyberQuest progress to this browser.", error);
    showToast("Save failed — browser storage is unavailable.");
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function xpNeeded() {
  return state.level * 100;
}

function addXp(amount) {
  state.xp += amount;
  if (state.xp >= xpNeeded()) {
    state.xp -= xpNeeded();
    state.level += 1;
    state.maxHealth += 20;
    state.health = state.maxHealth;
    addActivity(`Level up — now level ${state.level}`);
    showToast(`Level up! You are now level ${state.level}.`);
  }
}

function addActivity(message) {
  state.activity.unshift({ message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  state.activity = state.activity.slice(0, 8);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function missionCard(mission, interactive) {
  const complete = state.completedMissions.includes(mission.name);
  const action = interactive
    ? `<div class="mission-action"><span>${complete ? "REPLAY MISSION" : "ACCEPT MISSION"}</span><span>↗</span></div>`
    : "";
  return `
    <article class="mission-card" ${interactive ? `data-action="mission" data-mission="${mission.id}" tabindex="0" role="button" aria-label="Start ${escapeHtml(mission.name)}"` : ""}>
      <div class="mission-top">
        <div class="mission-icon ${mission.color}">${mission.icon}</div>
        <span class="mission-status ${complete ? "completed" : ""}">${complete ? "✓ COMPLETE" : mission.threat}</span>
      </div>
      <h3>${escapeHtml(mission.name)}</h3>
      <p>${escapeHtml(mission.description)}</p>
      <div class="mission-meta"><span>＋50 XP</span><span>◈ 25 COINS</span><span>⌖ ${mission.enemy === "Virus" ? 60 : mission.enemy === "Firewall" ? 100 : 80} HP</span></div>
      ${action}
    </article>`;
}

function playerLevelProgress() {
  return Math.min(100, (state.xp / xpNeeded()) * 100);
}

function statCard(label, value, suffix, icon, percent, note, purple) {
  return `<div class="stat-card">
    <div class="stat-label">${label}</div>
    <div class="stat-value">${value}<small>${suffix}</small><span class="metric-icon">${icon}</span></div>
    <div class="progress-track"><div class="progress-fill ${purple ? "purple" : ""}" style="width:${percent}%"></div></div>
    <div class="progress-note">${note}</div>
  </div>`;
}

function activityPanel() {
  const entries = state.activity.length
    ? state.activity.slice(0, 4).map((item) => `<div class="activity-item"><span class="activity-mark">⌁</span><span>${escapeHtml(item.message)}</span><span class="activity-time">${escapeHtml(item.time)}</span></div>`).join("")
    : `<div class="activity-item"><span class="activity-mark">⌁</span><span>Profile initialized. Your first mission awaits.</span><span class="activity-time">NOW</span></div>`;
  return `<section class="panel"><div class="panel-heading"><h3>Recent activity</h3><span>LIVE FEED</span></div><div class="activity-list">${entries}</div></section>`;
}

function renderOverview() {
  const progress = playerLevelProgress();
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric"
  }).format(new Date()).toUpperCase();
  return `
    <div class="welcome-line">
      <div><div class="eyebrow">${dateLabel}</div><h1 class="page-title">Welcome back, <span class="username">${escapeHtml(state.name)}</span></h1><p class="subtitle">Your next operation is waiting. Ready to jack in?</p></div>
      <div class="date-chip"><span>◷</span> LOCAL SESSION</div>
    </div>
    <section class="hero-card">
      <div class="hero-copy"><div class="eyebrow">INCOMING TRANSMISSION · PRIORITY 01</div><h2>The network won't save itself.</h2><p>Three threats are active across the grid. Choose a mission, outsmart the enemy, and become a legend in the underground.</p><button class="button button-primary" data-action="navigate" data-view="missions">Browse missions <span>↗</span></button></div>
      <div class="hero-art" aria-hidden="true"><div class="hero-orbit"></div><span class="hero-spark one"></span><span class="hero-spark two"></span><div class="hero-glyph">⌘</div></div>
    </section>
    <div class="stat-grid">
      ${statCard("Health", state.health, `/ ${state.maxHealth}`, "♡", (state.health / state.maxHealth) * 100, `${state.maxHealth - state.health} HP damage taken`)}
      ${statCard("Experience", state.xp, `/ ${xpNeeded()} XP`, "✳", progress, `${Math.max(0, xpNeeded() - state.xp)} XP to level ${state.level + 1}`, true)}
      ${statCard("Credits", state.coins, "CR", "◈", Math.min(100, state.coins), "Available balance")}
      ${statCard("Operative level", state.level, "LVL", "⌁", Math.min(100, state.level * 10), `Rank · ${state.level >= 5 ? "Netrunner" : state.level >= 3 ? "Specialist" : "Recruit"}`, true)}
    </div>
    <div class="section-heading"><div><h2>Available missions</h2><p>Pick your next target</p></div><button class="text-button" data-action="navigate" data-view="missions">View all missions →</button></div>
    <div class="mission-grid">${MISSIONS.map((mission) => missionCard(mission, false)).join("")}</div>
    <div class="section-heading"><div><h2>Your command log</h2><p>Signals from your current run</p></div></div>
    <div class="two-column">${activityPanel()}<section class="panel"><div class="panel-heading"><h3>Quick intel</h3><span>OPERATIVE FILE</span></div><div class="quick-stat-list">
      <div class="quick-stat"><span>Missions completed</span><strong>${state.statistics["Missions Completed"]}</strong></div>
      <div class="quick-stat"><span>Battles won</span><strong>${state.statistics["Battles Won"]}</strong></div>
      <div class="quick-stat"><span>Battles lost</span><strong>${state.statistics["Battles Lost"]}</strong></div>
      <div class="quick-stat"><span>Items carried</span><strong>${state.inventory.length}</strong></div>
    </div></section></div>`;
}

function renderMissions() {
  return `<div class="view-heading"><div class="eyebrow">OPERATION BOARD</div><h1>Mission select</h1><p>Choose a target to begin a turn-based encounter. Every mission pays out on victory.</p></div>
    <div class="mission-grid missions-view">${MISSIONS.map((mission) => missionCard(mission, true)).join("")}</div>`;
}

function renderInventory() {
  if (!state.inventory.length) {
    return `<div class="view-heading"><div class="eyebrow">FIELD KIT</div><h1>Inventory</h1><p>Tools and supplies recovered during your operations.</p></div><div class="empty-state"><span>▤</span>Your kit is empty. Complete a mission to earn a reward.</div>`;
  }
  const counts = state.inventory.reduce((items, name) => ({ ...items, [name]: (items[name] || 0) + 1 }), {});
  const items = Object.entries(counts).map(([name, count]) => {
    const patch = name === "Health Patch";
    return `<article class="inventory-item"><div class="item-icon">${patch ? "✚" : "◇"}</div><h3>${escapeHtml(name)}</h3><p>${patch ? "A quick-use med patch. Restores 35 health, up to your maximum." : "A token earned for completing a cyber operation."}</p><div class="item-count">QUANTITY · ${count}</div><button class="item-use" data-action="use-item" data-item="${escapeHtml(name)}" ${patch && state.health < state.maxHealth ? "" : "disabled"}>${patch ? (state.health < state.maxHealth ? "Use patch · +35 HP" : "Health already full") : "Mission memento"}</button></article>`;
  }).join("");
  return `<div class="view-heading"><div class="eyebrow">FIELD KIT</div><h1>Inventory</h1><p>Your supplies and recovered items. Health patches restore 35 HP.</p></div><div class="inventory-grid">${items}</div>`;
}

function renderStats() {
  const won = state.statistics["Battles Won"];
  const lost = state.statistics["Battles Lost"];
  const winRate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;
  const rank = state.level >= 5 ? "Netrunner" : state.level >= 3 ? "Specialist" : "Recruit";
  return `<div class="view-heading"><div class="eyebrow">OPERATIVE DOSSIER</div><h1>Performance report</h1><p>A complete readout of your progress across the network.</p></div>
    <section class="panel rank-card"><div class="rank-emblem">⌘</div><div class="rank-copy"><h3>${escapeHtml(state.name)}</h3><p>${rank} · CyberQuest operative</p></div><div class="rank-level">LEVEL ${String(state.level).padStart(2, "0")}</div></section>
    <div class="stats-overview">${statCard("Battles won", won, "W", "✓", winRate, `${winRate}% win rate`)}${statCard("Missions complete", state.statistics["Missions Completed"], "OPS", "⌁", Math.min(100, state.statistics["Missions Completed"] * 10), "Operations cleared", true)}${statCard("Credits earned", state.coins, "CR", "◈", Math.min(100, state.coins), "Current balance")}</div>
    <section class="panel"><div class="panel-heading"><h3>Combat record</h3><span>ALL-TIME STATISTICS</span></div><table class="stat-table"><tbody>
      <tr><td>Operative health</td><td>${state.health} / ${state.maxHealth} HP</td></tr>
      <tr><td>Energy reserve</td><td>${state.energy} / 100</td></tr>
      <tr><td>Experience points</td><td>${state.xp} / ${xpNeeded()} XP</td></tr>
      <tr><td>Battles won</td><td>${won}</td></tr>
      <tr><td>Battles lost</td><td>${lost}</td></tr>
      <tr><td>Missions completed</td><td>${state.statistics["Missions Completed"]}</td></tr>
      <tr><td>Items in inventory</td><td>${state.inventory.length}</td></tr>
    </tbody></table></section>`;
}

function healthBar(current, maximum, player) {
  const percentage = Math.max(0, Math.min(100, (current / maximum) * 100));
  return `<div class="health-bar ${player ? "player-health" : ""}"><div class="progress-fill" style="width:${percentage}%"></div></div>`;
}

function renderBattle() {
  const battle = state.battle;
  if (!battle) return renderMissions();
  const mission = MISSIONS.find((item) => item.id === battle.missionId);
  if (!mission) {
    state.battle = null;
    persist();
    return renderMissions();
  }
  const finished = battle.finished;
  const log = battle.log.map((line) => `<div class="log-line ${line.highlight ? "highlight" : ""}"><span class="log-time">${escapeHtml(line.time)}</span>${escapeHtml(line.message)}</div>`).join("");
  const result = finished
    ? `<div class="battle-result"><h3>${battle.result === "victory" ? "Mission complete" : battle.result === "defeat" ? "Signal lost" : "You escaped"}</h3><p>${battle.result === "victory" ? "The threat is neutralized. Rewards have been added to your operative file." : battle.result === "defeat" ? "Your health reached zero. Recover and try another operation." : "You disengaged from combat. No mission rewards were collected."}</p><button class="button button-primary" data-action="finish-battle">Return to mission board <span>↗</span></button></div>`
    : "";
  return `<div class="view-heading"><div class="eyebrow">LIVE OPERATION · ${escapeHtml(mission.name.toUpperCase())}</div><h1>Combat encounter</h1><p>Choose an action. The enemy retaliates after each turn.</p></div>
    <div class="battle-layout">
      <section class="battle-arena"><div class="arena-top"><span class="battle-tag">◉ ${finished ? "ENCOUNTER ENDED" : "COMBAT IN PROGRESS"}</span><span class="round-tag">TURN ${battle.turn}</span></div>
        <div class="combatants">
          <div class="combatant"><div class="combatant-avatar player-avatar">⌘</div><div class="combatant-name">${escapeHtml(state.name)}</div><div class="combatant-role">YOUR OPERATIVE</div><div class="health-copy"><span>HEALTH</span><span>${state.health} / ${state.maxHealth}</span></div>${healthBar(state.health, state.maxHealth, true)}</div>
          <div class="versus">VS</div>
          <div class="combatant"><div class="combatant-avatar">${mission.icon}</div><div class="combatant-name">${escapeHtml(battle.enemyName)}</div><div class="combatant-role">${escapeHtml(mission.threat)}</div><div class="health-copy"><span>THREAT</span><span>${battle.enemyHealth} / ${mission.health}</span></div>${healthBar(battle.enemyHealth, mission.health, false)}</div>
        </div>
        ${finished ? "" : `<div class="battle-actions"><button class="action-button" data-action="battle-move" data-move="attack"><span>⚔</span>Attack</button><button class="action-button" data-action="battle-move" data-move="scan"><span>⌕</span>Scan</button><button class="action-button" data-action="battle-move" data-move="defend"><span>⬡</span>Defend</button><button class="action-button escape" data-action="battle-move" data-move="escape"><span>↗</span>Escape</button></div>`}
      </section>
      <section class="panel"><div class="panel-heading"><h3>Combat log</h3><span>ENCRYPTED FEED</span></div><div class="combat-log">${log}</div>${result}</section>
    </div>`;
}

function render() {
  if (!state) {
    modal.hidden = false;
    setView("overview");
    screen.innerHTML = `<div class="empty-state"><span>⌘</span>Initialize your operative profile to enter CyberQuest.</div>`;
    updateSidebar();
    return;
  }
  modal.hidden = true;
  if (state.battle) {
    activeView = "battle";
    screen.innerHTML = renderBattle();
  } else {
    screen.innerHTML = activeView === "missions" ? renderMissions()
      : activeView === "inventory" ? renderInventory()
        : activeView === "stats" ? renderStats() : renderOverview();
  }
  updateSidebar();
}

function updateSidebar() {
  const name = state ? state.name : "New operative";
  document.getElementById("mini-name").textContent = name;
  document.getElementById("mini-avatar").textContent = name.charAt(0).toUpperCase() || "?";
  document.getElementById("mini-level").textContent = `LEVEL ${String(state ? state.level : 1).padStart(2, "0")} · ${state && state.level >= 5 ? "NETRUNNER" : state && state.level >= 3 ? "SPECIALIST" : "RECRUIT"}`;
  document.getElementById("breadcrumb-current").textContent = (state && state.battle ? "COMBAT" : activeView).toUpperCase();
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === activeView && !(state && state.battle));
  });
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === view));
}

function startMission(id) {
  const mission = MISSIONS.find((item) => item.id === id);
  if (!mission) return;
  state.battle = {
    missionId: id,
    enemyName: mission.enemy,
    enemyHealth: mission.health,
    turn: 1,
    defending: false,
    finished: false,
    result: "",
    log: [{ message: `${mission.enemy} enters the encounter. ${mission.id === "virus" ? "The virus begins spreading infection." : mission.id === "hacker" ? "The hacker launches a cyber attack." : "The firewall activates defense mode."}`, time: "TURN 01 · START", highlight: true }]
  };
  addActivity(`Mission started — ${mission.name}`);
  setView("missions");
  persist();
  render();
}

function logBattle(message, highlight) {
  const battle = state.battle;
  const stamp = `TURN ${String(battle.turn).padStart(2, "0")} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  battle.log.unshift({ message, time: stamp, highlight: Boolean(highlight) });
  battle.log = battle.log.slice(0, 16);
}

function finishBattle(result) {
  const battle = state.battle;
  battle.finished = true;
  battle.result = result;
  if (result === "victory") {
    state.statistics["Battles Won"] += 1;
    addXp(50);
    state.coins += 25;
    const mission = MISSIONS.find((item) => item.id === battle.missionId);
    state.statistics["Missions Completed"] += 1;
    if (!state.completedMissions.includes(mission.name)) state.completedMissions.push(mission.name);
    addXp(50);
    state.coins += 25;
    state.inventory.push("Mission Reward");
    logBattle("Victory! +100 XP, +50 coins, and Mission Reward collected.", true);
    addActivity(`Mission complete — ${mission.name}`);
  } else if (result === "defeat") {
    state.statistics["Battles Lost"] += 1;
    logBattle("Health depleted. Operation failed.", false);
    addActivity("Battle lost — operative health depleted");
  } else {
    logBattle("You escaped from the encounter.", false);
    addActivity("Operation aborted — disengaged from combat");
  }
}

function battleMove(move) {
  const battle = state && state.battle;
  if (!battle || battle.finished) return;
  if (move === "escape") {
    finishBattle("escaped");
    persist();
    render();
    return;
  }

  if (move === "attack") {
    const critical = Math.floor(Math.random() * 5) === 0;
    const damage = critical ? 40 : 25;
    battle.enemyHealth = Math.max(0, battle.enemyHealth - damage);
    logBattle(`${critical ? "Critical hit! " : ""}You dealt ${damage} damage to ${battle.enemyName}.`, critical);
  } else if (move === "scan") {
    logBattle(`Scan complete — ${battle.enemyName}: ${battle.enemyHealth} HP remaining, ${MISSIONS.find((item) => item.id === battle.missionId).attack} attack power.`);
  } else if (move === "defend") {
    battle.defending = true;
    logBattle("Defensive mode activated. Incoming damage will be halved.", true);
  } else {
    return;
  }

  if (battle.enemyHealth <= 0) {
    finishBattle("victory");
  } else {
    const mission = MISSIONS.find((item) => item.id === battle.missionId);
    const incoming = battle.defending ? Math.floor(mission.attack / 2) : mission.attack;
    state.health = Math.max(0, state.health - incoming);
    logBattle(`${battle.enemyName} dealt ${incoming} damage${battle.defending ? " — defense reduced the hit." : "."}`);
    battle.defending = false;
    battle.turn += 1;
    if (state.health <= 0) finishBattle("defeat");
  }
  persist();
  render();
}

function useItem(name) {
  if (name !== "Health Patch" || state.health >= state.maxHealth) return;
  const index = state.inventory.indexOf(name);
  if (index < 0) return;
  state.inventory.splice(index, 1);
  const before = state.health;
  state.health = Math.min(state.maxHealth, state.health + 35);
  addActivity(`Health Patch used — restored ${state.health - before} HP`);
  persist();
  showToast(`Health restored by ${state.health - before} HP.`);
  render();
}

function saveGame() {
  persist();
  const data = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(data);
  link.download = "cyberquest-save.json";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Game saved to this browser and downloaded.");
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "navigate" || button.classList.contains("nav-link")) {
    if (state && state.battle && !state.battle.finished) {
      showToast("Finish or escape the current encounter first.");
      return;
    }
    setView(button.dataset.view);
    render();
  } else if (action === "mission") {
    startMission(button.dataset.mission);
  } else if (action === "battle-move") {
    battleMove(button.dataset.move);
  } else if (action === "finish-battle") {
    state.battle = null;
    setView("missions");
    persist();
    render();
  } else if (action === "use-item") {
    useItem(button.dataset.item);
  } else if (action === "save") {
    if (state) saveGame();
    else showToast("Initialize an operative profile before saving.");
  } else if (action === "rename") {
    nameInput.value = state ? state.name : "";
    modal.hidden = false;
    nameInput.focus();
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest(".nav-link");
  if (link) {
    event.preventDefault();
    if (state && state.battle && !state.battle.finished) {
      showToast("Finish or escape the current encounter first.");
      return;
    }
    setView(link.dataset.view);
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".mission-card[role='button']")) {
    event.preventDefault();
    startMission(event.target.dataset.mission);
  }
});

document.getElementById("name-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }
  if (!state) state = newState(name);
  else state.name = name;
  addActivity(`Operative profile initialized — ${name}`);
  persist();
  modal.hidden = true;
  setView("overview");
  render();
});

render();
