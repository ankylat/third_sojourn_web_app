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
        en: "Imagine the first time you felt the ground beneath you. What might the earth have felt like to your infant self? Reflect on these sensations and write about how this early experience with the stable, supportive earth might have shaped your initial view of the world.",
        es: "Imagina la primera vez que sentiste la tierra bajo tus pies. ¿Cómo podría haberse sentido la tierra para tu yo infantil? Reflexiona sobre estas sensaciones y escribe cómo esta experiencia temprana con la tierra estable y de apoyo podría haber moldeado tu visión inicial del mundo.",
      },
      18: {
        en: "Think back to a moment of your early life's simple pleasures— the gentle sway of being rocked or the first ripple of laughter. Try to feel how you felt in those moments. How do these sensory memories resonate with your emotional and creative energy today?",
        es: "Trae a tu conciencia un momento de placeres simples en cuando eras un bebé: el suave balanceo al ser mecido o tu primera carcajada. Intenta sentir como se sintieron esos momentos. ¿Cómo resuenan estos recuerdos sensoriales con tu energía emocional y creativa hoy?",
      },
      19: {
        en: "Today, let's bring your parents into this process. How did your presence transform their world? Who did they become because of you coming into their life? Explore the concept of will power, and how it expressed in the relationship that they had with themselves, having in mind the role that you played on that process.",
        es: "Hoy, la invitación es a traer a tus padres a este proceso. ¿Cómo transformó tu presencia su mundo? ¿En quiénes se convirtieron gracias a que viniste a su vida? Explora el concepto de la fuerza de voluntad, y cómo se expresó en la relación de cada uno de ellos consigo mism@, tendiendo en cuenta qué rol jugaste tú en ese proceso.",
      },
      // Wink 12 - Unconditional Love: Heart Chakra
      20: {
        en: "Reflect on the gestures of care and kindness you received as a child. How did these moments of giving and receiving shape your understanding of love? Envision the hearts you touched and those that touched yours, and explore how these early exchanges of affection influenced your capacity for expressing and feeling compassion today.",
        es: "Reflexiona sobre los gestos de cuidado y amabilidad que recibiste cuando bebé. ¿Cómo moldearon estos momentos de dar y recibir tu comprensión del amor? Imagina los corazones que tocaste y aquellos que tocaron el tuyo, y explora cómo estos primeros intercambios de afecto influyeron en tu capacidad para expresar y sentir compasión hoy.",
      },
      // Wink 13 - Expressive Truth: Throat Chakra
      21: {
        en: "Think back to the echoes of conversations between your parents when you were just a baby. How did the tone, emotion, and style of their communication shape the atmosphere around you? Write about how you imagine these early exchanges influenced your understanding of relationships and communication today. Reflect on how this may still impact the way you connect with others.",
        es: "Piensa en los ecos de las conversaciones entre tus padres cuando eras solo un bebé. ¿Cómo influyeron el tono, la emoción y el estilo de su comunicación en el ambiente a tu alrededor? Escribe sobre cómo imaginas que estos primeros intercambios influenciaron tu comprensión de las relaciones y la comunicación hoy en día. Reflexiona sobre cómo esto podría seguir impactando la forma en que te conectas con los demás.",
      },
      // Wink 14 - Intuition and Insight: Third Eye Chakra
      22: {
        en: "Let's say you were born to specific parents in a specific place for a reason. Use your writing to explore the subtle signs in your life that point to this intuitive choice. What are these signs? What do they reveal? What do they tell you about the deeper motives behind your birth?",
        es: "Digamos que naciste de padres específicos en un lugar específico por una razón. Usa tu escritura para explorar las señales sutiles en tu vida que apuntan a esta elección intuitiva. ¿Cuáles son estas señales? ¿Qué revelan? ¿Qué te dicen sobre los motivos más profundos detrás de tu nacimiento?",
      },
      // Wink 15 - Spiritual Connection: Crown Chakra
      23: {
        en: "Explore the early months of your life as if they were guided by an invisible universal rhythm. What patterns or connections can you trace that suggest a broader plan at work? Write about how these early experiences might reveal deeper truths about your journey and place in the world.",
        es: "Explora los primeros meses de tu vida como si estuvieran guiados por un ritmo universal invisible. ¿Qué patrones o conexiones puedes rastrear que sugieran un plan más amplio en acción? Escribe sobre cómo estas primeras experiencias podrían revelar verdades más profundas sobre tu trayectoria y tu lugar en el mundo.",
      },
      // Wink 16 - Creative Act: Beyond the Chakras
      24: {
        en: "Imagine the role of play and creativity in your earliest life stages. Though you might not remember, envision how these forces shaped your initial encounters with the world. Write about how playful creativity might have opened doors to new realms of discovery and understanding, even before your memories began.",
        es: "Imagina el papel del juego y la creatividad en tus primeras etapas de vida. Aunque quizás no lo recuerdes, visualiza cómo estas fuerzas moldearon tus primeros encuentros con el mundo. Escribe sobre cómo la creatividad lúdica podría haber abierto puertas a nuevos ámbitos de descubrimiento y comprensión, incluso antes de que comenzaran tus recuerdos.",
      },
      25: {
        en: "who are you?",
        es: "quién eres?",
      },
      26: {
        en: "Reflect on your early sensory discoveries—taste, touch, sight, hearing, smell. How did these experiences connect you deeply with the world? Write about moments that sparked your creativity and emotional growth during early childhood.",
        es: "Reflexiona sobre tus primeros descubrimientos sensoriales: gusto, tacto, vista, oído, olfato. ¿Cómo te conectaron profundamente con el mundo? Escribe sobre momentos que desataron tu creatividad y crecimiento emocional durante la primera infancia.",
      },
      27: {
        en: "what change did learning how to walk bring into your life? use your words as an excuse for play.",
        es: "qué cambio trajo a tu vida aprender a caminar? usa tus palabras como una excusa para jugar.",
      },
      28: {
        en: "Bring to mind an impactful caregiver from your early years. How did their care influence your sense of trust and love? Or how they didn't? Describe with detail a defining moment you shared.",
        es: "Lleva a tu memoria a un cuidador significativo de tus primeros años. ¿Cómo influyó su cuidado en tu sentido de confianza y amor? ¿O cómo no lo hizo? Viaja a un momento definitorio que compartieron, y descríbelo con detalle.",
      },
      29: {
        en: "What does it mean to be free?",
        es: "qué significa ser libre?",
      },
      30: {
        en: "Imagine how intuition might have guided you as a toddler. What sort of situations do you think could have sparked an instinctive response? Use your creativity to reconstruct a moment where you might have intuitively reacted to your environment.",
        es: "Imagina cómo la intuición podría haberte guiado siendo un niño pequeño. ¿Qué tipo de situaciones crees que podrían haber provocado una respuesta instintiva? Usa tu creatividad para reconstruir un momento en que podrías haber reaccionado intuitivamente a tu entorno.",
      },
      31: {
        en: "tell us who you are",
        es: "cuéntanos... quién eres?",
      },
      32: {
        en: "Recall a time when a simple sensory detail—a sound, a scent, a texture—sparked an unexpected rush of creativity. What did this reveal about your inner world and your relationship with creativity?",
        es: "Recuerda una ocasión en que un simple detalle sensorial—un sonido, un aroma, una textura—desencadenó una oleada inesperada de creatividad. ¿Qué reveló esto sobre tu mundo interior y tu relación con la creatividad?",
      },
      33: {
        en: "Imagine the thrill of your first independent steps. How did mastering these movements shape your confidence and sense of adventure?",
        es: "Recuerda la emoción de tus primeros pasos. ¿Cómo influyó dominar estos movimientos en tu confianza y sentido de aventura?",
      },
      34: {
        en: "Think of a time when moving freely changed your perspective. What did exploring new spaces teach you about freedom and choice?",
        es: "Piensa en un momento en que moverte libremente cambió tu perspectiva. ¿Qué te enseñó la exploración de nuevos espacios sobre la libertad y la elección?",
      },
      35: {
        en: "Reflect on an instance where your movement led to discovery. How does this reflect your current ways of navigating challenges?",
        es: "Reflexiona sobre un caso en que tu movimiento condujera a un descubrimiento. ¿Cómo refleja esto tus maneras actuales de navegar desafíos?",
      },
      36: {
        en: "Consider how gaining physical independence influenced your relationships. How does this ability impact your emotional connections today?",
        es: "Considera cómo ganar independencia física influyó en tus relaciones. ¿Cómo impacta esta habilidad tus conexiones emocionales hoy?",
      },
      37: {
        en: "Explore how your early physical activities shaped your self-expression. How do you use movement to communicate and connect now?",
        es: "Explora cómo tus actividades físicas tempranas moldearon tu autoexpresión. ¿Cómo utilizas el movimiento para comunicarte y conectar ahora?",
      },
      38: {
        en: "Recall learning to navigate your environment. How does this initial spatial awareness influence your intuition in new situations?",
        es: "Recuerda aprender a navegar tu entorno. ¿Cómo influye esta conciencia espacial inicial en tu intuición en situaciones nuevas?",
      },
      39: {
        en: "Think back to moments when your movements mirrored inner feelings. How do these early expressions of emotion guide your creativity today?",
        es: "Piensa en momentos cuando tus movimientos reflejaban sentimientos internos. ¿Cómo guían estas expresiones tempranas de emoción tu creatividad hoy?",
      },
      40: {
        en: "Reflect on the joy of your first dance or playful run. How do these moments of pure movement continue to resonate in your life?",
        es: "Reflexiona sobre la alegría de tu primer baile o carrera juguetona. ¿Cómo siguen resonando estos momentos de movimiento puro en tu vida?",
      },
      41: {
        en: "tell us who you are",
        es: "quién eres?",
      },
      42: {
        en: "Reflect on the first relationships you formed through language. How did learning to speak and interpret words shape your relationships? Consider the influence of words on your emotional connections during early childhood.",
        es: "Reflexiona sobre las primeras relaciones que formaste a través del lenguaje. ¿Cómo moldeó el aprender a hablar e interpretar palabras tus relaciones? Considera la influencia de las palabras en tus conexiones emocionales durante la primera infancia.",
      },
      43: {
        en: "Think about a time when your voice felt particularly powerful or heard. How did expressing yourself and being listened to influence your sense of self and confidence?",
        es: "Piensa en un momento en que tu voz se sintió particularmente poderosa o escuchada. ¿Cómo influyó expresarte y ser escuchado en tu sentido del yo y tu confianza?",
      },
      44: {
        en: "Discuss a moment when words expressed or received acted as gestures of love and compassion. How did this communication touch your heart and shape your capacity for empathy?",
        es: "Discute un momento en que las palabras expresadas o recibidas actuaron como gestos de amor y compasión. ¿Cómo tocó esta comunicación tu corazón y moldeó tu capacidad de empatía?",
      },
      45: {
        en: "Recall a pivotal conversation from your early years that had a significant impact on you. How did this event shape your understanding of the power of spoken words?",
        es: "Recuerda una conversación crucial de tus primeros años que tuvo un impacto significativo en ti. ¿Cómo moldeó este evento tu comprensión del poder de las palabras habladas?",
      },
      46: {
        en: "Describe an instance when you understood something profound not through spoken words but through intuition or a deep knowing. How has this non-verbal understanding influenced your communication style?",
        es: "Describe un momento en que entendiste algo profundo no a través de palabras habladas, sino mediante la intuición o un conocimiento profundo. ¿Cómo ha influenciado este entendimiento no verbal tu estilo de comunicación?",
      },
      47: {
        en: "Reflect on a moment when communication felt transcendent or connected you to something larger than yourself. How do these moments influence your perspective on the power of voice and sound?",
        es: "Reflexiona sobre un momento en que la comunicación se sintió trascendente o te conectó con algo más grande que tú mismo. ¿Cómo influyen estos momentos en tu perspectiva sobre el poder de la voz y el sonido?",
      },
      48: {
        en: "Recall your favorite childhood toy. How did it shape your sense of security?",
        es: "Recuerda tu juguete favorito de la infancia. ¿Cómo moldeó tu sentido de seguridad?",
      },
      49: {
        en: "Describe a game that made you feel free. How did it influence your emotions?",
        es: "Describe un juego que te hizo sentir libre. ¿Cómo influyó en tus emociones?",
      },
      50: {
        en: "Who was your imaginary friend? How did they boost your confidence?",
        es: "¿Quién era tu amigo imaginario? ¿Cómo aumentó tu confianza?",
      },
      51: {
        en: "Reflect on a loving moment during play. How did it open your heart?",
        es: "Reflexiona sobre un momento amoroso durante el juego. ¿Cómo abrió tu corazón?",
      },
      52: {
        en: "Think of a pretend game where you spoke out. How did it affect your expression?",
        es: "Piensa en un juego de imaginación donde te expresaste. ¿Cómo afectó tu expresión?",
      },
      53: {
        en: "Describe a playtime that sparked insight. How did it expand your mind?",
        es: "Describe un juego que provocó una idea. ¿Cómo expandió tu mente?",
      },
      54: {
        en: "Recall a playful moment that felt magical. How did it connect you spiritually?",
        es: "Recuerda un momento de juego que se sintió mágico. ¿Cómo te conectó espiritualmente?",
      },
      55: {
        en: "Reflect on a creative play. How did it unlock your highest potential?",
        es: "Reflexiona sobre un juego creativo. ¿Cómo desbloqueó tu mayor potencial?",
      },
      /// FILL THE REST OF THE PROMPTS
      65: {
        en: "Think back to when you were around 5 years old. What was one of the first moments you asserted your independence? How did this shape your sense of security and belonging?",
        es: "Piensa en cuando tenías alrededor de 5 años. ¿Cuál fue uno de los primeros momentos en los que afirmaste tu independencia? ¿Cómo moldeó esto tu sentido de seguridad y pertenencia?",
      },
      66: {
        en: "Reflect on a time around age 5 when you made a choice based on what you liked. How did this early decision impact your emotions and sense of autonomy?",
        es: "Reflexiona sobre un momento cuando tenías alrededor de 5 años en el que tomaste una decisión basada en lo que te gustaba. ¿Cómo impactó esta decisión temprana en tus emociones y sentido de autonomía?",
      },
      67: {
        en: "Recall a moment from when you were 5 where you felt a strong sense of self. How did asserting your will during this time influence your confidence and decision-making?",
        es: "Recuerda un momento cuando tenías 5 años en el que sentiste un fuerte sentido de identidad. ¿Cómo influenció tu confianza y toma de decisiones afirmar tu voluntad durante este tiempo?",
      },
      68: {
        en: "Consider a time around age 5 when asserting your independence affected your relationships. How did this experience shape your understanding of love and connection?",
        es: "Considera un momento alrededor de los 5 años cuando afirmar tu independencia afectó tus relaciones. ¿Cómo moldeó esta experiencia tu comprensión del amor y la conexión?",
      },
      69: {
        en: "Think about the first time you strongly expressed an opinion or desire around age 5. How did using your voice to assert your independence influence your communication skills?",
        es: "Piensa en la primera vez que expresaste fuertemente una opinión o deseo alrededor de los 5 años. ¿Cómo influenció en tus habilidades de comunicación el usar tu voz para afirmar tu independencia?",
      },
      70: {
        en: "Reflect on a moment around age 5 when your intuition guided you to make an independent decision. How did this early insight shape your understanding of your inner wisdom?",
        es: "Reflexiona sobre un momento alrededor de los 5 años en el que tu intuición te guió a tomar una decisión independiente. ¿Cómo moldeó esta percepción temprana tu comprensión de tu sabiduría interior?",
      },
      71: {
        en: "Recall a time around age 5 when asserting your independence made you feel connected to something greater. How did this experience influence your spiritual growth?",
        es: "Recuerda un momento alrededor de los 5 años cuando afirmar tu independencia te hizo sentir conectado con algo más grande. ¿Cómo influenció esta experiencia en tu crecimiento espiritual?",
      },
      72: {
        en: "Imagine how asserting your independence around age 5 sparked your creativity. Write about a moment when standing up for yourself led to a creative breakthrough or expression.",
        es: "Imagina cómo afirmar tu independencia alrededor de los 5 años desató tu creatividad. Escribe sobre un momento en el que defenderte a ti mismo llevó a un avance creativo o expresión.",
      },
    },
  };

  const questionCycle = questions.resonanceWave1;
  return (
    questionCycle[wink] || {
      en: "tell us who you are",
      es: "quién eres?",
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

const characters = [
  "\u0C85",
  "\u0C86",
  "\u0C87",
  "\u0C88",
  "\u0C89",
  "\u0C8A",
  "\u0C8B",
  "\u0C8C",
  "\u0C8E",
  "\u0C8F",
  "\u0C90",
  "\u0C92",
  "\u0C93",
  "\u0C94",
  "\u0C95",
  "\u0C96",
  "\u0C97",
  "\u0C98",
  "\u0C99",
  "\u0C9A",
  "\u0C9B",
  "\u0C9C",
  "\u0C9D",
  "\u0C9E",
  "\u0C9F",
  "\u0CA0",
  "\u0CA1",
  "\u0CA2",
  "\u0CA3",
  "\u0CA4",
  "\u0CA5",
  "\u0CA6",
  "\u0CA7",
  "\u0CA8",
  "\u0CAA",
  "\u0CAB",
  "\u0CAC",
  "\u0CAD",
  "\u0CAE",
  "\u0CAF",
  "\u0CB0",
  "\u0CB1",
  "\u0CB2",
  "\u0CB3",
  "\u0CB5",
  "\u0CB6",
  "\u0CB7",
  "\u0CB8",
  "\u0CB9",
  "\u0CBC",
  "\u0CBD",
  "\u0CBE",
  "\u0CBF",
  "\u0CC0",
  "\u0CC1",
  "\u0CC2",
  "\u0CC3",
  "\u0CC4",
  "\u0CC6",
  "\u0CC7",
  "\u0CC8",
  "\u0CCA",
  "\u0CCB",
  "\u0CCC",
  "\u0CCD",
  "\u0CD5",
  "\u0CD6",
  "\u0CDE",
  "\u0CE0",
  "\u0CE1",
  "\u0CE2",
  "\u0CE3",
  "\u0CE6",
  "\u0CE7",
  "\u0CE8",
  "\u0CE9",
  "\u0CEA",
  "\u0CEB",
  "\u0CEC",
  "\u0CED",
  "\u0CEE",
  "\u0CEF",
  "\u0CF1",
  "\u0CF2", // Kannada characters
  "\u0C05",
  "\u0C06",
  "\u0C07",
  "\u0C08",
  "\u0C09",
  "\u0C0A",
  "\u0C0B",
  "\u0C0C",
  "\u0C0E",
  "\u0C0F",
  "\u0C10",
  "\u0C12",
  "\u0C13",
  "\u0C14", // Telugu characters
];

function encodeToAnkyverseLanguage(input) {
  let encoded = "";
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const index = (charCode - 32) % characters.length;
    encoded += characters[index];
  }
  return encoded;
}

function decodeFromAnkyverseLanguage(input) {
  let decoded = "";
  for (let i = 0; i < input.length; i++) {
    const index = characters.indexOf(input[i]);
    if (index !== -1) {
      decoded += String.fromCharCode(index + 32);
    } else {
      decoded += input[i];
    }
  }
  return decoded;
}

module.exports = {
  getAnkyverseDay,
  getAnkyverseQuestionForToday,
  encodeToAnkyverseLanguage,
  decodeFromAnkyverseLanguage,
};
