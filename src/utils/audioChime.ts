/**
 * Generates an accessible, soothing clinic chime using Web Audio API
 */
export function playReceptionChime(type: 'call' | 'success' | 'cancel' = 'call') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'call') {
      // Pleasant double-tone medical desk chime (E5 -> G#5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.setValueAtTime(830.61, now + 0.18); // G#5

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.18);
      gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.22);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.8);
    } else if (type === 'success') {
      // Quick positive confirmation blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Muted cancel tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    // Ignore audio errors silently if user hasn't interacted with page yet
    console.debug('Audio chime silent fallback', err);
  }
}
