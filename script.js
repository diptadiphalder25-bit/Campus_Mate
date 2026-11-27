/* CampusMate — Complete Frontend Application Logic (localStorage) */

const STORAGE_KEY = "campusmate_state_v1";

function getTodayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFutureDateTimeLocal(daysAhead, hours = 10, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function createDefaultState() {
  const today = getTodayKey(0);
  const d1 = getTodayKey(-1);
  const d2 = getTodayKey(-2);
  const d3 = getTodayKey(-3);
  const d4 = getTodayKey(-4);

  return {
    activeSection: "dashboard",
    dailyGoalMinutes: 240, // 4h 0m
    subjects: [
      { id: "sub-1", name: "Data Structures", minutes: 150 },
      { id: "sub-2", name: "Operating Systems", minutes: 95 },
      { id: "sub-3", name: "Database Systems", minutes: 120 },
      { id: "sub-4", name: "Computer Networks", minutes: 75 }
    ],
    sessions: [
      { id: "ses-1", dateKey: today, timestamp: Date.now() - 2 * 3600 * 1000, subject: "Data Structures", minutes: 65, source: "Timer" },
      { id: "ses-2", dateKey: today, timestamp: Date.now() - 5 * 3600 * 1000, subject: "Database Systems", minutes: 45, source: "Manual" },
      { id: "ses-3", dateKey: d1, timestamp: Date.now() - 86400 * 1000, subject: "Operating Systems", minutes: 140, source: "Timer" },
      { id: "ses-4", dateKey: d2, timestamp: Date.now() - 2 * 86400 * 1000, subject: "Computer Networks", minutes: 185, source: "Timer" },
      { id: "ses-5", dateKey: d3, timestamp: Date.now() - 3 * 86400 * 1000, subject: "Data Structures", minutes: 120, source: "Manual" },
      { id: "ses-6", dateKey: d4, timestamp: Date.now() - 4 * 86400 * 1000, subject: "Database Systems", minutes: 160, source: "Timer" }
    ],
    // Timestamp-based timer state
    timer: {
      status: "idle", // "idle" | "running" | "paused"
      subject: "Data Structures",
      runStartMs: null,
      accumulatedMs: 0
    },
    // Local sample friend data (no cross-device backend sync)
    friends: [
      { id: "fr-1", name: "Aarav Sharma", subject: "Algorithms", todayHours: 3.5, goalHours: 4.0, weeklyHours: 21.5, sessions: 7 },
      { id: "fr-2", name: "Ananya Roy", subject: "Machine Learning Basics", todayHours: 4.0, goalHours: 4.0, weeklyHours: 24.0, sessions: 8 },
      { id: "fr-3", name: "Rohan Verma", subject: "Linear Algebra", todayHours: 2.0, goalHours: 3.5, weeklyHours: 14.5, sessions: 5 },
      { id: "fr-4", name: "Meera Nair", subject: "Software Engineering", todayHours: 2.75, goalHours: 3.0, weeklyHours: 18.0, sessions: 6 }
    ],
    events: [
      {
        id: "ev-1",
        title: "Operating Systems Mid-Term Exam",
        description: "Units 1 to 4: CPU scheduling, deadlocks, memory paging.",
        dateTime: getFutureDateTimeLocal(3, 9, 30),
        category: "Exam",
        priority: "High",
        favorite: true
      },
      {
        id: "ev-2",
        title: "DBMS Mini-Project Submission",
        description: "Upload ER diagram, SQL schema, and demo video.",
        dateTime: getFutureDateTimeLocal(6, 17, 0),
        category: "Project Deadline",
        priority: "High",
        favorite: true
      },
      {
        id: "ev-3",
        title: "TechnoFest Hackathon Registration",
        description: "Team of 3–4 students; submit project abstract.",
        dateTime: getFutureDateTimeLocal(11, 18, 0),
        category: "College Festival",
        priority: "Medium",
        favorite: false
      },
      {
        id: "ev-4",
        title: "Past Quiz: Number Theory",
        description: "Completed morning quiz in Room 204.",
        dateTime: getFutureDateTimeLocal(-2, 11, 0),
        category: "Assignment",
        priority: "Low",
        favorite: false
      }
    ],
    notices: [
      {
        id: "nt-1",
        title: "Semester Examination Timetable Published",
        body: "The provisional schedule for upcoming theory and practical exams is available at the Academic Block notice board.",
        category: "Exams",
        priority: "High",
        date: getTodayKey(0),
        pinned: true,
        bookmarked: true,
        read: false
      },
      {
        id: "nt-2",
        title: "Central Library Extended Hours During Exams",
        body: "Reading hall stays open until 11:00 PM on weekdays with valid student ID cards.",
        category: "Academics",
        priority: "Medium",
        date: getTodayKey(-1),
        pinned: true,
        bookmarked: false,
        read: true
      },
      {
        id: "nt-3",
        title: "Merit & Need-Based Scholarship Applications Open",
        body: "Submit verified income and attendance certificates to the student welfare office before next Friday.",
        category: "Scholarships",
        priority: "High",
        date: getTodayKey(-2),
        pinned: false,
        bookmarked: true,
        read: false
      },
      {
        id: "nt-4",
        title: "Annual Cultural & Tech Fest Volunteer Call",
        body: "Students interested in stage management, media, or hospitality can sign up via the student council desk.",
        category: "Events",
        priority: "Low",
        date: getTodayKey(-4),
        pinned: false,
        bookmarked: false,
        read: true
      }
    ]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultState();
      saveState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    const base = createDefaultState();
    return {
      ...base,
      ...parsed,
      timer: { ...base.timer, ...(parsed.timer || {}) },
      subjects: Array.isArray(parsed.subjects) && parsed.subjects.length ? parsed.subjects : base.subjects,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : base.sessions,
      friends: Array.isArray(parsed.friends) ? parsed.friends : base.friends,
      events: Array.isArray(parsed.events) ? parsed.events : base.events,
      notices: Array.isArray(parsed.notices) ? parsed.notices : base.notices
    };
  } catch (err) {
    console.error("Failed to load CampusMate state:", err);
    return createDefaultState();
  }
}

function saveState(stateObj = state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
  } catch (err) {
    console.error("Failed to save CampusMate state:", err);
  }
}

