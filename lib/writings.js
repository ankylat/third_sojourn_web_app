function getLongThread(todayWink) {
  try {
    let longThread = "";
    let locallySavedSession, parsedSession;
    for (let i = 1; i < todayWink + 1; i++) {
      locallySavedSession = localStorage.getItem(`writingSession-${i}`);
      parsedSession = JSON.parse(locallySavedSession);
      if (locallySavedSession && parsedSession.text.length > 50) {
        longThread += `${parsedSession.text} \n\n *** \n\n`;
      }
    }
    return longThread;
  } catch (error) {
    return "";
  }
}

module.exports = {
  getLongThread,
};
