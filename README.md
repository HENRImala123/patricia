# Cardápio Digital Inteligente — Gestão e Atendimento para Restaurantes

Plataforma profissional de cardápio digital, mesas, QR Codes exclusivos, chamados em tempo real e atendimento para restaurantes.

---

## 🚀 Como publicar no GitHub Pages (Solução para a Tela Branca)

A tela branca ocorria porque, por padrão, o Vite gerava caminhos absolutos `/assets/...`, fazendo o navegador procurar os arquivos em `https://henrimala123.github.io/assets/...` em vez de `https://henrimala123.github.io/patricia/assets/...`.

Com a configuração `base: './'` que acabamos de aplicar no `vite.config.ts`, os caminhos agora são relativos (`./assets/...`), funcionando perfeitamente em qualquer subpasta do GitHub Pages.

### Opção 1: Deploy Automático via GitHub Actions (Recomendada)

Já incluímos o arquivo `.github/workflows/deploy.yml` no projeto. Para ativar:

1. Faça o commit e push do projeto para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: suporte ao GitHub Pages com caminhos relativos e workflow"
   git push origin main
   ```
2. No seu repositório no GitHub, vá em **Settings** > **Pages**.
3. Na seção **Build and deployment** > **Source**, selecione **GitHub Actions**.
4. Pronto! O GitHub compilará automaticamente e publicará o site em `https://henrimala123.github.io/patricia/`.

### Opção 2: Deploy Manual da pasta `dist`

Se você preferir publicar os arquivos estáticos diretamente pelo branch `gh-pages`:

1. Compile o projeto localmente:
   ```bash
   npm run build
   ```
2. A pasta `dist/` conterá todo o código pronto para produção com caminhos relativos.
3. Publique o conteúdo da pasta `dist/` para a branch `gh-pages` ou configure a branch `main` com a pasta `/dist`.

---

## 🛠️ Tecnologias e Recursos

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** com paleta oficial vermelho `#EF003F`, preto e branco
- **QR Code dinâmico** com exportação e displays de acrílico
- **Chamados em tempo real** com sincronização multi-sessão e áudio sintetizado (Web Audio API)
- **Studio de Mídias 9:16** (Stories & Reels) com visualizador de Giro 360° orbital
- **Monitor de Salão & Modo TV VIP** para telas suspensas 1080p/4K
- **Painel de Equipe (RBAC)** com controle de PIN de 4 dígitos