let state = loadState();
let activePeriodTab = "daily";
let activeLeaderboardTab = "today";
let toastTimeout = null;

function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.classList.remove("show");
  }, 2600);
}

function formatMinutesToHM(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatMsToHMS(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function getCurrentTimerElapsedMs() {
  if (state.timer.status === "running" && typeof state.timer.runStartMs === "number") {
    return state.timer.accumulatedMs + Math.max(0, Date.now() - state.timer.runStartMs);
  }
  return Math.max(0, state.timer.accumulatedMs || 0);
}

function getStudiedMinutesForDate(dateKey) {
  return state.sessions
    .filter((s) => s.dateKey === dateKey)
    .reduce((sum, s) => sum + Number(s.minutes || 0), 0);
}

function getStudiedMinutesForLastNDays(days) {
  let total = 0;
  for (let i = 0; i < days; i++) {
    total += getStudiedMinutesForDate(getTodayKey(-i));
  }
  return total;
}

function calculateStreakDays() {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const mins = getStudiedMinutesForDate(getTodayKey(-i));
    if (mins > 0) {
      streak++;
    } else if (i === 0) {
      // Allow today to still be in progress if yesterday had study time
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function priorityBadgeClass(priority) {
  if (priority === "High") return "badge-red";
  if (priority === "Medium") return "badge-amber";
  return "badge-green";
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ==================== NAVIGATION ==================== */
const SECTION_META = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your study goals, friends, deadlines, and campus notices"
  },
  study: {
    title: "StudyMate & Timer",
    subtitle: "Set daily goals, run timestamp timers, manage subjects, and review history"
  },
  circle: {
    title: "Study Circle",
    subtitle: "Track local demo friend study progress and compare leaderboard hours"
  },
  countdown: {
    title: "Event Countdown Builder",
    subtitle: "Live countdowns for exams, assignments, fests, deadlines, and events"
  },
  notices: {
    title: "Digital Notice Board",
    subtitle: "Search, filter, pin, bookmark, and manage campus notices"
  }
};

function switchSection(sectionId) {
  if (!SECTION_META[sectionId]) sectionId = "dashboard";
  state.activeSection = sectionId;
  saveState();

  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `section-${sectionId}`);
  });

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === sectionId);
  });

  document.getElementById("pageTitle").textContent = SECTION_META[sectionId].title;
  document.getElementById("pageSubtitle").textContent = SECTION_META[sectionId].subtitle;

  closeSidebar();
  renderAll();
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebarOverlay").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("open");
}

/* ==================== TIMER & STUDY LOGIC ==================== */
function startTimer() {
  const select = document.getElementById("timerSubjectSelect");
  if (select && select.value) {
    state.timer.subject = select.value;
  }
  if (state.timer.status !== "running") {
    state.timer.status = "running";
    state.timer.runStartMs = Date.now();
    saveState();
    updateTimerDisplays();
    renderDashboardShortcut();
    showToast(`Timer started for ${state.timer.subject}`);
  }
}

function pauseTimer() {
  if (state.timer.status === "running") {
    state.timer.accumulatedMs = getCurrentTimerElapsedMs();
    state.timer.runStartMs = null;
    state.timer.status = "paused";
    saveState();
    updateTimerDisplays();
    renderDashboardShortcut();
    showToast("Timer paused");
  }
}

function resumeTimer() {
  if (state.timer.status === "paused") {
    state.timer.status = "running";
    state.timer.runStartMs = Date.now();
    saveState();
    updateTimerDisplays();
    renderDashboardShortcut();
    showToast("Timer resumed");
  }
}

function stopAndSaveTimer() {
  const elapsedMs = getCurrentTimerElapsedMs();
  const loggedMinutes = Math.max(1, Math.round(elapsedMs / 60000));
  const subjectName = state.timer.subject || (state.subjects[0] ? state.subjects[0].name : "General Study");

  if (elapsedMs >= 1000) {
    recordStudySession(subjectName, loggedMinutes, "Timer");
    showToast(`Saved ${loggedMinutes} min for ${subjectName}`);
  } else {
    showToast("Timer reset (less than 1 second elapsed)");
  }

  state.timer.status = "idle";
  state.timer.runStartMs = null;
  state.timer.accumulatedMs = 0;
  saveState();
  renderAll();
}

