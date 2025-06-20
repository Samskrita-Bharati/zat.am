const reference = document.getElementById("reference");
const quote = document.getElementById("quote");
const input = document.getElementById("typedValue");
const start = document.getElementById("start");
const info = document.getElementById("info");
const message = document.getElementById("message");
const meaning = document.getElementById("meaning");
const viswaroopa = document.getElementById("viswaroopa");
const settings = document.getElementById("settings");
const share =  document.getElementById("share");
const tooltip = document.getElementById("myTooltip");

let quotes, meanings;

// Chapter 1 - https://esamskriti.com/essays/BG-CH-1.pdf

async function get_gita() {
  
  let responses = await fetch('bhagavadgita.txt');
  
  let quotes_all = await responses.json();
  
  // console.log(quotes_all);
  
  quotes = quotes_all.shlokas;
  
  meanings = quotes_all.meanings;
}

get_gita();

const imp_quotes = [
// Most interesting verses
 "karmanye vadhikaraste ma phaleshu kadachana, ma karmaphalaheturbhurma te sangostvakarmani",
 "yada yada hi dharmasya glanirbhavati bharata, abhythanamadharmasya tadatmanam srijamyaham",
 "paritranaya sadhunang vinashay cha dushkritam, dharmasangsthapanarthay sambhavami yuge yuge",
 "trividham narakasyedam dvaram naashanam, aatmanah kaamah krodhas tathaa lobhas tasmaad etat trayam tyajet",
 "yuktaahaara vihaarasya yukta cheshtasya karmasu, yukta svapnaavabodhasya yogo bhavati dukhah",
// https://www.invajy.com/bhagavad-gita/
 "na tvevaaham jaatu naasam na tvam neme janaadhipaa, na chaiva na bhavishyaamah sarve vayamatah param",
 "dehino sminyathaa dehe kaumaaram yauvanam jaraa, tathaa dehaantarapraaptirdheerastatra na muhyati",
 "maatraa sparshaas tu kaunteya śheetoshna sukha duhkha daah, aagamaapaayino nityaas tans titikshasva bhaarata",
 "na jaayate mriyate vaa kadaachin, naayam bhutvaa bhavitaa vaa na bhuyah, ajo nityah shaashvato yam puraano, na hanyate hanyamaane shareere",
 "vaasaansi jeernaani yathaa vihaaya, navaani grihnaati naro paraani, tathaa shareeraani vihaaya jeernaanya, nyaani sanyaati navaani dehee",
 "aapooryamaanam achala pratishtam, samudramaapah pravishanti yadvat, tadvat kaamaa yam pravishanti sarve, sa shaantim aapnoti na kaama kaamee",
 "shreyaan swadharmo vigunah para dharmaat svanushthitaat, swadharme nidhanam shreyah paradharmo bhayaavahah",
 "indriyaani paraanyaahur indriyebhyah param manah, manasastu paraa buddhir yo buddheh paratastu sah",
 "evam buddheh param buddhvaa sanstabhyaatmaanam aatmanaa, jahi shatrum mahaa baaho kaama rupam duraasadam",
 "na hi deha bhritaa shakyam tyaktum karmaany asheshatah, yas tu karma phala tyaagee sa tyaageetyabhidheeyate",
// https://emoha.com/blogs/busy/top-10-geeta-shlokas-meaning
 "bhogaiswvarya prasaktaanaam tayaapahrita chetasaam, vyavasaayaatmikaa buddhih samaadhau na vidheeyate",
 "dhyaayato vishayaan pumsah sangas teshoopajaayate, sangaat sanjaayate kaamah kaamaat krodho bhijaayate",
 "krodhaad bhavati sammohah sammohaat smriti vibhramah, smriti bhranshaad buddhi naasho buddhi naashaat pranashyati",
 "raaga dvesha viyuktais tu vishayaan indriyaish charan, aatma vashyair vidheyaatmaa prasaadam adhigachchhati",
 "kaama esha krodha esha rajo guna samudbhavah, mahaashano mahaa paapmaa viddhyenam iha vairinam",
 "bhoomir aaponalo vaayuh kham mano buddhir eva cha, ahankaara iteeyam me bhinnaa prakritir ashtadhaa",
 "apareyam itas tvanyaam prakritim viddhi me paraam, jeeva bhootaam mahaa baaho yayedam dhaaryate jagat",
 "ye hi sansparshajaa bhogaa duhkha yonaya eva te, aadyantavantah kaunteya na teshu ramate budhah",
 "sarva karmaani manasaa sannyasyaaste sukham vashee, nava dvaare pure dehee naiva kurvan na kaarayan",
 "api chet suduraachaaro bhajate maam ananya bhaak, saadhur eva sa mantavyah samyag vyavasito hi sah"
];

