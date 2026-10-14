
"use strict";

/*
  LANTERNA DE PODER
  Versão experimental 1.0

  Reconhecimento de voz:
  - Web Speech API
  - Identificação por juramento cadastrado
  - Identificação auxiliar por palavras características
  - Seleção manual das tropas

  Observação:
  Os símbolos abaixo são representações visuais genéricas.
  Não são reproduções dos emblemas oficiais da DC.
*/

const CORPS = [
  {
    id: "red",
    name: "Tropa dos Lanternas Vermelhos",
    short: "VERMELHOS",
    emotion: "RAIVA",
    description: "A raiva alimenta a energia vermelha.",
    color: "#ff293e",
    symbol: "✦",
    keywords: {
      "pt-BR": ["sangue", "raiva", "ódio", "vingança", "lanterna vermelha"],
      "en-US": ["blood", "rage", "hate", "vengeance", "red lantern"]
    }
  },
  {
    id: "orange",
    name: "Tropa dos Lanternas Laranjas",
    short: "LARANJAS",
    emotion: "AVAREZA",
    description: "O desejo de possuir tudo alimenta a luz laranja.",
    color: "#ff941b",
    symbol: "◆",
    keywords: {
      "pt-BR": ["meu", "minha", "ganância", "avareza", "lanterna laranja"],
      "en-US": ["mine", "greed", "avarice", "orange lantern"]
    }
  },
  {
    id: "yellow",
    name: "Tropa Sinestro",
    short: "SINESTRO",
    emotion: "MEDO",
    description: "O medo é a arma daqueles que controlam a luz amarela.",
    color: "#ffe128",
    symbol: "◈",
    keywords: {
      "pt-BR": ["medo", "temor", "sinestro", "lanterna amarela"],
      "en-US": ["fear", "sinestro", "yellow lantern"]
    }
  },
  {
    id: "green",
    name: "Tropa dos Lanternas Verdes",
    short: "VERDES",
    emotion: "FORÇA DE VONTADE",
    description: "A vontade é a força que supera o medo.",
    color: "#17ff65",
    symbol: "◉",
    keywords: {
      "pt-BR": ["dia mais claro", "noite mais densa", "mal escapar", "luz do lanterna verde"],
      "en-US": ["brightest day", "blackest night", "evil shall escape", "green lantern light"]
    }
  },
  {
    id: "blue",
    name: "Tropa dos Lanternas Azuis",
    short: "AZUIS",
    emotion: "ESPERANÇA",
    description: "A esperança ilumina os momentos mais sombrios.",
    color: "#2695ff",
    symbol: "✧",
    keywords: {
      "pt-BR": ["esperança", "lanterna azul", "luz azul"],
      "en-US": ["hope", "blue lantern", "blue light"]
    }
  },
  {
    id: "indigo",
    name: "Tribo Índigo",
    short: "ÍNDIGO",
    emotion: "COMPAIXÃO",
    description: "A compaixão conecta aqueles que sofrem.",
    color: "#7758ff",
    symbol: "❖",
    keywords: {
      "pt-BR": ["compaixão", "tribo índigo", "índigo"],
      "en-US": ["compassion", "indigo tribe", "indigo"]
    }
  },
  {
    id: "violet",
    name: "Safiras Estelares",
    short: "VIOLETAS",
    emotion: "AMOR",
    description: "O amor é a energia que conecta os seres.",
    color: "#f54ac8",
    symbol: "✿",
    keywords: {
      "pt-BR": ["amor", "safira estelar", "violeta"],
      "en-US": ["love", "star sapphire", "violet"]
    }
  },
  {
    id: "black",
    name: "Tropa dos Lanternas Negros",
    short: "NEGROS",
    emotion: "MORTE",
    description: "A escuridão representa a ausência de vida.",
    color: "#a4b1c5",
    symbol: "✕",
    keywords: {
      "pt-BR": ["morte", "mortos", "lanterna negra", "noite negra"],
      "en-US": ["death", "dead", "black lantern", "blackest night"]
    }
  },
  {
    id: "white",
    name: "Tropa dos Lanternas Brancos",
    short: "BRANCOS",
    emotion: "VIDA",
    description: "A luz branca representa a energia da vida.",
    color: "#ffffff",
    symbol: "✺",
    keywords: {
      "pt-BR": ["vida", "lanterna branca", "luz branca"],
      "en-US": ["life", "white lantern", "white light"]
    }
  },
  {
    id: "ultraviolet",
    name: "Tropa Ultravioleta",
    short: "ULTRAVIOLETA",
    emotion: "EMOÇÕES OCULTAS",
    description: "A luz invisível manifesta emoções reprimidas.",
    color: "#a83aff",
    symbol: "⬡",
    keywords: {
      "pt-BR": ["ultravioleta", "emoções ocultas", "luz invisível"],
      "en-US": ["ultraviolet", "hidden emotions", "invisible spectrum"]
    }
  },
  {
    id: "gold",
    name: "Lanterna Dourado",
    short: "DOURADO",
    emotion: "ENERGIA DOURADA",
    description: "Uma manifestação rara de energia do espectro.",
    color: "#ffc849",
    symbol: "✷",
    keywords: {
      "pt-BR": ["dourado", "lanterna dourado", "lanterna de ouro"],
      "en-US": ["gold lantern", "golden lantern"]
    }
  }
];