function recordStudySession(subjectName, minutes, source = "Manual") {
  const cleanMins = Math.max(1, Math.round(Number(minutes) || 0));
  const today = getTodayKey(0);

  state.sessions.unshift({
    id: `ses-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    dateKey: today,
    timestamp: Date.now(),
    subject: subjectName,
    minutes: cleanMins,
    source
  });

  let sub = state.subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase());
  if (sub) {
    sub.minutes = Number(sub.minutes || 0) + cleanMins;
  } else {
    state.subjects.push({
      id: `sub-${Date.now()}`,
      name: subjectName,
      minutes: cleanMins
    });
  }

  saveState();
}

function updateTimerDisplays() {
  const elapsedMs = getCurrentTimerElapsedMs();
  const formatted = formatMsToHMS(elapsedMs);

  const display = document.getElementById("timerDisplay");
  if (display) display.textContent = formatted;

  const dashReadout = document.getElementById("dashTimerReadout");
  if (dashReadout) dashReadout.textContent = formatted;

  const badge = document.getElementById("timerStatusBadge");
  if (badge) {
    badge.textContent = state.timer.status.charAt(0).toUpperCase() + state.timer.status.slice(1);
    badge.className = "badge " + (
      state.timer.status === "running" ? "badge-green" :
      state.timer.status === "paused" ? "badge-amber" : "badge-cyan"
    );
  }

  const startBtn = document.getElementById("timerStartBtn");
  const pauseBtn = document.getElementById("timerPauseBtn");
  const resumeBtn = document.getElementById("timerResumeBtn");
  const stopBtn = document.getElementById("timerStopBtn");

  if (startBtn && pauseBtn && resumeBtn && stopBtn) {
    startBtn.disabled = state.timer.status === "running" || state.timer.status === "paused";
    pauseBtn.disabled = state.timer.status !== "running";
    resumeBtn.disabled = state.timer.status !== "paused";
    stopBtn.disabled = state.timer.status === "idle";
  }
}

function renderDashboardShortcut() {
  const subjEl = document.getElementById("dashActiveSubject");
  if (subjEl) {
    subjEl.textContent = `Subject: ${state.timer.subject || "General Study"}`;
  }
}

function renderStudySection() {
  updateTimerDisplays();

  // Populate subject dropdowns
  const timerSelect = document.getElementById("timerSubjectSelect");
  const manualSelect = document.getElementById("manualSubjectSelect");
  const optionsHtml = state.subjects
    .map((s) => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`)
    .join("");

  if (timerSelect) {
    timerSelect.innerHTML = optionsHtml;
    if (state.subjects.some((s) => s.name === state.timer.subject)) {
      timerSelect.value = state.timer.subject;
    } else if (state.subjects[0]) {
      state.timer.subject = state.subjects[0].name;
      timerSelect.value = state.timer.subject;
    }
  }
  if (manualSelect) {
    manualSelect.innerHTML = optionsHtml;
  }

  // Daily goal inputs & readouts
  const goalMins = Number(state.dailyGoalMinutes || 0);
  const studiedToday = getStudiedMinutesForDate(getTodayKey(0));
  const remaining = Math.max(0, goalMins - studiedToday);
  const pct = goalMins > 0 ? Math.min(100, Math.round((studiedToday / goalMins) * 100)) : 0;

  document.getElementById("goalHoursInput").value = Math.floor(goalMins / 60);
  document.getElementById("goalMinutesInput").value = goalMins % 60;
  document.getElementById("studyGoalPctBadge").textContent = `${pct}%`;
  document.getElementById("studyTodayReadout").textContent = formatMinutesToHM(studiedToday);
  document.getElementById("studyTargetReadout").textContent = formatMinutesToHM(goalMins);
  document.getElementById("studyRemainingReadout").textContent = formatMinutesToHM(remaining);
  document.getElementById("studyGoalProgressBar").style.width = `${pct}%`;

  // Subjects list
  const subjList = document.getElementById("subjectsList");
  if (!state.subjects.length) {
    subjList.innerHTML = `<p class="muted-text">No subjects added yet.</p>`;
  } else {
    subjList.innerHTML = state.subjects
      .map(
        (s) => `
        <div class="subject-row">
          <div>
            <strong>${escapeHtml(s.name)}</strong>
            <span class="muted-text"> — ${formatMinutesToHM(s.minutes)}</span>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" data-del-subject="${s.id}">Remove</button>
        </div>
      `
      )
      .join("");
  }

  // Period summary (Daily / Weekly / Monthly)
  renderPeriodSummary();

  // History table
  const tbody = document.getElementById("sessionHistoryBody");
  if (!state.sessions.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="muted-text">No study sessions recorded yet.</td></tr>`;
  } else {
    tbody.innerHTML = state.sessions
      .slice(0, 30)
      .map((ses) => {
        const dt = new Date(ses.timestamp || Date.now());
        const timeStr = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return `
          <tr>
            <td class="mono">${escapeHtml(ses.dateKey)} ${timeStr}</td>
            <td>${escapeHtml(ses.subject)}</td>
            <td><strong>${formatMinutesToHM(ses.minutes)}</strong></td>
            <td><span class="badge ${ses.source === "Timer" ? "badge-cyan" : "badge-purple"}">${escapeHtml(ses.source)}</span></td>
            <td><button class="btn btn-ghost btn-sm" type="button" data-del-session="${ses.id}">Delete</button></td>
          </tr>
        `;
      })
      .join("");
  }
}

function renderPeriodSummary() {
  const box = document.getElementById("periodSummaryText");
  if (!box) return;

  const todayMins = getStudiedMinutesForDate(getTodayKey(0));
  const weekMins = getStudiedMinutesForLastNDays(7);
  const monthMins = getStudiedMinutesForLastNDays(30);
  const streak = calculateStreakDays();

  let activeLabel = "Today Total";
  let activeMins = todayMins;
  if (activePeriodTab === "weekly") {
    activeLabel = "Last 7 Days Total";
    activeMins = weekMins;
  } else if (activePeriodTab === "monthly") {
    activeLabel = "Last 30 Days Total";
    activeMins = monthMins;
  }

  box.innerHTML = `
    <div class="summary-box">
      <div class="label">${activeLabel}</div>
      <div class="val">${formatMinutesToHM(activeMins)}</div>
    </div>
    <div class="summary-box">
      <div class="label">Current Streak</div>
      <div class="val">${streak} ${streak === 1 ? "Day" : "Days"}</div>
    </div>
    <div class="summary-box">
      <div class="label">Total Logged Sessions</div>
      <div class="val">${state.sessions.length}</div>
    </div>
  `;
}

/* ==================== STUDY CIRCLE LOGIC ==================== */
function renderStudyCircleSection() {
  document.getElementById("friendCountBadge").textContent = `${state.friends.length} Members`;

  // Leaderboard
  const sorted = [...state.friends].sort((a, b) => {
    const valA = activeLeaderboardTab === "today" ? Number(a.todayHours) : Number(a.weeklyHours);
    const valB = activeLeaderboardTab === "today" ? Number(b.todayHours) : Number(b.weeklyHours);
    return valB - valA;
  });

  const lbEl = document.getElementById("leaderboardList");
  if (!sorted.length) {
    lbEl.innerHTML = `<p class="muted-text">No friends in Study Circle yet.</p>`;
  } else {
    lbEl.innerHTML = sorted
      .map((fr, idx) => {
        const hrs = activeLeaderboardTab === "today" ? Number(fr.todayHours).toFixed(1) : Number(fr.weeklyHours).toFixed(1);
        const unit = activeLeaderboardTab === "today" ? "today" : "this week";
        return `
          <div class="mini-item">
            <div>
              <span class="badge ${idx === 0 ? "badge-cyan" : "badge-blue"}">#${idx + 1}</span>
              <strong style="margin-left:8px;">${escapeHtml(fr.name)}</strong>
              <div class="mini-item-sub">Studying: ${escapeHtml(fr.subject)}</div>
            </div>
            <div class="mono" style="font-weight:700; color: var(--accent-cyan);">${hrs}h ${unit}</div>
          </div>
        `;
      })
      .join("");
  }

  // Friend Cards
  const grid = document.getElementById("friendsGrid");
  if (!state.friends.length) {
    grid.innerHTML = `<p class="muted-text">Add a friend using the form to start tracking local demo activity.</p>`;
    return;
  }

  grid.innerHTML = state.friends
    .map((fr) => {
      const todayH = Number(fr.todayHours || 0);
      const goalH = Math.max(0.25, Number(fr.goalHours || 1));
      const pct = Math.min(100, Math.round((todayH / goalH) * 100));
      const initials = fr.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return `
        <article class="item-card">
          <div class="item-card-top">
            <div class="friend-meta">
              <div class="friend-avatar">${escapeHtml(initials || "FR")}</div>
              <div>
                <strong>${escapeHtml(fr.name)}</strong>
                <div class="mini-item-sub">Subject: ${escapeHtml(fr.subject)}</div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" type="button" data-del-friend="${fr.id}">Remove</button>
          </div>

          <div>
            <div class="mini-item-sub" style="display:flex; justify-content:space-between; margin-bottom:5px;">
              <span>Today: ${todayH.toFixed(1)}h / ${goalH.toFixed(1)}h goal</span>
              <span>${pct}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill fill-blue" style="width:${pct}%;"></div>
            </div>
          </div>

          <div class="mini-item-sub" style="display:flex; justify-content:space-between;">
            <span>Weekly: <strong>${Number(fr.weeklyHours || 0).toFixed(1)}h</strong></span>
            <span>Sessions: <strong>${Number(fr.sessions || 0)}</strong></span>
          </div>
        </article>
      `;
    })
    .join("");
}

/* ==================== EVENT COUNTDOWN LOGIC ==================== */
function getCountdownParts(targetIso) {
  const targetMs = new Date(targetIso).getTime();
  const diff = targetMs - Date.now();
  if (Number.isNaN(targetMs) || diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { expired: false, days, hours, minutes, seconds };
}

function resetEventForm() {
  document.getElementById("editEventId").value = "";
  document.getElementById("eventFormTitle").textContent = "Create Countdown Event";
  document.getElementById("eventSubmitBtn").textContent = "Add Countdown Event";
  document.getElementById("cancelEventEditBtn").classList.add("hidden");
  document.getElementById("eventForm").reset();
  document.getElementById("eventDateTime").value = getFutureDateTimeLocal(2, 10, 0);
}

function renderCountdownSection() {
  const catFilter = document.getElementById("filterEventCategory").value;
  const favOnly = document.getElementById("filterEventFavOnly").checked;

  const filtered = state.events.filter((ev) => {
    if (catFilter !== "ALL" && ev.category !== catFilter) return false;
    if (favOnly && !ev.favorite) return false;
    return true;
  });

  const upcoming = [];
  const completed = [];

  filtered.forEach((ev) => {
    const parts = getCountdownParts(ev.dateTime);
    if (parts.expired) {
      completed.push({ ev, parts });
    } else {
      upcoming.push({ ev, parts });
    }
  });

  upcoming.sort((a, b) => new Date(a.ev.dateTime) - new Date(b.ev.dateTime));
  completed.sort((a, b) => new Date(b.ev.dateTime) - new Date(a.ev.dateTime));

  document.getElementById("upcomingCountBadge").textContent = `${upcoming.length} Upcoming`;
  document.getElementById("completedCountBadge").textContent = `${completed.length} Completed`;

  const upGrid = document.getElementById("upcomingEventsGrid");
  if (!upcoming.length) {
    upGrid.innerHTML = `<p class="muted-text">No upcoming events match your filter.</p>`;
  } else {
    upGrid.innerHTML = upcoming
      .map(({ ev, parts }) => `
        <article class="item-card">
          <div class="item-card-top">
            <div>
              <span class="badge badge-cyan">${escapeHtml(ev.category)}</span>
              <span class="badge ${priorityBadgeClass(ev.priority)}">${escapeHtml(ev.priority)}</span>
            </div>
            <button class="link-btn" type="button" data-fav-event="${ev.id}">${ev.favorite ? "★ Favorite" : "☆ Favorite"}</button>
          </div>

          <div>
            <strong>${escapeHtml(ev.title)}</strong>
            <p class="mini-item-sub">${escapeHtml(ev.description || "No extra notes.")}</p>
          </div>

          <div class="countdown-digits mono">
            <div class="cd-box"><div class="cd-num">${parts.days}</div><div class="cd-lbl">Days</div></div>
            <div class="cd-box"><div class="cd-num">${String(parts.hours).padStart(2, "0")}</div><div class="cd-lbl">Hrs</div></div>
            <div class="cd-box"><div class="cd-num">${String(parts.minutes).padStart(2, "0")}</div><div class="cd-lbl">Min</div></div>
            <div class="cd-box"><div class="cd-num">${String(parts.seconds).padStart(2, "0")}</div><div class="cd-lbl">Sec</div></div>
          </div>

          <div class="btn-row">
            <button class="btn btn-secondary btn-sm" type="button" data-edit-event="${ev.id}">Edit</button>
            <button class="btn btn-danger btn-sm" type="button" data-del-event="${ev.id}">Delete</button>
          </div>
        </article>
      `)
      .join("");
  }

  const compGrid = document.getElementById("completedEventsGrid");
  if (!completed.length) {
    compGrid.innerHTML = `<p class="muted-text">No completed events yet.</p>`;
  } else {
    compGrid.innerHTML = completed
      .map(({ ev }) => `
        <article class="item-card" style="opacity: 0.82;">
          <div class="item-card-top">
            <div>
              <span class="badge badge-purple">${escapeHtml(ev.category)}</span>
              <span class="badge badge-green">Completed</span>
            </div>
          </div>
          <strong>${escapeHtml(ev.title)}</strong>
          <p class="mini-item-sub">${escapeHtml(ev.description || "")}</p>
          <div class="btn-row">
            <button class="btn btn-secondary btn-sm" type="button" data-edit-event="${ev.id}">Edit / Reschedule</button>
            <button class="btn btn-danger btn-sm" type="button" data-del-event="${ev.id}">Delete</button>
          </div>
        </article>
      `)
      .join("");
  }
}

/* ==================== DIGITAL NOTICE BOARD LOGIC ==================== */
function resetNoticeForm() {
  document.getElementById("editNoticeId").value = "";
  document.getElementById("noticeFormTitle").textContent = "Post New Notice";
  document.getElementById("noticeSubmitBtn").textContent = "Publish Notice";
  document.getElementById("cancelNoticeEditBtn").classList.add("hidden");
  document.getElementById("noticeForm").reset();
  document.getElementById("noticeDate").value = getTodayKey(0);
}

function renderNoticesSection() {
  const query = (document.getElementById("noticeSearchInput").value || "").trim().toLowerCase();
  const cat = document.getElementById("noticeCategoryFilter").value;
  const sortBy = document.getElementById("noticeSortSelect").value;
  const bookOnly = document.getElementById("noticeBookmarkOnly").checked;
  const unreadOnly = document.getElementById("noticeUnreadOnly").checked;

  const unreadCount = state.notices.filter((n) => !n.read).length;
  document.getElementById("noticeStatsBadge").textContent = `${state.notices.length} Total • ${unreadCount} Unread`;

  let list = state.notices.filter((nt) => {
    if (cat !== "ALL" && nt.category !== cat) return false;
    if (bookOnly && !nt.bookmarked) return false;
    if (unreadOnly && nt.read) return false;
    if (query) {
      const hay = `${nt.title} ${nt.body} ${nt.category}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const prioRank = { High: 3, Medium: 2, Low: 1 };

  list.sort((a, b) => {
    // Pinned always first
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }
    if (sortBy === "priority") {
      return (prioRank[b.priority] || 0) - (prioRank[a.priority] || 0);
    }
    if (sortBy === "oldest") {
      return String(a.date).localeCompare(String(b.date));
    }
    return String(b.date).localeCompare(String(a.date));
  });

  const container = document.getElementById("noticesList");
  if (!list.length) {
    container.innerHTML = `<p class="muted-text">No notices match your search or filters.</p>`;
    return;
  }

  container.innerHTML = list
    .map((nt) => `
      <article class="notice-card ${nt.pinned ? "pinned" : ""} ${!nt.read ? "unread" : ""}">
        <div class="notice-meta-row">
          <div class="notice-tags">
            ${nt.pinned ? `<span class="badge badge-amber">Pinned</span>` : ""}
            <span class="badge badge-blue">${escapeHtml(nt.category)}</span>
            <span class="badge ${priorityBadgeClass(nt.priority)}">${escapeHtml(nt.priority)}</span>
            <span class="badge ${nt.read ? "badge-green" : "badge-cyan"}">${nt.read ? "Read" : "Unread"}</span>
          </div>
          <span class="muted-text mono">${escapeHtml(nt.date)}</span>
        </div>

        <div>
          <h4 style="margin-bottom:4px;">${escapeHtml(nt.title)}</h4>
          <p class="mini-item-sub" style="font-size:0.86rem; color:var(--text-secondary);">${escapeHtml(nt.body)}</p>
        </div>

        <div class="notice-actions">
          <button class="btn btn-secondary btn-sm" type="button" data-pin-notice="${nt.id}">${nt.pinned ? "Unpin" : "Pin"}</button>
          <button class="btn btn-secondary btn-sm" type="button" data-book-notice="${nt.id}">${nt.bookmarked ? "Bookmarked ★" : "Bookmark ☆"}</button>
          <button class="btn btn-secondary btn-sm" type="button" data-read-notice="${nt.id}">Mark ${nt.read ? "Unread" : "Read"}</button>
          <button class="btn btn-ghost btn-sm" type="button" data-edit-notice="${nt.id}">Edit</button>
          <button class="btn btn-danger btn-sm" type="button" data-del-notice="${nt.id}">Delete</button>
        </div>
      </article>
    `)
    .join("");
}

/* ==================== DASHBOARD & CHARTS ==================== */
function renderDashboardSection() {
  const goalMins = Number(state.dailyGoalMinutes || 0);
  const studiedToday = getStudiedMinutesForDate(getTodayKey(0));
  const remaining = Math.max(0, goalMins - studiedToday);
  const pct = goalMins > 0 ? Math.min(100, Math.round((studiedToday / goalMins) * 100)) : 0;
  const streak = calculateStreakDays();

  document.getElementById("dashStudiedToday").textContent = formatMinutesToHM(studiedToday);
  document.getElementById("dashRemaining").textContent = `Remaining: ${formatMinutesToHM(remaining)}`;
  document.getElementById("dashDailyGoal").textContent = formatMinutesToHM(goalMins);
  document.getElementById("dashGoalBar").style.width = `${pct}%`;
  document.getElementById("dashGoalPercent").textContent = `${pct}% completed`;
  document.getElementById("dashStreak").textContent = `${streak} ${streak === 1 ? "Day" : "Days"}`;
  document.getElementById("dashSessionsCount").textContent = `${state.sessions.length} logged sessions`;

  renderDashboardShortcut();
  updateTimerDisplays();

  // Next upcoming event
  const upcomingEvents = state.events
    .map((ev) => ({ ev, parts: getCountdownParts(ev.dateTime) }))
    .filter((x) => !x.parts.expired)
    .sort((a, b) => new Date(a.ev.dateTime) - new Date(b.ev.dateTime));

  const nextTitleEl = document.getElementById("dashNextEventTitle");
  const nextTimerEl = document.getElementById("dashNextEventTimer");
  if (upcomingEvents.length) {
    const top = upcomingEvents[0];
    nextTitleEl.textContent = top.ev.title;
    nextTimerEl.textContent = `${top.parts.days}d ${String(top.parts.hours).padStart(2, "0")}h ${String(top.parts.minutes).padStart(2, "0")}m ${String(top.parts.seconds).padStart(2, "0")}s`;
  } else {
    nextTitleEl.textContent = "No upcoming events";
    nextTimerEl.textContent = "--d --h --m --s";
  }

  // Friends snapshot
  const friendsBox = document.getElementById("dashFriendsList");
  friendsBox.innerHTML = state.friends.slice(0, 3).map((fr) => `
    <div class="mini-item">
      <div>
        <div class="mini-item-title">${escapeHtml(fr.name)}</div>
        <div class="mini-item-sub">${escapeHtml(fr.subject)}</div>
      </div>
      <span class="badge badge-purple">${Number(fr.todayHours).toFixed(1)}h today</span>
    </div>
  `).join("") || `<p class="muted-text">No friends added.</p>`;

  // Events snapshot
  const eventsBox = document.getElementById("dashEventsList");
  eventsBox.innerHTML = upcomingEvents.slice(0, 3).map(({ ev, parts }) => `
    <div class="mini-item">
      <div>
        <div class="mini-item-title">${escapeHtml(ev.title)}</div>
        <div class="mini-item-sub">${escapeHtml(ev.category)}</div>
      </div>
      <span class="badge badge-cyan mono">${parts.days}d ${parts.hours}h</span>
    </div>
  `).join("") || `<p class="muted-text">No upcoming events.</p>`;

  // Notices snapshot
  const noticesBox = document.getElementById("dashNoticesList");
  const sortedNotices = [...state.notices].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  noticesBox.innerHTML = sortedNotices.slice(0, 3).map((nt) => `
    <div class="mini-item">
      <div>
        <div class="mini-item-title">${nt.pinned ? "📌 " : ""}${escapeHtml(nt.title)}</div>
        <div class="mini-item-sub">${escapeHtml(nt.category)} • ${escapeHtml(nt.date)}</div>
      </div>
      <span class="badge ${priorityBadgeClass(nt.priority)}">${escapeHtml(nt.priority)}</span>
    </div>
  `).join("") || `<p class="muted-text">No notices posted.</p>`;

  drawWeeklyChart();
  drawSubjectChart();
}

function prepareCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(280, Math.floor(rect.width || canvas.width));
  const height = Math.max(190, Math.floor(rect.height || 230));
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function drawWeeklyChart() {
  const canvas = document.getElementById("weeklyStudyChart");
  if (!canvas) return;
  const { ctx, width, height } = prepareCanvas(canvas);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const key = getTodayKey(-i);
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString([], { weekday: "short" });
    const hours = Number((getStudiedMinutesForDate(key) / 60).toFixed(2));
    days.push({ label, hours });
  }

  const maxVal = Math.max(2, ...days.map((d) => d.hours));
  const padLeft = 36;
  const padRight = 14;
  const padTop = 18;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  ctx.clearRect(0, 0, width, height);

  // Grid lines
  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 1;
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#94a3b8";

  for (let i = 0; i <= 4; i++) {
    const y = padTop + plotH - (i / 4) * plotH;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
    const valText = ((maxVal * i) / 4).toFixed(1) + "h";
    ctx.fillText(valText, 2, y + 4);
  }

  const slotW = plotW / days.length;
  const barW = Math.min(34, slotW * 0.55);

  days.forEach((d, idx) => {
    const barH = (d.hours / maxVal) * plotH;
    const x = padLeft + idx * slotW + (slotW - barW) / 2;
    const y = padTop + plotH - barH;

    const grad = ctx.createLinearGradient(0, y, 0, padTop + plotH);
    grad.addColorStop(0, "#3b82f6");
    grad.addColorStop(1, "#06b6d4");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]);
    ctx.fill();

    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    ctx.fillText(d.label, x + barW / 2, height - 10);
    ctx.textAlign = "left";
  });
}