const imp_meanings = [
// Most interesting shlokas
"You have the right to work only but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.",
"Whenever there is decay of righteousness, O Bharata, And there is exaltation of unrighteousness, then I Myself come forth",
"For the protection of the good, for the destruction of evil-doers, For the sake of firmly establishing righteousness, I am born from age to age.",
"There are three gates leading to the hell of self-destruction for the soul—lust, anger, and greed. Therefore, one should abandon all three.",
"Those who are temperate in eating and recreation, balanced in work, and regulated in sleep, can mitigate all sorrows by practicing Yog",
// https://www.invajy.com/bhagavad-gita/
"But certainly, there was not any time in the past when I did not exist; nor you, nor these rulers of men. And surely it is not that we all shall cease to exist after this.",
"Just as the man in this body passes through the various stages of boyhood, youth, and old age, like so, he passes into another body after death. The wise know it and are not deluded.",
"The contact between the senses and the sense objects gives rise to fleeting perceptions of happiness and distress. These are non-permanent, and come and go like the winter and summer seasons. One must learn to tolerate them without being disturbed.",
"The soul is neither born, nor does it ever die; nor is it that having come to exist, It will ever cease to be. The soul is birth less, eternal, immortal and ageless; It is not destroyed when the body is destroyed.",
"As a person sheds worn-out garments and wears new ones, likewise, at the time of death, the soul casts off its worn-out body and enters a new one.",
"Just as the ocean remains undisturbed by the incessant flow of waters from rivers merging into it, likewise the sage who is unmoved despite the flow of desirable objects all around him attains peace, and not the person who strives to satisfy desires.",
"It is far better to perform one’s natural prescribed duty, though tinged with faults, than to perform another’s prescribed duty, though perfectly. In fact, it is preferable to die in the discharge of one’s duty, than to follow the path of another, which is fraught with danger.",
"The senses are superior to the gross body, and superior to the senses is the mind. Beyond the mind is the intellect, and even beyond the intellect is the soul.",
"Thus knowing oneself (soul) to be superior to the material senses, mind, and intellect, subdue the lower self (senses, mind, and intellect) by the higher self (strength of the soul), and kill this formidable enemy called lust.",
"For the embodied being, it is impossible to give up activities entirely. But those who relinquish the fruits of their actions are said to be truly renounced.",
// https://emoha.com/blogs/busy/top-10-geeta-shlokas-meaning
"Those who are excessively preoccupied with sensual pleasures and financial wealth, and who are perplexed by them, lack the strong commitment to devote their lives to the Supreme Lord. They are unable to sustain the firm commitment required to pursue the path of God-realization.",
"When a person perceives objects through their senses, attachment develops, leading to lust and fury. Desire produces attachment. When desire deepens, it gives rise to two significant problems: greed and rage. Greed arises from the constant feeding of desire.",
"Anger is inseparably linked to delusion, which further leads to memory distortion. When one’s memory is warped, their intelligence is destroyed, thus they slip back into the material pool. When angry and covered by a thick veil of emotions, people tend to make decisions they later regret.",
"Lord’s total mercy can only be obtained by those who can control their senses by experiencing independence from all forms of attachment and revulsion. Only then, it is completely focused on devotion to God, one receives God’s grace and enjoys his infinite bliss.",
"Lust is formed from contact with the material states of passion and which changes into wrath, world’s all-devouring, wicked enemy. When a desire is satisfied, greed emerges; when it is not, contempt develops. One commits sins while under the grip of the three—lust, greed, and anger.",
"One’s material energy is made up of eight facets: earth, water, fire, air, space, mind, intellect, and ego. The mind, intellect, and ego, as well as the five gross elements, are all expressions of Lord’s material force. All these eight elements are essentially portions of Maya, his material force.",
"There is a greater essence that incorporates all sentient creatures confronting material nature and preserving the cosmos. Unlike dead matter, this energy is wholly ethereal. All the world’s living souls are encompassed by his spiritual force, ‘jiva’ shakti.",
"The pleasures derived from interaction with sense objects, while appearing to be pleasurable to mortal beings, are in fact a continuous source of suffering. Such delights have a finite lifespan, and as such the wise ignore them. Worldly joys are insensible, and as a result, they diminish over time.",
"In the city of nine gates, self-controlling and secluded corporal creatures dwell calmly, free of thoughts that they are the doers or authors of anything. The incarnate soul is neither the implementer nor the cause of any action.",
"Even the most heinous sinners who worship, are to be accounted honourable since they have made a sensible decision. They should no longer be labelled as sinners if they begin to serve God entirely. They have made a pure decision and, because of their noble spiritual intention, should be called virtuous instead."
];