const STORAGE = {
  oaths: "lanterna_oaths_v1",
  settings: "lanterna_settings_v1",
  selected: "lanterna_selected_v1"
};

const DEFAULT_SETTINGS = {
  vibration: true,
  sound: true,
  animation: true,
  brightness: true
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $("#app"),
  corpsGrid: $("#corpsGrid"),
  corpsName: $("#corpsName"),
  corpsEmotion: $("#corpsEmotion"),
  corpsDescription: $("#corpsDescription"),
  corpsSymbol: $("#corpsSymbol"),
  powerPercent: $("#powerPercent"),
  powerFill: $("#powerFill"),
  powerMessage: $("#powerMessage"),
  listenButton: $("#listenButton"),
  listenButtonText: $("#listenButtonText"),
  microphoneState: $("#microphoneState"),
  transcript: $("#transcript"),
  voiceVisualizer: $("#voiceVisualizer"),
  languageSelect: $("#languageSelect"),
  chargeButton: $("#chargeButton"),
  resetButton: $("#resetButton"),
  fullscreenButton: $("#fullscreenButton"),
  oathCorps: $("#oathCorps"),
  oathLanguage: $("#oathLanguage"),
  oathText: $("#oathText"),
  saveOathButton: $("#saveOathButton"),
  clearOathButton: $("#clearOathButton"),
  editorFeedback: $("#editorFeedback"),
  savedOaths: $("#savedOaths"),
  settingsModal: $("#settingsModal"),
  settingsButton: $("#settingsButton"),
  closeSettingsButton: $("#closeSettingsButton"),
  vibrationToggle: $("#vibrationToggle"),
  soundToggle: $("#soundToggle"),
  animationToggle: $("#animationToggle"),
  brightnessToggle: $("#brightnessToggle"),
  resetSettingsButton: $("#resetSettingsButton"),
  chargeOverlay: $("#chargeOverlay"),
  overlaySymbol: $("#overlaySymbol"),
  overlayCorps: $("#overlayCorps"),
  overlayPercent: $("#overlayPercent"),
  overlayStatus: $("#overlayStatus"),
  closeChargeButton: $("#closeChargeButton"),
  systemStatus: $("#systemStatus"),
  stars: $("#stars")
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

let settings = {
  ...DEFAULT_SETTINGS,
  ...readJSON(STORAGE.settings, {})
};

let savedOaths = readJSON(STORAGE.oaths, []);

if (!Array.isArray(savedOaths)) {
  savedOaths = [];
}

savedOaths = savedOaths.filter(oath =>
  oath &&
  typeof oath.text === "string" &&
  CORPS.some(corps => corps.id === oath.corpsId) &&
  ["pt-BR", "en-US"].includes(oath.language)
);

let selectedCorps = CORPS.find(
  corps => corps.id === readJSON(STORAGE.selected, "green")
) || CORPS[3];

let recognition = null;
let listening = false;
let power = 0;
let charging = false;
let chargeFrame = null;
let audioContext = null;
let lastChargeTime = 0;

function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordsOf(text) {
  return normalizeText(text)
    .split(" ")
    .filter(word => word.length > 2);
}

function similarity(a, b) {
  const aWords = wordsOf(a);
  const bWords = wordsOf(b);

  if (!aWords.length || !bWords.length) {
    return 0;
  }

  const aSet = new Set(aWords);
  const bSet = new Set(bWords);

  let intersection = 0;

  for (const word of aSet) {
    if (bSet.has(word)) {
      intersection++;
    }
  }

  const union = new Set([...aSet, ...bSet]).size;

  return union ? intersection / union : 0;
}

function findCorps(id) {
  return CORPS.find(corps => corps.id === id) || null;
}

function selectCorps(id, options = {}) {
  const corps = findCorps(id);

  if (!corps) {
    return;
  }

  selectedCorps = corps;
  elements.app.dataset.corps = corps.id;

  elements.corpsName.textContent = corps.name;
  elements.corpsEmotion.textContent = corps.emotion;
  elements.corpsDescription.textContent = corps.description;
  elements.corpsSymbol.textContent = corps.symbol;

  elements.overlaySymbol.textContent = corps.symbol;
  elements.overlayCorps.textContent = corps.short;

  saveJSON(STORAGE.selected, corps.id);

  renderCorpsGrid();

  if (!options.keepPower) {
    resetPower();
  }

  if (options.message) {
    setMessage(options.message);
  }
}

function renderCorpsGrid() {
  elements.corpsGrid.replaceChildren();

  for (const corps of CORPS) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "corps-card";
    button.style.setProperty("--card-color", corps.color);

    if (corps.id === selectedCorps.id) {
      button.classList.add("active");
    }

    const symbol = document.createElement("span");
    symbol.className = "corps-card-symbol";
    symbol.textContent = corps.symbol;

    const name = document.createElement("span");
    name.className = "corps-card-name";
    name.textContent = corps.short;

    button.append(symbol, name);

    button.addEventListener("click", () => {
      selectCorps(corps.id, {
        message: `${corps.name.toUpperCase()} SELECIONADA`
      });
    });

    elements.corpsGrid.appendChild(button);
  }
}

