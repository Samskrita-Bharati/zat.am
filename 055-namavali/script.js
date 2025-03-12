const info = document.getElementById("info");
const gridContainer = document.getElementById("grid-container");
const newGameButton = document.getElementById("newGameButton");
const submitButton = document.getElementById("submitButton");
const shuffleButton = document.getElementById("shuffleButton");
const clues = document.getElementById("clues");
const status = document.getElementById("status");
const share =  document.getElementById("share");
const tooltip = document.getElementById("myTooltip");
const image = document.getElementById("image");
const HintButton = document.getElementById("GetaHintButton");

// let wordsArray = [  "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15"  ];

const ashttotara = [
  { 
    god: "Ganesh",
    nama: ["Gajanana", "Ganadhyaksha", "Vighnaraja", "Vinayaka", "Dvaimatura", "Dwimukha", "Pramukha", "Sumukha", "Kriti", "Supradipa", "Sukhanidhi", "Suradhyaksha", "Surarighna", "Mahaganapati", "Manya", "Mahakala", "Mahabala", "Heramba", "Lambajathara", "Haswagriva", "Mahodara", "Madotkata", "Mantrine", "Mangala Swara", "Pramadha", "Prathama", "Prajna", "Vighnakarta", "Vignaharta", "Vishwanetra", "Viratpati", "Shripati", "Vakpati", "Shringarin", "Ashritavatsala", "Shivapriya", "Shighrakarina", "Shashwata", "Bala", "Balotthitaya", "Bhavatmajaya", "Purana Purusha", "Pushne", "Pushkarotshipta Varine", "Agraganyaya", "Agrapujyaya", "Agragamine", "Mantrakrite", "Chamikaraprabhaya", "Sarvaya", "Sarvopasyaya", "Sarvakartre", "Sarvanetre", "Sarvasiddhipradaya", "Siddhaye", "Panchahastaya", "Parvatinadanaya", "Prabhave", "Kumaragurave", "Akshobhyaya", "Kunjarasura Bhanjanaya", "Pramodaya", "Modakapriyaya", "Kantimate", "Dhritimate", "Kapitthapanasapriyaya", "Brahmacharine", "Brahmarupine", "Brahmavidyadi Danabhuve", "Jishnave", "Vishnupriya", "Bhakta Jivitaya", "Jitamanmadhaya", "Aishwaryakaranaya", "Jyayase", "Yaksha Kinnerasevitaya", "Ganga Sutaya", "Ganadhishaya", "Gambhira Ninadaya", "Vatave", "Abhishtavaradaya", "Jyotishe", "Bhktanidhaye", "Bhavagamyaya", "Mangalapradaya", "Avyaktaya", "Aprakrita Parakramaya", "Satyadharmine", "Sakhaye", "Sarasambunidhaye", "Maheshaya", "Divyangaya", "Manikinkini Mekhalaya", "Samasta Devata Murtaye", "Sahishnave", "Satatotthitaya", "Vighatakarine", "Vishwagdrishe", "Vishwarakshakrite", "Kalyanagurave", "Unmattaveshaya", "Aparajite", "Samsta Jagadadharaya", "Sarwaishwaryapradaya", "Akranta Chida Chitprabhave", "Shri Vighneshwaraya"]
  },
  {
    god: "Hanuman",
    nama: ["Anjaneya", "Mahavira", "Hanumanta", "Marutatmaja", "Tatvagyanaprada", "Sitadevi Mudrapradayaka", "Ashokavanakachhetre", "Sarvamayavibhanjana", "Sarvabandha Vimoktre", "Rakshovidhwansakaraka", "Paravidyaparihara", "Parashaurya Vinashana", "Paramantra Nirakartre", "Parayantra Prabhedaka", "Sarvagraha Vinashi", "Bheemasenasahayakruthe", "Sarvadukhahara", "Sarvalolkacharine", "Manojavaya", "Parijata Drumoolastha", "Sarvamantra Swaroopavate", "Sarvatantra Swaroopine", "Sarvayantratmaka", "Kapeeshwara", "Mahakaya", "Sarvarogahara", "Balasiddhikara", "Sarvavidya Sampattipradayaka", "Kapisenanayaka", "Bhavishyath Chaturanana", "Kumarabrahmachari", "Ratnakundala Deeptimate", "Chanchaladwala sannaddha-lambamaana shikhojwala", "Gandharvavidya Tatvangna", "Mahabala Parakrama", "Karagrahavimoktre", "Shrunkhalabandhamochaka", "Sagarotharaka", "Pragnya", "Ramaduta", "Pratapavate", "Vanara", "Kesarisuta", "Sitashoka Nivaraka", "Anjanagarbhasambhoota", "Balarka Sadrashanana", "Vibheeshanapriyakara", "Dashagreevakulantaka", "Lakshmanapranadatre", "Vajrakaya", "Mahadyuta", "Chiranjeevini", "Ramabhakta", "Daityakarya Vighataka", "Akshahantre", "Kanchanabha", "Panchavaktra", "Mahatapasi", "Lankineebhanjana", "Shrimate", "Simhikaprana Bhanjana", "Gandhamadana Shailastha", "Lankapuravidahaka", "Sugreeva Sachiva", "Dheera", "Shoora", "Daityakulantaka", "Surarchita", "Mahatejasa", "Ramachudamaniprada", "Kamaroopine", "Pingalaksha", "Vardhimainakapujita", "Kabalikruta Martanda-Mandalaya", "Vijitendriya", "Ramasugreeva Sandhatre", "Maharavanamardana", "Sphatikabha", "Vagadheesha", "Navavyakruta Pandita", "Chaturbahave", "Deenabandhuraya", "Mahatmane", "Bhakthavatsala", "Sanjeevananagahatre", "Shuchaye", "Vagmine", "Dridhavrata", "Kalanemi Pramathana", "Harimarkatamarkata", "Danta", "Shanta", "Prasannatmane", "Shatakanttamadapahate", "Yogi", "Ramakathalolaya", "Sitanveshana Pandita", "Vajradranushta", "Vajranakha", "Rudraveerya Samudbhava", "Parthadhwajagrasamvasine", "Sharapanjarabhedaka", "Dashabahave", "Lokapujya", "Jambavatpreeti Vardhana", "Sitaramapadaseva"]
  },
  {
    god: "Vishnu",
    nama: ["Vishnu", "Lakshmipati", "Vaikuntha", "Garudadhwaja", "Parabrahma", "Jagannatha", "Vasudeva", "Trivikrama", "Daityantaka", "Madhuri", "Tarkshyavahanaya", "Sanatana", "Narayana", "Padmanabha", "Hrishikesha", "Sudhapradaya", "Madhava", "Pundarikaksha", "Sthitikarta", "Paratpara", "Vanamali", "Yajnarupa", "Chakrapanaye", "Gadadhara", "Upendra", "Keshava", "Hamsa", "Samudramathana", "Haraye", "Brahmajanaka", "Kaitabhasuramardana", "Shridhara", "Kamajanaka", "Sheshashayini", "Chaturbhuja", "Panchajanyadhara", "Shrimata", "Sharngapana", "Janardana", "Pitambaradhara", "Deva", "Suryachandravilochana", "Matsyarupa", "Kurmatanave", "Krodarupa", "Nrikesari", "Vamana", "Bhargava", "Bali", "Kalki", "Hayanana", "Vishwambhara", "Shishumara", "Shrikara", "Kapila", "Dhruva", "Dattatreya", "Achyuta", "Ananta", "Mukunda", "Dadhivamana", "Dhanvantari", "Shrinivasa", "Pradyumna", "Purushottama", "Shrivatsakaustubhadhara", "Murarata", "Adhokshaja", "Rishabha", "Mohinirupadhari", "Sankarshana", "Prithvi", "Kshirabdhishayini", "Bhutatma", "Aniruddha", "Nara", "Gajendravarada", "Tridhamne", "Bhutabhavana", "Shwetadwipasuvastavyaya", "Sankadimunidhyeyaya", "Bhagavata", "Shankarapriya", "Nilakanta", "Dharakanta", "Vedatmana", "Badarayana", "Bhagirathijanmabhumi Padapadma", "Satam Prabhave", "Swabhuve", "Vibhava", "Ghanashyama", "Jagatkaranaya", "Avyaya", "Buddhavatara", "Shantatma", "Lilamanushavigraha", "Damodara", "Viradrupa", "Bhutabhavyabhavatprabha", "Adideva", "Devadeva", "Prahladaparipalaka", "Shrimahavishnu"]
  },
  {
    god: "Shiva",
    nama: ["Shiva", "Maheshwara", "Shambhu", "Pinakin", "Shashi Shekhara", "Vamadeva", "Virupaksha", "Kapardi", "Nilalohita", "Shankara", "Shulapani", "Khatvangi", "Vishnuvallabha", "Shipivishta", "Ambikanatha", "Shrikantha", "Bhaktavatsala", "Bhava", "Sharva", "Trilokesha", "Shitikantha", "Ugra", "Kapali", "Kamari", "Andhakasura Sudana", "Gangadhara", "Lalataksha", "Kalakala", "Kripanidhi", "Bheema", "Parshuhasta", "Mrigpaani", "Jattadhar", "Kailasavasi", "Kawachi", "Kathor", "Tripurantak", "Vrishanka", "Vrishbharudh", "Bhasmodhulitavigrah", "Samapriya", "Swaramayi", "Trayimurti", "Anishvara", "Sarvagya", "Somasuryaagnilochana", "Havi", "Yagyamaya", "Soma", "Sadashiva", "Vishveshwara", "Veerabhadra", "Gananatha", "Prajapati", "Hiranyareta", "Durdharsha", "Girisha", "Anagha", "Bujangabhushana", "Bharga", "Giridhanva", "Giripriya", "krittivasaa", "Purarati", "Bhagwaan", "Pramathadhipa", "Mrityunjaya", "Sukshamatanu", "Jagadvyapi", "Vyomakesha", "Mahasenajanaka", "Charuvikrama", "Rudra", "Bhootapati", "Sthanu", "Ahirbhudhanya", "Digambara", "Ashtamurti", "Anekatma", "Sattvika", "Shuddhavigraha", "Shashvata", "Khandaparshu", "Aja", "Pashvimochana", "Mrida", "Pashupati", "Mahadeva", "Avayaya", "Bhagnetrabhid", "Avayayat", "Dakshadhwarahara", "Har", "Pushadantabhit", "Avyagra", "Sahsraksha", "Sahasrapada", "Apavargaprada", "Taraka", "Parameshwara"]
  },
  {
    god: "Rama",
    nama: ["Shree Rama", "Ramabhadra", "Ramachandra", "Rajeevalochana", "Rajendra", "Raghupungava", "Janakivallabha", "Jaitra", "Jitamitra", "Vishwamitrapriya", "Sharanatrana Tatpara", "Valipramathana", "Satyavache", "Satyavikrama", "Satyavrata", "Vratadhara", "Sada Hanumadashrita", "Kausaleya", "Kharadhwamsi", "Viradhavadhapandita", "Vibheeshanaparitrata", "Harakodandakhandana", "Saptatalaprabhetta", "Dashagreeva Shirohara", "Jamadagnya Mahadarpadalana", "Tatakantaka", "Vedantasara", "Vedatma", "Bhavarogasya Bheshajam", "Dooshanatrishirohanta", "Trimurti", "Trigunatmaka", "Trilokatma", "Punyacharitra Keertana", "Trilokarakshaka", "Dhanvi", "Dandakaranya Kartana", "Ahalyashapashamana", "Pitrabhakta", "Varaprada", "Jitendriya", "Jitakrodha", "Rikshavanara Sanghati", "Chitrakoot Samashraya", "Jayantatranavarada", "Sumitraputra Sevita", "Sarvadevadideva", "Mrutavanarajeevana", "Mayamareechahanta", "Mahabhuja", "Sarvadevastuta", "Soumya", "Brahmanya", "Munisanstuta", "Mahayogi", "Sugreevepsita Rajyada", "Sarva Punyadhikaphala", "Smrita Sarvaghanashana", "Adipurusha", "Paramapurusha", "Mahapurusha", "Punyodaya", "Dayasara", "Puranapurushottama", "Smitavaktra", "Mitabhashi", "Purvabhashi", "Raghava", "Anantaguna Gambhira", "Dheerodatta Gunottama", "Mayamanushacharitra", "Mahadevadipujita", "Setukrute", "Jitavarashaya", "Sarvatirthamaya", "Shyamanga", "Sundara", "Peetavasa", "Dhanurdhara", "Sarvayagyadhipa", "Yajvane", "Jaramarana Varjita", "Shivalingapratishthata", "Sarvapagunavarjita", "Paramatma", "Sachidananda Vigraha", "Paramjyoti", "Paramdhama", "Parakasha", "Paresha", "Paraga", "Para", "Sarvadevatmaka", "Parasme"]
  },
  {
    god: "Krishna",
    nama: ["Krishna", "Kamalanatha", "Sanatan", "Vasudevatmaja", "Punya", "Lila-manush-vigraha", "Shrivatsa kausthubadharya", "Yashoda vatsala", "Hari", "Chaturbujat Chakrasigada", "Shakhambuja Ayudhaya", "Devakinandana", "Shrisay", "Nandagopa Priyatmaja", "Yamunavega samhar", "Balabhadra Priyanuja", "Putanajivitahara", "Shakatasura bhanjana", "Nandavraja jananandin", "Sachidanand vigraha", "Navanit viliptanga", "Navanita-natana", "Muchukunda Prasadaka", "Shodashastri sahasresha", "Tribhangi", "Madhurakrut", "Shukavagamritabdindave", "Govinda", "Yoginampati", "Vatsavaata charaya", "Dhenukasura-bhanjanaya", "Trni-Krta-Trnavarta", "Yamalarjuna bhanjana", "Uttalottalabhetre", "Tamala-shyamala-kruta", "Gopa Gopishwara", "Koti-surya-samaprabha", "Ilapati", "Parasmai jyotish", "Yadavendra", "Yadudvahaya", "Vanamaline", "Pita vasase", "Parijatapa Harakaya", "Govardhanchalo Dhartreya", "Gopala", "Sarva palakaya", "Ajaya", "Niranjana", "Kanjalochana", "Madhughne", "Mathuranatha", "Dvarakanayaka", "Vrindavananta sancharine", "Tulasidama bhushanaya", "Syamantaka-maner-hartre", "Narnarayanatmakaya", "Kubja Krishnambaradharaya", "Mayine", "samsara-vairi", "Kamsarir", "Murara", "Narakantakah", "Anadi brahmacharika", "Krishnavyasana-karshakah", "Shishupala-shirashchetta", "Duryodhana-kulantakrit", "Vidurakrura-varada", "Vishvarupa-pradarshakah", "Satya sankalpah", "Satyabhamarata", "Jayi", "Subhadra purvajah", "Bhishma mukti Pradayaka", "Jagadguru", "venu-nada-visharada", "Vrishabhasura vidhvamsi", "banasura karantakrit", "Yudhishthira pratishthatre", "Barhi Barhavatamsaka", "Parthasarthi", "Avyakta", "Gitamrita Mahodadhi", "Yajnabhokta", "Danavendra Vinashaka", "Pannagashana vahana", "Jalakrida samasakta gopivastra pararaka", "Punya-Shloka", "Tirthakara", "Vedvedya", "Dayanidhi", "Sarvabhutatmaka", "Sarvagraharupi"]
  },
  {
    god: "Lakshmi",
    nama: ["Prakriti", "Vikriti", "Vidya", "Sarvabhutahitaprada", "Shraddha", "Vibhuti", "Surabhi", "Paramatmika", "Vachi", "Padmalaya", "Padma", "Shuchi", "Swaha", "Swadha", "Sudha", "Dhanya", "Hiranmayi", "Lakshmi", "NityaPushta", "Vibha", "Aditya", "Ditya", "Dipa", "Vasudha", "Vasudharini", "Kamala", "Kanta", "Kamakshi", "Kshirodhasambhava Krodhasambhava", "Anugrahaprada", "Buddhi", "Harivallabhi", "Ashoka", "Amrita", "Dipta", "Lokashokavinashini", "Dharmanilaya", "Karuna", "Lokamatri", "Padmapriya", "Padmahasta", "Padmakshya", "Padmasundari", "Padmodbhava", "Padmamukhi", "Padmanabhapriya", "Rma", "Padmamaladhara", "Devi", "Padmini", "Padmagandhini", "Punyagandha", "Suprasanna", "Prasadabhimukhi", "Prabha", "Chandravadana", "Chandra", "Chandrasahodari", "Chandrarupa", "Indira", "Indusheetala", "Ahladajanani", "Pushti", "Shivakari", "Satya", "Vimala", "Vishwajanani", "Tushti", "Daridryanashini", "Pritipushkarini", "Shuklamalyambara", "Shri", "Bhaskari", "Bilvanilaya", "Vararoha", "Yashaswini", "Vasundhara", "Udaranga", "Harini", "Hemamalini", "Dhanadhanyaki", "Siddhi", "Strainasoumya", "Shubhaprada", "Nripaveshmagatananda", "Varalakshmi", "Vasuprada", "Shubha", "Hiranyaprakara", "Samudratanaya", "Jaya", "Mangala Devi", "Vishnuvakshassthalasthita", "Vishnupatni", "Prasannakshi", "Narayanasamashrita", "Daridryadhwamsini", "Sarvopadrava Varini", "Navadurga", "Mahakali", "Brahmavishnushivatmika", "Trikalajnanasampanna", "Bhuvaneshwari"]
  },
  {
    god: "Saraswati",
    nama: ["Saraswati", "Mahabhadra", "Mahamaya", "Shripada", "Padmanilaya", "Padmakshi", "Padmavaktraga", "Shivanuja", "Pustakabhrita", "Jnanamudra", "Kamarupa", "Mahavidya", "Mahapataka Nashini", "Mahashraya", "Malini", "Mahabhoga", "Mahabhaga", "Mahotsaha", "Divyanga", "Suravandita", "Mahapasha", "Mahakara", "Mahankusha", "Pita", "Vishwa", "Vidyunmala", "Vaishnavi", "Chandrika", "Chandralekha Vibhushita", "Savitri", "Surasa", "Divyalankarabhushita", "Vagdevi", "Tivra", "Bhogada", "Bharati", "Bhama", "Gomati", "Jatila", "Vindhyavasa", "Vindhyachalavirajita", "Chandika", "Brahmi", "Brahmajnanaikasadhana", "Saudamini", "Sudhamurti", "Subhadra", "Surapujita", "Suvasini", "Sunasa", "Vinidra", "Padmalochana", "Vidyarupa", "Vishalakshi", "Brahmajaya", "Mahaphala", "Trikalajna", "Triguna", "Shastrarupini", "Shumbhasura-Pramathini", "Shubhada", "Swaratmika", "Raktabijanihantri", "Chamunda", "Ambika", "Mundakayapraharana", "Dhumralochanamardana", "Saumya", "Surasura Namaskrita", "Kalaratri", "Kaladhara", "Rupasaubhagyadayini", "Varahi", "Varijasana", "Chitrambara", "Chitragandha", "Chitramalyavibhushita", "Kamaprada", "Vandya", "Vidyadharasupujita", "Shwetanana", "Nilabhuja", "Chaturvargaphalaprada", "Chaturanana Samrajya", "Raktamadhya", "Hamsasana", "Nilajangha"]
  }
];