let nectar_list = [ 
      [1], 
      [7, 11, 13, 20, 22, 23, 38, 47, 55, 58, 62, 63, 70],
      [19, 30, 35],
      [7, 8, 29, 39],
      [3, 10],
      [17],
      [8, 9],
      [10],
      [26],
      [41],
      [8],
      [16, 17, 19],
      [7, 8, 27],
      [17, 18],
      [17],
      [1, 2, 3, 18, 21],
      [3, 23],
      [2, 11, 47, 66, 78]
    ];

let wordQueue, quoteText, highlightPosition, startTime, ch_index = 0, sh_index = -1, is_playing = false;

let num_errors, progression_type, nectar_index=-1, is_random;

let lastPlayedTs;

function startGame() {

  console.log("new game started!");
  is_playing = true;
  num_errors = 0;
  
  is_random = document.getElementById('rand').checked;
  progression_type = document.querySelector('input[name = progression]:checked').value
  // console.log("progression type: ",progression_type);
  
  message.innerHTML = ``;
  meaning.innerHTML = ``;
  info.innerHTML = ``;
  start.innerHTML = `New Game`;
  viswaroopa.innerHTML = ``;
  input.style.display = "block";
  share.style.display = "none";
  tooltip.innerHTML = "Copy to clipboard";
  
  if (progression_type == 1) {
    ch_index = Math.floor(Math.random() * quotes.length);
    sh_index = Math.floor(Math.random() * quotes[ch_index].length);
  } else if (progression_type == 0) {
    sh_index++;
    if (sh_index >= quotes[ch_index].length) {
      sh_index = 0;
      ch_index++;
      if (ch_index == quotes.length) {
        ch_index = 0;
      }
    }
  } else {     // (progression_type == 2)
    nectar_index++;
    if (nectar_index >= nectar_list[ch_index].length) {
      nectar_index = 0;
      ch_index++;
      if (ch_index == nectar_list.length) {
        ch_index = 0;
      }
    }
    sh_index = nectar_list[ch_index][nectar_index]-1;
  }
  quoteText = quotes[ch_index][sh_index];
  wordQueue = quoteText.split(" ");
  
  reference.innerHTML = `Chapter: ${ch_index+1}, Shloka: ${sh_index+1}`
  quote.innerHTML = wordQueue.map((word) => `<span>${word}</span>`).join("").split(",").join("<br>");
  highlightPosition = 0;
  quote.childNodes[highlightPosition].className = "highlight";
  
  startTime = new Date().getTime();
  
  document.body.className = "";
  
  // $("typedValue").focus();
  document.getElementById("typedValue").focus();
  document.getElementById("typedValue").select();
}