function drawSubjectChart() {
  const canvas = document.getElementById("subjectChart");
  if (!canvas) return;
  const { ctx, width, height } = prepareCanvas(canvas);

  const items = state.subjects.slice(0, 6);
  ctx.clearRect(0, 0, width, height);

  if (!items.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.fillText("No subject study data yet.", 20, height / 2);
    return;
  }

  const maxMins = Math.max(30, ...items.map((s) => Number(s.minutes || 0)));
  const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];
  const rowH = Math.min(34, (height - 20) / items.length);

  ctx.font = "12px sans-serif";

  items.forEach((sub, i) => {
    const y = 14 + i * rowH;
    const labelW = 120;
    const barMaxW = Math.max(60, width - labelW - 65);
    const w = (Number(sub.minutes || 0) / maxMins) * barMaxW;

    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(sub.name.slice(0, 16), 8, y + 14);

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(labelW, y + 3, barMaxW, 16);

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(labelW, y + 3, Math.max(4, w), 16, 4);
    ctx.fill();

    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${(Number(sub.minutes || 0) / 60).toFixed(1)}h`, labelW + barMaxW + 8, y + 15);
  });
}

/* ==================== GLOBAL RENDER & EVENT LISTENERS ==================== */
function renderSidebarMeta() {
  const streak = calculateStreakDays();
  document.getElementById("sidebarStreak").textContent = `${streak} ${streak === 1 ? "Day" : "Days"}`;
  document.getElementById("sidebarGoalMini").textContent = `Goal: ${formatMinutesToHM(state.dailyGoalMinutes)} / day`;
}

function renderAll() {
  renderSidebarMeta();
  if (state.activeSection === "dashboard") renderDashboardSection();
  if (state.activeSection === "study") renderStudySection();
  if (state.activeSection === "circle") renderStudyCircleSection();
  if (state.activeSection === "countdown") renderCountdownSection();
  if (state.activeSection === "notices") renderNoticesSection();
}

function bindEvents() {
  // Navigation
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => switchSection(btn.dataset.section));
  });

  document.querySelectorAll("[data-jump]").forEach((btn) => {
    btn.addEventListener("click", () => switchSection(btn.dataset.jump));
  });

  document.getElementById("quickTimerBtn").addEventListener("click", () => switchSection("study"));
  document.getElementById("openSidebarBtn").addEventListener("click", openSidebar);
  document.getElementById("closeSidebarBtn").addEventListener("click", closeSidebar);
  document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);

  // Reset demo data
  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    if (confirm("Reset all CampusMate data back to default demo values?")) {
      state = createDefaultState();
      saveState(state);
      resetEventForm();
      resetNoticeForm();
      renderAll();
      showToast("Demo data restored");
    }
  });

  // Timer controls (Study page + Dashboard shortcut)
  document.getElementById("timerStartBtn").addEventListener("click", startTimer);
  document.getElementById("timerPauseBtn").addEventListener("click", pauseTimer);
  document.getElementById("timerResumeBtn").addEventListener("click", resumeTimer);
  document.getElementById("timerStopBtn").addEventListener("click", stopAndSaveTimer);

  document.getElementById("dashStartBtn").addEventListener("click", startTimer);
  document.getElementById("dashPauseBtn").addEventListener("click", () => {
    if (state.timer.status === "paused") resumeTimer();
    else pauseTimer();
  });
  document.getElementById("dashStopBtn").addEventListener("click", stopAndSaveTimer);

  document.getElementById("timerSubjectSelect").addEventListener("change", (e) => {
    state.timer.subject = e.target.value;
    saveState();
    renderDashboardShortcut();
  });

  // Daily goal form
  document.getElementById("dailyGoalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const h = Math.max(0, Math.min(23, Number(document.getElementById("goalHoursInput").value || 0)));
    const m = Math.max(0, Math.min(59, Number(document.getElementById("goalMinutesInput").value || 0)));
    const total = h * 60 + m;
    if (total <= 0) {
      showToast("Please set a daily goal greater than 0 minutes");
      return;
    }
    state.dailyGoalMinutes = total;
    saveState();
    renderAll();
    showToast(`Daily goal updated to ${formatMinutesToHM(total)}`);
  });

  // Add subject form
  document.getElementById("addSubjectForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newSubjectName");
    const name = input.value.trim();
    if (!name) return;
    if (state.subjects.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      showToast("Subject already exists");
      return;
    }
    state.subjects.push({ id: `sub-${Date.now()}`, name, minutes: 0 });
    state.timer.subject = name;
    saveState();
    input.value = "";
    renderStudySection();
    showToast(`Added subject: ${name}`);
  });

  // Manual session form
  document.getElementById("manualSessionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const subj = document.getElementById("manualSubjectSelect").value;
    const hrs = Math.max(0, Number(document.getElementById("manualHours").value || 0));
    const mins = Math.max(0, Number(document.getElementById("manualMinutes").value || 0));
    const totalMins = hrs * 60 + mins;
    if (totalMins <= 0) {
      showToast("Enter at least 1 minute");
      return;
    }
    recordStudySession(subj, totalMins, "Manual");
    renderAll();
    showToast(`Logged ${formatMinutesToHM(totalMins)} for ${subj}`);
  });

  // Period tabs
  document.querySelectorAll(".pill-btn[data-period]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn[data-period]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePeriodTab = btn.dataset.period;
      renderPeriodSummary();
    });
  });

  // Clear history
  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    if (confirm("Clear all recorded study sessions?")) {
      state.sessions = [];
      saveState();
      renderAll();
      showToast("Study history cleared");
    }
  });

  // Study Circle add friend
  document.getElementById("addFriendForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("friendName").value.trim();
    const subject = document.getElementById("friendSubject").value.trim();
    const todayHours = Math.max(0, Number(document.getElementById("friendTodayHours").value || 0));
    const goalHours = Math.max(0.25, Number(document.getElementById("friendGoalHours").value || 1));
    const weeklyHours = Math.max(0, Number(document.getElementById("friendWeeklyHours").value || 0));
    const sessions = Math.max(0, Number(document.getElementById("friendSessions").value || 0));

    state.friends.unshift({
      id: `fr-${Date.now()}`,
      name,
      subject,
      todayHours,
      goalHours,
      weeklyHours,
      sessions
    });
    saveState();
    e.target.reset();
    renderAll();
    showToast(`${name} added to Study Circle`);
  });

  // Leaderboard tabs
  document.querySelectorAll(".lb-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lb-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeLeaderboardTab = btn.dataset.lb;
      renderStudyCircleSection();
    });
  });

  // Event Countdown form
  document.getElementById("eventForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("editEventId").value;
    const title = document.getElementById("eventTitle").value.trim();
    const description = document.getElementById("eventDescription").value.trim();
    const dateTime = document.getElementById("eventDateTime").value;
    const category = document.getElementById("eventCategory").value;
    const priority = document.getElementById("eventPriority").value;
    const favorite = document.getElementById("eventFavorite").checked;

    if (!title || !dateTime) return;

    if (editId) {
      const idx = state.events.findIndex((ev) => ev.id === editId);
      if (idx !== -1) {
        state.events[idx] = { ...state.events[idx], title, description, dateTime, category, priority, favorite };
        showToast("Countdown event updated");
      }
    } else {
      state.events.push({
        id: `ev-${Date.now()}`,
        title,
        description,
        dateTime,
        category,
        priority,
        favorite
      });
      showToast("Countdown event created");
    }

    saveState();
    resetEventForm();
    renderAll();
  });

  document.getElementById("cancelEventEditBtn").addEventListener("click", resetEventForm);
  document.getElementById("filterEventCategory").addEventListener("change", renderCountdownSection);
  document.getElementById("filterEventFavOnly").addEventListener("change", renderCountdownSection);

  // Notice Board form
  document.getElementById("noticeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("editNoticeId").value;
    const title = document.getElementById("noticeTitle").value.trim();
    const body = document.getElementById("noticeBody").value.trim();
    const category = document.getElementById("noticeCategory").value;
    const priority = document.getElementById("noticePriority").value;
    const date = document.getElementById("noticeDate").value || getTodayKey(0);
    const pinned = document.getElementById("noticePinned").checked;

    if (!title || !body) return;

    if (editId) {
      const idx = state.notices.findIndex((nt) => nt.id === editId);
      if (idx !== -1) {
        state.notices[idx] = { ...state.notices[idx], title, body, category, priority, date, pinned };
        showToast("Notice updated");
      }
    } else {
      state.notices.unshift({
        id: `nt-${Date.now()}`,
        title,
        body,
        category,
        priority,
        date,
        pinned,
        bookmarked: false,
        read: false
      });
      showToast("Notice published");
    }

    saveState();
    resetNoticeForm();
    renderAll();
  });

  document.getElementById("cancelNoticeEditBtn").addEventListener("click", resetNoticeForm);
  ["noticeSearchInput", "noticeCategoryFilter", "noticeSortSelect", "noticeBookmarkOnly", "noticeUnreadOnly"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderNoticesSection);
    document.getElementById(id).addEventListener("change", renderNoticesSection);
  });

  // Delegated dynamic actions
  document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.dataset.delSubject) {
      state.subjects = state.subjects.filter((s) => s.id !== target.dataset.delSubject);
      saveState();
      renderStudySection();
      showToast("Subject removed");
    } else if (target.dataset.delSession) {
      state.sessions = state.sessions.filter((s) => s.id !== target.dataset.delSession);
      saveState();
      renderAll();
      showToast("Session deleted");
    } else if (target.dataset.delFriend) {
      state.friends = state.friends.filter((f) => f.id !== target.dataset.delFriend);
      saveState();
      renderAll();
      showToast("Friend removed from Study Circle");
    } else if (target.dataset.favEvent) {
      const ev = state.events.find((x) => x.id === target.dataset.favEvent);
      if (ev) {
        ev.favorite = !ev.favorite;
        saveState();
        renderCountdownSection();
      }
    } else if (target.dataset.editEvent) {
      const ev = state.events.find((x) => x.id === target.dataset.editEvent);
      if (ev) {
        switchSection("countdown");
        document.getElementById("editEventId").value = ev.id;
        document.getElementById("eventTitle").value = ev.title;
        document.getElementById("eventDescription").value = ev.description || "";
        document.getElementById("eventDateTime").value = ev.dateTime;
        document.getElementById("eventCategory").value = ev.category;
        document.getElementById("eventPriority").value = ev.priority;
        document.getElementById("eventFavorite").checked = Boolean(ev.favorite);
        document.getElementById("eventFormTitle").textContent = "Edit Countdown Event";
        document.getElementById("eventSubmitBtn").textContent = "Save Changes";
        document.getElementById("cancelEventEditBtn").classList.remove("hidden");
      }
    } else if (target.dataset.delEvent) {
      state.events = state.events.filter((x) => x.id !== target.dataset.delEvent);
      saveState();
      renderAll();
      showToast("Event deleted");
    } else if (target.dataset.pinNotice) {
      const nt = state.notices.find((x) => x.id === target.dataset.pinNotice);
      if (nt) {
        nt.pinned = !nt.pinned;
        saveState();
        renderAll();
      }
    } else if (target.dataset.bookNotice) {
      const nt = state.notices.find((x) => x.id === target.dataset.bookNotice);
      if (nt) {
        nt.bookmarked = !nt.bookmarked;
        saveState();
        renderNoticesSection();
      }
    } else if (target.dataset.readNotice) {
      const nt = state.notices.find((x) => x.id === target.dataset.readNotice);
      if (nt) {
        nt.read = !nt.read;
        saveState();
        renderNoticesSection();
      }
    } else if (target.dataset.editNotice) {
      const nt = state.notices.find((x) => x.id === target.dataset.editNotice);
      if (nt) {
        switchSection("notices");
        document.getElementById("editNoticeId").value = nt.id;
        document.getElementById("noticeTitle").value = nt.title;
        document.getElementById("noticeBody").value = nt.body;
        document.getElementById("noticeCategory").value = nt.category;
        document.getElementById("noticePriority").value = nt.priority;
        document.getElementById("noticeDate").value = nt.date;
        document.getElementById("noticePinned").checked = Boolean(nt.pinned);
        document.getElementById("noticeFormTitle").textContent = "Edit Notice";
        document.getElementById("noticeSubmitBtn").textContent = "Update Notice";
        document.getElementById("cancelNoticeEditBtn").classList.remove("hidden");
      }
    } else if (target.dataset.delNotice) {
      state.notices = state.notices.filter((x) => x.id !== target.dataset.delNotice);
      saveState();
      renderAll();
      showToast("Notice deleted");
    }
  });

  window.addEventListener("resize", () => {
    if (state.activeSection === "dashboard") {
      drawWeeklyChart();
      drawSubjectChart();
    }
  });
}

/* ==================== LIVE TICK LOOP ==================== */
function startLiveLoop() {
  setInterval(() => {
    const now = new Date();
    const clockEl = document.getElementById("liveClock");
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    if (state.timer.status === "running") {
      updateTimerDisplays();
    }

    if (state.activeSection === "countdown") {
      renderCountdownSection();
    } else if (state.activeSection === "dashboard") {
      const upcomingEvents = state.events
        .map((ev) => ({ ev, parts: getCountdownParts(ev.dateTime) }))
        .filter((x) => !x.parts.expired)
        .sort((a, b) => new Date(a.ev.dateTime) - new Date(b.ev.dateTime));
      const nextTimerEl = document.getElementById("dashNextEventTimer");
      if (nextTimerEl) {
        if (upcomingEvents.length) {
          const top = upcomingEvents[0];
          nextTimerEl.textContent = `${top.parts.days}d ${String(top.parts.hours).padStart(2, "0")}h ${String(top.parts.minutes).padStart(2, "0")}m ${String(top.parts.seconds).padStart(2, "0")}s`;
        } else {
          nextTimerEl.textContent = "--d --h --m --s";
        }
      }
    }
  }, 1000);
}

/* ==================== INITIALIZATION ==================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("eventDateTime").value = getFutureDateTimeLocal(2, 10, 0);
  document.getElementById("noticeDate").value = getTodayKey(0);
  bindEvents();
  switchSection(state.activeSection || "dashboard");
  startLiveLoop();
});