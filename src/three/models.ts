import * as THREE from 'three';
import { HeroType, ZombieType } from '../types/game';

// Shared materials for reuse and performance
const materials = {
  skin: new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.6 }),
  zombieSkin: new THREE.MeshStandardMaterial({ color: 0x7da87b, roughness: 0.7 }),
  zombieBossSkin: new THREE.MeshStandardMaterial({ color: 0x5b7f58, roughness: 0.8 }),
  hairDark: new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 }),
  hairBrown: new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 }),
  whiteFabric: new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.7 }),
  blackFabric: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }),
  schoolBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 }),
  schoolOlive: new THREE.MeshStandardMaterial({ color: 0x4d5d36, roughness: 0.7 }),
  schoolGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }),
  redFabric: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 }),
  yellowGold: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.6 }),
  metalSilver: new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.8 }),
  woodBrown: new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 }),
  glassCyan: new THREE.MeshStandardMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.7, roughness: 0.1 }),
  orangeGlow: new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6, roughness: 0.3 }),
  acidGreen: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.8, roughness: 0.2 }),
  chalkboard: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 }),
};

// Helper: enable shadows on all meshes in a group
export function enableShadows(group: THREE.Object3D) {
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

// -------------------------------------------------------------
// 1. HERO 3D CHARACTERS (WARGA SEKOLAH)
// -------------------------------------------------------------

export function createHeroModel(type: HeroType): THREE.Group {
  const root = new THREE.Group();
  root.name = `hero_${type}`;

  switch (type) {
    case 'cikgu_math': {
      // Cikgu Math: Head with spectacles, smart batik shirt, tie, math book with symbols
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.65, 8), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }));
      body.position.y = 0.55;
      root.add(body);

      // Neck & Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), materials.skin);
      head.position.y = 1.05;
      root.add(head);

      // Hair
      const hair = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.22, 0.1, 10), materials.hairDark);
      hair.position.y = 1.18;
      root.add(hair);

      // Spectacles
      const glasses = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), materials.metalSilver);
      glasses.position.set(0.12, 1.06, 0.16);
      glasses.rotation.y = 0.2;
      root.add(glasses);
      const glasses2 = glasses.clone();
      glasses2.position.set(-0.12, 1.06, 0.16);
      glasses2.rotation.y = -0.2;
      root.add(glasses2);

      // Math Book held in left arm
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.26), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }));
      book.position.set(-0.32, 0.65, 0.15);
      book.rotation.set(0.2, 0.3, -0.4);
      root.add(book);

      // Wooden ruler in right hand
      const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.08), materials.woodBrown);
      ruler.position.set(0.3, 0.6, 0.1);
      ruler.rotation.z = -0.3;
      root.add(ruler);

      // Legs & Shoes
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), materials.blackFabric);
      legL.position.set(-0.12, 0.18, 0);
      const legR = legL.clone();
      legR.position.set(0.12, 0.18, 0);
      root.add(legL, legR);
      break;
    }

    case 'jaguh_lembing': {
      // Sports athlete with headband and athletic javelin
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.65, 8), materials.redFabric);
      body.position.y = 0.55;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), materials.skin);
      head.position.y = 1.05;
      root.add(head);

      // Red headband
      const headband = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 6, 12), materials.yellowGold);
      headband.position.y = 1.08;
      headband.rotation.x = Math.PI / 2;
      root.add(headband);

      // Long 3D Javelin spear held in hand
      const javelin = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), materials.woodBrown);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 8), materials.metalSilver);
      tip.position.y = 0.8;
      javelin.add(shaft, tip);
      javelin.position.set(0.35, 0.7, 0.1);
      javelin.rotation.x = Math.PI / 2 - 0.2;
      javelin.rotation.z = -0.2;
      root.add(javelin);

      // Running shorts and legs
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), materials.whiteFabric);
      legL.position.set(-0.13, 0.18, 0);
      const legR = legL.clone();
      legR.position.set(0.13, 0.18, 0);
      root.add(legL, legR);
      break;
    }

    case 'cikgu_pj': {
      // PE Teacher: Green track polo, whistle, track pants, holding basketball
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.65, 8), materials.schoolGreen);
      body.position.y = 0.55;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 12), materials.skin);
      head.position.y = 1.05;
      root.add(head);

      // Cap
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), materials.whiteFabric);
      cap.position.y = 1.12;
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.15), materials.whiteFabric);
      visor.position.set(0, 1.12, 0.2);
      root.add(cap, visor);

      // Whistle on chest
      const whistle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 6), materials.metalSilver);
      whistle.position.set(0, 0.75, 0.24);
      whistle.rotation.x = 0.5;
      root.add(whistle);

      // Basketball
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), materials.orangeGlow);
      ball.position.set(0.35, 0.65, 0.2);
      root.add(ball);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.35, 6), materials.schoolGreen);
      legL.position.set(-0.13, 0.18, 0);
      const legR = legL.clone();
      legR.position.set(0.13, 0.18, 0);
      root.add(legL, legR);
      break;
    }

    case 'budak_taekwondo': {
      // Taekwondo student in white dobok with black belt
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.6, 8), materials.whiteFabric);
      body.position.y = 0.55;
      root.add(body);

      // Black belt around waist
      const belt = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.05, 6, 12), materials.blackFabric);
      belt.position.y = 0.45;
      belt.rotation.x = Math.PI / 2;
      root.add(belt);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), materials.skin);
      head.position.y = 1.0;
      root.add(head);

      // Punching gloves/fists in ready stance
      const fistL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), materials.redFabric);
      fistL.position.set(-0.25, 0.65, 0.28);
      const fistR = fistL.clone();
      fistR.position.set(0.25, 0.7, 0.32);
      root.add(fistL, fistR);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), materials.whiteFabric);
      legL.position.set(-0.12, 0.18, 0);
      const legR = legL.clone();
      legR.position.set(0.12, 0.18, 0);
      root.add(legL, legR);
      break;
    }

    case 'pengawas_pss': {
      // Wall barrier hero: Thick stack of school encyclopedias / textbooks
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.55, 8), materials.schoolBlue);
      body.position.set(0, 0.5, -0.15);
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), materials.skin);
      head.position.set(0, 0.95, -0.15);
      root.add(head);

      // Giant Fortress of Textbooks in front
      const bookColors = [0x1d4ed8, 0xb91c1c, 0x047857, 0x7c2d12, 0x4338ca];
      for (let i = 0; i < 4; i++) {
        const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length], roughness: 0.5 });
        const stackBook = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.18, 0.45), bookMat);
        stackBook.position.set(0, 0.12 + i * 0.19, 0.15);
        stackBook.rotation.y = (i % 2 === 0 ? 0.05 : -0.05);
        root.add(stackBook);

        // Gold lettering spine detail
        const spine = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.4), materials.yellowGold);
        spine.position.set(0.38, 0.12 + i * 0.19, 0.15);
        root.add(spine);
      }
      break;
    }

    case 'budak_sains': {
      // Lab coat, protective goggles, green acid flask
      const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.65, 8), materials.whiteFabric);
      coat.position.y = 0.55;
      root.add(coat);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), materials.skin);
      head.position.y = 1.0;
      root.add(head);

      // Goggles
      const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.12), materials.glassCyan);
      goggles.position.set(0, 1.02, 0.15);
      root.add(goggles);

      // Erlenmeyer Flask with Acid
      const flaskBase = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 8), materials.glassCyan);
      flaskBase.position.set(0.28, 0.5, 0.2);
      const flaskNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8), materials.glassCyan);
      flaskNeck.position.set(0.28, 0.65, 0.2);
      const acidLiquid = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), materials.acidGreen);
      acidLiquid.position.set(0.28, 0.46, 0.2);
      root.add(flaskBase, flaskNeck, acidLiquid);
      break;
    }

    case 'abang_kantin': {
      // Canteen cook: Apron, chef toque, big cooking wok
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.65, 8), materials.whiteFabric);
      body.position.y = 0.55;
      root.add(body);

      // Red apron
      const apron = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.05), materials.redFabric);
      apron.position.set(0, 0.55, 0.25);
      root.add(apron);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), materials.skin);
      head.position.y = 1.02;
      root.add(head);

      // Chef hat
      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.25, 10), materials.whiteFabric);
      hat.position.y = 1.25;
      root.add(hat);

      // Big metal wok (Kuali)
      const wok = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), materials.metalSilver);
      wok.position.set(0.3, 0.6, 0.25);
      wok.rotation.x = -Math.PI / 3;
      const soupGlow = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), materials.orangeGlow);
      soupGlow.position.set(0.3, 0.6, 0.25);
      soupGlow.rotation.x = -Math.PI / 3;
      root.add(wok, soupGlow);
      break;
    }

    case 'pengawal_keselamatan': {
      // Security Guard: Dark blue uniform, peaked cap, flashlight with light cone
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.26, 0.65, 8), materials.schoolBlue);
      body.position.y = 0.55;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), materials.skin);
      head.position.y = 1.02;
      root.add(head);

      // Peaked Cap with gold badge
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.2, 0.12, 10), materials.schoolBlue);
      cap.position.y = 1.18;
      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), materials.yellowGold);
      badge.position.set(0, 1.18, 0.2);
      root.add(cap, badge);

      // Flashlight body
      const flashlight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.25, 8), materials.metalSilver);
      flashlight.position.set(0.3, 0.55, 0.25);
      flashlight.rotation.x = Math.PI / 2;
      // Glowing light cone
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.35 });
      const lightCone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 8), coneMat);
      lightCone.position.set(0.3, 0.55, 0.9);
      lightCone.rotation.x = -Math.PI / 2;
      root.add(flashlight, lightCone);
      break;
    }

    case 'cikgu_seni': {
      // Art teacher: Beret hat, colorful palette, paintbrush
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.65, 8), materials.schoolOlive);
      body.position.y = 0.55;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), materials.skin);
      head.position.y = 1.0;
      root.add(head);

      // French Beret hat
      const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.15, 0.1, 10), materials.redFabric);
      beret.position.set(0.04, 1.16, 0);
      beret.rotation.z = -0.2;
      root.add(beret);

      // Palette
      const palette = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 8), materials.woodBrown);
      palette.position.set(-0.28, 0.55, 0.2);
      palette.rotation.x = 0.5;
      root.add(palette);

      // Paintbrush
      const brush = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), materials.yellowGold);
      brush.position.set(0.28, 0.6, 0.2);
      brush.rotation.x = 0.8;
      root.add(brush);
      break;
    }

    case 'budak_silat': {
      // Silat martial artist: Traditional Black Silat suit, tanjak, keris
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.65, 8), materials.blackFabric);
      body.position.y = 0.55;
      root.add(body);

      // Gold Samping Songket around waist
      const songket = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.28, 0.25, 8), materials.yellowGold);
      songket.position.y = 0.45;
      root.add(songket);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), materials.skin);
      head.position.y = 1.02;
      root.add(head);

      // Tanjak headgear (folded ceremonial cloth)
      const tanjak = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.22, 5), materials.blackFabric);
      tanjak.position.set(0, 1.2, -0.02);
      tanjak.rotation.y = 0.4;
      root.add(tanjak);

      // Keris (undulating blade)
      const keris = new THREE.Group();
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.08), materials.metalSilver);
      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6), materials.woodBrown);
      hilt.position.y = -0.22;
      keris.add(blade, hilt);
      keris.position.set(0.32, 0.6, 0.2);
      keris.rotation.set(0.2, 0, -0.3);
      root.add(keris);
      break;
    }

    case 'pelampung_sekolah': {
      // Water float ring with vibrant red and white segments
      const floatGroup = new THREE.Group();
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.15, 12, 24), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }));
      torus.rotation.x = Math.PI / 2;
      torus.position.y = 0.15;
      floatGroup.add(torus);

      // White safety rope / stripe loops
      for (let i = 0; i < 4; i++) {
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 12), materials.whiteFabric);
        stripe.rotation.x = Math.PI / 2;
        stripe.position.set(
          Math.cos((i * Math.PI) / 2) * 0.42,
          0.15,
          Math.sin((i * Math.PI) / 2) * 0.42
        );
        floatGroup.add(stripe);
      }
      root.add(floatGroup);
      break;
    }
  }

  enableShadows(root);
  return root;
}

