function getAnkyverseQuestionForToday(wink) {
  const questions = {
    resonanceWave1: {
      1: {
        en: "Describe the big bang in your words. How do you make sense of this event?",
        es: "Describe el big bang en tus palabras. ¿Cómo haces sentido de este evento?",
      },
      2: {
        en: "Travel back to the year your were conceived (not born) by your parents: just from memory, what was that year/time/era about? What was important in the realms of culture, history, politics, sports, economy etc.? Refrain from Googling, it is more interesting to experience what comes.",
        es: "Viaja al año en que fuiste concebido (no nacido) por tus padres: solo de memoria, ¿de qué se trató ese año/época/era? ¿Qué era importante en los ámbitos de la cultura, la historia, la política, los deportes, la economía, etc.? Abstente de buscar en Google, es más interesante lo que venga a ti.",
      },
      3: {
        en: "Travel back nine months before you were born: which season (or month if you like precision) did the sperm of your father impregnate the egg of your mother? What do you associate with this season or month? What are the best and worst memories you have regarding that specific season/month, throughout your life?",
        es: "¿Viaja nueve meses antes de nacer: ¿en qué estación (o mes si quieres ser preciso) el esperma de tu padre fecundó el óvulo de tu madre? ¿Qué asocias con esta estación o mes? ¿Cuáles son los mejores y peores recuerdos que tienes sobre esa estación/mes específico a lo largo de tu vida?",
      },
      4: {
        en: "What was the environment like for your mother when she carried you in her womb? Who was around her? What kind of support did she have? Did she work? How old was she? What do you know about her mental or emotiona state when she carried you?",
        es: "¿Cómo era el ambiente para tu madre cuando te llevaba en su vientre? ¿Quién estaba a su alrededor? ¿Qué tipo de apoyo tuvo ella? ¿Ella trabajó? ¿Qué edad tenía ella? ¿Qué sabes sobre su estado mental o emocional cuando te cargó?",
      },
      5: {
        en: "Reflect on the communication environment before your birth. How did your parents express their thoughts and emotions about your upcoming arrival? Consider the spoken and unspoken messages in your early surroundings and their potential impact on you. How might these early expressions have shaped your way of communicating?",
        es: "Reflexiona sobre el entorno comunicativo antes de tu nacimiento. ¿Cómo expresaron tus padres sus pensamientos y emociones sobre tu próxima llegada? Considere los mensajes hablados y tácitos de su entorno inicial y su impacto potencial en usted. ¿Cómo podrían haber dado forma estas primeras expresiones a su forma de comunicarse?",
      },
      6: {
        en: "During your time in the womb, what hopes and views did your parents have about the world and your future? WHat did they care about? How do you think these influenced your early perceptions and understanding?",
        es: "Durante tu estancia en el útero, ¿qué esperanzas y puntos de vista tenían tus padres sobre el mundo y tu futuro? ¿Qué les importaba? ¿Cómo crees que estos influyeron en tus primeras percepciones y comprensión?",
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
        en: "Ponder the love that welcomed you into this world, whether from family, friends, or the universe itself. How has this love, or your search for it, shaped your life's journey and your capacity to give and receive love in return?",
        es: "Reflexiona sobre el amor que te dio la bienvenida a este mundo, ya sea de familiares, amigos o del universo mismo. ¿Cómo ha dado forma este amor, o tu búsqueda del mismo, al viaje de tu vida y a tu capacidad de dar y recibir amor a cambio?",
      },
      // Wink 13 - Expressive Truth: Throat Chakra
      13: {
        en: "Reflect on the first sounds and voices that surrounded your birth. How have these initial expressions shaped your way of communicating and connecting with the world? Explore how your earliest interactions influenced your journey to finding and expressing your true voice.",
        es: "Reflexiona sobre los primeros sonidos y voces que te rodearon al nacer. ¿Cómo han moldeado estas expresiones iniciales tu manera de comunicarte y conectar con el mundo? Explora cómo tus primeras interacciones influenciaron tu camino para encontrar y expresar tu verdadera voz.",
      },
      // Wink 14 - Intuition and Insight: Third Eye Chakra
      14: {
        en: "Consider the intuitive feelings and subtle influences you might have experienced from your earliest moments. How have these shaped your paths and choices? Reflect on their presence in your life, even if subtle, and explore their impact on you.",
        es: "Reflexiona sobre las sensaciones intuitivas y las influencias sutiles que podrías haber experimentado desde tus primeros momentos. ¿Cómo han moldeado estas tu camino y decisiones? Reflexiona sobre su presencia en tu vida, incluso si es sutil, y explora su impacto en ti.",
      },
      // Wink 15 - Spiritual Connection: Crown Chakra
      15: {
        en: "Consider the broader universal connection present at your birth. How has this shaped your life and worldview? Discuss how these initial universal ties influence your personal and spiritual growth.",
        es: "Considera la conexión universal presente en tu nacimiento. ¿Cómo ha moldeado esto tu vida y visión del mundo? Explora cómo estos lazos universales iniciales influyen en tu crecimiento personal y espiritual.",
      },
      // Wink 16 - Creative Act: Beyond the Chakras
      16: {
        en: "On the day of your birth, creativity itself took a breath through you. How does this original creative force inspire and shape your being and doing?",
        es: "El día de tu nacimiento, la creatividad misma tomó un respiro a través de ti. ¿Cómo inspira y da forma esta fuerza creativa original a tu ser y hacer?",
      },
      17: {
        en: "",
        es: "",
      },
      18: {
        en: "Imagine the dance of energies at the time of your birth. What colors, emotions, and connections might have surrounded you as you were welcomed into the world? Explore the sensations that the perspective of these brings into your awareness, as you bring yourself to life through each word that you use. Remember: This is a celebration. The celebration of your coming into the world. What are the emotions that are present in that exploration? Just feel into them. Feel them. Live them.",
        es: "Imagina el baile de energías en el momento de tu nacimiento. ¿Qué colores, emociones y conexiones podrían haber estado a tu alrededor mientras eras recibid@ en el mundo? Explora las sensaciones que la perspectiva de estas trae a tu conciencia, a medida que te das vida a través de cada palabra que usas. Recuerda: esto es una celebración. La celebración de tu llegada al mundo. ¿Cuáles son las emociones presentes en esa exploración? Simplemente siéntelas. Explóralas. Vívelas.",
      },
      19: {
        en: "Reflect on the energy of your first breath: how has this vital force shaped your life's journey and presence? Recall moments when this strength clearly manifested in you. What stirs you deeply, connecting you to that initial surge of life?",
        es: "Reflexiona sobre la energía de tu primer aliento: ¿cómo ha moldeado esta fuerza vital tu trayectoria y presencia en la vida? Recuerda momentos en que esta fortaleza se manifestó claramente en ti. ¿Qué te conmueve profundamente, conectándote con ese primer impulso de vida?",
      },
      // Wink 12 - Unconditional Love: Heart Chakra
      20: {
        en: "Ponder the love that welcomed you into this world, whether from family, friends, or the universe itself. How has this love, or your search for it, shaped your life's journey and your capacity to give and receive love in return?",
        es: "Reflexiona sobre el amor que te dio la bienvenida a este mundo, ya sea de familiares, amigos o del universo mismo. ¿Cómo ha dado forma este amor, o tu búsqueda del mismo, al viaje de tu vida y a tu capacidad de dar y recibir amor a cambio?",
      },
      // Wink 13 - Expressive Truth: Throat Chakra
      21: {
        en: "Reflect on the first sounds and voices that surrounded your birth. How have these initial expressions shaped your way of communicating and connecting with the world? Explore how your earliest interactions influenced your journey to finding and expressing your true voice.",
        es: "Reflexiona sobre los primeros sonidos y voces que te rodearon al nacer. ¿Cómo han moldeado estas expresiones iniciales tu manera de comunicarte y conectar con el mundo? Explora cómo tus primeras interacciones influenciaron tu camino para encontrar y expresar tu verdadera voz.",
      },
      // Wink 14 - Intuition and Insight: Third Eye Chakra
      22: {
        en: "Consider the intuitive feelings and subtle influences you might have experienced from your earliest moments. How have these shaped your paths and choices? Reflect on their presence in your life, even if subtle, and explore their impact on you.",
        es: "Reflexiona sobre las sensaciones intuitivas y las influencias sutiles que podrías haber experimentado desde tus primeros momentos. ¿Cómo han moldeado estas tu camino y decisiones? Reflexiona sobre su presencia en tu vida, incluso si es sutil, y explora su impacto en ti.",
      },
      // Wink 15 - Spiritual Connection: Crown Chakra
      23: {
        en: "Consider the broader universal connection present at your birth. How has this shaped your life and worldview? Discuss how these initial universal ties influence your personal and spiritual growth.",
        es: "Considera la conexión universal presente en tu nacimiento. ¿Cómo ha moldeado esto tu vida y visión del mundo? Explora cómo estos lazos universales iniciales influyen en tu crecimiento personal y espiritual.",
      },
      // Wink 16 - Creative Act: Beyond the Chakras
      24: {
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
      return "text-white p-2 bg-black rounded-xl";
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
