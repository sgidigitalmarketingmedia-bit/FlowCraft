/**
 * Speech synthesis utility for UK Female Voice narration during KYC journey simulation.
 * Includes garbage-collection retention fix and speech-finish callbacks.
 */

let cachedUKVoice: SpeechSynthesisVoice | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechHeartbeat: ReturnType<typeof setInterval> | null = null;

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    findUKFemaleVoice(voices);
  }
  return voices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

function findUKFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // 1. UK English Female named voices (Hazel, Serena, Fiona, Victoria, Martha, Libby, Sonia, etc.)
  const preferredUkNames = ['hazel', 'serena', 'fiona', 'victoria', 'kate', 'martha', 'susan', 'libby', 'sonia', 'female'];
  const ukFemale = voices.find(v => {
    const isUk = v.lang === 'en-GB' || v.lang.startsWith('en_GB') || v.lang.includes('GB');
    const nameLower = v.name.toLowerCase();
    return isUk && preferredUkNames.some(p => nameLower.includes(p));
  });

  if (ukFemale) {
    cachedUKVoice = ukFemale;
    return ukFemale;
  }

  // 2. Any en-GB voice
  const ukVoice = voices.find(v => v.lang === 'en-GB' || v.lang.startsWith('en_GB') || v.lang.includes('GB'));
  if (ukVoice) {
    cachedUKVoice = ukVoice;
    return ukVoice;
  }

  // 3. Any English female voice
  const enFemale = voices.find(v => {
    const isEn = v.lang.startsWith('en');
    const nameLower = v.name.toLowerCase();
    return isEn && (nameLower.includes('female') || nameLower.includes('samantha') || nameLower.includes('karen') || nameLower.includes('zira'));
  });

  if (enFemale) {
    cachedUKVoice = enFemale;
    return enFemale;
  }

  // 4. Fallback to any English voice
  const fallback = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  cachedUKVoice = fallback;
  return fallback;
}

export function getUKFemaleVoice(): SpeechSynthesisVoice | null {
  if (cachedUKVoice) return cachedUKVoice;
  const voices = loadVoices();
  return findUKFemaleVoice(voices);
}

export function speakUKExplanation(
  text: string, 
  options?: { onStart?: () => void; onEnd?: () => void; onError?: () => void }
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options?.onEnd?.();
    return null;
  }

  try {
    if (speechHeartbeat) {
      clearInterval(speechHeartbeat);
      speechHeartbeat = null;
    }

    // Cancel active speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getUKFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = 'en-GB';
    utterance.rate = 0.94; // Natural, articulate, clear British cadence
    utterance.pitch = 1.05; // Pleasant female pitch

    // Retain global reference so browser garbage collector doesn't cut speech off mid-sentence
    activeUtterance = utterance;
    (window as any).__activeSpeechUtterance = utterance;

    let hasEnded = false;

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (speechHeartbeat) {
        clearInterval(speechHeartbeat);
        speechHeartbeat = null;
      }
      activeUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      if (hasEnded) return;
      hasEnded = true;
      if (speechHeartbeat) {
        clearInterval(speechHeartbeat);
        speechHeartbeat = null;
      }
      activeUtterance = null;
      options?.onError?.();
    };

    // Chrome keep-alive heartbeat for longer speech passages
    speechHeartbeat = setInterval(() => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        if (speechHeartbeat) clearInterval(speechHeartbeat);
        return;
      }
      if (!window.speechSynthesis.speaking) {
        if (speechHeartbeat) clearInterval(speechHeartbeat);
        speechHeartbeat = null;
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 4500);

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.warn('Speech synthesis error or blocked by browser policy:', err);
    options?.onEnd?.();
    return null;
  }
}

export function stopSpeechNarration(): void {
  if (speechHeartbeat) {
    clearInterval(speechHeartbeat);
    speechHeartbeat = null;
  }
  activeUtterance = null;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}