// -------------------------------------------------------------
// 2. ZOMBIE 3D CHARACTERS & BOSSES
// -------------------------------------------------------------

export function createZombieModel(type: ZombieType): THREE.Group {
  const root = new THREE.Group();
  root.name = `zombie_${type}`;

  const isBoss = type.startsWith('boss_');
  const skinMat = isBoss ? materials.zombieBossSkin : materials.zombieSkin;

  switch (type) {
    case 'zombi_ponteng': {
      // Disheveled school uniform, tattered shirt
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.65, 8), materials.whiteFabric);
      body.position.y = 0.55;
      body.rotation.z = 0.08;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), skinMat);
      head.position.set(0.04, 1.02, 0.08);
      head.rotation.y = -0.2;
      root.add(head);

      // Messy hair
      const hair = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.15, 6), materials.hairDark);
      hair.position.set(0.04, 1.18, 0.08);
      root.add(hair);

      // Tattered school pants
      const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.24, 0.2, 8), materials.schoolOlive);
      pants.position.y = 0.35;
      root.add(pants);

      // Limbs for walking animation
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6), skinMat);
      armL.position.set(-0.28, 0.6, 0.18);
      armL.rotation.x = -Math.PI / 3;
      armL.name = 'armL';

      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6), skinMat);
      armR.position.set(0.28, 0.6, 0.18);
      armR.rotation.x = -Math.PI / 3;
      armR.name = 'armR';

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 6), materials.schoolOlive);
      legL.position.set(-0.12, 0.18, 0);
      legL.name = 'legL';

      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 6), materials.schoolOlive);
      legR.position.set(0.12, 0.18, 0);
      legR.name = 'legR';

      root.add(armL, armR, legL, legR);
      break;
    }

    case 'zombi_meja_kerusi': {
      // Zombie with wooden classroom desk shield
      const baseZombie = createZombieModel('zombi_ponteng');
      root.add(baseZombie);

      // Wooden Desk Shield
      const deskGroup = new THREE.Group();
      deskGroup.name = 'shieldMesh';
      const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.5), materials.woodBrown);
      deskTop.rotation.x = Math.PI / 2;
      deskTop.position.set(0, 0.65, -0.35);

      // 4 metal legs of the desk facing outward
      for (let dx of [-0.35, 0.35]) {
        for (let dy of [0.4, 0.85]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), materials.metalSilver);
          leg.rotation.x = Math.PI / 2;
          leg.position.set(dx, dy, -0.55);
          deskGroup.add(leg);
        }
      }
      deskGroup.add(deskTop);
      root.add(deskGroup);
      break;
    }

    case 'zombi_merentas_desa': {
      // Marathon runner zombie: Bib number, running headband, fast athletic build
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.6, 8), materials.yellowGold);
      body.position.y = 0.52;
      body.rotation.x = 0.25; // leaning forward
      root.add(body);

      // Bib number on chest
      const bib = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.02), materials.whiteFabric);
      bib.position.set(0, 0.55, -0.22);
      root.add(bib);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), skinMat);
      head.position.set(0, 0.95, -0.15);
      root.add(head);

      // Blue sweatband
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 6, 12), materials.schoolBlue);
      band.position.set(0, 0.98, -0.15);
      band.rotation.x = Math.PI / 2;
      root.add(band);

      // Fast legs
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6), materials.blackFabric);
      legL.position.set(-0.1, 0.2, 0);
      legL.name = 'legL';
      const legR = legL.clone();
      legR.position.set(0.1, 0.2, 0);
      legR.name = 'legR';
      root.add(legL, legR);
      break;
    }

    case 'zombi_pembuli': {
      // Giant bully zombie holding a huge chalkboard
      root.scale.set(1.35, 1.35, 1.35);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.75, 8), materials.blackFabric);
      body.position.y = 0.65;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), skinMat);
      head.position.y = 1.25;
      root.add(head);

      // Massive Chalkboard Shield
      const boardGroup = new THREE.Group();
      boardGroup.name = 'shieldMesh';
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 0.08), materials.chalkboard);
      board.position.set(0, 0.8, -0.4);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.86, 0.04), materials.woodBrown);
      frame.position.set(0, 0.8, -0.38);
      boardGroup.add(board, frame);
      root.add(boardGroup);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.45, 6), materials.blackFabric);
      legL.position.set(-0.16, 0.22, 0);
      legL.name = 'legL';
      const legR = legL.clone();
      legR.position.set(0.16, 0.22, 0);
      legR.name = 'legR';
      root.add(legL, legR);
      break;
    }

    case 'zombi_skateboard': {
      // Skater zombie with backward cap on 3D skateboard
      const baseZombie = createZombieModel('zombi_ponteng');
      baseZombie.position.y = 0.18;
      root.add(baseZombie);

      // 3D Skateboard
      const skateboard = new THREE.Group();
      skateboard.name = 'skateboard';
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.9), materials.redFabric);
      deck.position.y = 0.1;
      skateboard.add(deck);

      for (let dz of [-0.3, 0.3]) {
        for (let dx of [-0.15, 0.15]) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8), materials.yellowGold);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(dx, 0.06, dz);
          skateboard.add(wheel);
        }
      }
      root.add(skateboard);
      break;
    }

    // --- BOSSES ---
    case 'boss_olahragawan': {
      // Stage 1 Boss: Giant athlete throwing heavy iron shotputs
      root.scale.set(1.4, 1.4, 1.4);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.8, 8), materials.redFabric);
      body.position.y = 0.7;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
      head.position.y = 1.35;
      root.add(head);

      // Gold Medal around neck
      const medal = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 12), materials.yellowGold);
      medal.position.set(0, 0.9, -0.38);
      medal.rotation.x = Math.PI / 2;
      root.add(medal);

      // Iron Shotput ball in hand
      const shotput = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), materials.metalSilver);
      shotput.position.set(0.45, 1.1, -0.2);
      shotput.name = 'bossWeapon';
      root.add(shotput);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 6), materials.whiteFabric);
      legL.position.set(-0.18, 0.25, 0);
      legL.name = 'legL';
      const legR = legL.clone();
      legR.position.set(0.18, 0.25, 0);
      legR.name = 'legR';
      root.add(legL, legR);
      break;
    }

    case 'boss_kapten_korporal': {
      // Stage 2 Boss: Military cadet with red beret, medals, megaphone
      root.scale.set(1.4, 1.4, 1.4);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.8, 8), materials.schoolOlive);
      body.position.y = 0.7;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 12), skinMat);
      head.position.y = 1.35;
      root.add(head);

      // Red Beret
      const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.2, 0.12, 10), materials.redFabric);
      beret.position.set(0.04, 1.55, 0);
      beret.rotation.z = -0.15;
      root.add(beret);

      // Megaphone
      const megaphone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 10), materials.whiteFabric);
      megaphone.position.set(0.4, 0.95, -0.3);
      megaphone.rotation.x = -Math.PI / 2;
      root.add(megaphone);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.45, 6), materials.schoolOlive);
      legL.position.set(-0.16, 0.25, 0);
      legL.name = 'legL';
      const legR = legL.clone();
      legR.position.set(0.16, 0.25, 0);
      legR.name = 'legR';
      root.add(legL, legR);
      break;
    }

    case 'boss_sotong_gergasi': {
      // Stage 3 Boss: Giant aquatic kraken zombie with tentacles
      root.scale.set(1.5, 1.5, 1.5);
      const mantle = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 10), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 }));
      mantle.position.y = 1.0;
      mantle.rotation.x = Math.PI;
      root.add(mantle);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), skinMat);
      head.position.y = 0.8;
      root.add(head);

      // Glowing yellow mutant eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), materials.yellowGold);
      eyeL.position.set(-0.2, 0.85, -0.35);
      const eyeR = eyeL.clone();
      eyeR.position.set(0.2, 0.85, -0.35);
      root.add(eyeL, eyeR);

      // 6 writhing tentacles
      for (let i = 0; i < 6; i++) {
        const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.03, 0.8, 6), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
        const angle = (i * Math.PI) / 3;
        tentacle.position.set(Math.cos(angle) * 0.35, 0.3, Math.sin(angle) * 0.35);
        tentacle.rotation.set(0.3 * Math.cos(angle), 0, 0.3 * Math.sin(angle));
        tentacle.name = `tentacle_${i}`;
        root.add(tentacle);
      }
      break;
    }

    case 'boss_guru_disiplin': {
      // Stage 4 Boss: Stern retired discipline teacher with long wooden cane (Rotan Gergasi)
      root.scale.set(1.4, 1.4, 1.4);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.8, 8), materials.schoolBlue);
      body.position.y = 0.7;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), skinMat);
      head.position.y = 1.35;
      root.add(head);

      // Glasses & Stern frown
      const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.08), materials.metalSilver);
      glasses.position.set(0, 1.38, -0.25);
      root.add(glasses);

      // Giant Cane (Rotan 3D)
      const cane = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8), materials.woodBrown);
      cane.position.set(0.45, 0.7, -0.2);
      cane.rotation.z = -0.2;
      cane.name = 'bossWeapon';
      root.add(cane);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.45, 6), materials.blackFabric);
      legL.position.set(-0.16, 0.25, 0);
      legL.name = 'legL';
      const legR = legL.clone();
      legR.position.set(0.16, 0.25, 0);
      legR.name = 'legR';
      root.add(legL, legR);
      break;
    }

    case 'boss_prof_zero': {
      // Final Stage 5 Boss: Mad professor with trench coat, glowing glasses, floating fail exams, rotating Trapezium energy shield
      root.scale.set(1.5, 1.5, 1.5);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.85, 8), materials.blackFabric);
      body.position.y = 0.75;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
      head.position.y = 1.45;
      root.add(head);

      // Crazy white hair
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), materials.whiteFabric);
      hair.position.set(0, 1.6, 0.05);
      root.add(hair);

      // Glowing red goggles
      const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), materials.redFabric);
      goggles.position.set(0, 1.48, -0.26);
      root.add(goggles);

      // Trapezium Geometric Shield (Phase 2)
      const shieldGroup = new THREE.Group();
      shieldGroup.name = 'trapeziumShield';
      // Create Trapezium Shape
      const trapShape = new THREE.Shape();
      trapShape.moveTo(-0.6, -0.5);
      trapShape.lineTo(0.6, -0.5);
      trapShape.lineTo(0.35, 0.6);
      trapShape.lineTo(-0.35, 0.6);
      trapShape.closePath();

      const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
      const trapGeo = new THREE.ExtrudeGeometry(trapShape, extrudeSettings);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
      });
      const trapMesh = new THREE.Mesh(trapGeo, shieldMat);
      trapMesh.position.set(0, 0.85, -0.6);
      shieldGroup.add(trapMesh);
      root.add(shieldGroup);
      shieldGroup.visible = false; // toggled in Phase 2

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 6), materials.blackFabric);
      legL.position.set(-0.18, 0.25, 0);
      legL.name = 'legL';
      const legR = legL.clone();
      legR.position.set(0.18, 0.25, 0);
      legR.name = 'legR';
      root.add(legL, legR);
      break;
    }
  }

  enableShadows(root);
  return root;
}

