import { invoke as tauriInvoke } from '@tauri-apps/api/core'

export interface TypingMetrics {
  raw_wpm: number,
  adjusted_wpm: number,
  accuracy: number,
  consistency: number,
  is_bot: boolean,
  cheat_flags: string
}

const isTauri = !!(window as any).__TAURI_INTERNALS__;

const invoke = async (cmd: string, args?: any): Promise<any> => {
  if (isTauri) {
    return await tauriInvoke(cmd, args);
  }
  console.warn(`[Browser Mock] invoke('${cmd}') called with:`, args);

  // Return dummy data for common commands
  if (cmd === 'handle_keystroke') {
    return {
      raw_wpm: 60,
      adjusted_wpm: 58,
      accuracy: 98,
      consistency: 90,
      is_bot: false,
      cheat_flags: ''
    };
  }
  return null;
}

export const startSession = async (text: string): Promise<void> => {
  await invoke('start_session', { text })
}

export const handleKeystroke = async (
  char: string,
  timestampMs: number,
): Promise<TypingMetrics> => {
  return await invoke('handle_keystroke', { charStr: char, timestampMs })
}

export const completeSession = async (): Promise<TypingMetrics> => {
  return await invoke('complete_session')
}
