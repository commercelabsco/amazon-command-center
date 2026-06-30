// ClickUp Live Sync — paste this entire script into Chrome DevTools Console
// while the tool (index.html) is open at localhost:8080.
// Fetches fresh tasks from the ClickUp API, filters to Team = "Account Support"
// and excludes closed tasks. Results are saved to localStorage and rendered live.
(async function () {
  const STORAGE_KEY = 'ah_specialist_data';
  const LIST_TO_BRAND = {
    '900800517580': 'Real Mushrooms',
    '900801980704': 'Future Method',
    '900800518093': 'Total Hydration',
    '901801459350': 'Primitive Scientific',
    '901801459380': 'Vitamin IQ',
    '901815858541': 'Joymode',
    '901812043874': 'WAM Mints',
    '901814356996': 'Pineapple',
    '901811202140': 'UA Body Skincare',
    '901806123973': 'Best Life 4 Pets',
    '900800517042': 'Future Kind',
    '901802161530': 'Wild Yam Naturals',
    '900900519863': 'PrimeMD',
    '900900460156': 'MedChoice',
    '900800037043': 'Nusava',
    '901801946547': 'Vera Blends',
    '900800895702': 'Avana Home',
    '901802113675': 'TT - Corporate',
    '901802101512': 'TT - PrimeMD',
    '901802101705': 'TT - Nusava',
    '901802101712': 'TT - MedChoice',
  };

  // Get token from app storage or prompt
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) {}
  const token = stored.clickupToken || prompt('Enter your ClickUp API token (pk_...):');
  if (!token) { console.error('[ClickUp Inject] No token provided. Aborting.'); return; }

  // Returns true if the task belongs to the "ACCOUNT SUPPORT" Team custom field.
  // ACCOUNT SUPPORT = orderindex 21 in this workspace's TEAM dropdown.
  function isAccountSupport(task) {
    const tf = (task.custom_fields || []).find(f => f.name && f.name.toLowerCase() === 'team');
    if (!tf || tf.value === undefined || tf.value === null || tf.value === '') return false;
    // Direct orderindex match — most reliable since type_config isn't always returned
    if (tf.value === 21 || String(tf.value) === '21') return true;
    // Fallback: look up by name in type_config options if available
    const opts = (tf.type_config && tf.type_config.options) || [];
    const selected = opts.find(o =>
      o.orderindex === tf.value ||
      String(o.orderindex) === String(tf.value) ||
      o.id === tf.value
    );
    const label = selected ? selected.name : String(tf.value);
    return label.toLowerCase().includes('account support');
  }

  console.log('[ClickUp Inject] Fetching live tasks for', Object.keys(LIST_TO_BRAND).length, 'lists...');

  const clickupTasks = {};
  let totalTasks = 0;
  const errors = [];

  await Promise.all(
    Object.entries(LIST_TO_BRAND).map(async ([listId, brand]) => {
      try {
        const url = `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=false&include_closed=false&page=0`;
        const resp = await fetch(url, { headers: { Authorization: token } });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const json = await resp.json();
        const tasks = (json.tasks || []).filter(isAccountSupport);
        if (tasks.length > 0) {
          clickupTasks[brand] = tasks;
          totalTasks += tasks.length;
        }
      } catch (e) {
        errors.push(brand + ': ' + e.message);
      }
    })
  );

  const now = new Date().toISOString();

  // 1. Update live in-memory data object
  if (typeof data !== 'undefined') {
    data.clickupTasks = clickupTasks;
    data.clickupToken = token;
    data.clickupLastSync = now;
  }

  // 2. Persist to localStorage (preserves ASIN, violations, etc.)
  stored.clickupTasks = clickupTasks;
  stored.clickupToken = token;
  stored.clickupLastSync = now;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

  // 3. Update UI immediately
  const syncLabel = document.getElementById('cu-last-sync');
  if (syncLabel) syncLabel.textContent = 'Last synced: ' + new Date(now).toLocaleString();
  const errEl = document.getElementById('cu-error');
  if (errEl) errEl.classList.add('hidden');
  if (typeof renderClickUpPage === 'function') renderClickUpPage();

  const brandCount = Object.keys(clickupTasks).length;
  const summary = `✓ Done! ${totalTasks} Account Support tasks loaded across ${brandCount} brand${brandCount !== 1 ? 's' : ''}.`
    + (errors.length ? `\n\n⚠️ Errors (${errors.length}):\n${errors.join('\n')}` : '');

  console.log('[ClickUp Inject]', summary);
  if (errors.length) {
    console.warn('[ClickUp Inject] CORS errors? Run: python -m http.server 8080  then open localhost:8080');
  }
  alert(summary);
})();