function renderOathOptions() {
  elements.oathCorps.replaceChildren();

  for (const corps of CORPS) {
    const option = document.createElement("option");
    option.value = corps.id;
    option.textContent = corps.name;
    elements.oathCorps.appendChild(option);
  }

  elements.oathCorps.value = selectedCorps.id;
}

function renderSavedOaths() {
  elements.savedOaths.replaceChildren();

  if (!savedOaths.length) {
    const empty = document.createElement("p");
    empty.className = "editor-feedback";
    empty.textContent = "Nenhum juramento completo cadastrado.";
    elements.savedOaths.appendChild(empty);
    return;
  }

  for (const oath of savedOaths) {
    const corps = findCorps(oath.corpsId);

    if (!corps) {
      continue;
    }

    const card = document.createElement("article");
    card.className = "saved-oath-card";

    const title = document.createElement("h3");
    title.textContent = `${corps.name} · ${oath.language}`;

    const paragraph = document.createElement("p");
    paragraph.textContent = oath.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "EXCLUIR";

    remove.addEventListener("click", () => {
      savedOaths = savedOaths.filter(item => item.id !== oath.id);
      saveJSON(STORAGE.oaths, savedOaths);
      renderSavedOaths();
      showEditorFeedback("Juramento excluído.");
    });

    card.append(title, paragraph, remove);
    elements.savedOaths.appendChild(card);
  }
}

function showEditorFeedback(message) {
  elements.editorFeedback.textContent = message;
}

function saveOath() {
  const corpsId = elements.oathCorps.value;
  const language = elements.oathLanguage.value;
  const text = elements.oathText.value.trim();

  if (!findCorps(corpsId)) {
    showEditorFeedback("Selecione uma Tropa válida.");
    return;
  }

  if (text.length < 20) {
    showEditorFeedback("Informe um juramento com pelo menos 20 caracteres.");
    return;
  }

  const duplicate = savedOaths.some(oath =>
    oath.corpsId === corpsId &&
    oath.language === language &&
    normalizeText(oath.text) === normalizeText(text)
  );

  if (duplicate) {
    showEditorFeedback("Esse juramento já está cadastrado.");
    return;
  }

  const oath = {
    id: globalThis.crypto?.randomUUID?.() || `oath-${Date.now()}-${Math.random()}`,
    corpsId,
    language,
    text
  };

  savedOaths.push(oath);

  if (!saveJSON(STORAGE.oaths, savedOaths)) {
    savedOaths.pop();
    showEditorFeedback("Não foi possível salvar neste navegador.");
    return;
  }

  elements.oathText.value = "";
  showEditorFeedback("Juramento salvo com sucesso.");
  renderSavedOaths();
}

