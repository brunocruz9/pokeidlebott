import React, { useState, useMemo } from 'react';
import { Compass, Zap, MapPin, Award, Layers, Search, Filter } from 'lucide-react';
import { HUNT_LOCATIONS, calculateEffectiveness, findBestHunt } from '../data/huntData';

export const RouteSimulator: React.FC = () => {
  const [selectedType1, setSelectedType1] = useState<string>('FIRE');
  const [selectedType2, setSelectedType2] = useState<string>('FLYING');
  const [playerLevel, setPlayerLevel] = useState<number>(45);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const typesList = [
    'NORMAL', 'FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE',
    'FIGHTING', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG',
    'ROCK', 'GHOST', 'DRAGON', 'STEEL', 'DARK', 'FAIRY', 'NONE'
  ];

  // Cálculo da melhor rota
  const bestResult = useMemo(() => {
    const t2 = selectedType2 === 'NONE' ? null : selectedType2;
    return findBestHunt(selectedType1, t2, playerLevel);
  }, [selectedType1, selectedType2, playerLevel]);

  // Lista ranqueada de caças candidatas
  const scoredHunts = useMemo(() => {
    const t2 = selectedType2 === 'NONE' ? null : selectedType2;
    return HUNT_LOCATIONS
      .filter(h => {
        if (selectedArea !== 'all' && h.area !== selectedArea) return false;
        if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .map(h => {
        const eff = calculateEffectiveness(selectedType1, t2, h.type1, h.type2);
        const levelDiff = Math.max(0, playerLevel - h.level);
        const penalty = levelDiff > 60 ? Math.max(0.2, 1 - (levelDiff - 60) * 0.01) : 1;
        const isEligible = h.level <= playerLevel;
        const score = isEligible ? h.exp * eff * penalty : -1;
        return {
          ...h,
          eff,
          score,
          isEligible
        };
      })
      .sort((a, b) => {
        if (a.isEligible && !b.isEligible) return -1;
        if (!a.isEligible && b.isEligible) return 1;
        return b.score - a.score;
      });
  }, [selectedType1, selectedType2, playerLevel, selectedArea, searchQuery]);

  return (
    <div id="route-simulator" className="space-y-6">
      {/* Parameter Selection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Simulador do Algoritmo de Otimização de Rotas
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Teste exatamente como a extensão calcula a fraqueza elemental dos monstros de Kanto, Outland, Orre e Nightmare.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tipo 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tipo Primário (Seu Pokémon)</label>
            <select
              id="select-type1"
              value={selectedType1}
              onChange={(e) => setSelectedType1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            >
              {typesList.filter(t => t !== 'NONE').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Tipo 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tipo Secundário (Opcional)</label>
            <select
              id="select-type2"
              value={selectedType2}
              onChange={(e) => setSelectedType2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            >
              {typesList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Nível do Jogador */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Nível Detectado (Lv. {playerLevel})</label>
              <div className="flex gap-1">
                {[20, 50, 80, 150, 550, 2000].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setPlayerLevel(lvl)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-700"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="input-player-level"
              type="range"
              min={1}
              max={3000}
              value={playerLevel}
              onChange={(e) => setPlayerLevel(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Exemplos Rápidos:</span>
          {[
            { label: 'Charmander (Lv. 25)', t1: 'FIRE', t2: 'NONE', lvl: 25 },
            { label: 'Blastoise (Lv. 85)', t1: 'WATER', t2: 'NONE', lvl: 85 },
            { label: 'Gengar (Lv. 100)', t1: 'GHOST', t2: 'POISON', lvl: 100 },
            { label: 'Lucario (Lv. 580)', t1: 'FIGHTING', t2: 'STEEL', lvl: 580 },
            { label: 'Garchomp (Lv. 2500)', t1: 'DRAGON', t2: 'GROUND', lvl: 2500 },
          ].map(p => (
            <button
              key={p.label}
              onClick={() => {
                setSelectedType1(p.t1);
                setSelectedType2(p.t2);
                setPlayerLevel(p.lvl);
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Best Target Card */}
      {bestResult && bestResult.hunt && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
              <Award className="w-3.5 h-3.5" />
              Melhor Caça Selecionada pelo Assistente
            </span>
            <span className="text-xs text-emerald-400 font-semibold uppercase">
              Área: {bestResult.hunt.area}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <div className="text-xl font-bold text-white flex items-center gap-2">
                {bestResult.hunt.name}
                <span className="text-sm font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Lv. {bestResult.hunt.level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Tipos do Alvo:</span>
                <span className="font-semibold text-emerald-400">{bestResult.hunt.type1}</span>
                {bestResult.hunt.type2 && (
                  <>
                    <span>/</span>
                    <span className="font-semibold text-emerald-400">{bestResult.hunt.type2}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Slug no mapa: <code className="text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">{bestResult.hunt.slug}</code>
              </p>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-800/40 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Multiplicador de Dano</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-emerald-400" />
                {bestResult.multiplier}x
              </div>
              <div className="text-[10px] text-slate-400">
                {bestResult.multiplier >= 2 ? 'Super Efetivo (Kill rápido)' : bestResult.multiplier === 1 ? 'Dano Neutro' : 'Pouco Efetivo'}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-800/40 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Rendimento de EXP</div>
              <div className="text-xl font-bold text-white">
                {bestResult.hunt.exp.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">
                EXP base por abate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Candidate Hunts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-3 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Rotas Avaliadas pelo Algoritmo ({scoredHunts.length})</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="search-hunt"
                type="text"
                placeholder="Buscar monstro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todas as Áreas</option>
                <option value="kanto">Kanto (1-100)</option>
                <option value="outland">Outland (150)</option>
                <option value="orre">Orre (520-600)</option>
                <option value="nightmare">Nightmare (2000-3000)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Monstro / Caça</th>
                <th className="py-2.5 px-3">Nível Mínimo</th>
                <th className="py-2.5 px-3">Área</th>
                <th className="py-2.5 px-3">Tipos</th>
                <th className="py-2.5 px-3">Efetividade</th>
                <th className="py-2.5 px-3">EXP Base</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {scoredHunts.slice(0, 15).map((h, idx) => {
                const isBest = bestResult && bestResult.hunt.slug === h.slug;
                return (
                  <tr
                    key={h.slug + idx}
                    className={`transition-colors ${
                      isBest
                        ? 'bg-emerald-950/40 text-emerald-200 font-semibold'
                        : h.isEligible
                        ? 'hover:bg-slate-800/50'
                        : 'opacity-40 hover:opacity-60'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      {isBest && <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      <span>{h.name}</span>
                      <code className="text-[10px] text-slate-500">{h.slug}</code>
                    </td>
                    <td className="py-2.5 px-3">Lv. {h.level}</td>
                    <td className="py-2.5 px-3 uppercase text-[11px] text-slate-400">{h.area}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 mr-1">
                        {h.type1}
                      </span>
                      {h.type2 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {h.type2}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      <span className={h.eff >= 2 ? 'text-emerald-400' : h.eff < 1 ? 'text-rose-400' : 'text-slate-300'}>
                        {h.eff}x
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{h.exp.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      {isBest ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                          SELECIONADA
                        </span>
                      ) : h.isEligible ? (
                        <span className="text-[11px] text-emerald-400">Disponível</span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Nível Insuficiente</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
