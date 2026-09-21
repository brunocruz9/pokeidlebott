import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, FileText, CheckCircle2, ShieldCheck, Sparkles, Cloud, Laptop } from 'lucide-react';
import JSZip from 'jszip';
import { MANIFEST_JSON, CONTENT_JS, BOT_CORE_JS, README_MD } from '../data/extensionCode';

type FileTab = 'manifest' | 'content' | 'botcore' | 'readme';

export const ExtensionViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FileTab>('botcore');
  const [copied, setCopied] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'manifest':
        return MANIFEST_JSON;
      case 'content':
        return CONTENT_JS;
      case 'botcore':
        return BOT_CORE_JS;
      case 'readme':
        return README_MD;
    }
  };

  const getFileName = () => {
    switch (activeTab) {
      case 'manifest':
        return 'manifest.json';
      case 'content':
        return 'content.js';
      case 'botcore':
        return 'bot-core.js';
      case 'readme':
        return 'README.md';
    }
  };

  const copyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const downloadSingleFile = () => {
    const content = getActiveContent();
    const filename = getFileName();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadZip = async () => {
    try {
      setDownloading(true);
      const zip = new JSZip();
      zip.file('manifest.json', MANIFEST_JSON);
      zip.file('content.js', CONTENT_JS);
      zip.file('bot-core.js', BOT_CORE_JS);
      zip.file('README.md', README_MD);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'poke-idle-smart-assistant-extension.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Falha ao gerar ZIP:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div id="extension-viewer" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Arquitetura Desacoplada (GitHub Cloud + Loader)
            </span>
            <span className="text-xs text-slate-400 font-mono">v1.2.0</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">Código Fonte Dividido em Módulos</h2>
          <p className="text-xs text-slate-400">
            Instale o <strong>manifest.json</strong> e <strong>content.js</strong> apenas 1 vez no Chrome. O núcleo <strong>bot-core.js</strong> fica no GitHub e atualiza instantaneamente a cada commit!
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-download-zip"
            onClick={downloadZip}
            disabled={downloading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Gerando .ZIP...' : 'Baixar Todos os Arquivos (.ZIP)'}
          </button>
        </div>
      </div>

      {/* Target Destination Indicator */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {activeTab === 'botcore' ? (
            <>
              <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-300">
                Destino deste arquivo: <strong className="text-blue-300 font-mono">GitHub &gt; brunocruz9/pokeidlebot &gt; bot-core.js</strong> (atualizações automáticas via CDN anti-cache).
              </span>
            </>
          ) : activeTab === 'readme' ? (
            <>
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-300">
                Guia detalhado com instruções de publicação no GitHub e instalação no Google Chrome.
              </span>
            </>
          ) : (
            <>
              <Laptop className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                Destino deste arquivo: <strong className="text-emerald-300 font-mono">Google Chrome (chrome://extensions)</strong> — Instalação única, nunca precisa atualizar manualmente.
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5 gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <button
              id="tab-botcore"
              onClick={() => setActiveTab('botcore')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'botcore'
                  ? 'bg-slate-800 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span>bot-core.js</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">GitHub</span>
            </button>

            <button
              id="tab-content"
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'content'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>content.js (Loader)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">Chrome</span>
            </button>

            <button
              id="tab-manifest"
              onClick={() => setActiveTab('manifest')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'manifest'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>manifest.json</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">Chrome</span>
            </button>

            <button
              id="tab-readme"
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'readme'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>README.md</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-tab"
              onClick={() => copyContent(getActiveContent(), activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar {getFileName()}</span>
                </>
              )}
            </button>
            <button
              id="btn-download-tab"
              onClick={downloadSingleFile}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Baixar apenas este arquivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Salvar {getFileName()}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[560px] leading-relaxed text-slate-300">
          <pre className="whitespace-pre">
            {getActiveContent()}
          </pre>
        </div>
      </div>

      {/* Feature summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            1. Instalação Única no Chrome
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Você instala apenas o <code>manifest.json</code> e o carregador ultraleve <code>content.js</code> no Chrome uma única vez. Nunca mais precisará abrir <code>chrome://extensions</code> para atualizar o bot.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            2. Atualizações Imediatas via GitHub
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            O <code>bot-core.js</code> fica no repositório <strong>brunocruz9/pokeidlebot</strong>. Ao dar <code>git push</code> ou salvar pelo GitHub, a nova versão entra em vigor ao dar F5 no jogo graças à tag anti-cache <code>?t=Date.now()</code>.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            3. Fallback e Redundância Offline
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            O loader armazena a última versão bem-sucedida no <code>localStorage</code> do navegador. Se o GitHub ficar fora do ar temporariamente, o bot continua funcionando perfeitamente sem interrupções.
          </p>
        </div>
      </div>
    </div>
  );
};
