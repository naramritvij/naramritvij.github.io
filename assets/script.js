/* ============================================================
   Ritvij Naram — Portfolio
   Hero visual (three.js particle network) + small interactions
   Degrades gracefully: no WebGL / reduced-motion / mobile-low-power
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmall = window.innerWidth < 720;

  /* ---- typing prompt effect ---- */
  var cmdEl = document.querySelector(".prompt-line .cmd");
  if (cmdEl && !reduceMotion) {
    var full = cmdEl.textContent;
    cmdEl.textContent = "";
    var i = 0;
    (function type() {
      if (i <= full.length) {
        cmdEl.textContent = full.slice(0, i);
        i++;
        setTimeout(type, 38);
      }
    })();
  }

  /* ---- three.js particle network hero ---- */
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || reduceMotion) return;

  function boot() {
    if (typeof THREE === "undefined") return;

    var hero = canvas.parentElement;
    var renderer, scene, camera, points, lineMesh, raf;
    var W = hero.clientWidth, H = hero.clientHeight;
    var COUNT = isSmall ? 34 : 60;

    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      return; // no WebGL — canvas just stays empty, hero text still fully works
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, W / H, 1, 2000);
    camera.position.z = 420;

    var nodes = [];
    var positions = new Float32Array(COUNT * 3);
    for (var n = 0; n < COUNT; n++) {
      var x = (Math.random() - 0.5) * 900;
      var y = (Math.random() - 0.5) * 500;
      var z = (Math.random() - 0.5) * 400;
      nodes.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.25,
          (Math.random() - 0.5) * 0.25,
          (Math.random() - 0.5) * 0.15
        )
      });
      positions[n * 3] = x;
      positions[n * 3 + 1] = y;
      positions[n * 3 + 2] = z;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({ color: 0x3fb950, size: 3.2, transparent: true, opacity: 0.85 });
    points = new THREE.Points(geo, mat);
    scene.add(points);

    var lineGeo = new THREE.BufferGeometry();
    var maxLines = COUNT * 6;
    var linePositions = new Float32Array(maxLines * 3 * 2);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    var lineMat = new THREE.LineBasicMaterial({ color: 0x30363d, transparent: true, opacity: 0.5 });
    lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    var LINK_DIST = 170;

    function updateLines() {
      var idx = 0;
      var arr = lineGeo.attributes.position.array;
      for (var a = 0; a < nodes.length && idx < maxLines; a++) {
        for (var b = a + 1; b < nodes.length && idx < maxLines; b++) {
          var d = nodes[a].pos.distanceTo(nodes[b].pos);
          if (d < LINK_DIST) {
            arr[idx * 6] = nodes[a].pos.x;
            arr[idx * 6 + 1] = nodes[a].pos.y;
            arr[idx * 6 + 2] = nodes[a].pos.z;
            arr[idx * 6 + 3] = nodes[b].pos.x;
            arr[idx * 6 + 4] = nodes[b].pos.y;
            arr[idx * 6 + 5] = nodes[b].pos.z;
            idx++;
          }
        }
      }
      lineGeo.setDrawRange(0, idx * 2);
      lineGeo.attributes.position.needsUpdate = true;
    }

    var bounds = { x: 460, y: 260, z: 220 };
    function tick() {
      for (var n2 = 0; n2 < nodes.length; n2++) {
        var node = nodes[n2];
        node.pos.add(node.vel);
        if (Math.abs(node.pos.x) > bounds.x) node.vel.x *= -1;
        if (Math.abs(node.pos.y) > bounds.y) node.vel.y *= -1;
        if (Math.abs(node.pos.z) > bounds.z) node.vel.z *= -1;
        positions[n2 * 3] = node.pos.x;
        positions[n2 * 3 + 1] = node.pos.y;
        positions[n2 * 3 + 2] = node.pos.z;
      }
      geo.attributes.position.needsUpdate = true;
      updateLines();
      scene.rotation.y += 0.0009;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener("resize", function () {
      W = hero.clientWidth; H = hero.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); } else { tick(); }
    });
  }

  var s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  s.onload = boot;
  s.onerror = function () { /* offline / blocked — hero text still renders fine without it */ };
  document.head.appendChild(s);
})();