// -------------------------------------------------------------
// 3. 3D STAGE LAWN MOWERS (PENOLAK 3D)
// -------------------------------------------------------------

export function createLawnMowerModel(stage: number): THREE.Group {
  const root = new THREE.Group();
  root.name = `lawn_cleaner_s${stage}`;

  if (stage === 1) {
    // Stage 1: Pembaris Besi 1 Meter (Heavy industrial metallic ruler mower)
    const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.9), materials.metalSilver);
    ruler.position.y = 0.2;
    // Spring wheel cart
    const cart = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.5), materials.schoolBlue);
    cart.position.y = 0.2;
    const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), materials.blackFabric);
    wheelL.rotation.z = Math.PI / 2;
    wheelL.position.set(-0.22, 0.12, 0);
    const wheelR = wheelL.clone();
    wheelR.position.set(0.22, 0.12, 0);
    root.add(ruler, cart, wheelL, wheelR);
  } else if (stage === 2) {
    // Stage 2: Troli Bola Sukan (Sports ball cart on wheels)
    const cartCage = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.6), new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true }));
    cartCage.position.y = 0.35;
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.62), materials.metalSilver);
    base.position.y = 0.12;
    // Balls inside
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), materials.orangeGlow);
    b1.position.set(-0.1, 0.3, 0);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), materials.whiteFabric);
    b2.position.set(0.1, 0.32, 0.1);
    root.add(cartCage, base, b1, b2);
  } else if (stage === 3) {
    // Stage 3: Pembersih Kolam Otomatik (Aquatic pool cleaner vacuum)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }));
    body.position.y = 0.2;
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), materials.yellowGold);
    light.position.set(0.25, 0.22, 0);
    const propeller = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.3), materials.whiteFabric);
    propeller.position.set(-0.32, 0.2, 0);
    propeller.name = 'propeller';
    root.add(body, light, propeller);
  } else if (stage === 4) {
    // Stage 4: Troli PA System 3D (Subwoofer audio speaker cart)
    const speakerBox = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.6), materials.blackFabric);
    speakerBox.position.y = 0.35;
    const woofer1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 12), materials.yellowGold);
    woofer1.rotation.z = Math.PI / 2;
    woofer1.position.set(0.24, 0.45, 0);
    const woofer2 = woofer1.clone();
    woofer2.position.set(0.24, 0.22, 0);
    root.add(speakerBox, woofer1, woofer2);
  } else {
    // Stage 5: Troli Buku PSS Gergasi (Giant library trolley)
    const trolley = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.7), materials.woodBrown);
    trolley.position.y = 0.4;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 6, 12), materials.metalSilver);
    handle.position.set(-0.25, 0.65, 0);
    root.add(trolley, handle);
  }

  enableShadows(root);
  return root;
}

