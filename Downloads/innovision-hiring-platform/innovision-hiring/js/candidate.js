/**
 * candidate.js — Candidate Portal Logic
 * Innovision Overseas UAE Hiring Platform v1.0.0
 */

'use strict';

/* ── CANDIDATE SESSION STATE ─────────────────────── */
const S = {
  source:    'Direct',
  job:       '',
  personal:  {},
  questions: [],
  answers:   {},
  voice:     {},
  scores:    {},
  evaluations: {},
  refId:     ''
};

/* ── VOICE RECOGNITION INSTANCES ─────────────────── */
const recs = {};

function norm(str) {
  return (str || '').toString().trim().toLowerCase();
}

function phoneDigitsOnly(str) {
  return (str || '').toString().replace(/[^0-9]/g, '');
}

function samePersonDetails(a, b) {
  // Compare core identity + profile fields (case-insensitive for text fields).
  return (
    norm(a.firstName)  === norm(b.firstName) &&
    norm(a.lastName)   === norm(b.lastName) &&
    phoneDigitsOnly(a.phone) === phoneDigitsOnly(b.phone) &&
    norm(a.email)      === norm(b.email) &&
    norm(a.city)       === norm(b.city) &&
    norm(a.experience) === norm(b.experience) &&
    norm(a.passport)   === norm(b.passport) &&
    norm(a.education)  === norm(b.education) &&
    norm(a.languages)  === norm(b.languages) &&
    norm(a.gulfExp)    === norm(b.gulfExp)
  );
}

