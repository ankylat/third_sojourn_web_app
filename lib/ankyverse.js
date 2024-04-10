function getAnkyverseQuestionForToday(wink) {
  const questions = {
    resonanceWave1: {
      1: {
        en: "Describe the big bang in your words. How do you make sense of this event?",
        es: "Describe el big bang en tus palabras. ¿Cómo haces sentido de este evento?",
      },
      2: {
        en: "Travel back to the year you were conceived: what was that time about?",
        es: "Viaja al año en que fuiste concebido: ¿qué caracterizó ese tiempo?",
      },
      3: {
        en: "In which season were you conceived? What do you associate with it?",
        es: "¿En qué estación fuiste concebido? ¿Qué asocias con ella?",
      },
      4: {
        en: "What was the environment like for your mother during pregnancy?",
        es: "¿Cómo fue el entorno de tu madre durante el embarazo?",
      },
      5: {
        en: "Reflect on the communication environment before your birth.",
        es: "Reflexiona sobre el ambiente de comunicación antes de tu nacimiento.",
      },
      6: {
        en: "During your time in the womb, what hopes and views did your parents have?",
        es: "Durante tu tiempo en el vientre, ¿qué esperanzas y perspectivas tenían tus padres?",
      },
      7: {
        en: "Reflect on the spiritual or existential atmosphere during your time in the womb. What deeper beliefs or universal values might your parents have held? Consider how these could have touched your essence before you had memories, shaping your connection to the world.",
        es: "Reflexiona sobre el ambiente espiritual o existencial durante tu tiempo en el vientre. ¿Qué creencias profundas o valores universales podrían haber tenido tus padres? Considera cómo estos podrían haber tocado tu esencia antes de tener recuerdos, moldeando tu conexión con el mundo.",
      },
      8: {
        en: "Reflect on the capacity that your parents had for expressing their creativity as your were inside the womb of your mother: how did they connect to it? What is the impact that you perceive that had (and has) in your own capacity for expressing yourself creatively?",
        es: "Reflexiona sobre la capacidad que tenían tus padres para expresar su creatividad cuando estabas dentro del vientre de tu madre: ¿cómo se conectaron con ella? ¿Cuál es el impacto que percibes que tuvo (y tiene) en tu propia capacidad de expresarte creativamente?",
      },
      9: {
        en: "Explore with your words the moment of your birth, and everything that surrounded it. You may not remember, and that is perfectly fine and expected. But just dream. Or try to remember, but not with the part of you that thinks... With the one that knows. Just explore what comes as a consequence of navigating with your words the moment on which you gave your first breath, and dive into the awareness that that process brings.",
        es: "Explora con tus palabras el momento de tu nacimiento y todo lo que lo rodeó. Puede que no lo recuerdes, y eso está perfectamente bien y es esperado. Pero solo sueña. O intenta recordar, pero no con la parte de ti que piensa... Con la que sabe. Simplemente explora lo que surge como consecuencia de navegar con tus palabras el momento en el que diste tu primer aliento, y sumérgete en la conciencia que ese proceso trae.",
      },
      10: {
        en: "Imagine the dance of energies at the time of your birth. What colors, emotions, and connections might have surrounded you as you were welcomed into the world? Explore the sensations that the perspective of these brings into your awareness, as you bring yourself to life through each word that you use. Remember: This is a celebration. The celebration of your coming into the world. What are the emotions that are present in that exploration? Just feel into them. Feel them. Live them.",
        es: "Imagina el baile de energías en el momento de tu nacimiento. ¿Qué colores, emociones y conexiones podrían haber estado a tu alrededor mientras eras recibid@ en el mundo? Explora las sensaciones que la perspectiva de estas trae a tu conciencia, a medida que te das vida a través de cada palabra que usas. Recuerda: esto es una celebración. La celebración de tu llegada al mundo. ¿Cuáles son las emociones presentes en esa exploración? Simplemente siéntelas. Explóralas. Vívelas.",
      },
      11: {
        en: "Reflect on the energy of your first breath: how has this vital force shaped your life's journey and presence? Recall moments when this strength clearly manifested in you. What stirs you deeply, connecting you to that initial surge of life?",
        es: "Reflexiona sobre la energía de tu primer aliento: ¿cómo ha moldeado esta fuerza vital tu trayectoria y presencia en la vida? Recuerda momentos en que esta fortaleza se manifestó claramente en ti. ¿Qué te conmueve profundamente, conectándote con ese primer impulso de vida?",
      },
      // Wink 12 - Unconditional Love: Heart Chakra
      12: {
        en: "Reflect on the boundless love that embraced your arrival. How does this eternal wellspring of love manifest in your life's tapestry?",
        es: "Reflexiona sobre el amor sin límites que abrazó tu llegada. ¿Cómo se manifiesta esta fuente eterna de amor en el tapiz de tu vida?",
      },
      // Wink 13 - Expressive Truth: Throat Chakra
      13: {
        en: "Consider the first sounds and cries you made; what might they have expressed about your spirit and the life's symphony you were to play?",
        es: "Considera los primeros sonidos y llantos que hiciste; ¿qué podrían haber expresado sobre tu espíritu y la sinfonía de la vida que estabas por tocar?",
      },
      // Wink 14 - Intuition and Insight: Third Eye Chakra
      14: {
        en: "Imagine the intuitive whispers and ancestral wisdom that greeted you upon birth. How do these unseen threads weave through your inner knowing?",
        es: "Imagina los susurros intuitivos y la sabiduría ancestral que te recibieron al nacer. ¿Cómo se tejen estos hilos invisibles a través de tu saber interno?",
      },
      // Wink 15 - Spiritual Connection: Crown Chakra
      15: {
        en: "Ponder the celestial connection and cosmic consciousness that might have been present in your first moments. How does this connection influence your journey?",
        es: "Considera la conexión celestial y la conciencia cósmica que podrían haber estado presentes en tus primeros momentos. ¿Cómo influye esta conexión en tu viaje?",
      },
      // Wink 16 - Creative Act: Beyond the Chakras
      16: {
        en: "On the day of your birth, creativity itself took a breath through you. How does this original creative force inspire and shape your being and doing?",
        es: "El día de tu nacimiento, la creatividad misma tomó un respiro a través de ti. ¿Cómo inspira y da forma esta fuerza creativa original a tu ser y hacer?",
      },
    },
  };

  const questionCycle = questions.resonanceWave1;
  return (
    questionCycle[wink] || {
      en: "What does it mean to be free?",
      es: "¿Qué significa ser libre?",
    }
  );
}