let numSelected, num_wrong_guesses = 0, num_found = 0, num_hint_given = 0;

let already_guessed = [], all_guess_IDs = [], results = [];

let list_hint_class = ["hinted", "hint_group1", "hint_group2", "hint_group3", "hint_group4"];

let name_list = [];

let lastPlayedTs;


function createGame() {

  var today = new Date();
  
  if ( Na(new Date(lastPlayedTs), today) < 1) {
    alert("Play a new puzzle tomorrow!")
    return;
  }
  
  // const inputWords = prompt("Enter 16 words separated by spaces:");
  // let word_list = wordsArray[0].split(" ").map((word) => word.trim());
  name_list = [];
  document.body.className = "";
  status.innerHTML = ``;
  info.innerHTML = ``;
  share.style.display = "none";
  image.style.display = "none";
  
  let num_gods = ashttotara.length;
  
  let rnd_indices = Array.from({length: num_gods}, (x, i) => i);
  shuffle(rnd_indices);
  
  clues.innerHTML = `Gods: `
  
  for(let i=0; i < 3; i++) {
    let god_index = rnd_indices[i];
    
    let god_obj = ashttotara[god_index];
    
    const clue = document.createElement("span");
    clue.classList.add(`group${i+1}`); 
    clue.textContent = ` ${god_obj.god} `;
    clues.appendChild(clue);
    
    // let nm_indices = Array.from({length: god.nama.length}, (x, i) => i);
    // shuffle(nm_indices);
    let ids = [];
    
    for(let j=0; j<3; j++){
      
      let nm_indx = Math.floor(Math.random() * god_obj.nama.length);
      
      if (ids.includes(nm_indx)) {
        if (nm_indx!=0){
          nm_indx = nm_indx-1;
        } else {
          nm_indx = god_obj.nama.length-1 ;
        }
      }
      ids.push(nm_indx);
      
      name_list.push(god_obj.nama[nm_indx]);
    }
  }
  
  createGridItems(name_list);
  shuffleGrid();
  
  submitButton.style.display = "revert";
  shuffleButton.style.display = "revert";
  HintButton.style.display = "revert";
  
  numSelected = 0;
  num_wrong_guesses = 0;
  num_hint_given = 0;
  already_guessed = [];
  all_guess_IDs = [];
//  selectedGroupIDs = [];   
  num_found = 0;
  results = [];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to create grid items
function createGridItems(words) {
    gridContainer.innerHTML = "";
    words.forEach((word, index) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item"); 
        
        gridItem.textContent = word; //.toUpperCase();
        // gridItem.draggable = true;
        gridItem.setAttribute("data-id", `item-${index}`);
        gridItem.setAttribute("data-selected", "false"); // Set data-selected attribute to "false" initially
        gridItem.setAttribute("data-locked", "false"); // Set data-locked attribute to "false" initially

        gridItem.addEventListener("click", function() {
            toggleSelect(gridItem);
        });
 
        gridContainer.appendChild(gridItem);
    });

}

