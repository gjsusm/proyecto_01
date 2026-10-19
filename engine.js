/***********************************************************************
 * CONFIGURACIÓN COMERCIAL DE PYQUEST PRO
 * Edita estos 3 datos con tu número de WhatsApp y tu URL de Google Sheets
 ***********************************************************************/
const COMMERCIAL_CONFIG = {
  WHATSAPP_PHONE: "51964343967", // Tu número con código de país (51 para Perú)
  PRICE_DISPLAY: "S/ 10.00",
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwH386j_ZhcQafxhKNB0KrzJp06UOhlFErshyORBT83r1X33YYsnW2yp9R90hERWiy0/exec", // Pega aquí tu URL de Google Apps Script terminada en /exec
  MASTER_CODES: ["PYQ-2026-PRO1", "PYQ-ADMIN-JGM"]
};

/***********************************************************************
 * MOTOR PRINCIPAL COMERCIAL (Game)
 ***********************************************************************/
const Game = {
  state: {
    currentLevelIdx: 0,
    currentNodeIdx: 0,
    xp: 150,
    hearts: 5,
    streak: 0,
    soundEnabled: true,
    isPro: false,
    licenseKey: "",
    deviceId: "",
    completedNodes: {},
    unlockedHints: {},
    brokenShields: {},
    filledSlots: [],
    activeSlotIdx: 0,
    orderedSelection: [],
    selectedChoiceIdx: null,
    freeCodeInput: ""
  },
  pyodide: null,
  pyodideLoading: false,

  init() {
    this.loadProgress();
    SoundFX.enabled = this.state.soundEnabled !== false;
    this.setupWhatsappButton();
    this.renderAll();
  },

  loadProgress() {
    try {
      const saved = localStorage.getItem("pyquest_commercial_save_v1");
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Almacenamiento local restringido:", e);
    }

    if (!this.state.deviceId) {
      this.state.deviceId = "DEV-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    if (typeof LEVEL_DATA !== "undefined") {
      LEVEL_DATA.forEach(lvl => {
        if (!this.state.completedNodes[lvl.id]) this.state.completedNodes[lvl.id] = [];
        if (!this.state.unlockedHints[lvl.id]) this.state.unlockedHints[lvl.id] = [];
        if (!this.state.brokenShields[lvl.id]) this.state.brokenShields[lvl.id] = [false, false, false];
      });
    }
  },

  saveProgress() {
    try {
      const toSave = {
        currentLevelIdx: this.state.currentLevelIdx,
        currentNodeIdx: this.state.currentNodeIdx,
        xp: this.state.xp,
        hearts: this.state.hearts,
        streak: this.state.streak,
        soundEnabled: this.state.soundEnabled,
        isPro: this.state.isPro,
        licenseKey: this.state.licenseKey,
        deviceId: this.state.deviceId,
        completedNodes: this.state.completedNodes,
        unlockedHints: this.state.unlockedHints,
        brokenShields: this.state.brokenShields
      };
      localStorage.setItem("pyquest_commercial_save_v1", JSON.stringify(toSave));
    } catch (e) {}
  },

  /*********************************************************************
   * SISTEMA DE LICENCIAS Y PAYWALL (WHATSAPP / YAPE / GOOGLE SHEETS)
   *********************************************************************/
  setupWhatsappButton() {
    const btn = document.getElementById("btnWhatsappBuy");
    if (!btn) return;
    const msg = encodeURIComponent(
      `¡Hola! Quiero adquirir mi código de licencia de PyQuest PRO (${COMMERCIAL_CONFIG.PRICE_DISPLAY}) por Yape/Plin. Mi ID de dispositivo es: ${this.state.deviceId}`
    );
    btn.href = `https://wa.me/${COMMERCIAL_CONFIG.WHATSAPP_PHONE}?text=${msg}`;
  },

  openPaywallModal() {
    SoundFX.click();
    const modal = document.getElementById("proPaywallModal");
    const statusMsg = document.getElementById("licenseStatusMsg");
    if (statusMsg) statusMsg.classList.add("hidden");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  },

  closePaywallModal() {
    SoundFX.click();
    const modal = document.getElementById("proPaywallModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  validateSignedLocalKey(code) {
    if (COMMERCIAL_CONFIG.MASTER_CODES.includes(code)) return true;
    const match = /^PYQ-(\d{4})-([A-Z0-9]{4})$/.exec(code);
    if (!match) return false;
    const seed = match[1];
    const sig = match[2];
    const expected = btoa(seed + "_PYQUEST_JGM").replace(/[^A-Z0-9]/gi, "").slice(0, 4).toUpperCase();
    return sig === expected;
  },

  async activateLicense() {
    const input = document.getElementById("licenseInputBox");
    const statusMsg = document.getElementById("licenseStatusMsg");
    const code = (input ? input.value : "").trim().toUpperCase();

    if (!code) return;
    statusMsg.classList.remove("hidden");
    statusMsg.className = "text-[11px] font-mono mt-2 text-cyan-300";
    statusMsg.textContent = "⏳ Verificando licencia...";

    if (COMMERCIAL_CONFIG.GOOGLE_SCRIPT_URL) {
      try {
        const url = `${COMMERCIAL_CONFIG.GOOGLE_SCRIPT_URL}?code=${encodeURIComponent(code)}&device=${encodeURIComponent(this.state.deviceId)}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.ok) {
          this.unlockProSuccess(code, statusMsg, data.msg);
        } else {
          SoundFX.error();
          statusMsg.className = "text-[11px] font-mono mt-2 text-rose-400";
          statusMsg.textContent = `❌ ${data.msg}`;
        }
        return;
      } catch (err) {
        console.warn("Fallo de red con Google Script, usando validador local de respaldo.");
      }
    }

    if (this.validateSignedLocalKey(code)) {
      this.unlockProSuccess(code, statusMsg, "✅ ¡Licencia PRO activada! Todos los niveles están desbloqueados.");
    } else {
      SoundFX.error();
      statusMsg.className = "text-[11px] font-mono mt-2 text-rose-400";
      statusMsg.textContent = "❌ Código inválido. Adquiere tu licencia por WhatsApp.";
    }
  },

  unlockProSuccess(code, statusMsg, message) {
    SoundFX.bossDefeat();
    this.state.isPro = true;
    this.state.licenseKey = code;
    this.saveProgress();
    this.renderAll();

    if (statusMsg) {
      statusMsg.className = "text-[11px] font-mono mt-2 text-emerald-400 font-bold";
      statusMsg.textContent = message;
    }
    setTimeout(() => this.closePaywallModal(), 1200);
  },

  /*********************************************************************
   * TECLADO TÁCTIL DE SÍMBOLOS PYTHON PARA CELULARES
   *********************************************************************/
  getTouchToolbarHTML(targetId) {
    const keys = [
      { label: "Tab ⇥", val: "    " },
      { label: ":", val: ":" },
      { label: "(", val: "(" },
      { label: ")", val: ")" },
      { label: "[", val: "[" },
      { label: "]", val: "]" },
      { label: "{", val: "{" },
      { label: "}", val: "}" },
      { label: "\"", val: "\"" },
      { label: "'", val: "'" },
      { label: "_", val: "_" },
      { label: "=", val: " = " },
      { label: "==", val: " == " },
      { label: "+", val: " + " },
      { label: "-", val: " - " },
      { label: "*", val: " * " },
      { label: "%", val: " % " }
    ];

    const buttons = keys.map(k => `
      <button
        type="button"
        onclick="Game.insertSymbol('${targetId}', ${ JSON.stringify(k.val).replace(/"/g, '&quot;') })"
        class="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 active:bg-cyan-500/40 border border-cyan-500/30 font-mono text-xs text-cyan-200 font-bold transition">
        ${k.label}
      </button>
    `).join("");

    return `
      <div class="mb-1.5">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-mono text-cyan-400">📱 Barra Táctil Python (Inserción rápida):</span>
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5">
          ${buttons}
        </div>
      </div>
    `;
  },

  insertSymbol(targetId, textToInsert) {
    SoundFX.click();
    const el = document.getElementById(targetId);
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = el.value;

    el.value = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
    const newCursor = start + textToInsert.length;
    el.focus();
    el.setSelectionRange(newCursor, newCursor);

    if (targetId === "freeCodeInputBox") {
      this.state.freeCodeInput = el.value;
    }
  },

  /*********************************************************************
   * NAVEGACIÓN DE NIVELES Y REGLAS DE DESBLOQUEO
   *********************************************************************/
  isLevelLockedByPaywall(levelIdx) {
    return levelIdx > 0 && !this.state.isPro;
  },

  isNodeUnlocked(levelIdx, nodeIdx) {
    if (this.isLevelLockedByPaywall(levelIdx)) return false;
    if (levelIdx === 0 && nodeIdx === 0) return true;

    const lvl = LEVEL_DATA[levelIdx];
    const completed = this.state.completedNodes[lvl.id] || [];
    if (completed.includes(nodeIdx)) return true;

    if (nodeIdx === 0 && levelIdx > 0) {
      const prevLvl = LEVEL_DATA[levelIdx - 1];
      return (this.state.completedNodes[prevLvl.id] || []).includes(20);
    }
    return completed.includes(nodeIdx - 1);
  },

  toggleSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    SoundFX.enabled = this.state.soundEnabled;
    if (this.state.soundEnabled) SoundFX.click();
    this.saveProgress();
    this.renderHeaderStats();
  },

  restoreHearts() {
    SoundFX.success();
    this.state.hearts = 5;
    this.saveProgress();
    this.renderHeaderStats();
  },

  selectLevel(levelIdx) {
    if (this.isLevelLockedByPaywall(levelIdx)) {
      this.openPaywallModal();
      return;
    }
    if (!this.isNodeUnlocked(levelIdx, 0)) {
      SoundFX.error();
      VisualFX.shakeArena();
      this.showToast("🔒 Derrota primero al Jefe del Rango anterior para desbloquear este sector.", "amber");
      return;
    }
    SoundFX.click();
    this.state.currentLevelIdx = levelIdx;
    const lvl = LEVEL_DATA[levelIdx];
    const completed = this.state.completedNodes[lvl.id] || [];
    let nextNode = 0;
    for (let i = 0; i <= 20; i++) {
      if (!completed.includes(i)) {
        nextNode = i;
        break;
      }
    }
    this.state.currentNodeIdx = nextNode;
    this.resetExerciseTempState();
    this.saveProgress();
    this.renderAll();
  },

  selectNode(nodeIdx) {
    if (!this.isNodeUnlocked(this.state.currentLevelIdx, nodeIdx)) {
      SoundFX.error();
      VisualFX.shakeArena();
      this.showToast("🔒 Supera los nodos previos en orden para avanzar.", "amber");
      return;
    }
    SoundFX.click();
    this.state.currentNodeIdx = nodeIdx;
    this.resetExerciseTempState();
    this.saveProgress();
    this.renderAll();
  },

  resetExerciseTempState() {
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];
    if (this.state.currentNodeIdx < 20) {
      const ex = lvl.exercises[this.state.currentNodeIdx];
      if (ex.type === "fill_blank") {
        this.state.filledSlots = new Array(ex.answers.length).fill(null);
        this.state.activeSlotIdx = 0;
      } else if (ex.type === "order_lines") {
        this.state.orderedSelection = [];
      } else if (ex.type === "free_code") {
        this.state.freeCodeInput = "";
      } else {
        this.state.selectedChoiceIdx = null;
      }
    }
  },

  /*********************************************************************
   * RENDERIZADO GENERAL DE LA INTERFAZ
   *********************************************************************/
  renderAll() {
    if (typeof LEVEL_DATA === "undefined") return;
    this.renderHeaderStats();
    this.renderLevelList();
    this.renderNodesTrack();
    this.renderArena();
  },

  renderHeaderStats() {
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];
    document.getElementById("playerRankTitle").textContent = `Rango: ${lvl.name}`;
    document.getElementById("statHearts").textContent = this.state.hearts;
    document.getElementById("statStreak").textContent = this.state.streak;
    document.getElementById("statXP").textContent = `${this.state.xp} XP`;

    document.querySelectorAll(".soundIconSpan").forEach(el => {
      el.textContent = this.state.soundEnabled ? "🔊" : "🔇";
    });

    const proButtons = [
      document.getElementById("btnProStatus"),
      document.getElementById("btnProStatusMobile")
    ];
    proButtons.forEach(btn => {
      if (!btn) return;
      if (this.state.isPro) {
        btn.textContent = "👑 PRO ACTIVO";
        btn.className = btn.id.includes("Mobile")
          ? "text-[10px] font-cyber font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 whitespace-nowrap"
          : "hidden sm:flex text-[11px] font-cyber font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 whitespace-nowrap";
      } else {
        btn.textContent = "👑 PRO";
        btn.className = btn.id.includes("Mobile")
          ? "text-[10px] font-cyber font-bold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md whitespace-nowrap"
          : "hidden sm:flex text-xs font-cyber font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md whitespace-nowrap";
      }
    });

    let totalDone = 0;
    Object.values(this.state.completedNodes).forEach(arr => totalDone += arr.length);
    document.getElementById("totalProgressBadge").textContent = `${totalDone} / ${LEVEL_DATA.length * 21} Nodos`;

    document.getElementById("bossPreviewTitle").textContent = lvl.boss.name;
    document.getElementById("bossPreviewDesc").textContent = lvl.boss.lore;
  },

  animateStreakBadge() {
    const badge = document.getElementById("streakBadge");
    if (!badge) return;
    badge.classList.remove("streak-bump");
    void badge.offsetWidth;
    badge.classList.add("streak-bump");
  },

  renderLevelList() {
    const container = document.getElementById("levelListContainer");
    container.innerHTML = "";

    LEVEL_DATA.forEach((lvl, idx) => {
      const completedCount = (this.state.completedNodes[lvl.id] || []).length;
      const pct = Math.round((completedCount / 21) * 100);
      const paywalled = this.isLevelLockedByPaywall(idx);
      const unlocked = this.isNodeUnlocked(idx, 0);
      const isCurrent = idx === this.state.currentLevelIdx;

      const card = document.createElement("div");
      card.onclick = () => this.selectLevel(idx);
      card.className = `p-3 rounded-xl border transition cursor-pointer ${
        isCurrent
          ? "bg-slate-800/90 border-cyan-400 shadow-md"
          : unlocked
          ? "bg-slate-900/60 border-slate-700/70 hover:border-slate-500"
          : "bg-slate-950/60 border-slate-800/70 opacity-75"
      }`;

      const badgeRight = paywalled
        ? `<span class="text-[10px] font-cyber font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">👑 PRO</span>`
        : `<span class="font-mono text-xs text-cyan-400 font-semibold">${completedCount}/21</span>`;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">${paywalled ? "🔒" : (unlocked ? lvl.icon : "🔒")}</span>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-cyber font-bold text-xs text-white">NV.${lvl.number} ${lvl.name.toUpperCase()}</span>
                ${idx === 0 ? '<span class="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 rounded">GRATIS</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-400">${lvl.role}</p>
            </div>
          </div>
          ${badgeRight}
        </div>
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div class="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  renderNodesTrack() {
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];
    const completed = this.state.completedNodes[lvl.id] || [];
    document.getElementById("currentLevelHeader").textContent = `Rango ${lvl.number}: ${lvl.name}`;
    document.getElementById("levelNodeCounter").textContent =
      this.state.currentNodeIdx === 20
        ? "⚔️ NODO JEFE (21/21)"
        : `Nodo ${this.state.currentNodeIdx + 1} de 20`;

    const track = document.getElementById("nodesTrack");
    track.innerHTML = "";

    for (let i = 0; i <= 20; i++) {
      const isBoss = i === 20;
      const isPreBoss = i === 19;
      const isDone = completed.includes(i);
      const isUnlocked = this.isNodeUnlocked(this.state.currentLevelIdx, i);
      const isCurrent = i === this.state.currentNodeIdx;

      const btn = document.createElement("button");
      btn.onclick = () => this.selectNode(i);

      let styleClass = "";
      if (isCurrent) {
        styleClass = isBoss
          ? "bg-rose-600 text-white border-2 border-white shadow-lg scale-105"
          : "bg-cyan-500 text-slate-950 border-2 border-white shadow-lg scale-105";
      } else if (isDone) {
        styleClass = isBoss
          ? "bg-rose-900/60 text-rose-200 border border-rose-400"
          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
      } else if (isUnlocked) {
        styleClass = isBoss
          ? "bg-rose-950/60 text-rose-300 border border-rose-500/50"
          : isPreBoss
          ? "bg-amber-950/50 text-amber-300 border border-amber-500/50"
          : "bg-slate-800 text-slate-200 border border-slate-600";
      } else {
        styleClass = "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed";
      }

      btn.className = `flex-shrink-0 ${isBoss ? "px-3 h-9 rounded-lg" : "w-9 h-9 rounded-full"} font-mono text-xs font-bold flex items-center justify-center transition ${styleClass}`;
      btn.innerHTML = isBoss ? "⚔️ JEFE" : (isDone ? "✓" : (isPreBoss ? "⌨️" : i + 1));
      track.appendChild(btn);
    }
  },

  /*********************************************************************
   * ARENA DE MICRO-EJERCICIOS (NODOS 1 AL 20) + CONSOLA PYTHON
   *********************************************************************/
  renderArena() {
    const arena = document.getElementById("arenaContainer");
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];

    if (this.state.currentNodeIdx === 20) {
      this.renderBossArena(arena, lvl);
      return;
    }

    const ex = lvl.exercises[this.state.currentNodeIdx];
    if (this.state.filledSlots.length === 0 && ex.type === "fill_blank") {
      this.resetExerciseTempState();
    }

    const badgeTypeMap = {
      fill_blank: "COMPLETAR CÓDIGO",
      multiple_choice: "PREDICCIÓN DE SALIDA",
      order_lines: "ORDENAR ALGORITMO",
      bug_hunt: "CAZA DE BUGS",
      free_code: "⌨️ ESCRITURA DE CÓDIGO LIBRE"
    };

    let interactiveHTML = "";

    if (ex.type === "fill_blank") {
      let slotCounter = 0;
      const renderedCode = ex.template.map(part => {
        if (part === "___") {
          const sIdx = slotCounter++;
          const val = this.state.filledSlots[sIdx];
          const isActive = this.state.activeSlotIdx === sIdx;
          return `<span onclick="Game.setActiveSlot(${sIdx})" class="code-slot ${val !== null ? 'filled' : ''} ${isActive ? 'active-slot' : ''}">${val !== null ? this.escapeHTML(val) : '___'}</span>`;
        }
        return `<span>${this.escapeHTML(part)}</span>`;
      }).join("");

      const chipsHTML = ex.options.map((opt, oIdx) => `
        <button onclick="Game.pickChip(${oIdx})" class="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-cyan-500/20 border border-cyan-500/40 font-mono text-xs sm:text-sm text-cyan-200 font-semibold active:scale-95">
          ${this.escapeHTML(opt)}
        </button>
      `).join("");

      interactiveHTML = `
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm leading-8 whitespace-pre-wrap text-slate-200">${renderedCode}</div>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono text-slate-400">Toca un bloque para rellenar:</span>
            <button onclick="Game.clearSlots()" class="text-xs font-mono text-rose-400 hover:underline">Limpiar</button>
          </div>
          <div class="flex flex-wrap gap-2">${chipsHTML}</div>
        </div>
      `;
    } else if (ex.type === "multiple_choice" || ex.type === "bug_hunt") {
      const codeBox = ex.codePreview || ex.buggyCode || "";
      const choicesHTML = ex.choices.map((ch, cIdx) => {
        const selected = this.state.selectedChoiceIdx === cIdx;
        return `
          <button onclick="Game.selectChoice(${cIdx})" class="w-full text-left p-3 rounded-xl border font-mono text-xs sm:text-sm transition flex items-center justify-between ${
            selected ? "bg-cyan-500/20 border-cyan-400 text-white" : "bg-slate-800/70 border-slate-700 text-slate-200"
          }">
            <span>${this.escapeHTML(ch)}</span>
            <span class="w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-cyan-300 bg-cyan-400 text-slate-950' : 'border-slate-600'}">
              ${selected ? '✓' : ''}
            </span>
          </button>
        `;
      }).join("");

      interactiveHTML = `
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto">${this.escapeHTML(codeBox)}</pre>
        <div class="space-y-2 mt-3">${choicesHTML}</div>
      `;
    } else if (ex.type === "order_lines") {
      const selectedLinesHTML = this.state.orderedSelection.length === 0
        ? `<div class="text-xs font-mono text-slate-500 py-4 text-center">Toca los bloques de abajo en orden...</div>`
        : this.state.orderedSelection.map((lineIdx, pos) => `
            <div onclick="Game.removeOrderedLine(${pos})" class="cursor-pointer p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 font-mono text-xs text-cyan-200 flex items-center justify-between">
              <span><strong class="text-cyan-400 mr-2">${pos + 1}.</strong> ${this.escapeHTML(ex.lines[lineIdx])}</span>
              <span class="text-[10px] text-rose-300">✕</span>
            </div>
          `).join("");

      const indices = ex.lines.map((_, i) => i).reverse();
      const poolHTML = indices.map(lineIdx => {
        const used = this.state.orderedSelection.includes(lineIdx);
        return `
          <button ${used ? 'disabled' : ''} onclick="Game.addOrderedLine(${lineIdx})" class="w-full text-left p-2.5 rounded-lg border font-mono text-xs transition ${
            used ? "bg-slate-900 border-slate-800 text-slate-600 opacity-40" : "bg-slate-800 border-slate-700 text-slate-200"
          }">
            ${this.escapeHTML(ex.lines[lineIdx])}
          </button>
        `;
      }).join("");

      interactiveHTML = `
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 min-h-[105px]">${selectedLinesHTML}</div>
        <div class="mt-2.5 space-y-1.5">${poolHTML}</div>
      `;
    } else if (ex.type === "free_code") {
      interactiveHTML = `
        <div class="space-y-2.5">
          <pre class="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-400 overflow-x-auto">${this.escapeHTML(ex.contextCode)}</pre>
          ${this.getTouchToolbarHTML("freeCodeInputBox")}
          <input
            id="freeCodeInputBox"
            type="text"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            value="${this.escapeHTML(this.state.freeCodeInput)}"
            oninput="Game.updateFreeCode(this.value)"
            placeholder="${this.escapeHTML(ex.placeholder || '')}"
            class="w-full bg-slate-950 border-2 border-amber-500/50 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 font-mono text-xs sm:text-sm text-emerald-300 focus:outline-none"
          />
        </div>
      `;
    }

    arena.className = "flex-1 bg-slate-900/95 cyber-border rounded-xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[460px]";
    arena.innerHTML = `
      <canvas id="vfxCanvas" class="pointer-events-none absolute inset-0 w-full h-full z-40"></canvas>
      <div class="space-y-3.5 relative z-10">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              ${badgeTypeMap[ex.type] || "EJERCICIO"}
            </span>
            <h3 class="font-cyber font-bold text-base sm:text-lg text-white mt-1">${ex.title}</h3>
          </div>
          <span class="font-mono text-xs text-slate-400">#${this.state.currentNodeIdx + 1}</span>
        </div>

        <div class="bg-slate-800/60 border-l-4 border-cyan-400 rounded-r-xl p-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
          💡 ${ex.theory}
        </div>

        <p class="font-semibold text-xs sm:text-sm text-white">${ex.prompt}</p>
        ${interactiveHTML}
      </div>

      <div class="mt-5 pt-3 border-t border-slate-800 relative z-10">
        <div id="feedbackBanner" class="hidden mb-3"></div>
        <div class="flex items-center justify-between gap-2">
          <button onclick="Game.buyExerciseReveal()" class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs">
            💡 Pista (-30 XP)
          </button>
          <button id="btnCheckAnswer" onclick="Game.checkMicroExercise()" class="flex-1 sm:flex-initial sm:min-w-[190px] py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-cyber font-bold text-xs sm:text-sm text-slate-950 shadow-lg">
            COMPROBAR ⚡
          </button>
        </div>
      </div>
    `;
  },

  setActiveSlot(idx) { SoundFX.click(); this.state.activeSlotIdx = idx; this.renderArena(); },
  pickChip(optionIdx) {
    SoundFX.click();
    const ex = LEVEL_DATA[this.state.currentLevelIdx].exercises[this.state.currentNodeIdx];
    this.state.filledSlots[this.state.activeSlotIdx] = ex.options[optionIdx];
    const nextEmpty = this.state.filledSlots.findIndex(v => v === null);
    if (nextEmpty !== -1) this.state.activeSlotIdx = nextEmpty;
    this.renderArena();
  },
  clearSlots() { SoundFX.click(); this.resetExerciseTempState(); this.renderArena(); },
  selectChoice(idx) { SoundFX.click(); this.state.selectedChoiceIdx = idx; this.renderArena(); },
  addOrderedLine(lineIdx) {
    if (!this.state.orderedSelection.includes(lineIdx)) {
      SoundFX.click(); this.state.orderedSelection.push(lineIdx); this.renderArena();
    }
  },
  removeOrderedLine(pos) { SoundFX.click(); this.state.orderedSelection.splice(pos, 1); this.renderArena(); },
  updateFreeCode(val) { this.state.freeCodeInput = val; },
  normalizeCode(str) { return String(str || "").trim().replace(/'/g, '"').replace(/\s+/g, ""); },

  // Simulador de Terminal Python para mostrar el resultado exacto de cada ejercicio
  getExerciseConsolePreview(ex) {
    let fullCode = "";
    if (ex.type === "fill_blank") {
      let ansIdx = 0;
      fullCode = ex.template.map(p => (p === "___" ? ex.answers[ansIdx++] : p)).join("");
    } else if (ex.type === "order_lines") {
      fullCode = ex.lines.join("\n");
    } else if (ex.type === "multiple_choice") {
      fullCode = ex.codePreview || "";
    } else if (ex.type === "bug_hunt") {
      fullCode = ex.choices[ex.correctIndex];
    } else if (ex.type === "free_code") {
      fullCode = `${ex.contextCode}\n${ex.acceptedAnswers[0]}`;
    }

    let outputText = "";
    if (ex.type === "multiple_choice") {
      outputText = `>>> Salida en consola:\n${ex.choices[ex.correctIndex]}`;
    } else if (ex.type === "order_lines") {
      if (fullCode.includes("xp_total = nodos_completados * 15")) {
        outputText = ">>> XP ganada: 300";
      } else if (fullCode.includes("bateria = 100")) {
        outputText = ">>> 100";
      } else if (fullCode.includes("Núcleo estable")) {
        outputText = ">>> Núcleo estable";
      } else if (fullCode.includes("total += n")) {
        outputText = ">>> 6";
      } else if (fullCode.includes("dron['velocidad'] = 300")) {
        outputText = ">>> {'id': 'X-01', 'velocidad': 300}";
      } else if (fullCode.includes("sorted(lecturas, reverse=True)")) {
        outputText = ">>> [120, 80, 40]";
      } else if (fullCode.includes("bat.cargar(30)")) {
        outputText = ">>> 80";
      } else if (fullCode.includes("list(pares(3))")) {
        outputText = ">>> [0, 2, 4]";
      } else if (fullCode.includes("data['intentos'] += 1")) {
        outputText = ">>> {\"intentos\": 3}";
      } else if (fullCode.includes("Counter(eventos)")) {
        outputText = ">>> 2";
      } else {
        outputText = `>>> Código ejecutado:\n${fullCode}\n\n>>> Resultado: ${ex.explanation}`;
      }
    } else if (ex.type === "fill_blank") {
      const printMatch = /print\(\s*["']([^"']+)["']\s*\)/.exec(fullCode);
      if (printMatch) {
        outputText = `>>> ${printMatch[1]}`;
      } else if (fullCode.includes("Reactor al {carga} por ciento")) {
        outputText = `>>> Variable en memoria:\nreporte = "Reactor al 95 por ciento"`;
      } else {
        const lastLine = fullCode.trim().split("\n").slice(-1)[0];
        outputText = `>>> Línea evaluada: ${lastLine}\n>>> Resultado: ${ex.explanation}`;
      }
    } else if (ex.type === "free_code") {
      outputText = `>>> Instrucción ejecutada: ${ex.acceptedAnswers[0]}\n>>> ${ex.explanation}`;
    } else {
      outputText = `>>> Parche verificado: ${ex.choices[ex.correctIndex]}\n>>> ${ex.explanation}`;
    }

    return { fullCode, outputText };
  },

  buyExerciseReveal() {
    if (this.state.xp < 30) {
      SoundFX.error();
      this.showFeedback(false, "⚠️ Necesitas al menos 30 XP para autocompletar este nodo.");
      return;
    }
    this.state.xp -= 30;
    SoundFX.click();
    const ex = LEVEL_DATA[this.state.currentLevelIdx].exercises[this.state.currentNodeIdx];
    if (ex.type === "fill_blank") this.state.filledSlots = [...ex.answers];
    else if (ex.type === "multiple_choice" || ex.type === "bug_hunt") this.state.selectedChoiceIdx = ex.correctIndex;
    else if (ex.type === "order_lines") this.state.orderedSelection = ex.lines.map((_, i) => i);
    else if (ex.type === "free_code") this.state.freeCodeInput = ex.acceptedAnswers[0];
    this.saveProgress();
    this.renderHeaderStats();
    this.renderArena();
    this.showFeedback(true, `💡 Solución desbloqueada: ${ex.explanation}`);
  },

  checkMicroExercise() {
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];
    const ex = lvl.exercises[this.state.currentNodeIdx];
    let isCorrect = false;

    if (ex.type === "fill_blank") {
      isCorrect = ex.answers.every((ans, idx) => this.state.filledSlots[idx] === ans);
    } else if (ex.type === "multiple_choice" || ex.type === "bug_hunt") {
      isCorrect = this.state.selectedChoiceIdx === ex.correctIndex;
    } else if (ex.type === "order_lines") {
      isCorrect = this.state.orderedSelection.length === ex.lines.length &&
                  this.state.orderedSelection.every((val, idx) => val === idx);
    } else if (ex.type === "free_code") {
      const normUser = this.normalizeCode(this.state.freeCodeInput);
      isCorrect = ex.acceptedAnswers.some(ans => this.normalizeCode(ans) === normUser);
    }

    if (isCorrect) {
      const completed = this.state.completedNodes[lvl.id];
      if (!completed.includes(this.state.currentNodeIdx)) {
        completed.push(this.state.currentNodeIdx);
        this.state.xp += 25;
      }
      this.state.streak += 1;
      if (this.state.streak >= 2) { SoundFX.streak(this.state.streak); this.animateStreakBadge(); }
      else SoundFX.success();

      this.saveProgress();
      this.renderHeaderStats();
      this.renderNodesTrack();
      this.renderLevelList();
      this.showFeedback(true, `✅ ¡Correcto! +25 XP. ${ex.explanation}`, true);
    } else {
      SoundFX.error();
      VisualFX.shakeArena();
      this.state.streak = 0;
      if (this.state.hearts > 0) this.state.hearts -= 1;
      this.saveProgress();
      this.renderHeaderStats();
      this.showFeedback(false, "❌ Respuesta incorrecta. Revisa la pista teórica e inténtalo de nuevo.");
    }
  },

  showFeedback(success, message, allowNext = false) {
    const banner = document.getElementById("feedbackBanner");
    const btn = document.getElementById("btnCheckAnswer");
    if (!banner) return;
    banner.classList.remove("hidden");

    if (success) {
      const lvl = LEVEL_DATA[this.state.currentLevelIdx];
      const ex = lvl.exercises[this.state.currentNodeIdx];
      const consoleData = this.getExerciseConsolePreview(ex);

      banner.className = "mb-3 space-y-2.5";
      banner.innerHTML = `
        <div class="bg-black/95 border border-cyan-500/40 rounded-xl p-3 font-mono text-xs shadow-inner">
          <div class="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1.5">
            <span>>_ TERMINAL PYTHON (SALIDA DE EJECUCIÓN)</span>
            <span class="text-emerald-400">● EXIT CODE 0</span>
          </div>
          <pre class="text-cyan-300 whitespace-pre-wrap leading-relaxed">${this.escapeHTML(consoleData.outputText)}</pre>
        </div>

        <div class="p-3 rounded-xl font-mono text-xs bg-emerald-950/80 border border-emerald-400 text-emerald-200">
          ${message}
        </div>
      `;

      if (allowNext && btn) {
        btn.textContent = "SIGUIENTE ➔";
        btn.className = "flex-1 sm:flex-initial sm:min-w-[190px] py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 font-cyber font-bold text-xs sm:text-sm text-slate-950 shadow-lg";
        btn.onclick = () => this.advanceNextNode();
      }
    } else {
      banner.className = "mb-3 p-3 rounded-xl font-mono text-xs bg-rose-950/80 border border-rose-500 text-rose-200";
      banner.innerHTML = message;
    }
  },

  advanceNextNode() {
    SoundFX.click();
    if (this.state.currentNodeIdx < 20) {
      this.state.currentNodeIdx += 1;
      this.resetExerciseTempState();
      this.saveProgress();
      this.renderAll();
    }
  },

  /*********************************************************************
   * ARENA DE JEFE MULTIFASE (3 ESCUDOS + BARRA TÁCTIL MÓVIL)
   *********************************************************************/
  async ensurePyodideLoaded() {
    const badge = document.getElementById("pyodideStatusBadge");
    if (this.pyodide) return this.pyodide;
    if (this.pyodideLoading) return null;
    try {
      this.pyodideLoading = true;
      if (badge) badge.textContent = "⏳ Cargando Python 3...";
      this.pyodide = await loadPyodide();
      if (badge) { badge.textContent = "🐍 Python 3: Activo"; badge.className = "text-[11px] font-mono text-emerald-400"; }
      this.pyodideLoading = false;
      return this.pyodide;
    } catch (e) {
      this.pyodideLoading = false;
      return null;
    }
  },

  renderBossArena(arena, lvl) {
    this.ensurePyodideLoaded();
    const boss = lvl.boss;
    const broken = this.state.brokenShields[lvl.id] || [false, false, false];
    const unlockedH = this.state.unlockedHints[lvl.id] || [];
    const brokenCount = broken.filter(Boolean).length;
    const hpPercent = Math.max(0, 100 - brokenCount * 33 - (brokenCount === 3 ? 1 : 0));

    const rulesHTML = boss.problemSpec.rules.map(r => `
      <li class="flex items-start gap-1.5 text-xs text-slate-200">
        <span class="text-cyan-400 font-bold">▸</span><span>${this.escapeHTML(r)}</span>
      </li>
    `).join("");

    const shieldsHTML = boss.shields.map((sh, sIdx) => {
      const ok = broken[sIdx];
      return `
        <div id="shieldBadge_${sIdx}" class="p-2 rounded-xl border font-mono text-[11px] flex items-center justify-between ${
          ok ? "bg-emerald-950/60 border-emerald-400 text-emerald-200" : "bg-slate-900/90 border-rose-500/40 text-rose-200"
        }">
          <span>${ok ? "🔓" : "🛡️"} ${this.escapeHTML(sh.name)}</span>
          <span class="font-bold">${ok ? "ROTO" : "ACTIVO"}</span>
        </div>
      `;
    }).join("");

    const hintsHTML = boss.hints.map((h, hIdx) => {
      const isUn = unlockedH.includes(hIdx);
      return `
        <button onclick="Game.unlockBossHint(${hIdx})" class="px-2.5 py-1.5 rounded-lg border font-mono text-[11px] ${
          isUn ? "bg-amber-500/20 border-amber-400 text-amber-200" : "bg-slate-800 border-amber-500/40 text-amber-300"
        }">
          ${isUn ? `💡 Ver Pista ${hIdx + 1}` : `🔒 Pista ${hIdx + 1} (-${h.cost} XP)`}
        </button>
      `;
    }).join("");

    arena.className = "flex-1 bg-slate-900/95 boss-border rounded-xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[560px]";
    arena.innerHTML = `
      <canvas id="vfxCanvas" class="pointer-events-none absolute inset-0 w-full h-full z-40"></canvas>
      <div class="space-y-3.5 relative z-10">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/30 pb-2.5">
          <div>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ⚔️ JEFE DE RANGO (3 ESCUDOS)
            </span>
            <h3 class="font-cyber font-bold text-lg sm:text-xl text-white mt-1">${boss.name}</h3>
          </div>
          <div id="bossCoreTarget" class="flex items-center gap-2.5 bg-rose-950/40 border border-rose-500/40 px-3 py-1.5 rounded-xl">
            <div id="bossAvatarIcon" class="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center text-xl">${hpPercent === 0 ? "💥" : boss.avatar}</div>
            <div class="text-right">
              <span id="bossHpText" class="text-[11px] font-mono font-bold text-rose-400">${hpPercent}% HP</span>
              <div class="w-28 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-rose-500/50 mt-0.5">
                <div id="bossHpBar" class="h-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all duration-500" style="width: ${hpPercent}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-xs font-mono text-amber-200 bg-amber-950/30 border border-amber-500/40 p-2.5 rounded-xl">
          ⚠️ ${this.escapeHTML(boss.combatRule)}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">${shieldsHTML}</div>

        <div class="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-3.5 space-y-1.5">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <h4 class="font-cyber text-xs text-cyan-400">🎯 ${this.escapeHTML(boss.problemSpec.objective)}</h4>
            <span class="font-mono text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded">Salida: ${this.escapeHTML(boss.problemSpec.expectedOutput)}</span>
          </div>
          <ul class="space-y-1 pt-1">${rulesHTML}</ul>
        </div>

        <div>
          <div class="flex flex-wrap gap-2 mb-2">${hintsHTML}</div>
          ${this.getTouchToolbarHTML("bossCodeEditor")}
          <textarea id="bossCodeEditor" rows="7" spellcheck="false" autocapitalize="off" class="w-full bg-slate-950 border border-cyan-500/40 focus:border-cyan-400 rounded-xl p-3 font-mono text-xs sm:text-sm text-emerald-300 focus:outline-none leading-relaxed">${boss.starterCode}</textarea>
        </div>

        <div class="bg-black/90 border border-slate-800 rounded-xl p-3 font-mono text-xs">
          <div class="text-slate-500 border-b border-slate-800 pb-1 mb-1 flex justify-between">
            <span>TERMINAL DE AUDITORÍA</span>
            <span id="bossExecStatus" class="text-cyan-400">Listo</span>
          </div>
          <pre id="bossConsoleOutput" class="text-slate-300 whitespace-pre-wrap min-h-[48px]">Escribe tu solución y pulsa "ATACAR AL JEFE"...</pre>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-800 flex justify-end relative z-10">
        <button onclick="Game.runBossCode()" class="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 font-cyber font-bold text-xs sm:text-sm text-white shadow-lg active:scale-95">
          🐍 EJECUTAR PYTHON Y ATACAR AL JEFE
        </button>
      </div>
    `;
  },

  unlockBossHint(hintIdx) {
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];
    const hintObj = lvl.boss.hints[hintIdx];
    const unlocked = this.state.unlockedHints[lvl.id];
    const consoleOut = document.getElementById("bossConsoleOutput");

    if (!unlocked.includes(hintIdx)) {
      if (this.state.xp < hintObj.cost) {
        SoundFX.error();
        if (consoleOut) {
          consoleOut.className = "text-rose-400 whitespace-pre-wrap min-h-[48px]";
          consoleOut.textContent = `⚠️ Necesitas ${hintObj.cost} XP para desbloquear esta pista.`;
        }
        return;
      }
      this.state.xp -= hintObj.cost;
      unlocked.push(hintIdx);
      this.saveProgress();
      this.renderHeaderStats();
    }
    SoundFX.click();
    const savedCode = document.getElementById("bossCodeEditor")?.value;
    this.renderBossArena(document.getElementById("arenaContainer"), lvl);
    if (savedCode) document.getElementById("bossCodeEditor").value = savedCode;
    const out = document.getElementById("bossConsoleOutput");
    if (out) {
      out.className = "text-amber-300 whitespace-pre-wrap min-h-[48px]";
      out.textContent = `💡 ${hintObj.text}`;
    }
  },

  async runBossCode() {
    const lvl = LEVEL_DATA[this.state.currentLevelIdx];
    const boss = lvl.boss;
    const userCode = document.getElementById("bossCodeEditor").value;
    const consoleOut = document.getElementById("bossConsoleOutput");
    const statusEl = document.getElementById("bossExecStatus");

    statusEl.textContent = "Ejecutando...";
    consoleOut.textContent = "⚡ Disparando rayo compilador...";
    SoundFX.laser();
    await VisualFX.fireLaser();

    const py = await this.ensurePyodideLoaded();
    if (!py) {
      consoleOut.textContent = "⏳ Terminando de cargar Python 3, intenta en 2 segundos...";
      return;
    }

    let shieldsPassed = [false, false, false];
    let stdoutCaptured = "";
    let failMsg = "";

    try {
      const runner = `
