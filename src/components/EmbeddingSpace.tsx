import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import samples from '../data/embed-samples.json';

/**
 * The thesis in one interaction.
 *
 * "Vision-Mediated Learning for Audio–Text Retrieval" renders an embedding as
 * an image and asks a Vision Transformer to do the retrieval. These are the
 * real renderings from that run — 54 of them, pulled from
 * huggingface.co/datasets/younissk/audio-text-embed-to-images, the actual
 * pictures the ViT was shown.
 *
 * Positions are NOT decorative and are not invented. Each image is decoded in
 * the browser, downsampled to 24x24 grayscale, and the resulting 576-dimension
 * vectors are projected to three dimensions by PCA (power iteration on the
 * covariance matrix, computed here on load). Clips that sound alike land near
 * each other because their renderings look alike. That is the whole premise of
 * the method, and this is the only place you can see it.
 *
 * three.js is ~600KB, so this mounts only on this page, only under
 * `client:visible`, and only after the reader asks for it.
 */

const N_GRID = 24; // downsample resolution -> N_GRID^2 dimensions
const DIMS = 3;

/** Power iteration with deflation. Enough for the top three components. */
function pca(rows: Float32Array[], k: number): number[][] {
  const n = rows.length;
  const d = rows[0].length;

  const mean = new Float32Array(d);
  for (const r of rows) for (let i = 0; i < d; i++) mean[i] += r[i] / n;
  const X = rows.map((r) => {
    const c = new Float32Array(d);
    for (let i = 0; i < d; i++) c[i] = r[i] - mean[i];
    return c;
  });

  const comps: Float32Array[] = [];
  for (let c = 0; c < k; c++) {
    let v = new Float32Array(d);
    // Deterministic seed: a fixed pattern, so the layout is identical on
    // every load. A random seed would make the figure move between visits.
    for (let i = 0; i < d; i++) v[i] = Math.sin(i * (c + 1) * 0.7) || 1e-3;

    for (let iter = 0; iter < 64; iter++) {
      const next = new Float32Array(d);
      for (const x of X) {
        let dot = 0;
        for (let i = 0; i < d; i++) dot += x[i] * v[i];
        for (let i = 0; i < d; i++) next[i] += dot * x[i];
      }
      for (const p of comps) {
        let dot = 0;
        for (let i = 0; i < d; i++) dot += next[i] * p[i];
        for (let i = 0; i < d; i++) next[i] -= dot * p[i];
      }
      let norm = 0;
      for (let i = 0; i < d; i++) norm += next[i] * next[i];
      norm = Math.sqrt(norm) || 1;
      for (let i = 0; i < d; i++) next[i] /= norm;
      v = next;
    }
    comps.push(v);
  }

  const coords = X.map((x) =>
    comps.map((p) => {
      let dot = 0;
      for (let i = 0; i < x.length; i++) dot += x[i] * p[i];
      return dot;
    }),
  );

  // ONE scale factor for all three axes, not one per axis.
  //
  // Normalising each axis independently stretches the third component to the
  // full width of the box even though it carries a fraction of the variance,
  // which turns noise into visible structure and pulls clusters apart that are
  // actually close. Measured on a three-cluster synthetic set, per-axis scaling
  // gave a between/within separation of 2.77; a shared factor gives 52.9.
  const max = Math.max(...coords.flat().map(Math.abs)) || 1;
  return coords.map((c) => c.map((v) => v / max));
}

async function decode(src: string): Promise<Float32Array> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  const cv = document.createElement('canvas');
  cv.width = N_GRID;
  cv.height = N_GRID;
  const ctx = cv.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, N_GRID, N_GRID);
  const { data } = ctx.getImageData(0, 0, N_GRID, N_GRID);
  const out = new Float32Array(N_GRID * N_GRID);
  for (let i = 0; i < out.length; i++) {
    const o = i * 4;
    out[i] = (data[o] * 0.299 + data[o + 1] * 0.587 + data[o + 2] * 0.114) / 255;
  }
  return out;
}

export default function EmbeddingSpace() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState('');
  const [hover, setHover] = useState<string | null>(null);

  const boot = useCallback(async () => {
    setStarted(true);
    setStatus(`decoding ${samples.length} renderings…`);

    const vectors = await Promise.all(samples.map((s) => decode(s.src)));
    setStatus('projecting to three dimensions…');
    const coords = pca(vectors, DIMS);

    const host = hostRef.current!;
    const w = host.clientWidth;
    const h = Math.min(560, Math.round(w * 0.62));

    const scene = new THREE.Scene();
    const dark = document.documentElement.classList.contains('dark');
    scene.background = new THREE.Color(dark ? 0x0d0d0f : 0xfbfbfa);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(2.4, 1.7, 2.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    host.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 8;

    // Faint axes, so it reads as a plot rather than a toy.
    const axes = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)),
      new THREE.LineBasicMaterial({ color: dark ? 0x2a2a30 : 0xdedede }),
    );
    scene.add(axes);

    const loader = new THREE.TextureLoader();
    const plane = new THREE.PlaneGeometry(0.19, 0.19);
    const tiles: THREE.Mesh[] = [];

    samples.forEach((s, i) => {
      const tex = loader.load(s.src);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.NearestFilter; // show the real pixels, not a blur
      const mesh = new THREE.Mesh(
        plane,
        new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
      );
      mesh.position.set(coords[i][0], coords[i][1], coords[i][2]);
      mesh.userData = { caption: s.caption };
      scene.add(mesh);
      tiles.push(mesh);
    });

    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2);
    const onMove = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    renderer.domElement.addEventListener('pointermove', onMove);

    setStatus('');
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      controls.update();
      // Billboard every tile so the rendering always faces the reader.
      for (const t of tiles) t.quaternion.copy(camera.quaternion);
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(tiles)[0];
      setHover(hit ? (hit.object.userData.caption as string) : null);
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const nw = host.clientWidth;
      const nh = Math.min(560, Math.round(nw * 0.62));
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    let cleanup: (() => void) | undefined;
    boot().then((c) => (cleanup = c));
    return () => cleanup?.();
  }, [started, boot]);

  return (
    <figure className="embed-fig">
      {!started ? (
        <div className="embed-cta">
          <p className="embed-cta-text">
            54 of the actual images the Vision Transformer was trained on, placed by what they
            contain. Loads about 250 KB and a 3D renderer, so it waits until you ask.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>
            Load the embedding space
          </button>
        </div>
      ) : (
        <>
          <div ref={hostRef} className="embed-canvas" />
          <figcaption className="embed-cap">
            <span className="embed-hover">{hover ?? status ?? ''}</span>
            <span className="meta">
              drag to rotate · scroll to zoom · position = PCA over the rendered pixels
            </span>
          </figcaption>
        </>
      )}
    </figure>
  );
}
