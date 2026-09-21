import React, { useState } from 'react';
import { Terminal, Chrome, Github, Check, Copy, Sparkles, Cloud, Laptop, RefreshCw, Zap, ShieldAlert } from 'lucide-react';

export const InstallationGuide: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCmd = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const gitPushCommands = `# 1. Acesse o seu repositório local
cd pokeidlebott

# 2. Copie ou edite o arquivo bot-core.js na raiz do projeto
# (Cole o código disponível na aba 'bot-core.js' deste assistente)

# 3. Adicione o arquivo ao Git
git add bot-core.js

# 4. Crie o commit com a nova versão
git commit -m "feat: atualiza nucleo com leitura direta e auto-restock v1.2.0"

# 5. Garanta que o branch principal é a main
git branch -M main

# 6. Se ainda não adicionou o repositório remoto:
git remote add origin https://github.com/brunocruz9/pokeidlebott.git

# 7. Suba a atualização para o GitHub
git push origin main`;

  return (
    <div id="installation-guide-section" className="space-y-6">
      {/* Visão Geral da Arquitetura Remota */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-slate-100">
            Arquitetura Desacoplada: Como Funciona a Atualização Remota
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Nesta arquitetura moderna, os usuários instalam o carregador local no Chrome apenas <strong>uma única vez</strong>. Toda a lógica, dados de rotas, seletores e automações residem no arquivo <strong className="text-blue-400">bot-core.js</strong> no repositório <strong className="text-emerald-400">brunocruz9/pokeidlebott</strong>. A cada carregamento da página do jogo, o script baixa a versão mais recente e aplica na hora!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950/70 border border-emerald-500/30 p-3 rounded-lg flex items-start gap-2.5">
            <Laptop className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-emerald-300">Parte 1: No Navegador (Chrome)</span>
              <p className="text-slate-400">
                Você e seus usuários instalam apenas <code>manifest.json</code> e <code>content.js</code> no Chrome. Não requer nenhuma manutenção futura no navegador.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-blue-500/30 p-3 rounded-lg flex items-start gap-2.5">
            <Cloud className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-blue-300">Parte 2: Na Nuvem (GitHub)</span>
              <p className="text-slate-400">
                Você sobe o <code>bot-core.js</code> no repositório <strong>brunocruz9/pokeidlebott</strong>. Qualquer alteração reflete na hora para quem estiver jogando (F5).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Passo 1: Instalação no Chrome */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Chrome className="w-5 h-5 text-amber-400" />
          <span>Passo 1: Instalação Única no Google Chrome (Para os Usuários)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">1</div>
            <div className="font-bold text-slate-200">Baixar 2 Arquivos</div>
            <p className="text-slate-400 leading-relaxed">
              Crie uma pasta no computador (ex: <code>pokeidle-extension</code>) e coloque dentro <strong>apenas</strong>:
              <br />
              <code className="text-emerald-400 font-mono">manifest.json</code> e <code className="text-emerald-400 font-mono">content.js</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">2</div>
            <div className="font-bold text-slate-200">Acessar Extensões</div>
            <p className="text-slate-400 leading-relaxed">
              No Chrome, digite na barra de endereços:
              <br />
              <code className="text-emerald-400 select-all bg-slate-900 px-1 py-0.5 rounded">chrome://extensions</code>
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">3</div>
            <div className="font-bold text-slate-200">Modo Desenvolvedor</div>
            <p className="text-slate-400 leading-relaxed">
              No canto superior direito da página de extensões, ative a chave <strong>"Modo do desenvolvedor"</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">4</div>
            <div className="font-bold text-slate-200">Carregar Pasta</div>
            <p className="text-slate-400 leading-relaxed">
              Clique em <strong>"Carregar sem compactação"</strong> (Load unpacked) e selecione a pasta criada. Pronto!
            </p>
          </div>
        </div>
      </div>

      {/* Passo 2: Publicação no GitHub */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Github className="w-5 h-5 text-white" />
            <span>Passo 2: Como Subir o bot-core.js para o Repositório GitHub</span>
          </div>

          <button
            onClick={() => copyCmd(gitPushCommands, 'git')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            {copiedId === 'git' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Comandos Copiados!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Comandos Git</span>
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-slate-300">
          O loader ultraleve busca diretamente por:
          <div className="mt-1 p-2 bg-slate-950 rounded font-mono text-emerald-400 border border-slate-800 select-all overflow-x-auto">
            https://raw.githubusercontent.com/brunocruz9/pokeidlebott/main/bot-core.js
          </div>
        </div>

        {/* Git Terminal Box */}
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto border border-slate-800">
          <pre>{gitPushCommands}</pre>
        </div>

        {/* Upload alternativo via web */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 text-xs text-slate-400">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span>Opção sem Git (Direto pelo Navegador no GitHub):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Acesse <a href="https://github.com/brunocruz9/pokeidlebott" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">https://github.com/brunocruz9/pokeidlebott</a>.</li>
            <li>Clique em <strong>Add file</strong> &gt; <strong>Create new file</strong> (ou <strong>Upload files</strong>).</li>
            <li>Dê o nome exato de <code className="text-emerald-400">bot-core.js</code>.</li>
            <li>Cole o conteúdo da aba <strong>bot-core.js</strong> e clique em <strong>Commit changes</strong> salvando na branch <code>main</code>.</li>
          </ol>
        </div>
      </div>

      {/* Dicas Técnicas e Validações */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Mecanismos Técnicos do Loader &amp; Core
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Bypass de Cache (Zero Delay)</span>
            </div>
            <p>
              O loader utiliza <code>?t=${'{Date.now()}'}</code> e <code>cache: 'no-store'</code>. Isso impede que o cache de 5 minutos do GitHub Raw segure a versão antiga. Novos commits entram em vigor instantaneamente ao dar F5 no jogo.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Redundância Local (Offline)</span>
            </div>
            <p>
              Cada versão baixada com sucesso é salva no <code>localStorage</code>. Se o GitHub passar por instabilidade ou lentidão, o loader executa o último cache salvo para não deixar o jogador desprotegido.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Leitura Direta no DOM</span>
            </div>
            <p>
              O <code>bot-core.js</code> monitora diretamente o slot <code>[data-guide="inv-item-202"]</code> (Ultra Potion com cache) e a área de captura para comprar na loja via <code>POST /api/game/shop/buy</code> se cair abaixo de 100 poções ou 50 pokébolas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