function getAnkyverseColor(kingdom) {
  switch (kingdom) {
    case "Primordia":
      return "text-red-600";
    case "Emblazion":
      return "text-orange-600";
    case "Chryseos":
      return "text-yellow-600";
    case "Eleasis":
      return "text-green-600";
    case "Voxlumis":
      return "text-blue-600";
    case "Insightia":
      return "text-indigo-600";
    case "Claridium":
      return "text-violet-600";
    case "Poiesis":
      return "text-white-600 p-2 bg-black";
  }
}

function getAnkyverseDay(timestamp) {
  const currentSojourn = 3;
  const startingTimestamp = 1711861200;
  const difference = timestamp / 1000 - startingTimestamp;
  const wink = Math.ceil(difference / 86400);

  const kingdoms = [
    "Primordia",
    "Emblazion",
    "Chryseos",
    "Eleasis",
    "Voxlumis",
    "Insightia",
    "Claridium",
    "Poiesis",
  ];

  let currentKingdom = kingdoms[(wink - 1) % 8];

  return {
    currentSojourn,
    kingdom: currentKingdom,
    wink,
    prompt: getAnkyverseQuestionForToday(wink),
    color: getAnkyverseColor(currentKingdom),
  };
}

module.exports = {
  getAnkyverseDay,
  getAnkyverseQuestionForToday,
};
