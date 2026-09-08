'use client';
import { useEffect } from 'react';

// Original composition: a slow 16-bar cycle, with a new melodic phrase every four bars.
// All tones have an attack and a release; there is no sustained drone.
const chords = [
  [53, 60, 64, 69],
  [57, 60, 64, 67],
  [48, 55, 62, 64],
  [55, 60, 62, 69],
];
const melody = [
  [76, 74, 69, 72],
  [72, 76, 79, 74],
  [74, 72, 67, 69],
  [69, 74, 72, 67],
];
export function scoreBar(bar: number) {
  const chord = chords[bar % 4],
    phrase = Math.floor(bar / 4) % 4;
  const notes = Array.from({ length: 8 }, (_, i) => ({
    beat: i * 0.75,
    midi: chord[[0, 2, 1, 3, 2, 1, 3, 2][i]],
    velocity: 0.045,
    duration: 3.2,
  }));
  notes.push({
    beat: 1.5,
    midi: melody[phrase][bar % 4],
    velocity: 0.048,
    duration: 4.2,
  });
  notes.push({
    beat: 4.5,
    midi: melody[phrase][(bar + 1) % 4],
    velocity: 0.035,
    duration: 3.5,
  });
  return notes;
}
export default function useAmbientScore(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const ac = new AudioContext();
    const master = ac.createGain();
    master.gain.value = 0.24;
    master.connect(ac.destination);
    const reverb = ac.createConvolver();
    const length = Math.floor(ac.sampleRate * 3.5);
    const impulse = ac.createBuffer(2, length, ac.sampleRate);
    let seed = 123;
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) {
        seed = (seed * 16807) % 2147483647;
        d[i] =
          ((seed / 2147483647) * 2 - 1) * Math.pow(1 - i / length, 3) * 0.35;
      }
    }
    reverb.buffer = impulse;
    const wet = ac.createGain();
    wet.gain.value = 0.35;
    reverb.connect(wet);
    wet.connect(master);
    const lowpass = ac.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2200;
    lowpass.connect(master);
    lowpass.connect(reverb);
    let next = ac.currentTime + 0.15,
      bar = 0;
    const beat = 60 / 64;
    function play(
      midi: number,
      time: number,
      duration: number,
      velocity: number,
    ) {
      const note = ac.createGain();
      note.gain.setValueAtTime(0, time);
      note.gain.linearRampToValueAtTime(velocity, time + 0.055);
      note.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      note.connect(lowpass);
      let active = 3;
      [1, 2, 3].forEach((harmonic, i) => {
        const osc = ac.createOscillator(),
          gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12) * harmonic;
        gain.gain.value = [1, 0.16, 0.025][i];
        osc.connect(gain);
        gain.connect(note);
        osc.start(time);
        osc.stop(time + duration + 0.05);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
          if (--active === 0) note.disconnect();
        };
      });
    }
    const schedule = () => {
      if (ac.state !== 'running') return;
      while (next < ac.currentTime + 1) {
        for (const n of scoreBar(bar))
          play(n.midi, next + n.beat * beat, n.duration, n.velocity);
        next += 6 * beat;
        bar = (bar + 1) % 16;
      }
    };
    // The preference is on by default. Browsers can still require a trusted tap
    // or key press before allowing audible playback, so resume again on the
    // first interaction rather than treating the initial policy block as mute.
    const activate = () => {
      void ac
        .resume()
        .then(() => {
          schedule();
          document.removeEventListener('pointerdown', activate);
          document.removeEventListener('keydown', activate);
        })
        .catch(() => {});
    };
    activate();
    document.addEventListener('pointerdown', activate);
    document.addEventListener('keydown', activate);
    const timer = setInterval(schedule, 350);
    const visibility = () => {
      if (document.hidden) void ac.suspend().catch(() => {});
      else void ac.resume().catch(() => {});
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('pointerdown', activate);
      document.removeEventListener('keydown', activate);
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(0, ac.currentTime, 0.08);
      setTimeout(() => {
        void ac.close();
      }, 350);
    };
  }, [enabled]);
}