// -------------------------------------------------------------
// 4. 3D PROJECTILES, IQ BULBS & EFFECTS
// -------------------------------------------------------------

export function createIqBulbModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'iq_bulb';

  // Glass bulb envelope
  const bulbGeo = new THREE.SphereGeometry(0.25, 12, 12);
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xeab308,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.y = 0.25;

  // Screw base
  const baseGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.14, 8);
  const base = new THREE.Mesh(baseGeo, materials.metalSilver);
  base.position.y = 0.05;

  // Filament glow
  const filament = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 8), materials.orangeGlow);
  filament.position.y = 0.25;

  // Generous invisible hit volume for effortless mouse & touch clicking
  const hitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  root.add(bulb, base, filament, hitSphere);
  return root;
}

export function createProjectileModel(type: string): THREE.Group {
  const root = new THREE.Group();

  if (type === 'spear') {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), materials.woodBrown);
    shaft.rotation.z = Math.PI / 2;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), materials.metalSilver);
    tip.position.x = 0.45;
    tip.rotation.z = -Math.PI / 2;
    root.add(shaft, tip);
  } else if (type === 'ball') {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), materials.orangeGlow);
    root.add(ball);
  } else if (type === 'acid') {
    const flask = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 8), materials.acidGreen);
    root.add(flask);
  } else if (type === 'soup') {
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), materials.metalSilver);
    bowl.rotation.x = Math.PI;
    const hotSoup = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), materials.orangeGlow);
    root.add(bowl, hotSoup);
  } else if (type === 'shotput') {
    const ironBall = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), materials.metalSilver);
    root.add(ironBall);
  } else if (type === 'fail_paper') {
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.45), materials.whiteFabric);
    const redF = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.15), materials.redFabric);
    root.add(paper, redF);
  }

  return root;
}

export function createAcidPuddleModel(): THREE.Group {
  const root = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 12),
    new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
    })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.02;
  root.add(disc);
  return root;
}