// Function to toggle item lock
function toggleSelect(item) {
  
  const isSelected = item.getAttribute("data-selected") === "true";
  
  if ( (isSelected == false) && (numSelected>=3) ) {
      return;
    }
  const newSelectState = isSelected ? "false" : "true";
  
//  console.info(`Current state ${isSelected}`);
  
  item.setAttribute("data-selected", newSelectState);
  item.classList.toggle("selected");
//  item.draggable = newLockState === "false";
  if (newSelectState === "true") {
    numSelected += 1;  
  } else {
    numSelected -= 1;
  }
}

// Function to shuffle unlocked items
function shuffleGrid() {
    const unlockedItems = Array.from(gridContainer.querySelectorAll(".grid-item[data-locked='false']"));
    const shuffledItems = unlockedItems.sort(() => Math.random() - 0.5);

    // Create a map of locked item positions
    const lockedItemPositions = new Map();
    const gridItems = gridContainer.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
        if (item.getAttribute("data-locked") === "true") {
            lockedItemPositions.set(item, index);
        }
    });

    // Rearrange the unlocked items randomly
    gridContainer.innerHTML = "";
    shuffledItems.forEach((item) => {
        gridContainer.appendChild(item);
    });

    // Restore locked items to their original positions
    lockedItemPositions.forEach((index, item) => {
        gridContainer.insertBefore(item, gridContainer.children[index]);
    });
};



