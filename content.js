// ============================================
// OpenService MCP AionUI - CONTENT SCRIPT
// ============================================
// DOM manipulation and extraction functions for OpenService MCP framework
// Runs inside every webpage providing DOM functions
// Communicates with background script via chrome.runtime.sendMessage

function sendResult(action, result) {
  chrome.runtime.sendMessage({ action, result });
}

// ============================================
// FUNÇÕES DE EXTRAÇÃO DE DADOS
// ============================================

/**
 * Extrai todo o texto visível da página
 */
function page_get_text() {
  const text = document.body.innerText || document.body.textContent || '';
  sendResult('get_text', { success: true, text: text.trim() });
}

/**
 * Extrai todos os links da página
 */
function page_get_links() {
  const links = [];
  const elements = document.querySelectorAll('a[href]');

  elements.forEach((el, index) => {
    const href = el.getAttribute('href') || '';
    const text = el.innerText.trim() || el.textContent.trim() || `(link ${index + 1})`;
    links.push({ text, href, index });
  });

  sendResult('get_links', { success: true, links });
}

/**
 * Extrai todos os inputs do formulário
 */
function page_get_inputs() {
  const inputs = [];
  const elements = document.querySelectorAll('input, select, textarea');

  elements.forEach((el, index) => {
    const type = el.type || el.tagName.toLowerCase();
    const name = el.name || '';
    const id = el.id || '';
    const placeholder = el.placeholder || '';
    const value = el.value || '';

    let tag = 'input';
    if (el.tagName === 'SELECT') tag = 'select';
    if (el.tagName === 'TEXTAREA') tag = 'textarea';

    inputs.push({ tag, type, name, id, placeholder, value, index });
  });

  sendResult('get_inputs', { success: true, inputs });
}

/**
 * Extrai todos os botões da página
 */
function page_get_buttons() {
  const buttons = [];
  const elements = document.querySelectorAll('button, [role="button"]');

  elements.forEach((el, index) => {
    const text = el.innerText.trim() || el.textContent.trim() || `(botão ${index + 1})`;
    const type = el.type || 'button';
    const className = el.className ? el.className.baseValue || '' : '';

    buttons.push({ text, type, class: className, index });
  });

  sendResult('get_buttons', { success: true, buttons });
}

// ============================================
// FUNÇÕES DE INTERAÇÃO/DOM MANIPULATION
// ============================================

/**
 * Clica em um elemento especificado
 */
function page_click(selector) {
  let element;

  if (typeof selector === 'number') {
    const buttons = document.querySelectorAll('button');
    if (selector < buttons.length) {
      element = buttons[selector];
    }
  } else {
    element = document.querySelector(selector);
  }

  if (element) {
    element.click();
    sendResult('click', { success: true, element: selector, tag: element.tagName.toLowerCase() });
  } else {
    sendResult('click', { success: false, error: `Element not found: ${selector}` });
  }
}

/**
 * Digita texto em um elemento especificado
 */
function page_type(selector, text) {
  let element;

  if (typeof selector === 'number') {
    const inputs = document.querySelectorAll('input, textarea, select');
    if (selector < inputs.length) {
      element = inputs[selector];
    }
  } else {
    element = document.querySelector(selector);
  }

  if (element) {
    element.value = '';
    element.dispatchEvent(new Event('input', { bubbles: true }));

    if (text) {
      for (let i = 0; i < text.length; i++) {
        element.value += text[i];
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    sendResult('type', { success: true, element: selector, text_length: text.length });
  } else {
    sendResult('type', { success: false, error: `Element not found: ${selector}` });
  }
}

/**
 * Seleciona uma opção em um select/dropdown
 */
function page_select(selector, value) {
  let element;

  if (typeof selector === 'number') {
    element = document.querySelectorAll('select')[selector];
  } else {
    element = document.querySelector(selector);
  }

  if (element && element.tagName === 'SELECT') {
    const options = element.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value || options[i].innerText.trim().toLowerCase() === value.toLowerCase()) {
        element.selectedIndex = i;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        sendResult('select', { success: true, selected_value: value, option_index: i });
        return;
      }
    }

    sendResult('select', { success: false, error: `Option value "${value}" not found` });
  } else {
    sendResult('select', { success: false, error: `Element is not a select: ${selector}` });
  }
}

/**
 * Faz scroll da página
 */
