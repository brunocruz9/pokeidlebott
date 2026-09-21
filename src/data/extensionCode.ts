export const MANIFEST_JSON = `{
  "manifest_version": 3,
  "name": "Poke Idle World - Smart Assistant",
  "version": "1.2.0",
  "description": "Smart Assistant para Poke Idle World com auto-update remoto via GitHub: rotas EXP inteligentes, auto-viagem e auto-restock com leitura direta.",
  "author": "brunocruz9",
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://poke.idleworld.online/*",
    "*://poke.idleworld.online/*",
    "https://raw.githubusercontent.com/*"
  ],
  "content_scripts": [
    {
      "matches": [
        "https://poke.idleworld.online/*",
        "*://poke.idleworld.online/*"
      ],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_title": "Poke Idle Assistant"
  }
}`;

export const CONTENT_JS = `// ==UserScript / Chrome Extension Content Script (Ultralight Remote Loader)==
// @name         Poke Idle World - Smart Assistant Loader
// @version      1.2.0
// @description  Carregador remoto ultraleve que busca a versão mais recente do bot no GitHub
// @author       brunocruz9
// ==/UserScript==

(function () {
  'use strict';

  if (window.__POKE_IDLE_LOADER_INITIALIZED__) return;
  window.__POKE_IDLE_LOADER_INITIALIZED__ = true;

  const REMOTE_CORE_URL = 'https://raw.githubusercontent.com/brunocruz9/pokeidlebot/main/bot-core.js';
  const CACHE_KEY = '__POKE_IDLE_CORE_CACHE__';
  const CACHE_TIME_KEY = '__POKE_IDLE_CORE_CACHE_TIME__';

  console.log('[PokeIdle Loader] Verificando versão mais recente na nuvem (GitHub)...');

  function injectScript(code) {
    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = code;
      (document.head || document.documentElement).appendChild(script);
      console.log('[PokeIdle Loader] bot-core.js injetado e executado com sucesso!');
    } catch (err) {
      console.error('[PokeIdle Loader] Falha ao injetar script no contexto da página:', err);
    }
  }

  function showFallbackNotice(message, showRetry = true) {
    const existing = document.getElementById('pokeidle-loader-notice');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'pokeidle-loader-notice';
    banner.style.cssText = \`
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999999;
      background: #0f172a;
      border: 1px solid #ef4444;
      border-radius: 8px;
      padding: 12px 16px;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      max-width: 340px;
    \`;

    banner.innerHTML = \`
      <div style="font-weight: 700; color: #f87171; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
        <span>⚠️ PokeIdle Assistant</span>
        <button id="pokeidle-close-notice" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:14px;">✕</button>
      </div>
      <div style="color: #cbd5e1; line-height: 1.4;">\${message}</div>
      \${showRetry ? '<button id="pokeidle-retry-btn" style="margin-top: 8px; background: #2563eb; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 11px; font-weight: 600;">Tentar Novamente</button>' : ''}
    \`;

    document.body.appendChild(banner);

    document.getElementById('pokeidle-close-notice')?.addEventListener('click', () => banner.remove());
    document.getElementById('pokeidle-retry-btn')?.addEventListener('click', () => {
      banner.remove();
      loadBotCore();
    });
  }

  async function loadBotCore() {
    // Adiciona timestamp dinâmico para garantir bypass total do cache do CDN do GitHub
    const urlWithNoCache = \`\${REMOTE_CORE_URL}?t=\${Date.now()}\`;

    try {
      const response = await fetch(urlWithNoCache, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(\`HTTP Status \${response.status} ao conectar ao GitHub\`);
      }

      const scriptCode = await response.text();

      if (!scriptCode || scriptCode.trim().length === 0) {
        throw new Error('Conteúdo retornado do GitHub está vazio');
      }

      // Salva em cache local como redundância de segurança
      try {
        localStorage.setItem(CACHE_KEY, scriptCode);
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {
        // Ignora caso localStorage esteja cheio
      }

      injectScript(scriptCode);

    } catch (error) {
      console.warn('[PokeIdle Loader] Falha ao baixar bot-core.js remoto do GitHub:', error.message);

      // Fallback: Tenta executar a versão em cache local se disponível
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached && cached.trim().length > 0) {
        console.log('[PokeIdle Loader] Ativando fallback: executando versão em cache local.');
        injectScript(cached);
        showFallbackNotice('Conexão com GitHub indisponível. Usando versão local em cache.', false);
      } else {
        showFallbackNotice('Não foi possível carregar o bot-core do GitHub (repositório brunocruz9/pokeidlebot). Verifique sua conexão à internet.');
      }
    }
  }

  // Executa o carregamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBotCore);
  } else {
    loadBotCore();
  }
})();
`;