function checkGroup() {
  
  if ( (num_found == 3) || (num_wrong_guesses >= 4) ) {
    
    status.innerHTML = `Game Over. Start a new one?`;
    console.log('Game Over');
    
    return;
  }
  if (numSelected !=3){
    
    status.innerHTML = `Select 3 items`;
    return;
  }
  
  let selectedGroupIDs = [];

  const selectedItems = gridContainer.querySelectorAll(".grid-item[data-selected='true']");
  
  selectedItems.forEach((item, index) => {
    const selectedItemId = item.getAttribute("data-id");
    selectedGroupIDs.push(selectedItemId.match(/\d+/)[0]);
  });
  
//  console.info(selectedGroupIDs);
  
  let guess = selectedGroupIDs.toSorted().join('');
//  guess = guess.sort().join('');
//  console.log(guess);
//  selectedGroupIDs = [];
  
  if (already_guessed.includes(guess)) {
    
    status.innerHTML = `Already guessed`;
    console.log('Already guessed');
    
    numSelected = 0;
    
    selectedItems.forEach((item, index) => {
      item.classList.remove("selected");
      item.setAttribute("data-selected", false);
    });
    
    return;
  }
  
  already_guessed.push(guess);
  
  all_guess_IDs.push(selectedGroupIDs);
  
  let grp1 =0, grp2=0, grp3=0;
  
  selectedGroupIDs.forEach( (IDX, ind) => {
    // console.log(IDX);
    let ID = Number(IDX);
    if ( ([0,1,2]).includes(ID) ) {
      grp1 += 1;
    } else if ( ([3,4,5]).includes(ID) ) {
      grp2 += 1;
    } else if ( ([6,7,8]).includes(ID) ) {
      grp3 += 1;
    }
  });
  
  let success = false, group;
  
  if ( (grp1==3) || (grp2==3) || (grp3==3) ) {
    
    success = true;
    num_found += 1;
    console.log('Found a group');
    status.innerHTML = `Found a group`;
    
  } else if ( (grp1==2) || (grp2==2) || (grp3==2)  ) {
    
    success = false;
    num_wrong_guesses += 1;
    console.log(`One Away. Wrong guess no. ${num_wrong_guesses}`);
    status.innerHTML = `Just miss! Wrong guess no. ${num_wrong_guesses}`;
    
  } else {
    
    num_wrong_guesses += 1;
    console.log(`Wrong guess no. ${num_wrong_guesses}`);
    
    if (num_wrong_guesses == 3)
      status.innerHTML = `Wrong guess no. ${num_wrong_guesses}. Last chance!`;
    else 
      status.innerHTML = `Wrong guess no. ${num_wrong_guesses}`;

  }

  if (grp1 == 3) {
    group = "group1";
  } else if (grp2 == 3) {
    group = "group2";
  } else if (grp3 == 3) {
    group = "group3";
  }
  
/*  
  if (guess == '0123') {
    success = true;
    group = "group1";
    num_found += 1;
    console.log('Found group 1');
    status.innerHTML = `Found a group`;
    
  } else if (guess == '4567') {
    success = true;
    group = "group2";
    num_found += 1;
    console.log('Found group 2');
    status.innerHTML = `Found a group`;
    
  } else if (guess == '101189') {
    success = true;
    group = "group3";
    num_found += 1;
    console.log('Found group 3');
    status.innerHTML = `Found a group`;
    
  } else if (guess == '12131415') {
    success = true;
    group = "group4";
    num_found += 1;
    console.log('Found group 4');
    status.innerHTML = `Found a group`;
    
  } else {
    
    num_wrong_guesses += 1;
    
    console.log(`Wrong guess no. ${num_wrong_guesses}`);
    
    if (num_wrong_guesses < 4)
      status.innerHTML = `Wrong guess no. ${num_wrong_guesses}`;
    else
      status.innerHTML = `Wrong guess no. ${num_wrong_guesses}. Game Over.`;
    
  } */
  
  if (num_wrong_guesses == 4) {
    status.innerHTML = `Wrong guess no. ${num_wrong_guesses}. Game Over.`;
    
  } 
  
  if (num_found == 3) {
    status.innerHTML = `You won the Game.`;
    
    document.body.className = "winner";
  }
    
  // const selectedItems = gridContainer.querySelectorAll(".selected");
  const targetItems = gridContainer.querySelectorAll(".grid-item[data-locked='false']");

  selectedItems.forEach((item, index) => {

    item.classList.remove("selected");
    item.setAttribute("data-selected", false);
    
    if (success) {
      // const sourceItemId = item.dataTransfer.getData("text/plain");
      // const sourceItem = gridContainer.querySelector(`[data-id="${sourceItemId}"]`);
      // const targetItemId = e.target.getAttribute("data-id");
      // const targetItem = gridContainer.querySelector(`[data-id="${targetItemId}"]`);
      const targetItem = targetItems[index];
            
      if (item && targetItem && !targetItem.classList.contains("locked")) {

        const tempText = item.textContent;
        item.textContent = targetItem.textContent;
        targetItem.textContent = tempText;

        const new_targetID = item.getAttribute("data-id");
        const new_sourceID = targetItem.getAttribute("data-id");
        item.setAttribute("data-id",new_sourceID);
        targetItem.setAttribute("data-id",new_targetID);
        
        
        list_hint_class.forEach((tag, index) => {
          
          let tar_hinted = targetItem.classList.contains(tag);
          let src_hinted = item.classList.contains(tag);

          if ( (tar_hinted) && !(src_hinted) ){
            item.classList.add(tag);
            targetItem.classList.remove(tag);
          }
          if ( (src_hinted) && !(tar_hinted) ){
            item.classList.remove(tag);
            targetItem.classList.add(tag);
          }
          
        });
        
     }
      
      targetItem.classList.add(group);
      targetItem.classList.add("locked");
      targetItem.setAttribute("data-locked", true);
      
    }
  });

  numSelected = 0;
  
  
  if ( (num_found == 3) || (num_wrong_guesses == 4) ) {
    GameOver();
  }
  
}

