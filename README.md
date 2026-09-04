# 🛡️ Juntar PDF — Client-Side & DevSecOps Hardened

[![CI Pipeline](https://github.com/Mdsoare/juntar-pdf-web/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/Mdsoare/juntar-pdf-web/actions/workflows/ci-pipeline.yml)
[![Deploy to GitHub Pages](https://github.com/Mdsoare/juntar-pdf-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/Mdsoare/juntar-pdf-web/actions/workflows/deploy.yml)
[![Security Rating](https://img.shields.io/badge/Security-DevSecOps%20Hardened-green?style=flat&logo=github)](https://github.com/Mdsoare/juntar-pdf-web/security/code-scanning)
![Security: CSP Compliant](https://img.shields.io/badge/Security-CSP--Compliant-success.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Stylelint](https://img.shields.io/badge/Stylelint-264DE4?style=for-the-badge&logo=stylelint&logoColor=white)
![SAST & SCA](https://img.shields.io/badge/DevSecOps-SAST%20%26%20SCA-red?style=for-the-badge&logo=shield&logoColor=white)

---

Uma solução **100% client-side**, leve, rápida e centrada em privacidade para unificação e manipulação de arquivos PDF (`.pdf`).

Projetada sob o paradigma **Zero-Trust** e princípios de **Privacy by Design**, a aplicação opera inteiramente no navegador do usuário — **nenhum documento ou dado pessoal é enviado para servidores externos ou armazenado na rede**.

---

## 🚀 Demonstração & Live Access

Acesse a versão estável diretamente via GitHub Pages:  
👉 **[https://mdsoare.github.io/juntar-pdf-web](https://mdsoare.github.io/juntar-pdf-web)**

---

## 💡 O Problema e a Solução

Em operações corporativas, rotinas administrativas e investigações forenses, o manuseio de documentos sensíveis exige cautela extrema. Utilizar conversores ou mescladores de PDF *online* não confiáveis expõe dados confidenciais, documentos pessoais e relatórios restritos a servidores de terceiros.

O **Juntar PDF Web** resolve essa vulnerabilidade ao realizar a leitura, extração de páginas e geração do documento final estritamente em memória local no browser, garantindo total isolamento da rede.

---

## ✨ Principais Funcionalidades

- 🧩 **Junção de PDFs Local:** Selecione ou arraste múltiplos arquivos PDF e combine-os em um único documento unificado.
- 📥 **Upload & Drag-and-Drop:** Interface responsiva com suporte a arrastar e soltar ou navegação por arquivo.
- 📋 **Gestão Dinâmica de Fila:** Visualização clara dos arquivos carregados, ordem de processamento e tamanho individual antes de consolidar.
- 🧹 **Limpeza Segura de Memória:** Descarte imediato do buffer de documentos locais e revogação dinâmica de URLs do tipo Blob (`URL.revokeObjectURL`).
- ⚡ **Execução Otimizada & Bundled:** Empacotamento via Vite com divisão de chunks, tree-shaking e cache busting automático para máxima performance.

---

## 🛠️ Tecnologias Utilizadas

- **Vite:** Bundler de alta performance para gerenciamento de assets, servimento em desenvolvimento e geração de build de produção otimizado.
- **HTML5 Semantic:** Estrutura focada em acessibilidade (WCAG) e SEO.
- **CSS3 Moderno:** Layout responsivo, variáveis CSS, CSS Grid e Flexbox integrados diretamente na esteira do Vite.
- **Vanilla JavaScript (ES6+ Modules):** Execução otimizada em escopo estrito (`'use strict'`), manipulando dados binários via `ArrayBuffer` e `Blob` API.
- **pdf-lib:** Gerenciada como dependência NPM para manipulação e fusão local de documentos PDF, empacotada com segurança no bundle final.

---

## 🔒 Postura de Segurança (DevSecOps)

O projeto é mantido sob uma esteira rigorosa de DevSecOps com auditorias estáticas de código (SAST), análise de dependências (SCA) e testes dinâmicos (DAST):

| Vetor de Risco | Status | Ação / Mitigação Aplicada |
| :--- | :---: | :--- |
| **Data Exfiltration** | 🛡️ Protegido | Processamento 100% Client-Side. Comunicação externa totalmente bloqueada via Content Security Policy (`connect-src 'none'`). |
| **DOM-XSS** | 🛡️ Protegido | Manipulação e renderização do DOM usando estritamente APIs puras como `textContent` e `createElement`. |
| **Clickjacking** | 🛡️ Protegido | Proteção por script Frame-Busting ativo no carregamento e diretiva CSP `frame-ancestors 'none'`. |
| **Gestão de Dependências (SCA)** | 🛡️ Protegido | Dependências de terceiros gerenciadas via NPM com varreduras automatizadas por `npm audit`, OSV-Scanner e Trivy na esteira do CI. |
| **Cache Busting & Integrity** | 🛡️ Protegido | O Vite gera hashes baseados no conteúdo dos arquivos compilados (`dist/`), impedindo a execução de scripts corrompidos ou em cache desatualizado. |
| **Linter & Code Quality** | 🛡️ Protegido | Código auditado e validado via ESLint (Zero Warnings), Stylelint, HTMLHint e Markdownlint. |

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

- Node.js (v24+ recomendado)
- NPM

### Passos

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/Mdsoare/juntar-pdf-web.git
    cd juntar-pdf-web
    ```

2. **Instale as dependências:**

    ```bash
    npm ci
    ```
3. **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```
4. **Acesse a URL exibida no terminal**

    - geralmente `http://localhost:5173/juntar-pdf-web/`.

5. **Para gerar a build de produção:**

    ```bash
    npm run build
    ```

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

*Desenvolvido por **Marcelo Soares** | Especialista em Segurança da Informação e Computação Forense.*