import sys, io
_user_code = ${JSON.stringify(userCode)}
_buf = io.StringIO()
sys.stdout = _buf
try:
    exec(_user_code, globals())
finally:
    sys.stdout = sys.__stdout__
_captured_stdout = _buf.getvalue()
_captured_stdout
`;
      stdoutCaptured = await py.runPythonAsync(runner);
    } catch (err) {
      SoundFX.error();
      VisualFX.shakeArena();
      const lines = String(err).trim().split("\n");
      consoleOut.className = "text-rose-400 whitespace-pre-wrap min-h-[48px]";
      consoleOut.textContent = `❌ Error en tu código Python:\n${lines.slice(-2).join("\n")}`;
      return;
    }

    for (let i = 0; i < boss.shields.length; i++) {
      try {
        await py.runPythonAsync(boss.shields[i].validatePy);
        shieldsPassed[i] = true;
        SoundFX.shieldBreak();
      } catch (sErr) {
        const lines = String(sErr).trim().split("\n");
        failMsg = `🛡️ ${boss.shields[i].name}:\n${lines.slice(-1)[0]}`;
        break;
      }
    }

    this.state.brokenShields[lvl.id] = shieldsPassed;
    this.saveProgress();

    const brokenCount = shieldsPassed.filter(Boolean).length;
    const newHp = Math.max(0, 100 - brokenCount * 33 - (brokenCount === 3 ? 1 : 0));
    const hpBar = document.getElementById("bossHpBar");
    const hpText = document.getElementById("bossHpText");
    if (hpBar) hpBar.style.width = `${newHp}%`;
    if (hpText) hpText.textContent = `${newHp}% HP`;

    if (brokenCount === 3) {
      consoleOut.className = "text-emerald-400 whitespace-pre-wrap min-h-[48px]";
      consoleOut.textContent = `Salida:\n${stdoutCaptured}\n✅ ¡3/3 Escudos destruidos!`;
      await this.completeBossNode(lvl);
    } else {
      SoundFX.error();
      VisualFX.shakeArena();
      consoleOut.className = "text-amber-300 whitespace-pre-wrap min-h-[48px]";
      consoleOut.textContent = `Salida: ${stdoutCaptured.trim() || "(Vacía)"}\n⚠️ Escudos rotos: ${brokenCount}/3\n${failMsg}`;
    }
  },

  async completeBossNode(lvl) {
    SoundFX.bossDefeat();
    const completed = this.state.completedNodes[lvl.id];
    if (!completed.includes(20)) {
      completed.push(20);
      this.state.xp += 300;
      this.state.streak += 1;
    }
    this.saveProgress();
    this.renderHeaderStats();
    this.renderLevelList();
    this.renderNodesTrack();

    await VisualFX.explodeBoss();

    const modal = document.getElementById("victoryModal");
    document.getElementById("modalTitle").textContent = `¡${lvl.boss.name.toUpperCase()} DERROTADO!`;
    document.getElementById("modalBody").textContent = `Superaste el Rango ${lvl.name}.`;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeModalAndAdvance() {
    SoundFX.click();
    const modal = document.getElementById("victoryModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    if (this.state.currentLevelIdx < LEVEL_DATA.length - 1) {
      const nextIdx = this.state.currentLevelIdx + 1;
      if (this.isLevelLockedByPaywall(nextIdx)) {
        this.openPaywallModal();
        return;
      }
      this.state.currentLevelIdx = nextIdx;
      this.state.currentNodeIdx = 0;
      this.resetExerciseTempState();
      this.saveProgress();
      this.renderAll();
    }
  },

  showToast(msg, color = "cyan") {
    const banner = document.getElementById("feedbackBanner");
    if (banner) {
      banner.classList.remove("hidden");
      banner.className = `mb-3 p-3 rounded-xl font-mono text-xs bg-${color}-950/80 border border-${color}-500 text-${color}-200`;
      banner.textContent = msg;
    }
  },

  escapeHTML(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
};

window.addEventListener("DOMContentLoaded", () => Game.init());