function GetaHint() {
  
    if ( (num_found == 3) || (num_wrong_guesses == 4) ) {
      status.innerHTML = `Game Over!`;
      return;
    }
  
  const solvedHints = gridContainer.querySelectorAll(".hinted.locked");
  let num_solved_hints = solvedHints.length;
  
  if ((num_hint_given + num_found - num_solved_hints) >= 3) {
    status.innerHTML = `All hints used up.`
    return;
  }
  
  const unsolvedItems = gridContainer.querySelectorAll(".grid-item[data-locked='false']");
  
  let group, unsolvedIDs = [];
  
  unsolvedItems.forEach((item, index) => {
    
    const Id = item.getAttribute("data-id");
    let id = parseInt(Id.match(/\d+/)[0]);
    unsolvedIDs.push(id);
    
  });
  
  unsolvedIDs.sort((a,b) => a-b);
  
  let num_unsolved_hints = num_hint_given - num_solved_hints;
  
  let hint_indx = unsolvedIDs[num_unsolved_hints * 3 + num_unsolved_hints];
  
  let hintedItem = gridContainer.querySelector(`[data-id="item-${hint_indx}"]`);
  
  if ( ([0,1,2]).includes(hint_indx) ) {
    group = "hint_group1";
  } else if ( ([3,4,5]).includes(hint_indx) ) {
    group = "hint_group2";
  } else if ( ([6,7,8]).includes(hint_indx) ) {
    group = "hint_group3";
  }
  
  hintedItem.classList.add(group);
  hintedItem.classList.add("hinted");
  
  num_hint_given += 1;
  
  status.innerHTML = `Hint ${num_hint_given} used.`
}

