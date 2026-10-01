// Concept-check questions for CS1806 Exploring Science, Module 1 (sessions 1-6).
// Sourced from each hour deck in session_presentation/module-1/hour-N.tex:
// its hook, ConcepTest, Think-Pair-Share, assessment and misconception check.
// Correct-answer positions are deliberately spread across options, so
// students can't learn to always pick the same letter.
//
// Three question types:
//   multiple choice: { text, options: [...], correctIndex, explanation }
//   number answer:   { text, type: 'numeric', answer, unit?, tolerance?, explanation }
//     tolerance is relative: 0.05 accepts anything within ±5% of `answer`; omit for exact.
//   text (unscored): { text, type: 'text', display: 'cloud' | 'list', maxLength?, explanation? }
//     'cloud' groups identical short answers by size; 'list' shows each response as a card.
//     explanation, if given, is shown as a model answer after the responses.
// Add `confidence: true` to a scored question to ask "How sure are you? 1-5" after
// answering — used sparingly, on each session's ConcepTest.
// Any scored question can be run as vote → discuss → revote from the host panel.

module.exports = [
  {
    id: 1,
    title: 'Classification of Solids from Band Theory',
    questions: [
      {
        text: 'Warm-up: name ONE semiconductor device that is within two metres of you right now.',
        type: 'text',
        display: 'cloud',
        maxLength: 30,
        explanation: 'Phones, chargers, laptops, LED lights, the projector… Count the transistors in a phone alone and the answer is in the billions — that is why this module exists.',
      },
      {
        text: 'Copper carries current easily; glass does not carry it at all. Roughly how far apart are their resistivities?',
        options: ['About 10 times', 'About 1,000 times', 'About a million times', 'At least 10¹⁷ times'],
        correctIndex: 3,
        explanation: 'The resistivity chart runs from about 10⁻⁸ (metals) to 10⁹ and beyond (insulators) — at least seventeen orders of magnitude. No other everyday property of matter varies over such a range.',
      },
      {
        text: 'Why do discrete atomic energy levels become energy bands in a solid?',
        options: [
          'Neighbouring atoms force each level to split (Pauli exclusion); with ~10²³ atoms the split levels merge into near-continuous bands',
          'Electrons leave their atoms and fill the empty space between them',
          'Heating the solid melts the levels together',
          'The solid creates brand-new levels unrelated to the atomic ones',
        ],
        correctIndex: 0,
        explanation: 'A band is not a new kind of object — it is the original atomic level, smeared out by the neighbours. The levels must split because no two electrons may share a quantum state.',
      },
      {
        text: 'Rank these by conductivity at room temperature: Cu (Eg ≈ 0), Ge (0.67 eV), Si (1.1 eV), diamond (5.5 eV).',
        options: ['Cu > Si > Ge > diamond', 'Diamond > Si > Ge > Cu', 'Cu > Ge > Si > diamond', 'Ge > Cu > Si > diamond'],
        correctIndex: 2,
        explanation: 'Copper has no gap (conductor). Ge and Si are semiconductors, with Ge the better conductor because its gap is smaller. Diamond, far above 3 eV, is an insulator. Conductivity falls as the gap grows.',
      },
      {
        text: 'Solid A has a band gap of 0.9 eV. In solid B the valence and conduction bands overlap. At room temperature:',
        options: [
          'A conducts better than B',
          'B conducts better than A',
          'they conduct equally, since both have carriers available',
          'neither conducts, because neither band is partly filled',
        ],
        correctIndex: 1,
        confidence: true,
        explanation: 'Overlapping bands mean there is no gap to cross, so carriers are always present — B is a conductor. A is a semiconductor: it conducts, but far less well, because carriers must first be lifted across the gap.',
      },
      {
        text: 'Conduction needs empty states for electrons to move into. So a completely FULL band carries...',
        options: ['the largest current', 'current only at 0 K', 'current only if it is the conduction band', 'no current, however many electrons it holds'],
        correctIndex: 3,
        explanation: 'In a full band there is nowhere for an electron to move to, so it carries no net current. That is why diamond — packed with electrons — is an insulator.',
      },
      {
        text: 'True or False: "Insulators don\'t conduct because they have no electrons."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The valence band is full of electrons. It is the large band gap that blocks conduction, not a shortage of electrons.',
      },
      {
        text: 'True or False: "At 0 K, a pure semiconductor behaves as an insulator."',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. With no thermal energy, no electrons are lifted across the gap: the valence band is full and the conduction band empty. A semiconductor needs thermal energy or doping to conduct.',
      },
      {
        text: 'True or False: "The band gap is a region of empty space inside the crystal."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The band gap is a range of ENERGY with no allowed electron states — not a place in the crystal. The vertical axis of a band diagram is energy, not position.',
      },
    ],
  },
  {
    id: 2,
    title: 'Intrinsic and Extrinsic Semiconductors',
    questions: [
      {
        text: 'In pure (intrinsic) silicon, breaking one covalent bond creates...',
        options: ['one free electron only', 'one hole only', 'one free electron AND one hole', 'one positive ion'],
        correctIndex: 2,
        explanation: 'Carriers in an intrinsic semiconductor are created in pairs: the freed electron and the vacancy it leaves behind. That is the whole content of n = p.',
      },
      {
        text: 'A hole is only a missing electron. Why do we treat it as a carrier of POSITIVE charge?',
        options: [
          'Because the nucleus left behind is positive',
          'Because a positron is created when the bond breaks',
          'Because holes are real positive particles',
          'Because under a field neighbouring electrons shuffle one way, so the vacancy moves along the field — exactly as a positive charge would',
        ],
        correctIndex: 3,
        explanation: 'Nothing is ionised and no nucleus changes. The vacancy moves along the field like a positive charge, and treating it as one carrier is far easier than tracking every electron that shuffled.',
      },
      {
        text: 'Which dopant turns silicon into p-type?',
        options: ['Phosphorus (group V)', 'Arsenic (group V)', 'Boron (group III)', 'Antimony (group V)'],
        correctIndex: 2,
        explanation: 'Group III atoms (B, Al, Ga) have one electron too few for silicon\'s four bonds — the unfilled bond becomes a hole. Group V atoms (P, As, Sb) donate an electron and give n-type.',
      },
      {
        text: 'Silicon is doped with phosphorus. The majority carriers are...',
        options: ['electrons', 'holes', 'equal numbers of both', 'there are no carriers'],
        correctIndex: 0,
        explanation: 'Phosphorus is group V — a donor. It has one electron more than the bonds need, easily freed, so the material is n-type with electrons as majority carriers.',
      },
      {
        text: 'You start with intrinsic silicon and keep adding donors. The Fermi level Ef will...',
        options: ['move up, towards the conduction band', 'move down, towards the valence band', 'stay at mid-gap', 'disappear'],
        correctIndex: 0,
        confidence: true,
        explanation: 'More electrons push Ef up towards the conduction band; more holes push it down. Ef sits near mid-gap only in intrinsic material, because there n = p.',
      },
      {
        text: 'n-type silicon has n = 10¹⁶ cm⁻³, and nᵢ = 1.5 × 10¹⁰ cm⁻³. Using np = nᵢ², roughly how many holes are there?',
        options: ['Zero', '2.25 × 10⁴ cm⁻³', '1.5 × 10¹⁰ cm⁻³', '10¹⁶ cm⁻³'],
        correctIndex: 1,
        explanation: 'p = nᵢ²/n = (2.25 × 10²⁰)/(10¹⁶) = 2.25 × 10⁴ cm⁻³. Raising the majority carriers pushes the minority carriers down by the same factor — but never to zero.',
      },
      {
        text: 'In silicon, μₙ ≈ 1400 and μₚ ≈ 470 cm²/V·s. What does this mean?',
        options: [
          'Holes drift faster, so p-type devices are faster',
          'Mobility has no effect on conductivity',
          'Electrons have a higher thermal speed',
          'Electrons drift faster in a given field, so electron-based devices are faster',
        ],
        correctIndex: 3,
        explanation: 'Drift velocity is v = μE, so the higher electron mobility means faster electron devices. Mobility is about the drift added by the field, not the thermal speed.',
      },
      {
        text: 'True or False: "Doping makes the semiconductor electrically charged."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The crystal stays neutral: each donor gives a mobile electron and is left behind as a fixed positive ion. We separated charges; we added no net charge.',
      },
    ],
  },
  {
    id: 3,
    title: 'The Diode and its Characteristics',
    questions: [
      {
        text: 'A battery, a lamp and a diode in series: the lamp lights. Reverse ONLY the diode and it goes dark. Why?',
        options: [
          'Forward bias lowers the junction barrier so carriers cross; reverse bias raises it so almost none do',
          'The diode breaks when reversed',
          'Reversing the diode changes the lamp\'s resistance',
          'The diode stores charge in one direction only',
        ],
        correctIndex: 0,
        explanation: 'Same component, same circuit, one orientation reversed. Forward bias opposes the built-in field and lowers the barrier; reverse bias adds to it and shuts the main flow off.',
      },
      {
        text: 'One silicon crystal: left half p-type, right half n-type. What happens at the boundary?',
        options: [
          'Carriers keep flowing until one side runs out',
          'Nothing happens until a voltage is applied',
          'Electrons and holes diffuse across and recombine, uncovering fixed ions whose field stops further diffusion',
          'The boundary becomes a good conductor',
        ],
        correctIndex: 2,
        explanation: 'Diffusion uncovers fixed dopant ions. Their field opposes the diffusion that created it, so it stops. Carriers never "run out" — the field stops them.',
      },
      {
        text: 'The region at the junction left with only fixed ions is called the depletion region because...',
        options: ['it is depleted of atoms', 'it is depleted of dopants', 'current depletes it over time', 'it is depleted of mobile carriers'],
        correctIndex: 3,
        explanation: 'It has almost no free electrons or holes — only fixed ions. That is exactly what makes it a barrier, not a conductor.',
      },
      {
        text: 'When a diode is forward biased, its depletion region...',
        options: ['narrows', 'widens', 'stays the same width', 'moves to the n side'],
        correctIndex: 0,
        explanation: 'Forward bias opposes the built-in field, lowering the barrier and narrowing the depletion layer. Reverse bias does the opposite — it widens.',
      },
      {
        text: 'A silicon diode\'s forward current starts rising very steeply at about...',
        options: ['0.1 V', '0.3 V', '0.7 V', '5 V'],
        correctIndex: 2,
        explanation: 'Silicon\'s knee is around 0.7 V (germanium about 0.3 V). Below the knee the current is tiny; above it the current rises approximately exponentially.',
      },
      {
        text: 'A silicon diode is reverse biased at −5 V. The current through it is:',
        options: ['exactly zero', 'a small current, almost independent of the voltage', 'a small current, proportional to the voltage', 'large, in the reverse direction'],
        correctIndex: 1,
        confidence: true,
        explanation: 'A small leakage current Iₛ always flows and barely changes with reverse voltage — what you measured at −1 V and −5 V. "Proportional" is still thinking of the diode as a resistor.',
      },
      {
        text: 'A mains adapter uses diodes to...',
        options: ['amplify the signal', 'raise the voltage', 'convert AC to DC (rectification)', 'store energy'],
        correctIndex: 2,
        explanation: 'Because a diode conducts in one direction only, it passes one half of each AC cycle and blocks the other — rectification.',
      },
      {
        text: 'True or False: "A diode behaves like a resistor."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Its I–V curve is non-linear with a turn-on knee — there is no single resistance to quote. A straight line from the origin would be a resistor.',
      },
      {
        text: 'Minute paper: in two sentences, WHY does a diode conduct in only one direction?',
        type: 'text',
        display: 'list',
        maxLength: 200,
        explanation: 'Diffusion at the junction uncovers fixed ions whose field forms a barrier. Forward bias lowers that barrier so carriers cross easily; reverse bias raises it, so almost none do.',
      },
    ],
  },
  {
    id: 4,
    title: 'The Zener Diode and its Characteristics',
    questions: [
      {
        text: 'Warm-up: name ONE device or circuit that needs a steady, regulated supply voltage.',
        type: 'text',
        display: 'cloud',
        maxLength: 30,
        explanation: 'Phone chargers, laptops, microcontrollers, sensors, LED drivers… anything with a chip needs a steady voltage whatever the input or the load does. Holding a voltage steady is today\'s device\'s job.',
      },
      {
        text: 'A Zener diode is designed to operate in...',
        options: ['forward bias', 'reverse breakdown', 'reverse bias, just below V_Z', 'zero bias'],
        correctIndex: 1,
        explanation: 'A Zener is a heavily doped p–n junction deliberately operated in reverse breakdown. Its breakdown voltage V_Z is the part\'s main parameter — it is not faulty.',
      },
      {
        text: 'What single property makes a Zener useful as a voltage reference?',
        options: [
          'In breakdown, the voltage across it stays nearly constant over a wide range of current',
          'It blocks all reverse current',
          'It amplifies small currents',
          'Its resistance is very high',
        ],
        correctIndex: 0,
        explanation: 'A near-vertical I–V line means the voltage barely changes however the current varies, so it fixes the voltage at its node whatever the rest of the circuit does.',
      },
      {
        text: 'Why is a Zener diode heavily doped?',
        options: [
          'To make it conduct better in forward bias',
          'To stop it breaking down',
          'To give a thin depletion region, so breakdown happens at a low, usable voltage',
          'To make it emit light',
        ],
        correctIndex: 2,
        explanation: 'Heavy doping gives a thin depletion region and a strong field, so breakdown occurs at a low, well-defined voltage.',
      },
      {
        text: 'Breakdown in a 3.3 V Zener diode is mainly due to...',
        options: ['avalanche (impact ionisation)', 'thermal runaway', 'forward conduction', 'quantum tunnelling through a thin barrier'],
        correctIndex: 3,
        explanation: 'Below about 6 V the depletion region is thin enough for carriers to tunnel straight through — the Zener effect. Above about 6 V, avalanche (a chain reaction of impact ionisation) dominates.',
      },
      {
        text: 'A 5 V Zener must supply a load of up to 20 mA from a 9 V input, with I_Z(min) = 5 mA. What series resistance R does the calculation give?',
        type: 'numeric',
        answer: 160,
        unit: 'Ω',
        tolerance: 0.05,
        explanation: 'R carries I_L + I_Z = 20 + 5 = 25 mA and drops 9 − 5 = 4 V, so R = 4 V / 25 mA = 160 Ω. In practice take the nearest standard value BELOW it (150 Ω) so there is always enough current.',
      },
      {
        text: 'Same regulator with R = 150 Ω. The load is disconnected. What is the Zener current now?',
        type: 'numeric',
        answer: 26.7,
        unit: 'mA',
        tolerance: 0.05,
        explanation: 'The resistor still passes 4 V / 150 Ω ≈ 27 mA, and with no load all of it goes through the Zener. The resistor does not know the load has gone.',
      },
      {
        text: 'A working Zener regulator\'s load is increased until it draws ALL the current the resistor can pass. The output voltage...',
        options: ['stays at V_Z — that is what a regulator does', 'rises towards the input voltage', 'falls below V_Z, because the Zener is no longer in breakdown', 'drops immediately to zero'],
        correctIndex: 2,
        confidence: true,
        explanation: 'Regulation holds only while I_Z ≥ I_Z(min). With no current left for the Zener it leaves breakdown, and the circuit is just a resistor feeding a load — the output sags below V_Z.',
      },
      {
        text: 'True or False: "Reverse breakdown does not damage a diode, provided the current is limited."',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Reverse breakdown is non-destructive as long as the current is limited — that is the series resistor\'s job. "Breakdown destroys the diode" is a common misconception.',
      },
    ],
  },
  {
    id: 5,
    title: 'Transistor: Input and Output Characteristics',
    questions: [
      {
        text: 'True or False: "An npn transistor is just two diodes back to back — you could build one by soldering two diodes together."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The base is very thin and lightly doped, so carriers injected by the emitter pass straight through to the collector. Two soldered diodes have thick, separate middle regions and no transistor action.',
      },
      {
        text: 'Which region of a BJT is very thin and lightly doped?',
        options: ['Emitter', 'Collector', 'Base', 'All three are the same'],
        correctIndex: 2,
        explanation: 'The emitter is heavily doped to inject carriers, the base thin and lightly doped so they cross it without recombining, and the collector largest because it dissipates the heat.',
      },
      {
        text: 'A transistor has I_E = 10 mA and I_C = 9.9 mA. What is the base current I_B?',
        type: 'numeric',
        answer: 0.1,
        unit: 'mA',
        explanation: 'I_E = I_C + I_B (Kirchhoff), so I_B = 10 − 9.9 = 0.1 mA. The base current is the small remainder.',
      },
      {
        text: 'For the ACTIVE (amplifying) region, the two junctions are biased...',
        options: [
          'both forward',
          'both reverse',
          'emitter–base reverse, collector–base forward',
          'emitter–base forward, collector–base reverse',
        ],
        correctIndex: 3,
        explanation: 'Active: EB forward, CB reverse. Both forward is saturation (fully on); both reverse is cut-off (off).',
      },
      {
        text: 'A transistor in SATURATION is...',
        options: ['fully on, with V_CE small', 'switched off', 'amplifying linearly', 'damaged'],
        correctIndex: 0,
        explanation: 'Saturation is fully on: both junctions forward biased and V_CE small — a closed switch. Cut-off is the "off" state.',
      },
      {
        text: 'In the flat part of the output characteristic, V_CE is raised from 4 V to 8 V with I_B held constant. The collector current I_C...',
        options: ['doubles, because the voltage doubled', 'stays almost the same', 'falls to about half', 'drops to zero'],
        correctIndex: 1,
        confidence: true,
        explanation: 'In the active region the curves are nearly flat: I_C barely depends on V_CE. What sets I_C is I_B, and that was held constant. "Doubles" treats the transistor as a resistor.',
      },
      {
        text: 'If α = 0.99, what is β? (β = α / (1 − α))',
        type: 'numeric',
        answer: 99,
        tolerance: 0.005,
        explanation: 'β = 0.99 / 0.01 = 99. And if α improves to 0.995, β becomes 199 — a tiny change in α is a large change in β.',
      },
      {
        text: 'True or False: "β is a fixed constant of the transistor."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. β varies with collector current, with temperature, and between nominally identical devices.',
      },
    ],
  },
  {
    id: 6,
    title: 'LEDs, Photodiodes and Solar Cells',
    questions: [
      {
        text: 'Three LEDs emit red (660 nm), green (525 nm) and blue (470 nm). Which is made from the material with the LARGEST band gap?',
        options: ['Red, because red light is the most intense', 'Green, because it is in the middle of the visible range', 'Blue, because a shorter wavelength means a higher photon energy', 'They are all the same, since they are all LEDs'],
        correctIndex: 2,
        confidence: true,
        explanation: 'λ(nm) = 1240/Eg(eV): blue 470 nm → 2.64 eV, green → 2.36 eV, red → 1.88 eV. Shorter wavelength, higher photon energy, larger gap.',
      },
      {
        text: 'An LED material has Eg = 2.0 eV. What wavelength does it emit? (λ in nm = 1240 / Eg in eV)',
        type: 'numeric',
        answer: 620,
        unit: 'nm',
        tolerance: 0.02,
        explanation: 'λ = 1240 / 2.0 = 620 nm — orange-red light.',
      },
      {
        text: 'Silicon (Eg = 1.1 eV) is cheap and well understood. Why is there no silicon LED?',
        options: [
          'Its band gap is too small',
          'Silicon cannot absorb light',
          'Silicon cannot be doped p-type',
          'Its band gap is indirect — emission needs a lattice vibration as well, so the energy is lost as heat instead',
        ],
        correctIndex: 3,
        explanation: 'The gap SIZE is fine; the gap SHAPE is fatal. In an indirect-gap material photon emission is far too unlikely to compete with losing the energy as heat. (An infrared silicon LED does not exist either.)',
      },
      {
        text: 'An LED, a photodiode and a solar cell are operated, respectively, with...',
        options: ['forward bias, reverse bias, no bias', 'reverse bias, forward bias, forward bias', 'forward bias, forward bias, reverse bias', 'no bias, reverse bias, forward bias'],
        correctIndex: 0,
        explanation: 'One p–n junction, three bias conditions, three devices: forward to emit, reverse to detect, none to generate power.',
      },
      {
        text: 'Why is a photodiode operated in REVERSE bias?',
        options: [
          'To make it emit light',
          'Reverse bias stops all current',
          'It widens the depletion region and strengthens the field, so more photo-generated pairs are separated — and no forward current swamps the signal',
          'So it can store energy',
        ],
        correctIndex: 2,
        explanation: 'A wider depletion region with a stronger field means more light is absorbed where the field can pull the electron–hole pairs apart. That separation is the photocurrent.',
      },
      {
        text: 'A photodiode only responds to photons that satisfy...',
        options: ['hν ≥ Eg', 'hν ≤ Eg', 'λ ≥ 1240 nm', 'any wavelength at all'],
        correctIndex: 0,
        explanation: 'A photon must carry at least the band-gap energy to create an electron–hole pair. It is the LED relation read the other way.',
      },
      {
        text: 'True or False: "Silicon can absorb light well, even though it cannot emit it efficiently."',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. The indirect gap penalises prompt EMISSION, not absorption — which is exactly why silicon solar cells and photodiodes work.',
      },
      {
        text: 'True or False: "Solar cells store energy."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. A solar cell converts light to current. Storage is a separate battery.',
      },
      {
        text: 'Minute paper: in two sentences and no equations — why can silicon DETECT light but not EMIT it?',
        type: 'text',
        display: 'list',
        maxLength: 200,
        explanation: 'Silicon\'s gap is indirect. A photon with enough energy can still create an electron–hole pair (detection works), but an electron dropping back needs a lattice vibration as well to emit a photon, so it loses the energy as heat instead.',
      },
    ],
  },
  {
    // ~40 min review of Hours 1–6. New questions, not repeats of the session quizzes:
    // each tests one idea, often across two hours. Suggested pacing: warm-up 2 min,
    // ~1.5–2 min per scored question, discuss-and-revote on 2–3 of the confidence ones,
    // closing check 3 min.
    id: 'm1-review',
    label: 'Module 1 Review',
    title: 'Semiconductors and Devices — Conceptual Review (40 min)',
    questions: [
      {
        text: 'Warm-up: in one or two words — what single quantity decided almost everything in Module 1?',
        type: 'text',
        display: 'cloud',
        maxLength: 25,
        explanation: 'The band gap. Everything in Module 1 followed from the size — and the shape — of a gap in the allowed energies of a solid.',
      },
      {
        text: 'Diamond is packed with electrons, yet it is an insulator. The best explanation is:',
        options: [
          'Its electrons are bound to their nuclei and can never move',
          'Its valence band is full, and the 5.5 eV gap is far too large for electrons to reach empty states at room temperature',
          'It has no conduction band at all',
          'Its electrons have zero mobility',
        ],
        correctIndex: 1,
        explanation: 'Conduction needs empty states to move into. A full band carries no current however many electrons it holds, and 5.5 eV is far beyond the 0.1–3 eV semiconductor range, so almost no electron reaches the empty conduction band.',
      },
      {
        text: 'Pure silicon is warmed from 20 °C to 80 °C. Its conductivity...',
        options: [
          'falls, the way a metal\'s does',
          'stays the same — pure silicon has no carriers',
          'rises, because more electron–hole pairs are thermally created across the gap',
          'drops to zero',
        ],
        correctIndex: 2,
        explanation: 'In a semiconductor the number of carriers is set by the band gap and the temperature. Heating lifts more electrons across the gap, creating more electron–hole pairs — the opposite of a metal, whose conductivity falls when heated.',
      },
      {
        text: 'True or False: "Higher mobility means a carrier gains more drift velocity for the same electric field."',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. v = μE: mobility is the drift velocity gained per unit field. It says nothing about the carrier\'s thermal speed, which is the same either way.',
      },
      {
        text: 'Donor doping raises the electron concentration to a MILLION times nᵢ. At equilibrium, the hole concentration...',
        options: ['rises a million times too', 'stays at nᵢ', 'falls to zero', 'falls to one-millionth of nᵢ'],
        correctIndex: 3,
        explanation: 'np = nᵢ². If n = 10⁶ nᵢ then p = nᵢ / 10⁶. Raising the majority carriers pushes the minority carriers down by the same factor — but never to zero.',
      },
      {
        text: 'In p-type silicon, the Fermi level lies...',
        options: ['nearer the valence band', 'nearer the conduction band', 'exactly at mid-gap', 'above the conduction band'],
        correctIndex: 0,
        explanation: 'Holes are the majority carriers, which pushes Ef down towards the valence band. Donors push it up; only intrinsic material (n = p) keeps it near mid-gap.',
      },
      {
        text: 'With NO battery connected, what creates the electric field across a p–n junction\'s depletion region?',
        options: [
          'Free electrons piled up at the boundary',
          'The metal contacts on the two ends',
          'Fixed, ionised dopant atoms left uncovered after carriers diffused across and recombined',
          'Nothing — there is no field without a battery',
        ],
        correctIndex: 2,
        confidence: true,
        explanation: 'Diffusion carries electrons and holes across, where they recombine. What is left behind is fixed ions — positive on the n side, negative on the p side — and their field opposes further diffusion. The depletion region has almost no free carriers at all.',
      },
      {
        text: 'True or False: "Reverse bias widens the depletion region."',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Reverse bias adds to the built-in field, raising the barrier and widening the layer — only a small leakage current flows. Forward bias does the opposite: the layer narrows and current rises steeply.',
      },
      {
        text: 'A Zener diode and an ordinary rectifier diode are both p–n junctions. What is the key design difference?',
        options: [
          'A Zener has three doped layers instead of two',
          'A Zener only works in forward bias',
          'A Zener is made from a direct-gap material',
          'A Zener is heavily doped: a thin depletion region gives a low, well-defined breakdown voltage, and it is used in reverse breakdown',
        ],
        correctIndex: 3,
        explanation: 'Heavy doping → thin depletion region → breakdown at a low, usable V_Z. The Zener is designed to sit in reverse breakdown, which is non-destructive as long as a series resistor limits the current.',
      },
      {
        text: 'Zener regulator: 12 V input, 5 V Zener, load up to 20 mA, I_Z(min) = 5 mA. What series resistance R does the calculation give?',
        type: 'numeric',
        answer: 280,
        unit: 'Ω',
        tolerance: 0.05,
        explanation: 'R carries I_L + I_Z = 20 + 5 = 25 mA and drops 12 − 5 = 7 V, so R = 7 V / 25 mA = 280 Ω. In practice take the nearest standard value below it (270 Ω) so there is always enough current for the Zener.',
      },
      {
        text: 'In the flat region of a transistor\'s output characteristic, the I_B = 40 µA curve gives I_C = 4 mA. What is β_dc?',
        type: 'numeric',
        answer: 100,
        tolerance: 0.01,
        explanation: 'β = I_C / I_B = 4 mA / 40 µA = 100. (And α = β / (1 + β) = 100/101 ≈ 0.990.)',
      },
      {
        text: 'A transistor used as a switch in a digital circuit swings between...',
        options: ['cut-off and saturation', 'active and saturation', 'the active region only', 'breakdown and cut-off'],
        correctIndex: 0,
        explanation: 'Cut-off is the switch open (off); saturation is the switch closed (fully on). Analogue amplifiers sit in the active region; digital circuits swing between cut-off and saturation.',
      },
      {
        text: 'A transistor amplifier delivers far more signal power than the base draws. Where does the extra power come from?',
        options: ['The base current', 'The transistor creates it', 'The DC power supply', 'The emitter\'s heavy doping'],
        correctIndex: 2,
        confidence: true,
        explanation: 'From the supply. The small base current only CONTROLS a much larger collector current, which the supply provides — the transistor is a current-controlled valve, not a source of energy.',
      },
      {
        text: 'A blue LED emits at 470 nm. What is the band gap of its material? (Eg in eV = 1240 / λ in nm)',
        type: 'numeric',
        answer: 2.64,
        unit: 'eV',
        tolerance: 0.02,
        explanation: 'Eg = 1240 / 470 ≈ 2.64 eV. Shorter wavelength → higher photon energy → larger gap (a red LED at 660 nm is only about 1.88 eV).',
      },
      {
        text: 'Which is TRUE of silicon as an optoelectronic material?',
        options: [
          'Good LED, poor solar cell',
          'Poor at both — its gap is too small',
          'Good at both',
          'Poor LED, good solar cell — its indirect gap penalises emission, not absorption',
        ],
        correctIndex: 3,
        confidence: true,
        explanation: 'Silicon\'s gap is indirect. Emitting a photon needs a lattice vibration as well, so the energy is lost as heat — no silicon LED. But absorbing a photon to make an electron–hole pair works fine, which is why silicon solar cells and photodiodes are everywhere.',
      },
      {
        text: 'A photodiode and a solar cell create electron–hole pairs from light in exactly the same way. What makes the solar cell DELIVER power instead of consuming it?',
        options: [
          'It is forward biased',
          'There is no external bias: the built-in field separates the pairs and the energy comes from the photons, over a large area',
          'It is made from a direct-gap material',
          'It stores charge like a battery',
        ],
        correctIndex: 1,
        explanation: 'Same generation physics, different purpose. The photodiode is reverse biased by a supply; the solar cell has no bias — its own built-in field separates the pairs, so it acts as the source. LED forward, photodiode reverse, solar cell none.',
      },
      {
        text: 'True or False: "A photodiode is just a light-dependent resistor."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. A photodiode is a light-controlled CURRENT source: absorbed photons create pairs that the junction field sweeps out as a photocurrent.',
      },
      {
        text: 'Before the test: which ONE Module 1 idea are you least confident about? Be specific.',
        type: 'text',
        display: 'list',
        maxLength: 150,
      },
    ],
  },
  // ---- Module 2, sessions 7-12 (crystal structure). Written for the HTML decks in
  // ---- html-slides/public/module-2/: each hour asks them in THIS order, and question 0
  // ---- is the hook it reveals later in the hour. Numbers match content/*/module-2/examples.
  {
    id: 7,
    title: 'Crystals & unit cell',
    questions: [
      {
        text: 'A stainless steel spoon. Is it a crystal?',
        options: [
          'No: metals are amorphous',
          'No: it has no flat faces or facets',
          'Yes: it is polycrystalline, millions of tiny crystal grains',
          'Yes: the whole spoon is one single crystal',
        ],
        correctIndex: 2,
        explanation: 'Crystalline means the arrangement repeats. A spoon is millions of small grains, each a crystal, in random orientations, so it shows no facets and no single-crystal shape. It still counts.',
      },
      {
        text: 'A cubic cell has an atom at every one of its 8 corners. How many atoms do those corners give ONE cell?',
        options: ['8', '4', '1', '1/8'],
        correctIndex: 2,
        confidence: true,
        explanation: 'Eight cells meet at every corner, so each cell may claim only 1/8 of that atom. Eight corners × 1/8 = 1 atom per cell.',
      },
      {
        text: 'A centred square cell: a point at each corner and one at the centre. How many lattice points belong to it?',
        type: 'numeric',
        answer: 2,
        explanation: '4 corners × 1/4 (four cells share each corner in 2-D) + 1 at the centre = 2. A legal unit cell, but not a primitive one.',
      },
      {
        text: 'True or False: "Every unit cell is a primitive cell."',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. A primitive cell holds exactly one lattice point; a unit cell may hold more. Every primitive cell is a unit cell, not the other way round.',
      },
      {
        text: 'In one word: what makes a crystal a crystal?',
        type: 'text',
        display: 'cloud',
        maxLength: 30,
        explanation: 'Periodicity: the same arrangement, the same way up, repeating indefinitely. Glass has the local order but not the repetition.',
      },
    ],
  },
  {
    id: 8,
    title: 'Lattice parameters & crystal systems',
    questions: [
      {
        text: 'Guess: how many genuinely different KINDS of unit-cell box are there?',
        type: 'text',
        display: 'cloud',
        maxLength: 20,
        explanation: 'Seven. Six free numbers, but a box that tiles space with a consistent symmetry can take only seven distinct shapes: the seven crystal systems.',
      },
      {
        text: 'The interaxial angle α lies between which two axes?',
        options: ['a and b', 'b and c', 'c and a', 'a and the plane of b, c'],
        correctIndex: 1,
        explanation: 'Each angle sits between the two axes it is NOT named after: α between b and c, β between c and a, γ between a and b. "Alpha opposes a."',
      },
      {
        text: 'A CUBIC cell and a TRICLINIC cell are both fully specified. Which needs MORE independent numbers?',
        options: [
          'the cubic cell, since all three edges must be stated',
          'the triclinic cell, since none of its six parameters is fixed by symmetry',
          'both need six: there are always six parameters',
          'both need three, since three lengths fix any box',
        ],
        correctIndex: 1,
        confidence: true,
        explanation: 'Triclinic needs all six. Cubic needs one: state a, and b = c = a with all angles 90° follow. Higher symmetry means FEWER independent parameters.',
      },
      {
        text: 'a = b = c, α = β = γ ≠ 90°. Which system?',
        options: ['Cubic', 'Rhombohedral', 'Tetragonal', 'Hexagonal'],
        correctIndex: 1,
        explanation: 'Equal edges like cubic, but the angles are not right angles: rhombohedral. The angles are half the specification.',
      },
      {
        text: 'a ≠ b ≠ c, α = γ = 90°, β ≠ 90°. Which system?',
        options: ['Triclinic', 'Orthorhombic', 'Monoclinic', 'Hexagonal'],
        correctIndex: 2,
        explanation: 'One oblique angle, β, and two right angles: monoclinic (the IUCr standard setting used in this module).',
      },
      {
        text: 'A shoebox: three unequal edges, all angles 90°. Which system?',
        options: ['Cubic', 'Tetragonal', 'Orthorhombic', 'Monoclinic'],
        correctIndex: 2,
        explanation: 'Cubic needs a = b = c as well as right angles. Three unequal edges with three right angles is orthorhombic.',
      },
    ],
  },
  {
    id: 9,
    title: 'Bravais lattices & cubic structures',
    questions: [
      {
        text: '7 crystal systems × 4 centrings (P, I, C, F) = 28. How many distinct lattices do you think survive?',
        type: 'text',
        display: 'cloud',
        maxLength: 20,
        explanation: 'Fourteen. The other centred cells are not new: redraw them with a different cell and they are lattices already on the list.',
      },
      {
        text: 'Base-centred CUBIC, redrawn with a smaller cell, turns out to be...',
        options: ['simple cubic', 'simple tetragonal', 'body-centred cubic', 'face-centred cubic'],
        correctIndex: 1,
        explanation: 'The centred square net in the ab plane is a smaller square net of side a/√2, stacked at c = a. Since a/√2 ≠ a, the new cell is tetragonal, not cubic.',
      },
      {
        text: 'The rhombohedral lattice is labelled R. That means it is...',
        options: [
          'a fifth kind of centring, beyond P, I, C and F',
          'primitive: one lattice point per cell; R is only its symbol',
          'body-centred',
          'face-centred',
        ],
        correctIndex: 1,
        explanation: 'R is the conventional Bravais symbol, not a centring. The rhombohedral lattice is primitive, one point per cell, like any P.',
      },
      {
        text: 'A body-centred cubic structure. Which pair of numbers is correct?',
        options: [
          '9 atoms per cell, coordination number 8',
          '2 atoms per cell, coordination number 8',
          '2 atoms per cell, coordination number 2',
          '8 atoms per cell, coordination number 8',
        ],
        correctIndex: 1,
        confidence: true,
        explanation: '8 corners × 1/8 + 1 centre = 2 atoms per cell; the centre atom touches all 8 corners, so CN = 8. Atoms per cell is about the box; CN is about one atom and its neighbours.',
      },
      {
        text: 'How many atoms belong to one FCC unit cell?',
        type: 'numeric',
        answer: 4,
        explanation: '8 corners × 1/8 + 6 faces × 1/2 = 1 + 3 = 4.',
      },
      {
        text: 'FCC, a = 4.05 Å. What is the nearest-neighbour distance, in Å?',
        type: 'numeric',
        answer: 2.86,
        unit: 'Å',
        tolerance: 0.02,
        explanation: 'Neighbours sit half a face diagonal apart: (√2/2) × 4.05 = 2.86 Å. (The metal is aluminium.)',
      },
    ],
  },
  {
    id: 10,
    title: 'Miller indices & interplanar spacing',
    questions: [
      {
        text: 'Silicon wafers are sold as "(100)" or "(111)". What do the three digits mean? Your best guess.',
        type: 'text',
        display: 'list',
        maxLength: 160,
        explanation: 'They name the crystal plane the wafer is sliced along. Same silicon, sawn at a different angle to the lattice, so a different arrangement of atoms at the surface.',
      },
      {
        text: 'A plane cuts the axes at a, 2b and 3c. Its Miller indices are...',
        options: ['(123)', '(632)', '(321)', '(236)'],
        correctIndex: 1,
        explanation: 'Reciprocals 1, 1/2, 1/3; clear the fractions (×6): 6, 3, 2. So (632).',
      },
      {
        text: 'A plane cuts the axes at −a, b/2 and c. Its Miller indices are...',
        options: ['(121)', '(1̄21)', '(12̄1)', '(1̄ ½ 1)'],
        correctIndex: 1,
        explanation: 'Reciprocals −1, 2, 1: already whole numbers. The negative is kept as a bar: (1̄21).',
      },
      {
        text: 'Round brackets (hkl) and square brackets [hkl] name...',
        options: [
          'the same thing, written two ways',
          '(hkl) a family of planes, [hkl] a direction',
          '(hkl) a direction, [hkl] a family of planes',
          '(hkl) one plane, [hkl] all the planes parallel to it',
        ],
        correctIndex: 1,
        explanation: '(hkl) is a plane (a whole parallel family); [hkl] is a direction. In a cubic crystal [hkl] is normal to (hkl), but not in general.',
      },
      {
        text: 'd = 1/√((h/a)² + (k/b)² + (l/c)²) is valid for...',
        options: [
          'all seven crystal systems',
          'orthogonal axes only: cubic, tetragonal, orthorhombic',
          'cubic crystals only',
          'every system except triclinic',
        ],
        correctIndex: 1,
        explanation: 'The derivation uses cos²α + cos²β + cos²γ = 1, which holds only when a, b, c are mutually perpendicular.',
      },
      {
        text: 'Cubic crystal, a = 3.6 Å. Find d₁₁₁ in Å.',
        type: 'numeric',
        answer: 2.08,
        unit: 'Å',
        tolerance: 0.02,
        explanation: 'd = a/√(h²+k²+l²) = 3.6/√3 = 2.08 Å.',
      },
      {
        // after the problem set on purpose: it is that set's item 4, the
        // trap the teacher wants to see on paper first (hour-10.tex notes)
        text: 'Item 4 again: a plane cuts a at a/2 and is parallel to b and c. Its Miller indices are...',
        options: ['(100)', '(200)', '(½00)', '(2∞∞)'],
        correctIndex: 1,
        confidence: true,
        explanation: 'Reciprocals 2, 0, 0, and there is nothing to clear. It is (200), not (100): a plane at a/2 is a different plane from one at a. Clearing fractions means multiplying UP to whole numbers, never reducing whole numbers.',
      },
    ],
  },
  {
    id: 11,
    title: 'Atomic packing fraction',
    questions: [
      {
        text: 'A bar of copper: what percentage of it is empty space? Write a number.',
        type: 'text',
        display: 'cloud',
        maxLength: 12,
        explanation: 'About 26%. Copper is FCC, APF 0.74, and that is the BEST packing possible for equal spheres. Simple cubic leaves 48% empty.',
      },
      {
        text: 'In BCC, the atoms touch along the...',
        options: ['cube edge', 'face diagonal', 'body diagonal', 'they do not touch'],
        correctIndex: 2,
        explanation: 'The centre atom touches the corners: a√3 = 4r. If corner atoms touched along the edge there would be no room for the centre atom.',
      },
      {
        text: 'In FCC, the atoms touch along the...',
        options: ['cube edge', 'face diagonal', 'body diagonal', 'they do not touch'],
        correctIndex: 1,
        explanation: 'Corner and face-centre atoms touch along the face diagonal: a√2 = 4r.',
      },
      {
        text: 'Copper and gold are both FCC. Gold atoms are larger and gold is twice as dense. Which has the higher APF?',
        options: [
          'gold, since it is much denser',
          'copper, since smaller atoms pack more efficiently',
          'they are equal: both are 0.74',
          'it cannot be decided without both lattice constants',
        ],
        correctIndex: 2,
        confidence: true,
        explanation: 'APF depends only on the geometry: r cancels, and so do the lattice constants. Both FCC, both 0.74. Gold is denser because its atoms are heavier.',
      },
      {
        text: 'A BCC metal has a = 2.87 Å. Find the atomic radius r, in Å.',
        type: 'numeric',
        answer: 1.24,
        unit: 'Å',
        tolerance: 0.02,
        explanation: 'a√3 = 4r, so r = 2.87 × 1.732 / 4 = 1.24 Å.',
      },
      {
        text: 'The same metal: BCC, a = 2.87 Å, M = 55.8 g/mol. Estimate the density in g/cm³.',
        type: 'numeric',
        answer: 7.84,
        unit: 'g/cm³',
        tolerance: 0.02,
        explanation: 'ρ = nM/(a³N_A) = 2 × 55.8 / (2.363×10⁻²³ × 6.022×10²³) = 7.84 g/cm³. It is iron; measured 7.87.',
      },
    ],
  },
  {
    id: 12,
    title: "Bragg's law & X-ray diffraction",
    questions: [
      {
        text: 'Nobody has ever SEEN a crystal lattice. How could you find where the atoms are without seeing them? One idea.',
        type: 'text',
        display: 'list',
        maxLength: 160,
        explanation: 'Use a wave whose wavelength matches the spacing (X-rays, about 1 Å) and read the interference. The structure is inferred from where the beams reinforce.',
      },
      {
        text: 'In nλ = 2d sin θ, the angle θ is measured from...',
        options: [
          'the diffracting planes (the glancing angle)',
          'the normal to the planes',
          'the outer surface of the crystal',
          'the detector arm',
        ],
        correctIndex: 0,
        explanation: 'θ is the glancing angle from the diffracting planes. From the normal is the optics habit, and it would put cos where the law needs sin.',
      },
      {
        text: 'd = 2.0 Å, λ = 1.54 Å. What is the highest order of diffraction observable?',
        type: 'numeric',
        answer: 2,
        explanation: 'sin θ ≤ 1 so n ≤ 2d/λ = 2.60. n must be whole: n_max = 2.',
      },
      {
        text: 'A diffractometer reports a peak at 2θ = 44.0°. Which angle goes into nλ = 2d sin θ?',
        options: [
          '44.0°, because that is what the instrument measured',
          '22.0°, because the instrument reports the angle between incident and diffracted beams',
          '46.0°, because θ is measured from the normal',
          '88.0°, because the beam is deflected at two planes',
        ],
        correctIndex: 1,
        confidence: true,
        explanation: 'The detector arm turns through 2θ while the crystal turns through θ. Halve it: 22.0°. Using 44° gives d = 1.10 Å instead of 2.06 Å.',
      },
      {
        text: 'First order at θ = 15.0°. At what angle θ (in degrees) is the second order?',
        type: 'numeric',
        answer: 31.2,
        unit: '°',
        tolerance: 0.01,
        explanation: 'sin θ₂ = 2 sin 15.0° = 0.5176, θ₂ = 31.2°. Not 30°: it is sin θ that goes as n, not θ.',
      },
      {
        text: 'Cu Kα, λ = 1.54 Å. A first-order peak at 2θ = 38.5°. Find d in Å.',
        type: 'numeric',
        answer: 2.34,
        unit: 'Å',
        tolerance: 0.02,
        explanation: 'θ = 19.25°, d = 1.54 / (2 sin 19.25°) = 2.34 Å.',
      },
    ],
  },
];