function detectBySavedOaths(transcript, language) {
  const normalized = normalizeText(transcript);
  const candidates = [];

  for (const oath of savedOaths) {
    if (oath.language !== language) {
      continue;
    }

    const expected = normalizeText(oath.text);
    const expectedWords = wordsOf(expected);
    const spokenWords = wordsOf(normalized);

    if (expectedWords.length < 4 || spokenWords.length < 4) {
      continue;
    }

    const score = similarity(normalized, expected);

    const coverage = expectedWords.filter(word =>
      spokenWords.includes(word)
    ).length / expectedWords.length;

    const combined = score * .45 + coverage * .55;

    if (combined >= .67 && coverage >= .65) {
      candidates.push({
        corpsId: oath.corpsId,
        score: combined,
        method: "juramento cadastrado"
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    return null;
  }

  if (
    candidates.length > 1 &&
    candidates[0].corpsId !== candidates[1].corpsId &&
    candidates[0].score - candidates[1].score < .08
  ) {
    return null;
  }

  return candidates[0];
}

function detectByKeywords(transcript, language) {
  const normalized = normalizeText(transcript);
  const matches = [];

  for (const corps of CORPS) {
    const keywords = corps.keywords[language] || [];
    let score = 0;
    let hits = 0;

    for (const keyword of keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (!normalizedKeyword) {
        continue;
      }

      const phraseMatch =
        ` ${normalized} `.includes(` ${normalizedKeyword} `);

      if (phraseMatch) {
        hits++;
        score += normalizedKeyword.includes(" ") ? 3 : 1;
      }
    }

    if (hits > 0) {
      matches.push({
        corpsId: corps.id,
        score,
        hits,
        method: "palavras características"
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  if (!matches.length) {
    return null;
  }

  const best = matches[0];
  const second = matches[1];

  // A identificação auxiliar exige uma expressão específica
  // ou múltiplas pistas, evitando ativar por uma palavra comum.
  if (best.score < 3 && best.hits < 2) {
    return null;
  }

  if (second && best.score === second.score) {
    return null;
  }

  return best;
}

function detectCorps(transcript, language) {
  return (
    detectBySavedOaths(transcript, language) ||
    detectByKeywords(transcript, language)
  );
}

function setMessage(message) {
  elements.powerMessage.textContent = message;
}

function setPower(value) {
  power = Math.max(0, Math.min(100, Math.round(value)));

  elements.powerPercent.textContent = `${power}%`;
  elements.powerFill.style.width = `${power}%`;
  elements.overlayPercent.textContent = `${power}%`;
}

function resetPower() {
  if (chargeFrame !== null) {
    cancelAnimationFrame(chargeFrame);
    chargeFrame = null;
  }

  charging = false;
  lastChargeTime = 0;

  elements.app.classList.remove("charging", "fully-charged");
  elements.chargeOverlay.classList.remove("active");
  elements.chargeOverlay.setAttribute("aria-hidden", "true");

  setPower(0);
  setMessage("AGUARDANDO JURAMENTO...");
}

function vibrate(pattern) {
  if (!settings.vibration) {
    return;
  }

  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function getAudioContext() {
  if (!settings.sound) {
    return null;
  }

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  } catch {
    return null;
  }
}

function playTone(frequency, duration, type = "sine", volume = .08) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(.001, volume),
      context.currentTime + .015
    );

    gain.gain.exponentialRampToValueAtTime(
      .0001,
      context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration + .02);
  } catch (error) {
    console.warn("Áudio indisponível:", error);
  }
}

function playChargeComplete() {
  if (!settings.sound) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  const notes = [392, 523.25, 659.25, 783.99];

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * .13;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(.13, start + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, start + .35);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(start + .38);
  });
}

function openChargeOverlay() {
  elements.overlaySymbol.textContent = selectedCorps.symbol;
  elements.overlayCorps.textContent = selectedCorps.short;
  elements.overlayStatus.textContent = "CARREGANDO ANEL";

  elements.chargeOverlay.classList.add("active");
  elements.chargeOverlay.setAttribute("aria-hidden", "false");

  if (settings.brightness) {
    // Uma página web não pode alterar diretamente o brilho físico
    // do aparelho. O efeito utiliza a área inteira da tela.
    elements.chargeOverlay.style.filter = "brightness(1.15)";
  } else {
    elements.chargeOverlay.style.filter = "none";
  }
}

function closeChargeOverlay() {
  elements.chargeOverlay.classList.remove("active");
  elements.chargeOverlay.setAttribute("aria-hidden", "true");
}

function finishCharge() {
  charging = false;
  chargeFrame = null;

  setPower(100);

  elements.app.classList.remove("charging");
  elements.app.classList.add("fully-charged");

  elements.overlayStatus.textContent = "ANEL TOTALMENTE CARREGADO";

  setMessage("ENERGIA COMPLETA · ANEL CARREGADO");

  vibrate([100, 70, 150, 70, 300]);
  playChargeComplete();
}

function startCharge() {
  if (charging) {
    return;
  }

  if (listening) {
    stopListening();
  }

  resetPower();

  charging = true;
  elements.app.classList.add("charging");

  openChargeOverlay();

  setMessage("TRANSFERÊNCIA DE ENERGIA INICIADA");

  vibrate(60);
  playTone(240, .18, "sawtooth", .04);

  const duration = 3800;
  const start = performance.now();

  function frame(now) {
    if (!charging) {
      return;
    }

    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 2.3);

    setPower(eased * 100);

    if (progress < 1) {
      chargeFrame = requestAnimationFrame(frame);
    } else {
      finishCharge();
    }
  }

  chargeFrame = requestAnimationFrame(frame);
}

function createRecognition() {
  const RecognitionClass =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!RecognitionClass) {
    return null;
  }

  const instance = new RecognitionClass();

  instance.lang = elements.languageSelect.value;
  instance.continuous = false;
  instance.interimResults = true;
  instance.maxAlternatives = 3;

  instance.onstart = () => {
    listening = true;

    elements.listenButtonText.textContent = "PARAR RECONHECIMENTO";
    elements.microphoneState.textContent = "OUVINDO...";
    elements.voiceVisualizer.classList.add("listening");
    elements.systemStatus.lastChild.textContent = " MICROFONE ATIVO";

    elements.transcript.textContent = "Estou ouvindo seu juramento...";
  };

  instance.onresult = event => {
    let interim = "";
    let finalText = "";
    const alternatives = [];

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];

      if (result.isFinal) {
        finalText += result[0].transcript + " ";

        for (let j = 0; j < result.length; j++) {
          alternatives.push(result[j].transcript);
        }
      } else {
        interim += result[0].transcript + " ";
      }
    }

    const display = (finalText + interim).trim();

    if (display) {
      elements.transcript.textContent = display;
    }

    if (!finalText.trim()) {
      return;
    }

    const language = elements.languageSelect.value;
    let detected = null;

    for (const candidate of [finalText, ...alternatives]) {
      detected = detectCorps(candidate, language);

      if (detected) {
        break;
      }
    }

    if (detected) {
      const corps = findCorps(detected.corpsId);

      selectCorps(corps.id, {
        message: `JURAMENTO RECONHECIDO: ${corps.short}`
      });

      setTimeout(() => startCharge(), 350);
    } else {
      setMessage("JURAMENTO NÃO IDENTIFICADO");
      elements.transcript.textContent =
        `${display}\n\nNão foi possível identificar a Tropa. Cadastre o juramento completo ou tente novamente.`;
    }
  };

  instance.onerror = event => {
    const errors = {
      "not-allowed": "Permissão do microfone negada.",
      "audio-capture": "Microfone indisponível.",
      "network": "Erro de rede no reconhecimento de voz.",
      "no-speech": "Nenhuma fala detectada.",
      "language-not-supported": "Idioma não suportado.",
      "service-not-allowed": "Serviço de voz não autorizado."
    };

    const message = errors[event.error] ||
      `Erro no reconhecimento: ${event.error}`;

    elements.transcript.textContent = message;
    setMessage("RECONHECIMENTO INTERROMPIDO");
  };

  instance.onend = () => {
    listening = false;

    elements.listenButtonText.textContent = "INICIAR RECONHECIMENTO";
    elements.microphoneState.textContent = "MICROFONE INATIVO";
    elements.voiceVisualizer.classList.remove("listening");
    elements.systemStatus.lastChild.textContent = " SISTEMA PRONTO";
  };

  return instance;
}