function GameOver() {
  
  const targetItems = gridContainer.querySelectorAll(".grid-item[data-locked='false']");
  
  let group, sourceIDs = [];
  
  targetItems.forEach((item, index) => {
    
    const Id = item.getAttribute("data-id");
    let id = parseInt(Id.match(/\d+/)[0]);
    sourceIDs.push(id);
    
  });
  
  sourceIDs.sort((a,b) => a-b);
  // console.log("Items left out: " sourceIDs);
  
  targetItems.forEach((targetItem, index) => {
    
      const sourceItemId = sourceIDs[index];
      const sourceItem = gridContainer.querySelector(`[data-id="item-${sourceItemId}"]`);
      // const targetItemId = targetItem.getAttribute("data-id");
      // const targetItem = gridContainer.querySelector(`[data-id="${targetItemId}"]`);
            
      if ( sourceItem && targetItem && (sourceItem !== targetItem) ) {
        
          const tempText = sourceItem.textContent;
          sourceItem.textContent = targetItem.textContent;
          targetItem.textContent = tempText;
        
          const new_targetID = sourceItem.getAttribute("data-id");
          const new_sourceID = targetItem.getAttribute("data-id");
          sourceItem.setAttribute("data-id",new_sourceID);
          targetItem.setAttribute("data-id",new_targetID);
      } 
    
      list_hint_class.forEach((tag, index) => {

        let tar_hinted = targetItem.classList.contains(tag);
        let src_hinted = sourceItem.classList.contains(tag);

        if ( (tar_hinted) && !(src_hinted) ){
          sourceItem.classList.add(tag);
          targetItem.classList.remove(tag);
        }
        if ( (src_hinted) && !(tar_hinted) ){
          sourceItem.classList.remove(tag);
          targetItem.classList.add(tag);
        }

      });
    
      if ( ([0,1,2]).includes(sourceItemId) ) {
        group = "group1";
      } else if ( ([3,4,5]).includes(sourceItemId) ) {
        group = "group2";
      } else if ( ([6,7,8]).includes(sourceItemId) ) {
        group = "group3";
      }
      
    //  targetItem.classList.remove("group1 group2 group3 group4");
      targetItem.classList.add(group);
      targetItem.classList.add("locked");
      targetItem.setAttribute("data-locked", true);
  });
  /*
  let hinted = gridContainer.querySelectorAll(".hinted");
  hinted.forEach((item, index) => {
    item.classList.remove("hint_group1");
    item.classList.remove("hint_group2");
    item.classList.remove("hint_group3");
    item.classList.remove("hint_group4");
  });*/

  lastPlayedTs = new Date();

  save_history();
  
  share.style.display = "revert";
  share.focus();
  ShareIt();
}