function checkInput() {
  const currentWord = wordQueue[0].replaceAll(',','');
  const typedValue = input.value.trim();

  if (is_playing == false) {
    input.value = ""; // empty the text input
    return;
  }
  if (typedValue == "@") {
    console.log("cheat code for testing game");
    input.value = ""; // empty the text input
    gameOver();
    return;
  }
  if (currentWord !== typedValue) {
    
    if (currentWord.startsWith(typedValue) == true) {
      input.className = "";
    } else {
      input.className = "error";
      console.log("mistake");
      num_errors++;
    }
    
    return;
  }
  

  wordQueue.shift(); // shift removes the first item in the array (the 0th element)
  input.value = ""; // empty the text input

  quote.childNodes[highlightPosition].className = "";
  highlightPosition++;

  if (wordQueue.length === 0) {
    console.log("Successfully finished game");
    gameOver();
    return;
  }

  quote.childNodes[highlightPosition].className = "highlight";
}

let elapsedTime;

function gameOver() {
  if (is_playing == false) {
    return;
  } else {
    is_playing = false;
  }

  lastPlayedTs = new Date();

  elapsedTime = new Date().getTime() - startTime;
  // let time_taken = (elapsedTime/1000);
  // console.log(`Time taken is: ${Math.round(time_taken)}`)
  
  message.innerHTML = `
    <span class="congrats">Congrats!</span>
    <br> You finished in ${elapsedTime/1000} seconds with ${num_errors} typos
    `;
  
  quote.innerHTML = `<span class="quote">Verse: ${quotes[ch_index][sh_index].split(",").join("<br>")}</span>`;
  meaning.innerHTML = `<span class="meaning">Meaning: ${meanings[ch_index][sh_index]}</span>`;
  
  
  input.style.display = "none";
  share.style.display = "block";
  share.focus();
  
  if (is_random == false) {
    save_history();
  }
  
  if (Math.random() > 0.5) {
  viswaroopa.innerHTML = `<img class="img" src="viswaroopa.jpg?v=1696161919579">`
  } else {
  viswaroopa.innerHTML = `<img class="img" src="Mahabharata.jpg?v=1696106267514">`
  }
  document.body.className = "viswaroopa";
//  document.body.className = "winner";
  ShareIt();
}

var copyText;

function ShareIt() {
  
  let linkURL = "https://zat.am/057-gita-typing";
  
  copyText = `#BhagavadGita I learnt the meaning of shloka ${sh_index+1} from chapter ${ch_index+1} in ${Math.round(elapsedTime/1000)} sec at ${linkURL}`;
  
  navigator.clipboard.writeText(copyText);
  
   if (navigator.canShare) {
    navigator.share({
      title: 'Share results',
      text: `#BhagavadGita I learnt the meaning of shloka ${sh_index+1} from chapter ${ch_index+1} in ${Math.round(elapsedTime/1000)} sec at ${linkURL}`,
      // url: linkURL,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  }
  
//  alert("Copied the results to clipboard");
  tooltip.innerHTML = "Results copied";
}

function outFunc() {
  tooltip.innerHTML = "Copy to clipboard";
}

function Na(e, a) {
    var s = new Date(e);
    var t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
    return Math.round(t / 864e5);
}


function get_history() {
  const noItemsFound_ch = 0, noItemsFound_sh = -1, noItemsFound_nec = -1, noItemsFound_lastPlayedTs = 0;
  const ch = localStorage.getItem('ch_index') || noItemsFound_ch;
  const sh = localStorage.getItem('sh_index') || noItemsFound_sh;
  const nec = localStorage.getItem('nectar_indx') || noItemsFound_nec;
  const lpts = localStorage.getItem('lpts') || noItemsFound_lastPlayedTs;

  ch_index = JSON.parse(ch);
  sh_index = JSON.parse(sh);
  nectar_index = JSON.parse(nec);
  lastPlayedTs = JSON.parse(lpts);
}

function save_history() {
  const ch = JSON.stringify(ch_index);
  const sh = JSON.stringify(sh_index);
  const nec = JSON.stringify(nectar_index);
  const lpts = JSON.stringify(lastPlayedTs);
  localStorage.setItem('ch_index', ch);
  localStorage.setItem('sh_index', sh);
  localStorage.setItem('nectar_indx', nec);
  localStorage.setItem('lpts', lpts);
}

get_history();
input.style.display = "none";
share.style.display = "none";

document.getElementById("start").focus();
start.addEventListener("click", startGame);
input.addEventListener("input", checkInput);