export const BOT_CORE_JS = `// ==UserScript / Poke Idle World Bot Core==
// @name         Poke Idle World - Smart Assistant Core (GitHub Cloud Version)
// @version      1.2.0
// @author       brunocruz9
// @repository   https://github.com/brunocruz9/pokeidlebot
// @description  Núcleo de automação com rotas EXP, leitura direta no DOM de poções/pokébolas e auto-restock
// ==/UserScript==

(function () {
  'use strict';

  if (window.__POKE_IDLE_ASSISTANT_LOADED__) {
    console.log('[PokeIdle Core] Instância já carregada anteriormente no DOM.');
    return;
  }
  window.__POKE_IDLE_ASSISTANT_LOADED__ = true;

  console.log('[PokeIdle Core] Inicializando bot-core v1.2.0 via nuvem (GitHub)...');

  // ==========================================
  // 1. TABELA DE FRAQUEZAS ELEMENTAIS
  // ==========================================
  const TYPE_CHART = {
    NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
    FIRE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 2, BUG: 2, ROCK: 0.5, DRAGON: 0.5, STEEL: 2 },
    WATER: { FIRE: 2, WATER: 0.5, GRASS: 0.5, GROUND: 2, ROCK: 2, DRAGON: 0.5 },
    GRASS: { FIRE: 0.5, WATER: 2, GRASS: 0.5, POISON: 0.5, GROUND: 2, FLYING: 0.5, BUG: 0.5, ROCK: 2, DRAGON: 0.5, STEEL: 0.5 },
    ELECTRIC: { WATER: 2, ELECTRIC: 0.5, GRASS: 0.5, GROUND: 0, FLYING: 2, DRAGON: 0.5 },
    ICE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 0.5, GROUND: 2, FLYING: 2, DRAGON: 2, STEEL: 0.5 },
    FIGHTING: { NORMAL: 2, ICE: 2, POISON: 0.5, FLYING: 0.5, PSYCHIC: 0.5, BUG: 0.5, ROCK: 2, GHOST: 0, DARK: 2, STEEL: 2, FAIRY: 0.5 },
    POISON: { GRASS: 2, POISON: 0.5, GROUND: 0.5, ROCK: 0.5, GHOST: 0.5, STEEL: 0, FAIRY: 2 },
    GROUND: { FIRE: 2, ELECTRIC: 2, GRASS: 0.5, POISON: 2, FLYING: 0, BUG: 0.5, ROCK: 2, STEEL: 2 },
    FLYING: { ELECTRIC: 0.5, GRASS: 2, FIGHTING: 2, BUG: 2, ROCK: 0.5, STEEL: 0.5 },
    PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
    BUG: { FIRE: 0.5, GRASS: 2, FIGHTING: 0.5, POISON: 0.5, FLYING: 0.5, PSYCHIC: 2, GHOST: 0.5, DARK: 2, STEEL: 0.5, FAIRY: 0.5 },
    ROCK: { FIRE: 2, ICE: 2, FIGHTING: 0.5, GROUND: 0.5, FLYING: 2, BUG: 2, STEEL: 0.5 },
    GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
    DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
    STEEL: { FIRE: 0.5, WATER: 0.5, ELECTRIC: 0.5, ICE: 2, ROCK: 2, STEEL: 0.5, FAIRY: 2 },
    DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
    FAIRY: { FIRE: 0.5, FIGHTING: 2, POISON: 0.5, DRAGON: 2, DARK: 2, STEEL: 0.5 }
  };

  function getEffectiveness(atkType, def1, def2) {
    if (!atkType || !TYPE_CHART[atkType]) return 1.0;
    const mult1 = TYPE_CHART[atkType][def1] !== undefined ? TYPE_CHART[atkType][def1] : 1.0;
    const mult2 = def2 && TYPE_CHART[atkType][def2] !== undefined ? TYPE_CHART[atkType][def2] : 1.0;
    return mult1 * mult2;
  }

  // ==========================================
  // 2. BASE DE DADOS COMPLETA DE HUNTS (ROTAS)
  // ==========================================
  const HUNTS = [
    { id: 'caterpie', name: 'Caterpie', level: 1, type1: 'BUG', exp: 39, area: 'kanto' },
    { id: 'weedle', name: 'Weedle', level: 2, type1: 'BUG', type2: 'POISON', exp: 39, area: 'kanto' },
    { id: 'rattata', name: 'Rattata', level: 3, type1: 'NORMAL', exp: 51, area: 'kanto' },
    { id: 'pidgey', name: 'Pidgey', level: 5, type1: 'NORMAL', type2: 'FLYING', exp: 50, area: 'kanto' },
    { id: 'bellsprout', name: 'Bellsprout', level: 8, type1: 'GRASS', type2: 'POISON', exp: 60, area: 'kanto' },
    { id: 'oddish', name: 'Oddish', level: 10, type1: 'GRASS', type2: 'POISON', exp: 64, area: 'kanto' },
    { id: 'zubat', name: 'Zubat', level: 12, type1: 'POISON', type2: 'FLYING', exp: 49, area: 'kanto' },
    { id: 'geodude', name: 'Geodude', level: 15, type1: 'ROCK', type2: 'GROUND', exp: 60, area: 'kanto' },
    { id: 'paras', name: 'Paras', level: 18, type1: 'BUG', type2: 'GRASS', exp: 57, area: 'kanto' },
    { id: 'sandshrew', name: 'Sandshrew', level: 20, type1: 'GROUND', exp: 60, area: 'kanto' },
    { id: 'drowzee', name: 'Drowzee', level: 22, type1: 'PSYCHIC', exp: 66, area: 'kanto' },
    { id: 'diglett', name: 'Diglett', level: 25, type1: 'GROUND', exp: 53, area: 'kanto' },
    { id: 'mankey', name: 'Mankey', level: 28, type1: 'FIGHTING', exp: 61, area: 'kanto' },
    { id: 'gloom', name: 'Gloom', level: 30, type1: 'GRASS', type2: 'POISON', exp: 138, area: 'kanto' },
    { id: 'weepinbell', name: 'Weepinbell', level: 32, type1: 'GRASS', type2: 'POISON', exp: 137, area: 'kanto' },
    { id: 'voltorb', name: 'Voltorb', level: 35, type1: 'ELECTRIC', exp: 66, area: 'kanto' },
    { id: 'koffing', name: 'Koffing', level: 38, type1: 'POISON', exp: 68, area: 'kanto' },
    { id: 'graveler', name: 'Graveler', level: 40, type1: 'ROCK', type2: 'GROUND', exp: 137, area: 'kanto' },
    { id: 'machoke', name: 'Machoke', level: 42, type1: 'FIGHTING', exp: 142, area: 'kanto' },
    { id: 'rhydon', name: 'Rhydon', level: 45, type1: 'GROUND', type2: 'ROCK', exp: 170, area: 'kanto' },
    { id: 'haunter', name: 'Haunter', level: 48, type1: 'GHOST', type2: 'POISON', exp: 142, area: 'kanto' },
    { id: 'kadabra', name: 'Kadabra', level: 50, type1: 'PSYCHIC', exp: 140, area: 'kanto' },
    { id: 'tentacruel', name: 'Tentacruel', level: 55, type1: 'WATER', type2: 'POISON', exp: 185, area: 'kanto' },
    { id: 'magmar', name: 'Magmar', level: 60, type1: 'FIRE', exp: 173, area: 'kanto' },
    { id: 'electabuzz', name: 'Electabuzz', level: 65, type1: 'ELECTRIC', exp: 172, area: 'kanto' },
    { id: 'pinsir', name: 'Pinsir', level: 70, type1: 'BUG', exp: 175, area: 'kanto' },
    { id: 'scyther', name: 'Scyther', level: 75, type1: 'BUG', type2: 'FLYING', exp: 100, area: 'kanto' },
    { id: 'tangela_outland', name: 'Tangela Ancestral', level: 85, type1: 'GRASS', exp: 260, area: 'outland' },
    { id: 'golem_outland', name: 'Golem das Cavernas', level: 95, type1: 'ROCK', type2: 'GROUND', exp: 320, area: 'outland' },
    { id: 'arcanine_outland', name: 'Arcanine Feroz', level: 110, type1: 'FIRE', exp: 380, area: 'outland' },
    { id: 'gengar_outland', name: 'Gengar Sombrio', level: 130, type1: 'GHOST', type2: 'POISON', exp: 450, area: 'outland' },
    { id: 'alakazam_outland', name: 'Alakazam Cósmico', level: 160, type1: 'PSYCHIC', exp: 580, area: 'outland' },
    { id: 'shadow_lugia', name: 'Shadow Lugia', level: 250, type1: 'PSYCHIC', type2: 'FLYING', exp: 1200, area: 'orre' },
    { id: 'nightmare_darkrai', name: 'Pesadelo Darkrai', level: 500, type1: 'DARK', exp: 3500, area: 'nightmare' },
    { id: 'nightmare_mewtwo', name: 'Mewtwo Abissal', level: 1000, type1: 'PSYCHIC', exp: 8000, area: 'nightmare' }
  ];

  function calculateOptimalHunt(atkType1, atkType2, playerLevel) {
    let best = null;
    let maxScore = -1;

    for (const h of HUNTS) {
      if (h.level > playerLevel + 5) continue; // limite de segurança

      const mult1 = getEffectiveness(atkType1, h.type1, h.type2);
      const mult2 = atkType2 ? getEffectiveness(atkType2, h.type1, h.type2) : 1.0;
      const bestMult = Math.max(mult1, mult2);

      let lvlDiff = playerLevel - h.level;
      let levelPenalty = 1.0;
      if (lvlDiff > 15) {
        levelPenalty = Math.max(0.15, 1.0 - (lvlDiff - 15) * 0.04);
      }

      const score = (h.exp * bestMult) * levelPenalty;

      if (score > maxScore) {
        maxScore = score;
        best = { hunt: h, score: Math.round(score), effectiveness: bestMult };
      }
    }

    return best || { hunt: HUNTS[0], score: 10, effectiveness: 1.0 };
  }

  // ==========================================
  // 3. ESTADO GLOBAL DO BOT
  // ==========================================
  const state = {
    enabled: true,
    minimized: false,
    currentLevel: null,
    activePokemonName: 'Charmeleon',
    atkType1: 'FIRE',
    atkType2: null,
    currentHunt: null,
    targetHunt: null,
    potions: null,
    potionsInCache: false,
    pokeballs: null,
    pokeballsInCache: false,
    allPokeballs: [],
    lastTravelTime: 0,
    lastRestockTime: 0,
    logs: []
  };

  function addLog(msg) {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    state.logs.unshift(\`[\${time}] \${msg}\`);
    if (state.logs.length > 25) state.logs.pop();
    updateUI();
  }

  // ==========================================
  // 4. LEITURA DE DADOS NO DOM DO JOGO
  // ==========================================

  function readPlayerLevel() {
    const levelPatterns = [/lv[\\. ]*(\\d+)/i, /nível[\\. ]*(\\d+)/i, /level[\\. ]*(\\d+)/i];
    const selectors = ["[class*='level' i]", "[class*='lvl' i]", "[id*='level' i]", "[data-guide*='level' i]"];

    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        const text = el.innerText || el.textContent || '';
        for (const pat of levelPatterns) {
          const match = text.match(pat);
          if (match) {
            const val = parseInt(match[1], 10);
            if (val > 0 && val < 5000) return val;
          }
        }
      }
    }

    const allLeaves = Array.from(document.querySelectorAll("span, div, b, p")).filter(e => e.children.length === 0);
    for (const leaf of allLeaves) {
      const match = (leaf.textContent || '').match(/^(?:lv|lvl|level)[\\. ]*(\\d+)$/i);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > 0 && val < 5000) return val;
      }
    }
    return null;
  }

  function readActivePokemon() {
    const selectors = ["[class*='active-pokemon' i]", "[class*='pokemon-name' i]", "[data-guide*='poke-name' i]"];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim()) {
        return el.innerText.trim();
      }
    }
    return null;
  }

  // 4.1 Leitura direta de Ultra Potion (slot 202) no inventário com cache
  function readUltraPotions() {
    const slot = document.querySelector('[data-guide="inv-item-202"]');
    if (slot) {
      const leaves = Array.from(slot.querySelectorAll('*')).filter(el => el.children.length === 0);
      let countFound = null;

      for (const leaf of leaves) {
        const text = (leaf.textContent || '').trim();
        const match = text.match(/^[x×]?\\s*(\\d{1,7})$/i);
        if (match) {
          const val = parseInt(match[1], 10);
          if (val !== 202) {
            countFound = val;
            break;
          }
        }
      }

      if (countFound === null) {
        for (const leaf of leaves) {
          const text = (leaf.textContent || '').trim();
          const match = text.match(/\\b(\\d+)\\b/);
          if (match) {
            const val = parseInt(match[1], 10);
            if (val !== 202) {
              countFound = val;
              break;
            }
          }
        }
      }

      if (countFound === null) {
        const raw = slot.textContent || '';
        const numbers = raw.match(/\\b\\d+\\b/g);
        if (numbers) {
          const filtered = numbers.map(n => parseInt(n, 10)).filter(n => n !== 202);
          if (filtered.length > 0) countFound = filtered[0];
        }
      }

      if (countFound !== null && !isNaN(countFound)) {
        state.potions = countFound;
        state.potionsInCache = false;
        return countFound;
      }
    }

    if (state.potions !== null) {
      state.potionsInCache = true;
    }
    return state.potions;
  }

  // 4.2 Leitura direta de Pokébolas na interface principal / área de captura
  function readActivePokeballs() {
    let detectedCounts = [];

    const ballContainers = Array.from(document.querySelectorAll(
      "[data-guide*='ball' i], [class*='catch' i], [class*='capture' i], [class*='pokeball' i], [class*='ball-slot' i], [class*='ballSlot' i], [id*='catch' i]"
    ));

    for (const container of ballContainers) {
      const leaves = Array.from(container.querySelectorAll('*')).filter(
        e => e.children.length === 0 && /\\d+/.test(e.textContent)
      );

      for (const leaf of leaves) {
        const text = (leaf.textContent || '').trim();
        const matches = text.match(/\\b\\d{1,7}\\b/g);
        if (matches) {
          matches.forEach(m => {
            const num = parseInt(m, 10);
            if (!isNaN(num) && num >= 0 && !/lv|hp|exp/i.test(leaf.parentElement?.textContent || '')) {
              detectedCounts.push(num);
            }
          });
        }
      }
    }

    if (detectedCounts.length === 0) {
      const ballIcons = Array.from(document.querySelectorAll("img[src*='ball' i], img[alt*='ball' i], [class*='ball' i] img"));
      for (const icon of ballIcons) {
        const parent = icon.closest("button, div, [role='button']") || icon.parentElement;
        if (parent) {
          const numbers = (parent.innerText || parent.textContent || '').match(/\\b\\d{1,7}\\b/g);
          if (numbers) {
            numbers.forEach(n => {
              const val = parseInt(n, 10);
              if (!isNaN(val) && val >= 0) detectedCounts.push(val);
            });
          }
        }
      }
    }

    const valid = Array.from(new Set(detectedCounts)).filter(n => n >= 0 && n <= 999999);

    if (valid.length > 0) {
      state.allPokeballs = valid;
      const minBall = Math.min(...valid);
      state.pokeballs = minBall;
      state.pokeballsInCache = false;
      return minBall;
    }

    if (state.pokeballs !== null) {
      state.pokeballsInCache = true;
    }
    return state.pokeballs;
  }

  // ==========================================
  // 5. RESTOCK AUTOMÁTICO SILENCIOSO VIA API
  // ==========================================
  async function buySupplies(type, id, qty) {
    try {
      const payload = type === 'potion' ? { itemId: id, qty: qty } : { ballId: id, qty: qty };
      addLog(\`Auto-Restock: Comprando \${qty}x \${type === 'potion' ? 'Ultra Potions' : 'Pokébolas'}...\`);

      const res = await fetch('/api/game/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addLog(\`Compra silenciosa com sucesso! (+\${qty}x \${type === 'potion' ? 'Ultra Potion' : 'Pokébola'})\`);
        if (type === 'potion') state.potions = (state.potions || 0) + qty;
        if (type === 'ball') {
          state.pokeballs = (state.pokeballs || 0) + qty;
          if (state.allPokeballs.length > 0) {
            const minIndex = state.allPokeballs.indexOf(Math.min(...state.allPokeballs));
            if (minIndex !== -1) state.allPokeballs[minIndex] += qty;
          }
        }
        updateUI();
      } else {
        addLog(\`Erro na loja (\${res.status}): verifique saldo de moedas\`);
      }
    } catch (err) {
      addLog(\`Falha na requisição da loja: \${err.message}\`);
    }
  }

  function checkAndAutoRestock() {
    if (!state.enabled) return;
    const now = Date.now();
    if (now - state.lastRestockTime < 10000) return;

    if (state.potions !== null && state.potions < 100) {
      state.lastRestockTime = now;
      buySupplies('potion', 202, 100);
      return;
    }

    if (state.pokeballs !== null && state.pokeballs < 50) {
      state.lastRestockTime = now;
      buySupplies('ball', 4, 50);
    }
  }

  // ==========================================
  // 6. VIAGEM AUTOMÁTICA NO MAPA
  // ==========================================
  async function triggerMapTravel(targetHuntName) {
    if (!state.enabled) return;
    const now = Date.now();
    if (now - state.lastTravelTime < 15000) return;

    state.lastTravelTime = now;
    addLog(\`Iniciando viagem para: \${targetHuntName}...\`);

    const mapBtn = document.querySelector("button[class*='map' i], [data-guide*='map' i], a[href*='map' i]");
    if (mapBtn) {
      mapBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }

    const huntMarkers = Array.from(document.querySelectorAll("[class*='marker' i], [class*='hunt' i], [class*='route' i], [role='button']"));
    const targetMarker = huntMarkers.find(el => {
      const text = el.innerText || el.textContent || '';
      return text.toLowerCase().includes(targetHuntName.toLowerCase());
    });

    if (targetMarker) {
      targetMarker.click();
      addLog(\`Chegou à rota: \${targetHuntName}!\`);
      state.currentHunt = targetHuntName;
    } else {
      addLog(\`Aviso: marcador de \${targetHuntName} não encontrado na tela do mapa.\`);
    }
  }

  // ==========================================
  // 7. INTERFACE FLUTUANTE ESCURA (SHADOW DOM)
  // ==========================================
  let hostEl = null;
  let shadow = null;

  function createFloatingUI() {
    if (document.getElementById('poke-idle-smart-assistant-ui')) return;

    hostEl = document.createElement('div');
    hostEl.id = 'poke-idle-smart-assistant-ui';
    shadow = hostEl.attachShadow({ mode: 'open' });

    const styles = document.createElement('style');
    styles.textContent = \`
      * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
      .container {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 12px;
        box-shadow: 0 16px 36px rgba(0,0,0,0.6);
        z-index: 9999999;
        font-size: 12px;
        overflow: hidden;
        user-select: none;
        transition: height 0.2s ease, width 0.2s ease;
      }
      .container.minimized {
        width: 180px;
      }
      .header {
        background: #1e293b;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: grab;
        border-bottom: 1px solid #334155;
      }
      .header:active { cursor: grabbing; }
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 13px;
        color: #f8fafc;
      }
      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
      .dot.off {
        background: #64748b;
        box-shadow: none;
      }
      .controls {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .icon-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
      .icon-btn:hover { background: #334155; color: #f8fafc; }
      .body {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #090d16;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid #1e293b;
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
      }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #475569;
        transition: .2s;
        border-radius: 20px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .2s;
        border-radius: 50%;
      }
      input:checked + .slider { background-color: #10b981; }
      input:checked + .slider:before { transform: translateX(16px); }

      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .stat-box {
        background: #090d16;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid #1e293b;
      }
      .stat-label {
        font-size: 10px;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .stat-val {
        font-size: 13px;
        font-weight: 700;
        color: #f8fafc;
        margin-top: 2px;
      }
      .stat-sub {
        font-size: 9px;
        color: #64748b;
        font-family: monospace;
        margin-top: 1px;
      }
      .badge-cache {
        background: #78350f;
        color: #fcd34d;
        font-size: 8px;
        padding: 1px 4px;
        border-radius: 4px;
      }
      .hunt-box {
        background: #090d16;
        border: 1px solid #065f46;
        padding: 10px;
        border-radius: 8px;
      }
      .hunt-title {
        color: #34d399;
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
      }
      .hunt-name {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        margin-top: 2px;
      }
      .hunt-meta {
        font-size: 10px;
        color: #94a3b8;
        display: flex;
        justify-content: space-between;
        margin-top: 4px;
      }
      .btn-action {
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid #475569;
        padding: 8px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 11px;
        cursor: pointer;
        width: 100%;
        transition: background 0.15s;
      }
      .btn-action:hover { background: #334155; }
      .logs {
        background: #020617;
        border: 1px solid #1e293b;
        padding: 8px;
        border-radius: 6px;
        font-family: ui-monospace, monospace;
        font-size: 9px;
        color: #94a3b8;
        max-height: 80px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
    \`;

    const html = \`
      <div class="container" id="ui-container">
        <div class="header" id="ui-header">
          <div class="title">
            <span class="dot" id="ui-dot"></span>
            <span>PokeIdle Helper</span>
          </div>
          <div class="controls">
            <button class="icon-btn" id="btn-minimize" title="Minimizar">_</button>
          </div>
        </div>

        <div class="body" id="ui-body">
          <div class="toggle-row">
            <span style="font-weight: 600; color: #cbd5e1;">Automação Ativa</span>
            <label class="switch">
              <input type="checkbox" id="ui-toggle" checked>
              <span class="slider"></span>
            </label>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">Pokémon</div>
              <div class="stat-val" id="ui-poke">\${state.activePokemonName}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Nível</div>
              <div class="stat-val" id="ui-level">Detectando...</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">
                <span>Ultra Potion</span>
                <span id="ui-potion-cache" class="badge-cache" style="display:none">cache</span>
              </div>
              <div class="stat-val" id="ui-potions">\${state.potions !== null ? state.potions + 'x' : 'Detectando...'}</div>
              <div class="stat-sub">[slot 202: &lt;100]</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">
                <span>Pokébolas</span>
                <span id="ui-ball-cache" class="badge-cache" style="display:none">cache</span>
              </div>
              <div class="stat-val" id="ui-balls">\${state.pokeballs !== null ? state.pokeballs + 'x' : 'Detectando...'}</div>
              <div class="stat-sub" id="ui-ball-sub">[área captura: &lt;50]</div>
            </div>
          </div>

          <div class="hunt-box">
            <div class="hunt-title">Rota Recomendada</div>
            <div class="hunt-name" id="ui-target-hunt">Calculando...</div>
            <div class="hunt-meta">
              <span id="ui-target-area">Área: —</span>
              <span id="ui-target-mult">Vantagem: —</span>
            </div>
          </div>

          <button class="btn-action" id="btn-manual-travel">Viajar Para Rota Ideal Agora</button>

          <div class="logs" id="ui-logs">
            <div>[PokeIdle Core] Conectado ao jogo com sucesso via GitHub!</div>
          </div>
        </div>
      </div>
    \`;

    shadow.appendChild(styles);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    shadow.appendChild(wrapper);
    document.body.appendChild(hostEl);

    const toggle = shadow.getElementById('ui-toggle');
    toggle.addEventListener('change', (e) => {
      state.enabled = e.target.checked;
      const dot = shadow.getElementById('ui-dot');
      if (dot) {
        if (state.enabled) dot.classList.remove('off');
        else dot.classList.add('off');
      }
      addLog(state.enabled ? 'Automação RETOMADA' : 'Automação PAUSADA');
    });

    const btnMin = shadow.getElementById('btn-minimize');
    btnMin.addEventListener('click', () => {
      state.minimized = !state.minimized;
      const body = shadow.getElementById('ui-body');
      const container = shadow.getElementById('ui-container');
      if (state.minimized) {
        body.style.display = 'none';
        container.classList.add('minimized');
        btnMin.textContent = '□';
      } else {
        body.style.display = 'flex';
        container.classList.remove('minimized');
        btnMin.textContent = '_';
      }
    });

    const btnTravel = shadow.getElementById('btn-manual-travel');
    btnTravel.addEventListener('click', () => {
      if (state.targetHunt) {
        triggerMapTravel(state.targetHunt.name);
      } else {
        addLog('Ainda calculando a rota ideal...');
      }
    });

    makeDraggable(shadow.getElementById('ui-container'), shadow.getElementById('ui-header'));
  }

  function makeDraggable(container, header) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      container.style.top = (container.offsetTop - pos2) + "px";
      container.style.left = (container.offsetLeft - pos1) + "px";
      container.style.right = 'auto';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function updateUI() {
    if (!shadow) return;

    const elPoke = shadow.getElementById('ui-poke');
    if (elPoke) elPoke.textContent = state.activePokemonName || 'Detectando...';

    const elLevel = shadow.getElementById('ui-level');
    if (elLevel) elLevel.textContent = state.currentLevel ? 'Lv. ' + state.currentLevel : 'Detectando...';

    const elPotions = shadow.getElementById('ui-potions');
    if (elPotions) {
      elPotions.textContent = state.potions !== null ? state.potions + 'x' : 'Detectando...';
      elPotions.style.color = (state.potions !== null && state.potions < 100) ? '#f59e0b' : '#f8fafc';
    }

    const elPotionCache = shadow.getElementById('ui-potion-cache');
    if (elPotionCache) {
      elPotionCache.style.display = state.potionsInCache ? 'inline-block' : 'none';
    }

    const elBalls = shadow.getElementById('ui-balls');
    if (elBalls) {
      elBalls.textContent = state.pokeballs !== null ? state.pokeballs + 'x' : 'Detectando...';
      elBalls.style.color = (state.pokeballs !== null && state.pokeballs < 50) ? '#f59e0b' : '#f8fafc';
    }

    const elBallCache = shadow.getElementById('ui-ball-cache');
    if (elBallCache) {
      elBallCache.style.display = state.pokeballsInCache ? 'inline-block' : 'none';
    }

    const elBallSub = shadow.getElementById('ui-ball-sub');
    if (elBallSub) {
      if (state.allPokeballs && state.allPokeballs.length > 1) {
        elBallSub.textContent = \`Mín: \${state.pokeballs} [\${state.allPokeballs.slice(0, 4).join(', ')}]\`;
      } else {
        elBallSub.textContent = '[área captura: <50]';
      }
    }

    const elTarget = shadow.getElementById('ui-target-hunt');
    if (elTarget) elTarget.textContent = state.targetHunt ? \`\${state.targetHunt.name} (Lv. \${state.targetHunt.level})\` : 'Calculando...';

    const elArea = shadow.getElementById('ui-target-area');
    if (elArea && state.targetHunt) elArea.textContent = \`Área: \${state.targetHunt.area.toUpperCase()}\`;

    const elMult = shadow.getElementById('ui-target-mult');
    if (elMult && state.targetHunt) elMult.textContent = \`Vantagem: \${state.targetHunt.effectiveness}x\`;

    const elLogs = shadow.getElementById('ui-logs');
    if (elLogs) {
      elLogs.innerHTML = state.logs.map(l => \`<div>\${l}</div>\`).join('');
    }
  }

  // ==========================================
  // 8. LOOP PRINCIPAL DE EXECUÇÃO
  // ==========================================
  function tick() {
    createFloatingUI();

    const detectedLevel = readPlayerLevel();
    const detectedPoke = readActivePokemon();

    if (detectedPoke && detectedPoke !== state.activePokemonName) {
      state.activePokemonName = detectedPoke;
      addLog(\`Pokémon detectado: \${detectedPoke}\`);
    }

    if (detectedLevel && detectedLevel !== state.currentLevel) {
      const isLevelUp = state.currentLevel !== null && detectedLevel > state.currentLevel;
      state.currentLevel = detectedLevel;

      if (isLevelUp) {
        addLog(\`Level Up detectado! Novo nível: Lv. \${detectedLevel}\`);
      }

      const opt = calculateOptimalHunt(state.atkType1, state.atkType2, detectedLevel);
      if (opt && (!state.targetHunt || state.targetHunt.id !== opt.hunt.id)) {
        state.targetHunt = { ...opt.hunt, effectiveness: opt.effectiveness };
        addLog(\`Nova rota recomendada: \${opt.hunt.name} (Lv. \${opt.hunt.level}, \${opt.effectiveness}x efetivo)\`);

        if (state.enabled && isLevelUp) {
          triggerMapTravel(opt.hunt.name);
        }
      }
    }

    readUltraPotions();
    readActivePokeballs();
    checkAndAutoRestock();
    updateUI();
  }

  setInterval(tick, 1500);
  setTimeout(tick, 300);

  console.log('[PokeIdle Core] Script do bot-core ativo e operando com sucesso!');
})();
`;

