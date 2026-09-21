# Poke Idle World - Smart Assistant (Arquitetura Nuvem GitHub + Loader Local)

Esta extensão utiliza uma **arquitetura híbrida desacoplada**:
1. **Google Chrome (Instalação Única no Navegador)**: Baixe apenas `manifest.json` e `content.js`.
2. **Nuvem GitHub (`brunocruz9/pokeidlebott`)**: O arquivo `bot-core.js` fica hospedado no repositório. Sempre que você alterar ou atualizar este arquivo no GitHub, todos os jogadores recebem a nova versão instantaneamente ao recarregar a página do jogo (`F5`), sem precisar reinstalar nada no Chrome!

---

## 📁 Divisão dos Arquivos

| Arquivo | Destino | Função |
| :--- | :--- | :--- |
| **`manifest.json`** | 💻 Google Chrome (Pasta local) | Declara permissões para `https://poke.idleworld.online/*` e `https://raw.githubusercontent.com/*`. |
| **`content.js`** | 💻 Google Chrome (Pasta local) | **Loader ultraleve**: faz o download dinâmico do `bot-core.js` com timestamp anti-cache e o injeta na página do jogo. |
| **`bot-core.js`** | ☁️ GitHub (`brunocruz9/pokeidlebott`) | **Inteligência completa**: widget escuro flutuante, cálculo de rotas EXP por fraqueza, leitura direta de Ultra Potions (`[data-guide="inv-item-202"]`) com cache, contagem de pokébolas e auto-restock via API. |

---

## 🚀 Passo 1: Instalar a Extensão no Chrome (Apenas 1 vez)

1. Crie uma pasta vazia no seu computador, por exemplo `pokeidle-extension`.
2. Coloque dentro dela **apenas** estes dois arquivos:
   - `manifest.json`
   - `content.js`
3. Abra o Google Chrome e acesse:
   ```text
   chrome://extensions
   ```
4. Ative a chave **"Modo do desenvolvedor"** no canto superior direito.
5. Clique no botão **"Carregar sem compactação"** (Load unpacked) e selecione a pasta `pokeidle-extension`.
6. Pronto! A extensão está instalada e nunca mais precisará ser recarregada manualmente no Chrome.

---

## ☁️ Passo 2: Subir o `bot-core.js` no Repositório do GitHub

O loader procura o script no link:
`https://raw.githubusercontent.com/brunocruz9/pokeidlebott/main/bot-core.js`

### Opção A: Pelo Terminal (Git)
Se você já clonou ou tem o repositório configurado no seu computador:
```bash
# 1. Copie o bot-core.js para a raiz do seu repositório local
cd pokeidlebott

# 2. Adicione e faça o commit
git add bot-core.js
git commit -m "feat: atualiza nucleo do bot com leitura direta e auto-restock v1.2.0"

# 3. Envie para o branch main no GitHub
git push origin main
```

### Opção B: Direto pelo Navegador no GitHub
1. Abra seu repositório: `https://github.com/brunocruz9/pokeidlebott`
2. Clique em **Add file** -> **Upload files** (ou crie um novo arquivo chamado `bot-core.js`).
3. Cole o conteúdo de `bot-core.js` e clique em **Commit changes** salvando na branch `main`.

---

## 🔄 Como funcionam as Atualizações Instantâneas

- O loader `content.js` efetua requisições com parâmetro temporal:
  `https://raw.githubusercontent.com/brunocruz9/pokeidlebott/main/bot-core.js?t=1690000000000`
- Isso **força o CDN do GitHub a ignorar o cache**, entregando sempre o último commit.
- Caso o GitHub passe por instabilidade passageira, o loader executa a cópia de segurança salva no `localStorage` do navegador para nunca interromper o farm do jogador.
