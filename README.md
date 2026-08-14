# OpenService MCP AionUI - Chrome Extension

![OpenService MCP AionUI](https://img.shields.io/badge/OpenService-MCP%20AionUI-007acc?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-V3-4285F4?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📌 Visão Geral

**OpenService MCP AionUI** é uma extensão do Chrome completa e poderosa que permite controle total do navegador através do framework **AionUI MCP** (Model Control Protocol). Diferente de ferramentas como Playwright, Chrome DevTools Protocol (CDP) ou Selenium, esta extensão usa **APIs nativas de Chrome Extensions**, proporcionando:

- ✅ **Sem looping de abas** - Não abre novos processos Chrome a cada comando
- ✅ **Comunicação local via stdio** - Segura e eficiente
- ✅ **Funciona com qualquer modelo de IA** - Não preso a provedores específicos
- ✅ **Extensível** - Adicione novas funcionalidades via comandos MCP

## 👤 Autor

**Enzo Vieira**  
Desenvolvedor de extensões Chrome e automação de navegadores

- 🔗 **LinkedIn**: [https://www.linkedin.com/in/enzovieiratrabalho/](https://www.linkedin.com/in/enzovieiratrabalho/)
- 💻 **GitHub**: [https://github.com/EnzoVieira3012](https://github.com/EnzoVieira3012)

## 🎯 Público-Alvo

Desenvolvedores que utilizam **AionUI** e desejam uma alternativa flexível, open-source e não-proprietária para automação de navegadores.

## ✨ Funcionalidades

### 🔍 Extração de Dados da Página

- `get_text` - Extrai todo o texto visível
- `get_links` - Lista todos os links com texto e URLs
- `get_inputs` - Captura inputs, selects e textareas
- `get_buttons` - Encontra todos os botões da página

### 🎯 Interação DOM

- `click` - Clica em elemento por seletor CSS
- `type` - Digita texto em campos de formulário
- `select` - Seleciona opção em dropdowns
- `scroll` - Rolagem suave (up/down/left/right/top/bottom)
- `screenshot` - Capture screenshot da viewport

### 🌐 Navegação e Abas

- `navigate` - Navegar para URL na aba atual
- `open_tab` - Abrir nova aba com URL
- `close_tab` - Fechar aba atual
- `switch_tab` - Trocar entre abas
- `execute_script` - Executar JavaScript personalizado

### 💡 Comandos Exemplo

```json
// Navegar para uma página
{"action": "navigate", "params": {"url": "https://exemplo.com"}}

// Extrair texto da página
{"action": "get_text", "params": {}}

// Clicar em botão
{"action": "click", "params": {"selector": "button"}

// Rolagem da página
{"action": "scroll", "params": {"direction": "down", "pixels": 500}}

// Screenshot
{"action": "screenshot", "params": {}}

// Executar JavaScript
{"action": "execute_script", "params": {"script": "document.body.style.background='yellow'"}}
```

## 🛠️ Como Usar

### Via Terminal/CLI

Enviar comandos através do stdin:

```bash
# Navegar
echo '{"action": "navigate", "params": {"url": "https://example.com"}}' | aionui mcp stdio

# Extrair texto
echo '{"action": "get_text", "params": {}}' | aionui mcp stdio

# Tirar screenshot
echo '{"action": "screenshot", "params": {}}' | aionui mcp stdio
```

### Via Código (Node.js)

```javascript
const { execSync } = require('child_process');

// Navegar
execSync('echo \'{"action": "navigate", "params": {"url": "https://github.com"}}\' | aionui mcp stdio');

// Obter texto
const result = execSync('echo \'{"action": "get_text", "params": {}}\' | aionui mcp stdio', {
  encoding: 'utf8'
});
console.log(result);
```

## 📁 Estrutura do Projeto

```
manifest.json      # Configuração da extensão Chrome
background.js      # Handler MCP - comunica via stdin/stdout
content.js         # Funções DOM, extração e interação
content.css        # Arquivo CSS (obrigatório para carregar)
LICENSE            # Licença MIT
README.md          # Esta documentação
```

## 🆚 Comparação Rápida

| Característica | OpenService MCP AionUI | Playwright | CDP | Selenium |
|----------------|------------------------|------------|-----|----------|
| **Tipo** | Chrome Extension | Node.js library | Protocolo Chrome | Browser driver |
| **Looping de abas** | ❌ Não (fixo) | ⚠️ Pode ocorrer | ⚠️ Depende | ⚠ Depende |
| **Setup** | Basta carregar extensão | Node_modules + browsers | Config CDP | Drivers de browser |
| **Comunicação** | stdin/stdout (MCP) | API Node.js | WebSocket | JSON wire protocol |
| **Modelo IA** | Qualquer um (open) | Node.js | Chrome specific | Any |

## 🐛 Problemas Conhecidos

1. **Chrome precisa estar aberto** - A extensão roda dentro de uma instância existente
2. **Perfil do Chrome** - Funciona melhor com perfil padrão
3. **Content scripts** - Alguns sites com CSP podem bloquear injeção

## 🚀 Roadmap

- [x] Versão inicial com funções básicas
- [ ] Suporte a múltiplos perfis Chrome
- [ ] Gravação e replay de ações (macro)
- [ ] Dashboard web para monitorar comandos em tempo real

## 📄 Licença

Este projeto está licenciado under the **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Como Contribuir

1. Fork o repositório (`git fork https://github.com/EnzoVieira3012/openservice-mcp-aionui.git`)
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 💬 Suporte

- **Issues**: Use o GitHub Issues para reportar bugs ou solicitar funcionalidades
- **Discussions**: GitHub Discussions para dúvidas e sugestões
- **LinkedIn**: [https://www.linkedin.com/in/enzovieiratrabalho/](https://www.linkedin.com/in/enzovieiratrabalho/)

---

**OpenService MCP AionUI** - Controle seu navegador com liberdade open-source! 🌐✨