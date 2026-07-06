(function () {
  'use strict';

  var STORAGE_KEY = 'calorieTracker.v1';
  var MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
  var MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snacks' };

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { goal: 2000, entries: [] };
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return { goal: 2000, entries: [] };
      if (!Array.isArray(parsed.entries)) parsed.entries = [];
      if (typeof parsed.goal !== 'number') parsed.goal = 2000;
      return parsed;
    } catch (e) {
      return { goal: 2000, entries: [] };
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  var data = loadData();

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function nowTimeStr() {
    var d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function uid() {
    return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function num(v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }

  // ---- Elements ----
  var goalInput = document.getElementById('goalInput');
  var saveGoalBtn = document.getElementById('saveGoalBtn');

  var mealSelect = document.getElementById('mealSelect');
  var foodInput = document.getElementById('foodInput');
  var caloriesInput = document.getElementById('caloriesInput');
  var proteinInput = document.getElementById('proteinInput');
  var carbsInput = document.getElementById('carbsInput');
  var fatInput = document.getElementById('fatInput');
  var dateInput = document.getElementById('dateInput');
  var timeInput = document.getElementById('timeInput');
  var addEntryBtn = document.getElementById('addEntryBtn');

  var viewDateInput = document.getElementById('viewDateInput');
  var dayTotals = document.getElementById('dayTotals');
  var dayProgressBar = document.getElementById('dayProgressBar');
  var mealGroups = document.getElementById('mealGroups');

  var historyChart = document.getElementById('historyChart');
  var historyList = document.getElementById('historyList');

  var exportBtn = document.getElementById('exportBtn');
  var importBtn = document.getElementById('importBtn');
  var clearAllBtn = document.getElementById('clearAllBtn');
  var importModal = document.getElementById('importModal');
  var importCloseBtn = document.getElementById('importCloseBtn');
  var importText = document.getElementById('importText');
  var importDoBtn = document.getElementById('importDoBtn');

  // ---- Init defaults ----
  goalInput.value = data.goal;
  dateInput.value = todayStr();
  timeInput.value = nowTimeStr();
  viewDateInput.value = todayStr();

  // ---- Goal ----
  saveGoalBtn.addEventListener('click', function () {
    var g = num(goalInput.value);
    data.goal = g > 0 ? g : 0;
    saveData();
    renderDay();
  });

  // ---- Add entry ----
  addEntryBtn.addEventListener('click', function () {
    var food = foodInput.value.trim();
    var calories = num(caloriesInput.value);

    if (!food) { foodInput.focus(); return; }
    if (calories <= 0) { caloriesInput.focus(); return; }

    var entry = {
      id: uid(),
      meal: mealSelect.value,
      food: food,
      calories: calories,
      protein: num(proteinInput.value),
      carbs: num(carbsInput.value),
      fat: num(fatInput.value),
      date: dateInput.value || todayStr(),
      time: timeInput.value || nowTimeStr()
    };

    data.entries.push(entry);
    saveData();

    foodInput.value = '';
    caloriesInput.value = '';
    proteinInput.value = '';
    carbsInput.value = '';
    fatInput.value = '';
    foodInput.focus();

    viewDateInput.value = entry.date;
    renderAll();
  });

  function deleteEntry(id) {
    data.entries = data.entries.filter(function (e) { return e.id !== id; });
    saveData();
    renderAll();
  }

  // ---- Day view ----
  viewDateInput.addEventListener('change', renderDay);

  function entriesForDate(dateStr) {
    return data.entries.filter(function (e) { return e.date === dateStr; });
  }

  function sumCalories(entries) {
    return entries.reduce(function (sum, e) { return sum + e.calories; }, 0);
  }

  function renderDay() {
    var dateStr = viewDateInput.value || todayStr();
    var dayEntries = entriesForDate(dateStr);
    var total = sumCalories(dayEntries);
    var goal = data.goal || 0;
    var remaining = goal - total;

    var totalsHtml = '<strong>' + total + ' kcal</strong> logged';
    if (goal > 0) {
      totalsHtml += ' &middot; goal ' + goal + ' kcal &middot; ' +
        (remaining >= 0 ? remaining + ' kcal remaining' : (-remaining) + ' kcal over');
    }
    dayTotals.innerHTML = totalsHtml;

    var pct = goal > 0 ? Math.min(100, (total / goal) * 100) : (total > 0 ? 100 : 0);
    dayProgressBar.style.width = pct + '%';
    dayProgressBar.classList.toggle('over', goal > 0 && total > goal);

    mealGroups.innerHTML = '';
    MEALS.forEach(function (mealKey) {
      var mealEntries = dayEntries.filter(function (e) { return e.meal === mealKey; })
        .sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); });
      var mealTotal = sumCalories(mealEntries);

      var group = document.createElement('div');
      group.className = 'meal-group';

      var header = document.createElement('h3');
      header.innerHTML = '<span>' + MEAL_LABELS[mealKey] + '</span><span class="muted">' + mealTotal + ' kcal</span>';
      group.appendChild(header);

      if (mealEntries.length === 0) {
        var empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = 'No entries yet.';
        group.appendChild(empty);
      } else {
        mealEntries.forEach(function (e) {
          var row = document.createElement('div');
          row.className = 'entry';

          var macros = [];
          if (e.protein) macros.push(e.protein + 'g protein');
          if (e.carbs) macros.push(e.carbs + 'g carbs');
          if (e.fat) macros.push(e.fat + 'g fat');
          var metaText = (e.time || '') + (macros.length ? ' &middot; ' + macros.join(', ') : '');

          row.innerHTML =
            '<div class="entry-main">' +
              '<span class="entry-name">' + escapeHtml(e.food) + ' — ' + e.calories + ' kcal</span>' +
              '<span class="entry-meta">' + metaText + '</span>' +
            '</div>';

          var actions = document.createElement('div');
          actions.className = 'entry-actions';
          var delBtn = document.createElement('button');
          delBtn.className = 'ghost small';
          delBtn.textContent = 'Delete';
          delBtn.addEventListener('click', function () { deleteEntry(e.id); });
          actions.appendChild(delBtn);
          row.appendChild(actions);

          group.appendChild(row);
        });
      }

      mealGroups.appendChild(group);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- History (last 7 days) ----
  function renderHistory() {
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var dateStr = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      days.push({
        date: dateStr,
        label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        total: sumCalories(entriesForDate(dateStr))
      });
    }

    var goal = data.goal || 0;
    var maxVal = Math.max(goal, 1, Math.max.apply(null, days.map(function (d) { return d.total; })));

    historyChart.innerHTML = '';
    days.forEach(function (d) {
      var wrap = document.createElement('div');
      wrap.className = 'history-bar-wrap';

      var value = document.createElement('div');
      value.className = 'history-bar-value';
      value.textContent = d.total > 0 ? d.total : '';
      wrap.appendChild(value);

      var bar = document.createElement('div');
      bar.className = 'history-bar' + (goal > 0 && d.total > goal ? ' over' : '');
      var heightPct = maxVal > 0 ? (d.total / maxVal) * 100 : 0;
      bar.style.height = Math.max(heightPct, d.total > 0 ? 2 : 0) + '%';
      wrap.appendChild(bar);

      var label = document.createElement('div');
      label.className = 'history-bar-label';
      label.textContent = d.label;
      wrap.appendChild(label);

      historyChart.appendChild(wrap);
    });

    historyList.innerHTML = '';
    days.slice().reverse().forEach(function (d) {
      var item = document.createElement('div');
      item.className = 'item';
      var statusText = goal > 0
        ? (d.total > goal ? (d.total - goal) + ' kcal over goal' : (goal - d.total) + ' kcal under goal')
        : '';
      item.innerHTML =
        '<h3>' + d.label + '</h3>' +
        '<div class="meta">' + d.total + ' kcal' + (statusText ? ' &middot; ' + statusText : '') + '</div>';
      historyList.appendChild(item);
    });
  }

  // ---- Export / Import ----
  exportBtn.addEventListener('click', function () {
    var json = JSON.stringify(data, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(function () {
        alert('Data copied to clipboard.');
      }, function () {
        promptFallback(json);
      });
    } else {
      promptFallback(json);
    }
  });

  function promptFallback(json) {
    window.prompt('Copy your data:', json);
  }

  importBtn.addEventListener('click', function () {
    importText.value = '';
    importModal.showModal();
  });

  importCloseBtn.addEventListener('click', function () {
    importModal.close();
  });

  importDoBtn.addEventListener('click', function () {
    try {
      var parsed = JSON.parse(importText.value);
      if (!parsed || !Array.isArray(parsed.entries)) throw new Error('Invalid format');
      data = {
        goal: typeof parsed.goal === 'number' ? parsed.goal : 2000,
        entries: parsed.entries
      };
      saveData();
      goalInput.value = data.goal;
      importModal.close();
      renderAll();
    } catch (e) {
      alert('Could not import: invalid JSON.');
    }
  });

  clearAllBtn.addEventListener('click', function () {
    if (!confirm('Clear all calorie tracker data? This cannot be undone.')) return;
    data = { goal: data.goal, entries: [] };
    saveData();
    renderAll();
  });

  function renderAll() {
    renderDay();
    renderHistory();
  }

  renderAll();
})();