export const README_MD = `# Poke Idle World - Smart Assistant (Arquitetura Nuvem GitHub + Loader Local)

Esta extensão utiliza uma **arquitetura híbrida desacoplada**:
1. **Google Chrome (Instalação Única no Navegador)**: Baixe apenas \`manifest.json\` e \`content.js\`.
2. **Nuvem GitHub (\`brunocruz9/pokeidlebot\`)**: O arquivo \`bot-core.js\` fica hospedado no repositório. Sempre que você alterar ou atualizar este arquivo no GitHub, todos os jogadores recebem a nova versão instantaneamente ao recarregar a página do jogo (\`F5\`), sem precisar reinstalar nada no Chrome!

---

## 📁 Divisão dos Arquivos

| Arquivo | Destino | Função |
| :--- | :--- | :--- |
| **\`manifest.json\`** | 💻 Google Chrome (Pasta local) | Declara permissões para \`https://poke.idleworld.online/*\` e \`https://raw.githubusercontent.com/*\`. |
| **\`content.js\`** | 💻 Google Chrome (Pasta local) | **Loader ultraleve**: faz o download dinâmico do \`bot-core.js\` com timestamp anti-cache e o injeta na página do jogo. |
| **\`bot-core.js\`** | ☁️ GitHub (\`brunocruz9/pokeidlebot\`) | **Inteligência completa**: widget escuro flutuante, cálculo de rotas EXP por fraqueza, leitura direta de Ultra Potions (\`[data-guide="inv-item-202"]\`) com cache, contagem de pokébolas e auto-restock via API. |

---

## 🚀 Passo 1: Instalar a Extensão no Chrome (Apenas 1 vez)

1. Crie uma pasta vazia no seu computador, por exemplo \`pokeidle-extension\`.
2. Coloque dentro dela **apenas** estes dois arquivos:
   - \`manifest.json\`
   - \`content.js\`
3. Abra o Google Chrome e acesse:
   \`\`\`text
   chrome://extensions
   \`\`\`
4. Ative a chave **"Modo do desenvolvedor"** no canto superior direito.
5. Clique no botão **"Carregar sem compactação"** (Load unpacked) e selecione a pasta \`pokeidle-extension\`.
6. Pronto! A extensão está instalada e nunca mais precisará ser recarregada manualmente no Chrome.

---

## ☁️ Passo 2: Subir o \`bot-core.js\` no Repositório do GitHub

O loader procura o script no link:
\`https://raw.githubusercontent.com/brunocruz9/pokeidlebot/main/bot-core.js\`

### Opção A: Pelo Terminal (Git)
Se você já clonou ou tem o repositório configurado no seu computador:
\`\`\`bash
# 1. Copie o bot-core.js para a raiz do seu repositório local
cd pokeidlebot

# 2. Adicione e faça o commit
git add bot-core.js
git commit -m "feat: atualiza nucleo do bot com leitura direta e auto-restock v1.2.0"

# 3. Envie para o branch main no GitHub
git push origin main
\`\`\`

### Opção B: Direto pelo Navegador no GitHub
1. Abra seu repositório: \`https://github.com/brunocruz9/pokeidlebot\`
2. Clique em **Add file** -> **Upload files** (ou crie um novo arquivo chamado \`bot-core.js\`).
3. Cole o conteúdo de \`bot-core.js\` e clique em **Commit changes** salvando na branch \`main\`.

---

## 🔄 Como funcionam as Atualizações Instantâneas

- O loader \`content.js\` efetua requisições com parâmetro temporal:
  \`https://raw.githubusercontent.com/brunocruz9/pokeidlebot/main/bot-core.js?t=1690000000000\`
- Isso **força o CDN do GitHub a ignorar o cache**, entregando sempre o último commit.
- Caso o GitHub passe por instabilidade passageira, o loader executa a cópia de segurança salva no \`localStorage\` do navegador para nunca interromper o farm do jogador.
`;