/* ── SOURCE SELECTION ────────────────────────────── */
function selectSource(src, el) {
  S.source = src;
  document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ── STEP 1: VALIDATE PERSONAL DETAILS ──────────── */
function validateStep1() {
  const fname    = document.getElementById('fname').value.trim();
  const lname    = document.getElementById('lname').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const city     = document.getElementById('city').value.trim();
  const passport = document.getElementById('passport').value;
  const langsRaw = document.getElementById('langs').value.trim();
  const emailRaw = document.getElementById('email').value.trim();

  // Alphabets-only validation (allow spaces).
  // If you want commas for languages later, we can extend this rule.
  const alphaSpaceRe = /^[A-Za-z ]+$/;
  if (!alphaSpaceRe.test(fname) || !alphaSpaceRe.test(lname)) {
    showToast('First name and last name must contain alphabets only.', 'danger');
    return;
  }
  // Languages allow alphabets + commas (e.g. "Hindi, English").
  // - letters/spaces only inside each language token
  // - commas act only as separators
  // - no empty tokens, no trailing comma
  const alphaCommaSpaceRe = /^[A-Za-z]+(?: [A-Za-z]+)*(?:,\s*[A-Za-z]+(?: [A-Za-z]+)*)*$/;
  if (langsRaw && !alphaCommaSpaceRe.test(langsRaw)) {
    showToast('Languages must contain alphabets and commas only (e.g., Hindi, English).', 'danger');
    return;
  }

  if (!fname || !lname || !phone || !city || !passport) {
    showToast('Please fill all required fields (*).', 'danger');
    return;
  }
  // Phone: allow only digits, + and - (e.g. +91-9876543210).
  const phoneAllowedRe = /^[0-9+-]+$/;
  if (!phoneAllowedRe.test(phone)) {
    showToast('Mobile number can contain only numbers, "+" and "-".', 'danger');
    return;
  }
  // Require minimum digits (ignore + and - for this check).
  const phoneDigits = phone.replace(/[^0-9]/g, '');
  if (phoneDigits.length < 8) {
    showToast('Please enter a valid mobile number.', 'danger');
    return;
  }

  if (emailRaw && !emailRaw.includes('@')) {
    showToast('Invalid email.', 'danger');
    return;
  }

  // City / State: letters, spaces, commas, and periods only (no digits or symbols).
  const cityAllowedRe = /^[A-Za-z., ]+$/;
  if (!cityAllowedRe.test(city)) {
    showToast('City / State may only contain letters, commas, and periods.', 'danger');
    return;
  }

  const candidatePersonal = {
    firstName:  fname,
    lastName:   lname,
    phone:      phone,
    email:      emailRaw,
    city:       city,
    experience: document.getElementById('exp').value || '0',
    passport:   passport,
    education:  document.getElementById('education').value,
    languages:  langsRaw || 'Not specified',
    gulfExp:    document.getElementById('gulf_exp').value || 'Not specified'
  };

  // Prevent duplicate users by phone/email, unless it's the same exact user profile.
  const existing = loadAdminData();
  const candPhoneDigits = phoneDigitsOnly(candidatePersonal.phone);
  const candEmail = norm(candidatePersonal.email);
  const conflicts = existing.filter(r => {
    const samePhone = candPhoneDigits && phoneDigitsOnly(r.phone) === candPhoneDigits;
    const sameEmail = candEmail && norm(r.email) === candEmail;
    return samePhone || sameEmail;
  });

  if (conflicts.length) {
    const hasExactSameUser = conflicts.some(r => samePersonDetails(r, candidatePersonal));
    if (!hasExactSameUser) {
      showToast('User already exists with this mobile number or email.', 'danger');
      return;
    }
  }

  S.personal = candidatePersonal;
  goStep(2);
}

/* ── STEP 2: JOB SELECTION ───────────────────────── */
function selectJob(key) {
  S.job = key;
  document.querySelectorAll('.job-card').forEach(c => c.classList.remove('selected'));
  const el = document.getElementById('job-' + key);
  if (el) el.classList.add('selected');
}

function validateStep2() {
  if (!S.job) {
    showToast('Please select a deployment role.', 'danger');
    return;
  }
  buildQuestions();
  goStep(3);
}

/* ── STEP 3: BUILD QUESTIONS ─────────────────────── */
function buildQuestions() {
  const allQs = QB[S.job] || [];
  
  // Deduplicate questions by text to avoid asking the same question twice
  const uniqueQs = [];
  const seen = new Set();
  for (let q of allQs) {
    const qt = (q.question || '').toLowerCase().trim();
    if (!seen.has(qt)) {
      seen.add(qt);
      uniqueQs.push(q);
    }
  }

  const pool = uniqueQs.sort(() => Math.random() - 0.5);
  const desiredCount = S.job === 'security' ? 20 : 5;
  S.questions = pool.slice(0, Math.min(desiredCount, pool.length));
  S.answers   = {};
  S.voice     = {};
  S.evaluations = {};

  const roleInfo = ROLES[S.job];
  document.getElementById('q-role-title').textContent =
    (roleInfo?.icon || '') + '  ' + (roleInfo?.label || '') + ' — Skill Assessment';

  const container = document.getElementById('q-container');
  container.innerHTML = '';

  if (!S.questions.length) {
    container.innerHTML =
      '<p style="color:var(--muted);padding:20px;text-align:center;">No questions configured for this role yet. Please contact Innovision admin.</p>';
    return;
  }

  S.questions.forEach((q, i) => {
    const isMcq = Array.isArray(q.options) && q.options.length > 0;
    const writtenHtml = isMcq
      ? `
        <div class="form-group">
          <label class="form-label">Choose the correct option</label>
          <div class="mcq-options" role="radiogroup" aria-label="Options for question ${i + 1}">
            ${(q.options || []).map(opt => `
              <label class="mcq-option">
                <input type="radio" name="opt-${q.id}" value="${escapeHtml(opt.key)}"
                  onchange="S.answers['${q.id}']=this.value" />
                <span class="mcq-key">${escapeHtml(opt.key)}.</span>
                <span class="mcq-text">${escapeHtml(opt.text)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `
      : `
        <div class="form-group">
          <label class="form-label">Written Answer</label>
          <textarea class="text-answer" id="ans-${q.id}"
            placeholder="Type your answer here…"
            oninput="S.answers['${q.id}']=this.value"
            aria-label="Written answer for question ${i + 1}"></textarea>
        </div>
      `;

    const card = document.createElement('div');
    card.className = 'q-card';
    card.innerHTML = `
      <div class="q-meta">
        <span class="q-num">Q${i + 1} of ${S.questions.length}</span>
        <span class="q-badge ${BADGE_MAP[q.type]}">${BADGE_LBL[q.type]}</span>
      </div>
      ${q.passage ? `<div class="q-passage">${escapeHtml(q.passage)}</div>` : ''}
      <div class="q-text">${escapeHtml(q.question)}</div>
      ${writtenHtml}
      <div class="voice-row">
        <button class="btn-voice" id="vbtn-${q.id}" onclick="toggleVoice('${q.id}')"
          aria-label="Record voice answer for question ${i + 1}">
          <span class="rec-dot"></span> Record Voice Answer
        </button>
        <span class="v-status" id="vs-${q.id}" aria-live="polite">Click to record</span>
      </div>
      <div class="v-transcript" id="vt-${q.id}" aria-live="polite">Voice transcript will appear here…</div>
    `;
    container.appendChild(card);
  });
}

/* ── VOICE RECORDING ─────────────────────────────── */
function toggleVoice(qid) {
  const btn = document.getElementById('vbtn-' + qid);
  const st  = document.getElementById('vs-'   + qid);
  const tr  = document.getElementById('vt-'   + qid);

  const hasSpeech =
    ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  // ── Fallback demo mode (no Speech API) ──
  if (!hasSpeech) {
    if (btn.classList.contains('recording')) {
      btn.classList.remove('recording');
      btn.innerHTML = '<span class="rec-dot"></span> Record Voice Answer';
      st.textContent = 'Stopped';
    } else {
      btn.classList.add('recording');
      btn.innerHTML = '<span class="rec-dot"></span> Recording…';
      st.textContent = 'Recording (demo mode)…';
      const demos = [
        'I would immediately stop and report the defect to my supervisor before moving the vehicle.',
        'I will pull over safely, switch on hazard lights, apply parking brake and call my supervisor.',
        'I would politely decline and explain UAE traffic law to the client, then take the approved route.',
        'I would document all findings and escalate to Innovision management with a full root cause report.',
        'I would calmly separate the individuals, ensure safety, and notify security control immediately.'
      ];
      const idx = S.questions.findIndex(q => q.id === qid);
      setTimeout(() => {
        const t = demos[idx % demos.length] || 'Voice response recorded.';
        S.voice[qid] = t;
        tr.textContent = t;
        btn.classList.remove('recording');
        btn.innerHTML = '<span class="rec-dot"></span> Re-record';
        st.textContent = '✓ Recorded';
      }, 2500);
    }
    return;
  }

  // ── Stop existing recording ──
  if (recs[qid]) {
    recs[qid].stop();
    delete recs[qid];
    btn.classList.remove('recording');
    btn.innerHTML = '<span class="rec-dot"></span> Re-record';
    st.textContent = '✓ Recorded';
    return;
  }

  // ── Start real speech recognition ──
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SpeechRecognition();
  r.continuous     = true;
  r.interimResults = true;
  r.lang           = 'en-IN';

  r.onresult = e => {
    let fin = '', inter = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) fin   += e.results[i][0].transcript;
      else                       inter += e.results[i][0].transcript;
    }
    if (fin) S.voice[qid] = (S.voice[qid] || '') + fin;
    tr.textContent = (S.voice[qid] || '') + inter;
  };

  r.onerror = () => {
    st.textContent = 'Microphone error — please try again';
    btn.classList.remove('recording');
    btn.innerHTML = '<span class="rec-dot"></span> Record Voice Answer';
  };

  r.onend = () => {
    btn.classList.remove('recording');
    btn.innerHTML = '<span class="rec-dot"></span> Re-record';
    st.textContent = '✓ Recorded';
  };

  r.start();
  recs[qid] = r;
  btn.classList.add('recording');
  btn.innerHTML = '<span class="rec-dot"></span> Stop Recording';
  st.textContent = 'Listening…';
}

/* ── SUBMIT ASSESSMENT ───────────────────────────── */
function submitAssessment() {
  // Check minimum answers
  let answered = 0;
  S.questions.forEach(q => {
    if ((S.answers[q.id] || '').trim() || (S.voice[q.id] || '').trim()) answered++;
  });
  if (answered < Math.ceil(S.questions.length / 2)) {
    showToast('Please answer at least half the questions before submitting.', 'danger');
    return;
  }

  // Calculate scores
  const reading = scoreReading();
  const voice   = scoreVoice();
  const quality = scoreQuality();
  const total   = Math.round(reading * 0.35 + voice * 0.3 + quality * 0.35);

  S.scores = { reading, voice, quality, total };
  S.refId  = 'INV' + Date.now().toString().slice(-7);

  // Save to admin data
  const record = {
    id:        S.refId,
    ...S.personal,
    job:       S.job,
    source:    S.source,
    scores:    S.scores,
    evaluations: { ...S.evaluations },
    questions: S.questions,
    answers:   { ...S.answers },
    voice:     { ...S.voice },
    status:    'pending',
    timestamp: new Date().toISOString()
  };

  let data = loadAdminData();
  data.push(record);
  saveAdminData(data);

  showResult(total, reading, voice, quality);
  S.submitted = true;
  goStep(4);
}

/* ── SCORING ALGORITHMS ──────────────────────────── */
function allQuestionsHaveExpected() {
  return (
    S.questions.length > 0 &&
    S.questions.every(q => (q.expectedAnswer || '').toString().trim().length > 0)
  );
}

function scoreReading() {
  if (allQuestionsHaveExpected()) {
    let sum = 0;
    const total = Math.max(S.questions.length, 1);

    S.questions.forEach(q => {
      const candidate = (S.answers[q.id] || '').toString();
      const res = evaluateCandidateForQuestion(q, candidate);

      S.evaluations[q.id] = S.evaluations[q.id] || {};
      S.evaluations[q.id].written = { matched: res.matched, score: res.score };
      sum += res.score;
    });

    return Math.round((sum / total) * 100);
  }

  // Fallback: existing heuristic scoring for roles without expected answers.
  let s = 58;
  S.questions.forEach(q => {
    const a = (S.answers[q.id] || '').toLowerCase();
    if (q.type === 'reading' && a.length > 15) s += 10;
    if (a.length > 70) s += 8;
  });
  return Math.min(100, s);
}

function scoreVoice() {
  if (allQuestionsHaveExpected()) {
    let sum = 0;
    const total = Math.max(S.questions.length, 1);

    S.questions.forEach(q => {
      const candidate = (S.voice[q.id] || '').toString();
      const res = evaluateCandidateForQuestion(q, candidate);

      S.evaluations[q.id] = S.evaluations[q.id] || {};
      S.evaluations[q.id].voice = { matched: res.matched, score: res.score };
      sum += res.score;
    });

    return Math.round((sum / total) * 100);
  }

  // Fallback: existing heuristic scoring for roles without expected answers.
  const filled = Object.values(S.voice).filter(v => v && v.length > 8).length;
  return Math.round(38 + (filled / Math.max(S.questions.length, 1)) * 62);
}

function scoreQuality() {
  if (allQuestionsHaveExpected()) {
    let sum = 0;
    const total = Math.max(S.questions.length, 1);

    S.questions.forEach(q => {
      const ev = S.evaluations[q.id] || {};
      const ws = typeof ev.written?.score === 'number' ? ev.written.score : 0;
      const vs = typeof ev.voice?.score   === 'number' ? ev.voice.score   : 0;
      sum += (ws + vs) / 2;
    });

    return Math.round((sum / total) * 100);
  }

  // Fallback: existing heuristic scoring for roles without expected answers.
  let s = 48;
  S.questions.forEach(q => {
    const a = (S.answers[q.id] || '').trim();
    const v = (S.voice[q.id]   || '').trim();
    if (a.length > 45)  s += 8;
    if (a.length > 110) s += 5;
    if (v.length > 25)  s += 7;
  });
  return Math.min(100, s);
}

// Advanced Text Evaluation (Sørensen-Dice + Token Overlap)
function getBigrams(str) {
  const bigrams = new Set();
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.add(str.substring(i, i + 2));
  }
  return bigrams;
}

function calculateDiceCoefficient(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  const bg1 = getBigrams(str1);
  const bg2 = getBigrams(str2);
  if (bg1.size === 0 || bg2.size === 0) return 0;
  let intersection = 0;
  for (let bg of bg1) {
    if (bg2.has(bg)) intersection++;
  }
  return (2.0 * intersection) / (bg1.size + bg2.size);
}

function evaluateAnswerLenient(candidate, expected) {
  const cNorm = normalizeText(candidate);
  const eNorm = normalizeText(expected);

  if (!cNorm || !eNorm) return { matched: false, score: 0 };

  // 1. Exact Substring Match
  if (cNorm.includes(eNorm) || eNorm.includes(cNorm)) {
    return { matched: true, score: 1 };
  }

  // 2. Token Overlap calculation
  const candTokens = tokenizeForScoring(cNorm);
  const expTokens  = tokenizeForScoring(eNorm);
  
  if (!expTokens.length) return { matched: false, score: 0 };

  const expSet = new Set(expTokens);
  let commonTokens = 0;
  expSet.forEach(t => { if (candTokens.includes(t)) commonTokens++; });
  const tokenScore = commonTokens / expTokens.length;

  // 3. Sørensen-Dice Coefficient
  const diceScore = calculateDiceCoefficient(cNorm, eNorm);

  // Combine Scores (take highest)
  const finalScore = Math.max(tokenScore, diceScore);
  
  // Set an adaptive threshold based on length
  const threshold = expTokens.length < 4 ? 0.55 : 0.40;
  const matched = finalScore >= threshold;

  return { matched, score: Math.max(0, Math.min(1, finalScore)) };
}

function evaluateCandidateForQuestion(q, candidateRaw) {
  // MCQ: allow matching by option key (A/B/C/D) OR by the option text.
  if (q && q.expectedOption && Array.isArray(q.options) && q.options.length > 0) {
    const c = (candidateRaw || '').toString().trim();
    const candKey = c.toUpperCase();
    if (candKey === q.expectedOption) return { matched: true, score: 1 };
    // If they typed the option text instead of selecting.
    return evaluateAnswerLenient(c, q.expectedAnswer || '');
  }
  return evaluateAnswerLenient((candidateRaw || '').toString(), (q?.expectedAnswer || '').toString());
}

function normalizeText(str) {
  return (str || '')
    .toString()
    .replace(/[’]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeForScoring(norm) {
  const STOP = new Set([
    'the','a','an','and','or','to','of','in','for','with','on','at','by','from','that',
    'this','it','its','are','is','was','were','be','been','being','as','but','not','very'
  ]);

  return (norm || '')
    .split(' ')
    .map(t => t.trim())
    .filter(t => t && t.length >= 2 && !STOP.has(t));
}

/* ── DISPLAY RESULT ──────────────────────────────── */
function showResult(total, reading, voice, quality) {
  const setTxt = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const setStyle = (id, prop, val) => { const el = document.getElementById(id); if (el) el.style[prop] = val; };

  setTxt('final-score', total);
  setTxt('ref-id', S.refId);
  setTxt('sc-r', reading);
  setTxt('sc-v', voice);
  setTxt('sc-q', quality);
  setStyle('bar-r', 'width', reading + '%');
  setStyle('bar-v', 'width', voice   + '%');
  setStyle('bar-q', 'width', quality + '%');

  // Score ring animation
  const circ   = 390;
  const offset = circ - (circ * total / 100);
  setStyle('result-ring', 'strokeDashoffset', offset);

  let grade, color;
  if      (total >= 80) { grade = 'Excellent — Strong Candidate'; color = 'var(--success)'; }
  else if (total >= 65) { grade = 'Good — Recommended';           color = 'var(--gold)';    }
  else if (total >= 50) { grade = 'Average — Needs Review';       color = 'var(--warning)'; }
  else                  { grade = 'Below Threshold';              color = 'var(--danger)';  }

  setHtml('grade-display', `<span class="grade-pill" style="background:${color}20;color:${color};">${grade}</span>`);
}

/* ── UTILITY ─────────────────────────────────────── */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

/* ── FLOW RESET ──────────────────────────────────── */
function resetCandidate() {
  S.source = 'Direct';
  S.job = '';
  S.personal = {};
  S.questions = [];
  S.answers = {};
  S.voice = {};
  S.scores = {};
  S.evaluations = {};
  S.refId = '';
  S.submitted = false;
}

function applyAgain() {
  resetCandidate();
  const qc = document.getElementById('q-container');
  if (qc) qc.innerHTML = '';
  if (typeof buildJobGrid === 'function') buildJobGrid();
  goStep(0);
}

function goToHomePage() {
  // After submit, return to first page (fresh state).
  resetCandidate();
  const qc = document.getElementById('q-container');
  if (qc) qc.innerHTML = '';
  if (typeof buildJobGrid === 'function') buildJobGrid();
  if (typeof goHome === 'function') goHome();
  else goStep(0);
}

/* ── INPUT FILTERING (alphabets-only) ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const nameCharRe = /[^a-zA-Z ]/g;       // remove everything except letters + spaces
  const langsCharRe = /[^a-zA-Z, ]/g;    // remove everything except letters + comma + spaces
  const phoneCharRe = /[^0-9+\-]/g;      // remove everything except digits, + and -
  const cityCharRe = /[^a-zA-Z., ]/g;    // letters, comma, period, space only
  ['fname', 'lname', 'langs', 'phone', 'city'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (id === 'langs') {
        // Keep backspace/delete feeling natural: only strip invalid characters,
        // and lightly normalize comma usage without trimming the whole string.
        let v = el.value.replace(langsCharRe, '');
        // Prevent duplicate commas like ",," or ", ,"
        v = v.replace(/\s*,\s*,+/g, ',');
        // Do NOT force a space after comma (lets backspace work naturally)
        // Collapse multiple spaces (but keep user spacing around commas)
        v = v.replace(/[ ]{2,}/g, ' ');
        el.value = v;
      } else if (id === 'phone') {
        // Allow only digits, + and -; keep backspace/paste natural.
        el.value = el.value.replace(phoneCharRe, '');
      } else if (id === 'city') {
        let v = el.value.replace(cityCharRe, '');
        v = v.replace(/[ ]{2,}/g, ' ');
        el.value = v;
      } else {
        el.value = el.value.replace(nameCharRe, '');
        el.value = el.value.replace(/\s+/g, ' ').trimStart();
      }
    });
  });
});