let copyText

function ShareIt() {
  
  // Share your results
  let sq = [];
  results = ""
  all_guess_IDs.forEach((guess_ID, index) => {
    // console.log(guess_ID);
    guess_ID.forEach( (IDX, ind) => {
      // console.log(IDX);
      let ID = Number(IDX);
      if ( ([0,1,2]).includes(ID) ) {
        sq = "🟥"; // "\u1F7E5"
      } else if ( ([3,4,5]).includes(ID) ) {
        sq = "🟩"; // "\u1F7E9"
      } else if ( ([6,7,8]).includes(ID) ) {
        sq = "🟦"; // "\u1F7E6"
      }
      
      results += sq;
    });
    results += "\n";
  });
  
  let linkURL = window.location.href;
  
  copyText = `#Namavali game\n${results} at ${linkURL}`;
  
  navigator.clipboard.writeText(copyText);
  
   if (navigator.canShare) {
    navigator.share({
      title: 'Share results',
      text: `#Namavali game\n${results} at ${linkURL}`,
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

document.addEventListener("keypress", function onPress(event) {
    if (event.key === "@") {
      console.log("cheat code for testing game");
      num_found = 3;
      GameOver();
      return;
    }
});

function Na(e, a) {
    var s = new Date(e);
    var t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
    return Math.round(t / 864e5);
}

function get_history() {
  const noItemsFound_lastPlayedTs = 0;
  const lpts = localStorage.getItem('lpts') || noItemsFound_lastPlayedTs;
  
  lastPlayedTs = JSON.parse(lpts);
}

function save_history() {
  const lpts = JSON.stringify(lastPlayedTs);
  localStorage.setItem('lpts', lpts);
}

get_history();

share.style.display = "none";
submitButton.style.display = "none";
shuffleButton.style.display = "none";
HintButton.style.display = "none";

// Function to handle input
newGameButton.addEventListener("click", createGame);
shuffleButton.addEventListener("click", shuffleGrid);
submitButton.addEventListener("click", checkGroup);
HintButton.addEventListener("click", GetaHint);