function startListening() {
  if (charging) {
    return;
  }

  if (!recognition) {
    recognition = createRecognition();
  }

  if (!recognition) {
    elements.transcript.textContent =
      "Seu navegador não oferece suporte ao reconhecimento de voz. Tente usar o Google Chrome no Android.";
    return;
  }

  recognition.lang = elements.languageSelect.value;

  try {
    getAudioContext();
    recognition.start();
  } catch (error) {
    console.warn("Falha ao iniciar reconhecimento:", error);
  }
}

function stopListening() {
  if (recognition && listening) {
    recognition.stop();
  }
}

function toggleListening() {
  if (listening) {
    stopListening();
  } else {
    startListening();
  }
}

function openSettings() {
  elements.settingsModal.hidden = false;
}

function closeSettings() {
  elements.settingsModal.hidden = true;
}

function updateSettings() {
  settings.vibration = elements.vibrationToggle.checked;
  settings.sound = elements.soundToggle.checked;
  settings.animation = elements.animationToggle.checked;
  settings.brightness = elements.brightnessToggle.checked;

  saveJSON(STORAGE.settings, settings);

  elements.app.classList.toggle(
    "no-animation",
    !settings.animation
  );
}

function renderSettings() {
  elements.vibrationToggle.checked = settings.vibration;
  elements.soundToggle.checked = settings.sound;
  elements.animationToggle.checked = settings.animation;
  elements.brightnessToggle.checked = settings.brightness;

  updateSettings();
}

