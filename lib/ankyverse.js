function daysBetweenDates(start, end) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours, minutes, seconds, milliseconds
  return Math.round((end - start) / oneDay);
}

function getAnkyverseQuestion(language = "en") {
  const question = {
    en: "Reflect on the communication environment before your birth. How did your parents express their thoughts and emotions about your upcoming arrival? Consider the spoken and unspoken messages in your early surroundings and their potential impact on you. How might these early expressions have shaped your way of communicating?",
    es: "Reflexiona sobre el ambiente de comunicación antes de tu nacimiento. ¿Cómo expresaban tus padres sus pensamientos y emociones sobre tu próxima llegada? Considera los mensajes hablados y no hablados en tu entorno temprano y su posible impacto en ti. ¿Cómo podrían estas primeras expresiones haber moldeado tu forma de comunicarte?",
  };
  return question[language];
}

function getAnkyverseDay(date) {
  const ankyverseStart = new Date(Date.UTC(2023, 7, 10, 5, 0, 0)); // 2023-08-10T05:00:00 in UTC
  const daysInSojourn = 96;
  const daysInSlumber = 21;
  const cycleLength = daysInSojourn + daysInSlumber; // 117 days
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
  // Ensure the input date is in UTC
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );

  const elapsedDays = daysBetweenDates(ankyverseStart, utcDate);
  const currentSojourn = Math.floor(elapsedDays / cycleLength) + 1;
  const dayWithinCurrentCycle = elapsedDays % cycleLength;

  let currentKingdom, status, wink;
  if (dayWithinCurrentCycle < daysInSojourn) {
    status = "Sojourn";
    wink = dayWithinCurrentCycle + 1; // Wink starts from 1
    currentKingdom = kingdoms[dayWithinCurrentCycle % 8];
  } else {
    status = "Great Slumber";
    wink = null; // No Wink during the Great Slumber
    currentKingdom = "None";
  }
  return {
    date: utcDate.toISOString(),
    currentSojourn,
    status,
    currentKingdom,
    wink,
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

const date = getAnkyverseDay(new Date());
console.log(`the ankyverse date today is: `, date);

module.exports = {
  getAnkyverseDay,
  getAnkyverseQuestion,
  encodeToAnkyverseLanguage,
  decodeFromAnkyverseLanguage,
};
