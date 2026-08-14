// ============================================
// OpenService MCP AionUI - BACKGROUND SCRIPT
// ============================================
// MCP server handler for Chrome Extension control
// Communicates via stdin/stdout with content scripts

const { spawn } = require('child_process');
const http = require('http');
const url = require('url');
const readline = require('readline');

// Interface MCP - comunica via stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

// Mapeamento de comandos para funções da página
const commandMap = {
  // Navegação
  navigate: async (params) => {
    const url = params.url || '';
    if (!url) return { success: false, error: 'URL nao especificada' };
    return { success: true, action: 'navigate', url };
  },

  // Abrir nova aba
  open_tab: async (params) => {
    const url = params.url || '';
    return { success: true, action: 'open_tab', url };
  },

  // Fechar aba
  close_tab: async (params) => {
    return { success: true, action: 'close_tab' };
  },

  // Switch tab
  switch_tab: async (params) => {
    const tabId = params.tabId;
    return { success: true, action: 'switch_tab', tab_id: tabId };
  },

  // Scroll
  scroll: async (params) => {
    const direction = params.direction || 'down';
    const pixels = params.pixels || 0;
    return { success: true, action: 'scroll', direction, pixels };
  },

  // Screenshot
  screenshot: async (params) => {
    return { success: true, action: 'screenshot' };
  },

  // Executar JS
  execute_script: async (params) => {
    const script = params.script || '';
    if (!script) return { success: false, error: 'Script nao especificado' };
    return { success: true, action: 'execute_script', script };
  }
};

// ============================================
// HANDLER PRINCIPAL - Processa comandos MCP
// ============================================

async function handleCommand(command, params) {
  try {
    if (commandMap[command]) {
      return await commandMap[command](params);
    } else {
      return { success: false, error: `Comando desconhecido: ${command}` };
    }
  } catch (error) {
    console.error(`Erro no comando ${command}:`, error);
    return { success: false, error: error.message };
  }
}

// Processar linhas do stdin
console.error('OpenService MCP AionUI - MCP Background running');

rl.on('line', (line) => {
  if (!line.trim()) return;

  try {
    const { command, params } = JSON.parse(line);
    const result = handleCommand(command, params);
    console.log(JSON.stringify(result));
  } catch (e) {
    console.log(JSON.stringify({ success: false, error: `JSON parse error: ${e.message}` }));
  }
});

rl.on('close', () => {
  console.error('MCP Background shutting down');
  process.exit(0);
});