function resetSettings() {
  settings = { ...DEFAULT_SETTINGS };
  renderSettings();
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else {
      setMessage("TELA CHEIA NÃO SUPORTADA");
    }
  } catch (error) {
    console.warn("Tela cheia indisponível:", error);
    setMessage("NÃO FOI POSSÍVEL ATIVAR TELA CHEIA");
  }
}

function createStars() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 70; i++) {
    const star = document.createElement("span");
    star.className = "star";

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${2 + Math.random() * 5}s`;

    fragment.appendChild(star);
  }

  elements.stars.appendChild(fragment);
}

function registerEvents() {
  elements.listenButton.addEventListener("click", toggleListening);
  elements.chargeButton.addEventListener("click", startCharge);
  elements.resetButton.addEventListener("click", resetPower);
  elements.fullscreenButton.addEventListener("click", toggleFullscreen);

  elements.saveOathButton.addEventListener("click", saveOath);

  elements.clearOathButton.addEventListener("click", () => {
    elements.oathText.value = "";
    showEditorFeedback("");
  });

  elements.settingsButton.addEventListener("click", openSettings);
  elements.closeSettingsButton.addEventListener("click", closeSettings);

  elements.settingsModal
    .querySelector("[data-close-modal]")
    .addEventListener("click", closeSettings);

  elements.resetSettingsButton.addEventListener("click", resetSettings);

  [
    elements.vibrationToggle,
    elements.soundToggle,
    elements.animationToggle,
    elements.brightnessToggle
  ].forEach(input => {
    input.addEventListener("change", updateSettings);
  });

  elements.closeChargeButton.addEventListener("click", closeChargeOverlay);

  elements.languageSelect.addEventListener("change", () => {
    if (listening) {
      stopListening();
    }

    setMessage("IDIOMA DE RECONHECIMENTO ALTERADO");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSettings();
      closeChargeOverlay();
    }
  });
}

function initialize() {
  createStars();
  renderOathOptions();
  renderSavedOaths();
  renderSettings();
  registerEvents();

  selectCorps(selectedCorps.id);

  elements.transcript.textContent =
    "Pressione o botão e recite o juramento.";

  const RecognitionClass =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!RecognitionClass) {
    elements.microphoneState.textContent = "VOZ NÃO SUPORTADA";
  }

  if (!window.isSecureContext) {
    elements.microphoneState.textContent = "HTTPS NECESSÁRIO";
    elements.transcript.textContent =
      "Abra o aplicativo por HTTPS para utilizar o reconhecimento de voz.";
  }

  console.info("Lanterna de Poder iniciado.");
  console.info("Tropas disponíveis:", CORPS.length);
}

document.addEventListener("DOMContentLoaded", initialize);
