import { invoke } from '@tauri-apps/api/core'

export interface TypingMetrics {
  raw_wpm: number,
  adjusted_wpm: number,
  accuracy: number,
  consistency: number,
  is_bot: boolean,
  cheat_flags: string
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
