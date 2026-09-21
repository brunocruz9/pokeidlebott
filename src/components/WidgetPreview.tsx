import React, { useState } from 'react';
import { Minus, Square, ShoppingCart, RefreshCw, MapPin, Activity, PackageOpen, Sparkles, Layers } from 'lucide-react';
import { findBestHunt } from '../data/huntData';

export const WidgetPreview: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(38);
  const [pokemonName] = useState('Charmeleon');

  // Nova leitura direta de Ultra Potions (slot 202) e cache
  const [backpackOpen, setBackpackOpen] = useState(false);
  const [potions, setPotions] = useState(438);
  const [potionsInCache, setPotionsInCache] = useState(true);

  // Nova leitura direta de Pokébolas na área de captura (ex: 1370, 274, 6769, 1139)
  const [ballCounts, setBallCounts] = useState<number[]>([1370, 274, 6769, 1139]);

  const minBall = Math.min(...ballCounts);

  const [logs, setLogs] = useState<string[]>([
    'Assistente Manifest V3 ativo com leitura direta.',
    'Área de captura lida: [1370, 274, 6769, 1139]. Mínimo ativo: 274x.',
    'Slot Ultra Potion [data-guide="inv-item-202"]: 438x (valor em cache persistido).',
    'Rota ideal calculada: Gloom (Lv. 30, 2x Super Efetivo)'
  ]);

  const addSimLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 18)]);
  };

  const bestHunt = findBestHunt('FIRE', null, currentLevel).hunt;

  const simulateLevelUp = () => {
    const newLvl = currentLevel + 2;
    setCurrentLevel(newLvl);
    addSimLog(`Subiu para o Nível Lv. ${newLvl}!`);

    const newBest = findBestHunt('FIRE', null, newLvl).hunt;
    if (newBest.name !== bestHunt.name) {
      addSimLog(`Otimizador ativado: Nova rota calculada -> ${newBest.name} (Lv. ${newBest.level})`);
      addSimLog(`[Mapa] Abrindo mapa e clicando no marcador: ${newBest.name}...`);
      addSimLog(`[Viagem] Chegou com sucesso em ${newBest.name} (${newBest.area.toUpperCase()})!`);
    }
  };

  const toggleBackpack = () => {
    const nextState = !backpackOpen;
    setBackpackOpen(nextState);
    if (nextState) {
      setPotionsInCache(false);
      addSimLog('Mochila aberta no jogo! [data-guide="inv-item-202"] detectado diretamente no DOM.');
      addSimLog(`Slot 202 lido com precisão: ${potions}x (isolado do peso total da mochila).`);
    } else {
      setPotionsInCache(true);
      addSimLog('Mochila fechada. Elemento saiu do DOM: valor mantido no CACHE com sucesso (não zerou o painel!).');
    }
  };

  const simulateUsePotions = () => {
    const newPotions = Math.max(12, potions - 180);
    setPotions(newPotions);
    addSimLog(`Batalha: Utilizou poções. Estoque atual: ${newPotions}x.`);

    if (newPotions < 100 && enabled) {
      setTimeout(() => {
        addSimLog(`[Auto-Restock Silencioso] Ultra Potions < 100 detectado (${newPotions}x).`);
        addSimLog(`[Loja API] POST /api/game/shop/buy payload: {"itemId": 202, "qty": 100}`);
        setPotions(p => p + 100);
        addSimLog(`[Loja API] Compra finalizada com sucesso! +100 Ultra Potions.`);
      }, 700);
    }
  };

  const simulateUseBalls = () => {
    // Reduz a menor pokébola para abaixo de 50
    const nextBalls = [...ballCounts];
    const minIdx = nextBalls.indexOf(Math.min(...nextBalls));
    nextBalls[minIdx] = 32;
    setBallCounts(nextBalls);
    addSimLog(`Captura: Pokébola ativa consumida. Menor contagem caiu para: 32x.`);

    if (enabled) {
      setTimeout(() => {
        addSimLog(`[Auto-Restock Silencioso] Menor Pokébola ativa < 50 detectada (32x).`);
        addSimLog(`[Loja API] POST /api/game/shop/buy payload: {"ballId": 4, "qty": 50}`);
        setBallCounts(prev => {
          const updated = [...prev];
          const mIdx = updated.indexOf(Math.min(...updated));
          updated[mIdx] += 50;
          return updated;
        });
        addSimLog(`[Loja API] Compra de 50x Pokébolas concluída com sucesso!`);
      }, 900);
    }
  };

  const simulateManualRestock = () => {
    addSimLog('Restock manual disparado via API...');
    setPotions(p => p + 100);
    setBallCounts(prev => prev.map(b => b + 50));
    addSimLog('Sucesso: +100x Ultra Potions e +50x Pokébolas adicionadas.');
  };

  return (
    <div id="widget-preview-section" className="space-y-6">
      {/* Control panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Simulação do Card Flutuante (Leitura Direta sem Modal)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Teste as novas leituras diretas no DOM: <code>[data-guide="inv-item-202"]</code> com cache quando a mochila fecha e leitura da área de captura.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="sim-toggle-backpack"
              onClick={toggleBackpack}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                backpackOpen
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <PackageOpen className="w-3.5 h-3.5" />
              {backpackOpen ? 'Mochila Aberta (DOM Visível)' : 'Abrir Mochila no Jogo'}
            </button>

            <button
              id="sim-use-potions"
              onClick={simulateUsePotions}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Gastar Potions (&lt;100)
            </button>

            <button
              id="sim-use-balls"
              onClick={simulateUseBalls}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Gastar Pokébolas (&lt;50)
            </button>

            <button
              id="sim-levelup"
              onClick={simulateLevelUp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Level Up (+2)
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="relative w-full h-[540px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-6">
        {/* Mock Game Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Mock In-Game Elements showing the real DOM targets */}
        <div className="absolute left-6 top-6 bottom-6 w-[360px] hidden md:flex flex-col gap-3 pointer-events-none opacity-80 z-0">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800 pb-1.5">
              <span>Simulação do DOM do Jogo</span>
              <span className="text-[10px] text-emerald-400">Ao Vivo</span>
            </div>

            {/* Catch Area Representation */}
            <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                <span>Área de Captura Principal</span>
                <span className="text-[9px] text-emerald-400">Leitura Direta</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
                {ballCounts.map((count, idx) => (
                  <div
                    key={idx}
                    className={`p-1 rounded text-[11px] font-mono font-bold ${
                      count === minBall
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[8px] text-slate-500 uppercase">Ball #{idx + 1}</div>
                    {count}
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-slate-500 pt-0.5">
                Menor pokébola ativa: <strong className="text-emerald-400">{minBall}x</strong> (dispara compra se &lt; 50)
              </div>
            </div>

            {/* Inventory Slot Representation */}
            <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                <span>Inventário / Mochila</span>
                <span className={`text-[9px] ${backpackOpen ? 'text-blue-400' : 'text-amber-400'}`}>
                  {backpackOpen ? '[data-guide="inv-item-202"] no DOM' : 'Mochila Fechada (Cache Ativo)'}
                </span>
              </div>

              {backpackOpen ? (
                <div className="p-2 bg-blue-950/40 border border-blue-600/40 rounded flex items-center justify-between text-[11px]">
                  <div>
                    <div className="font-bold text-blue-200">Ultra Potion (ID 202)</div>
                    <div className="text-[9px] text-slate-400">data-guide="inv-item-202"</div>
                  </div>
                  <div className="font-mono text-sm font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {potions}
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-slate-900/60 border border-dashed border-slate-700 rounded text-[10px] text-slate-400 text-center">
                  Mochila fechada. O helper utiliza o último valor lido em cache ({potions}x) sem zerar o painel.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The Floating Widget Replica */}
        <div
          id="mock-floating-widget"
          className={`absolute top-6 right-6 z-20 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl transition-all duration-200 overflow-hidden ${
            minimized ? 'w-[180px]' : 'w-[310px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800 border-b border-slate-700/60 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  enabled
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-xs font-bold text-slate-100 tracking-wide">PokeIdle Helper</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="widget-btn-minimize"
                onClick={() => setMinimized(!minimized)}
                className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-700 rounded transition-colors"
                title={minimized ? 'Expandir' : 'Minimizar'}
              >
                {minimized ? <Square className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <div className="p-3.5 space-y-3">
              {/* Toggle switch */}
              <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Automação Geral</span>
                <button
                  id="widget-toggle-btn"
                  onClick={() => {
                    setEnabled(!enabled);
                    addSimLog(!enabled ? 'Automação RETOMADA' : 'Automação PAUSADA');
                  }}
                  className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-md transform transition" />
                </button>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Pokémon Ativo</div>
                  <div className="font-bold text-slate-100 truncate mt-0.5">{pokemonName}</div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Nível Atual</div>
                  <div className="font-bold text-emerald-400 mt-0.5">Lv. {currentLevel}</div>
                </div>

                {/* Ultra Potion Box */}
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Ultra Potion</span>
                    {potionsInCache && (
                      <span className="text-[9px] text-amber-300 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-800/50">
                        cache
                      </span>
                    )}
                  </div>
                  <div className={`font-bold text-sm mt-0.5 ${potions < 100 ? 'text-amber-400' : 'text-slate-100'}`}>
                    {potions}x
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">[slot 202: &lt;100]</div>
                </div>

                {/* Pokeballs Box */}
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Pokébolas</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/50">
                      ativa
                    </span>
                  </div>
                  <div className={`font-bold text-sm mt-0.5 ${minBall < 50 ? 'text-amber-400' : 'text-slate-100'}`}>
                    {minBall}x
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono truncate" title={ballCounts.join(', ')}>
                    Mín: [{ballCounts.join(', ')}]
                  </div>
                </div>
              </div>

              {/* Target Route */}
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-emerald-800/40 space-y-1">
                <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Rota Ideal Recomendada
                </div>
                <div className="text-sm font-bold text-slate-100">
                  {bestHunt.name} <span className="text-xs font-normal text-slate-400">(Lv. {bestHunt.level})</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Área: {bestHunt.area.toUpperCase()}</span>
                  <span>EXP: {bestHunt.exp.toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={() => addSimLog(`[Viagem] Viajando agora para ${bestHunt.name}...`)}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  Viajar Agora
                </button>
                <button
                  onClick={simulateManualRestock}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  Restock Manual
                </button>
              </div>

              {/* Mini Log window */}
              <div className="bg-black/60 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 max-h-24 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="leading-tight truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
