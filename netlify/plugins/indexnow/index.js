// Tras cada publicación en producción, avisa a Bing (Edge) y otros buscadores con IndexNow.
import { submitIndexNow } from '../../../tools/indexnow.mjs';

export const onSuccess = async () => {
  if (process.env.CONTEXT !== 'production') return;
  try { await submitIndexNow(); } catch (e) { console.log('IndexNow no disponible: ' + e.message); }
};
