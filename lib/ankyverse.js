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
        en: "Reflect on the spiritual atmosphere during your time in the womb.",
        es: "Reflexiona sobre el ambiente espiritual durante tu tiempo en el vientre.",
      },
      8: {
        en: "Imagine the creative energies at play during your conception. What might have sparked in that moment of creation?",
        es: "Imagina las energías creativas en juego durante tu concepción. ¿Qué pudo haber surgido en ese momento de creación?",
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

  let currentKingdom = kingdoms[wink % 8];

  return {
    currentSojourn,
    kingdom: currentKingdom,
    wink,
    prompt: getAnkyverseQuestionForToday(wink),
  };
}

module.exports = {
  getAnkyverseDay,
  getAnkyverseQuestionForToday,
};