function page_scroll(direction, pixels = 0) {
  let scrollX = 0, scrollY = 0;

  switch (direction) {
    case 'down':
      scrollY = pixels || window.innerHeight;
      break;
    case 'up':
      scrollY = -(pixels || window.innerHeight);
      break;
    case 'left':
      scrollX = -(pixels || window.innerWidth);
      break;
    case 'right':
      scrollX = pixels || window.innerHeight;
      break;
    case 'top':
      scrollY = -(document.body.scrollTop || document.documentElement.scrollTop);
      break;
    case 'bottom':
      scrollY = (document.body.scrollHeight || document.documentElement.scrollHeight) -
                (window.innerHeight || document.documentElement.clientHeight);
      break;
    default:
      sendResult('scroll', { success: false, error: `Direção inválida: ${direction}` });
      return;
  }

  window.scrollBy({ top: scrollY, left: scrollX, behavior: 'smooth' });
  sendResult('scroll', { success: true, direction, pixels, scrollY, scrollX });
}

/**
 * Captura screenshot da página
 */
function page_screenshot() {
  try {
    const dataURL = canvas ? canvas.toDataURL('image/png') : '';
    sendResult('screenshot', { success: true, data_url: dataURL });
  } catch (error) {
    sendResult('screenshot', { success: false, error: error.message });
  }
}

// ============================================
// FUNÇÕES DE NAVEGAÇÃO DE ABA
// ============================================

/**
 * Solicitar ao background script que abra nova aba
 */
function browser_open_tab(url) {
  chrome.runtime.sendMessage({ action: 'open_tab', url });
  sendResult('open_tab', { success: true, url });
}

/**
 * Solicitar ao background script que feche aba
 */
function browser_close_tab(tabId) {
  chrome.runtime.sendMessage({ action: 'close_tab', tabId });
  sendResult('close_tab', { success: true });
}

/**
 * Solicitar ao background script que troque de aba
 */
function browser_switch_tab(tabId) {
  chrome.runtime.sendMessage({ action: 'switch_tab', tabId });
  sendResult('switch_tab', { success: true, tab_id: tabId });
}

/**
 * Solicitar ao background script que navegue
 */
function browser_navigate(url) {
  chrome.runtime.sendMessage({ action: 'navigate', url });
  sendResult('navigate', { success: true, url });
}

// ============================================
// FUNÇÃO PARA EXECUTAR JAVASCRIPT PERSONALIZADO
// ============================================

/**
 * Executar JS personalizado na página
 */
function browser_execute_script(script) {
  chrome.runtime.sendMessage({ action: 'execute_script', script });
  sendResult('execute_script', { success: true, script_length: script.length });
}

// ============================================
// LISTA DE RECEBIMENTO DE MENSAGENS DO BACKGROUND
// ============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_text') {
    page_get_text();
  } else if (request.action === 'get_links') {
    page_get_links();
  } else if (request.action === 'get_inputs') {
    page_get_inputs();
  } else if (request.action === 'get_buttons') {
    page_get_buttons();
  } else if (request.action === 'click') {
    page_click(request.selector);
  } else if (request.action === 'type') {
    page_type(request.selector, request.text);
  } else if (request.action === 'select') {
    page_select(request.selector, request.value);
  } else if (request.action === 'scroll') {
    page_scroll(request.direction, request.pixels);
  } else if (request.action === 'screenshot') {
    page_screenshot();
  } else if (request.action === 'open_tab') {
    browser_open_tab(request.url);
  } else if (request.action === 'close_tab') {
    browser_close_tab(request.tabId);
  } else if (request.action === 'switch_tab') {
    browser_switch_tab(request.tabId);
  } else if (request.action === 'navigate') {
    browser_navigate(request.url);
  } else if (request.action === 'execute_script') {
    browser_execute_script(request.script);
  }

  return true;
});

// ============================================
// INICIALIZAÇÃO
// ============================================

console.log('OpenService MCP AionUI - Content Script Active');

// Expor funções globalmente
window.page_get_text = page_get_text;
window.page_get_links = page_get_links;
window.page_get_inputs = page_get_inputs;
window.page_get_buttons = page_get_buttons;
window.page_click = page_click;
window.page_type = page_type;
window.page_select = page_select;
window.page_scroll = page_scroll;
window.page_screenshot = page_screenshot;
window.browser_open_tab = browser_open_tab;
window.browser_close_tab = browser_close_tab;
window.browser_switch_tab = browser_switch_tab;
window.browser_navigate = browser_navigate;
window.browser_execute_script = browser_execute_script;