// ==UserScript / Chrome Extension Content Script (Ultralight Remote Loader)==
// @name         Poke Idle World - Smart Assistant Loader
// @version      1.2.0
// @description  Carregador remoto ultraleve que busca a versão mais recente do bot no GitHub
// @author       brunocruz9
// ==/UserScript==

(function () {
  'use strict';

  if (window.__POKE_IDLE_LOADER_INITIALIZED__) return;
  window.__POKE_IDLE_LOADER_INITIALIZED__ = true;

  const REMOTE_CORE_URL = 'https://raw.githubusercontent.com/brunocruz9/pokeidlebott/main/bot-core.js';
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
    banner.style.cssText = `
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
    `;

    banner.innerHTML = `
      <div style="font-weight: 700; color: #f87171; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
        <span>⚠️ PokeIdle Assistant</span>
        <button id="pokeidle-close-notice" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:14px;">✕</button>
      </div>
      <div style="color: #cbd5e1; line-height: 1.4;">${message}</div>
      ${showRetry ? '<button id="pokeidle-retry-btn" style="margin-top: 8px; background: #2563eb; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 11px; font-weight: 600;">Tentar Novamente</button>' : ''}
    `;

    document.body.appendChild(banner);

    document.getElementById('pokeidle-close-notice')?.addEventListener('click', () => banner.remove());
    document.getElementById('pokeidle-retry-btn')?.addEventListener('click', () => {
      banner.remove();
      loadBotCore();
    });
  }

  async function loadBotCore() {
    // Adiciona timestamp dinâmico para garantir bypass total do cache do CDN do GitHub
    const urlWithNoCache = `${REMOTE_CORE_URL}?t=${Date.now()}`;

    try {
      const response = await fetch(urlWithNoCache, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP Status ${response.status} ao conectar ao GitHub`);
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
        showFallbackNotice('Não foi possível carregar o bot-core do GitHub (repositório brunocruz9/pokeidlebott). Verifique sua conexão à internet.');
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
