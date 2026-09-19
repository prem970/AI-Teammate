/** Capture mic audio as 16-bit mono WAV (Sarvam-friendly). */

export async function recordWavBlob(maxMs = 15000): Promise<{
  start: () => void;
  stop: () => Promise<Blob>;
  cancel: () => void;
}> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  const audioCtx = new AudioContext({ sampleRate: 16000 });
  const source = audioCtx.createMediaStreamSource(stream);
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);
  const mute = audioCtx.createGain();
  mute.gain.value = 0;
  const chunks: Float32Array[] = [];
  let collecting = false;

  processor.onaudioprocess = (e) => {
    if (!collecting) return;
    chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  };

  // Keep processor alive without playing mic through speakers
  source.connect(processor);
  processor.connect(mute);
  mute.connect(audioCtx.destination);

  let stopTimer: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    collecting = false;
    if (stopTimer) clearTimeout(stopTimer);
    try {
      processor.disconnect();
      source.disconnect();
      mute.disconnect();
    } catch {
      /* ignore */
    }
    stream.getTracks().forEach((t) => t.stop());
    void audioCtx.close();
  };

  return {
    start: () => {
      void audioCtx.resume();
      collecting = true;
      stopTimer = setTimeout(() => {
        collecting = false;
      }, maxMs);
    },
    stop: async () => {
      collecting = false;
      const blob = floatChunksToWav(chunks, audioCtx.sampleRate || 16000);
      cleanup();
      return blob;
    },
    cancel: () => {
      cleanup();
    },
  };
}

function floatChunksToWav(chunks: Float32Array[], sampleRate: number): Blob {
  const length = chunks.reduce((n, c) => n + c.length, 0);
  const pcm = new Int16Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) {
      const s = Math.max(-1, Math.min(1, chunk[i]));
      pcm[offset++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }

  const buffer = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(buffer);
  const writeStr = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) {
    view.setInt16(44 + i * 2, pcm[i], true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
