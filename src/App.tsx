import React, { useState } from 'react';
import { FileCode2, Compass, Eye, BookOpen, ShieldCheck, Zap, Download } from 'lucide-react';
import { ExtensionViewer } from './components/ExtensionViewer';
import { RouteSimulator } from './components/RouteSimulator';
import { WidgetPreview } from './components/WidgetPreview';
import { InstallationGuide } from './components/InstallationGuide';
import JSZip from 'jszip';
import { MANIFEST_JSON, CONTENT_JS, README_MD } from './data/extensionCode';

export default function App() {
  const [activeSection, setActiveSection] = useState<'code' | 'simulator' | 'widget' | 'guide'>('code');

  const handleQuickDownload = async () => {
    const zip = new JSZip();
    zip.file('manifest.json', MANIFEST_JSON);
    zip.file('content.js', CONTENT_JS);
    zip.file('README.md', README_MD);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poke-idle-smart-assistant-extension.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                  Poke Idle World Assistant
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
                  Chrome Extension V3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Otimização Inteligente de Rotas EXP, Auto-Restock e Floating Overlay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              title="Baixar extensão completa em formato .ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar Extensão (.ZIP)</span>
              <span className="sm:hidden">Baixar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveSection('code')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'code'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Código da Extensão (manifest & content)
          </button>

          <button
            onClick={() => setActiveSection('simulator')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'simulator'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Simulador de Rotas & Fraquezas
          </button>

          <button
            onClick={() => setActiveSection('widget')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'widget'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview do Widget Flutuante
          </button>

          <button
            onClick={() => setActiveSection('guide')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guia de Instalação (Chrome & GitHub)
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeSection === 'code' && <ExtensionViewer />}
        {activeSection === 'simulator' && <RouteSimulator />}
        {activeSection === 'widget' && <WidgetPreview />}
        {activeSection === 'guide' && <InstallationGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Poke Idle World Smart Assistant Extension • Desenvolvido com Google Chrome Extensions Manifest V3
      </footer>
    </div>
  );
}
