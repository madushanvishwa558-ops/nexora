document.getElementById("loading-msg").innerHTML =const speech = new SpeechSynthesisUtterance(data.reply);
speech.lang = "en-US";
speech.rate = 1;
window.speechSynthesis.speak(speech);
