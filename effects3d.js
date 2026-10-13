// effects3d.js — optional 3D effects made with three.js.
// The game never needs this file. If three.js didn't load (offline) or the
// player prefers reduced motion, celebrate() just does nothing.

function celebrate() {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof THREE === "undefined" || reduceMotion) return;

  // try/catch: if anything goes wrong (e.g. the computer has WebGL turned
  // off), skip the confetti quietly. A bonus effect must never break the game.
  try {
    launchConfetti();
  } catch (error) {
    console.warn("Confetti skipped:", error.message);
  }
}

function launchConfetti() {
  // --- Set up: a see-through canvas on top of the page ---
  // pointer-events: none lets clicks pass through to the buttons underneath.
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const canvas = renderer.domElement;
  canvas.className = "confetti-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const scene = new THREE.Scene();
  // A camera looking at the scene from z = 10
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 10;

  // --- Make the confetti: small paper rectangles in the balloon colors ---
  const colors = ["#c94f5a", "#5f9a5c", "#4f7d8c", "#b3a246", "#d0883b", "#7d5ba6", "#d46a9a", "#4a6fb5"];
  const paper = new THREE.PlaneGeometry(0.22, 0.12); // every piece shares one shape
  const pieces = [];
  for (let i = 0; i < 160; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      side: THREE.DoubleSide, // visible from both sides as it tumbles
      transparent: true,
    });
    const piece = new THREE.Mesh(paper, material);
    // Start near the bottom middle and burst upward and outward
    piece.position.set((Math.random() - 0.5) * 2, -4, (Math.random() - 0.5) * 2);
    piece.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.25,
      0.18 + Math.random() * 0.17,
      (Math.random() - 0.5) * 0.1
    );
    piece.userData.spin = new THREE.Vector3(Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3);
    scene.add(piece);
    pieces.push(piece);
  }

  // --- Animate: gravity pulls the pieces down while they spin ---
  const duration = 3000; // ms
  const start = performance.now();
  function frame(now) {
    const t = (now - start) / duration; // 0 → 1
    for (const piece of pieces) {
      const v = piece.userData.velocity;
      v.y -= 0.006; // gravity
      v.multiplyScalar(0.985); // air resistance
      piece.position.add(v);
      piece.rotation.x += piece.userData.spin.x;
      piece.rotation.y += piece.userData.spin.y;
      piece.rotation.z += piece.userData.spin.z;
      piece.material.opacity = Math.min(1, (1 - t) * 3); // fade out at the end
    }
    renderer.render(scene, camera);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      cleanUp();
    }
  }
  requestAnimationFrame(frame);

  // Free the GPU memory and remove the canvas when we're done,
  // so playing many rounds never slows the page down.
  function cleanUp() {
    for (const piece of pieces) piece.material.dispose();
    paper.dispose();
    renderer.dispose();
    canvas.remove();
  }
}
