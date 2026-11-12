const gridContainer = document.getElementById("grid-container");
const newGameButton = document.getElementById("newGameButton");
const submitButton = document.getElementById("submitButton");
const shuffleButton = document.getElementById("shuffleButton");
const clues = document.getElementById("clues");
const status = document.getElementById("status");
const scoreDisplay = document.getElementById("game-score");
const timeDisplay = document.getElementById("game-time");
const hintsLeftDisplay = document.getElementById("hints-left");
const mistakeCountDisplay = document.getElementById("mistake-count");
const share =  document.getElementById("share");
const tooltip = document.getElementById("myTooltip");
const image = document.getElementById("image");
const gameContent = document.getElementById("game-content");
const HintButton = document.getElementById("GetaHintButton");
const gameOverModal = document.getElementById("game-over-modal");
const gameOverTitle = document.getElementById("game-over-title");
const resultScore = document.getElementById("result-score");
const resultTime = document.getElementById("result-time");
const playAgainButton = document.getElementById("play-again");
const leaderboardStatus = document.getElementById("score-save-status");

const ashttotara = [
  { 
    god: "गणेश",
    nama: ["गजानन", "गणाध्यक्ष", "विघ्नराज", "विनायक", "द्वैमातुर", "द्विमुख", "प्रमुख", "सुमुख", "कृती", "सुप्रदीप", "सुखनिधि", "सुराध्यक्ष", "सुरारिघ्न", "महागणपति", "मान्य", "महाकाल", "महाबल", "हेरम्ब", "लम्बजठर", "ह्रस्वग्रीव", "महोदर", "मदोत्कट", "मन्त्री", "मङ्गलस्वर", "प्रमध", "प्रमध", "प्राज्ञ", "विघ्नकर्ता", "विघ्नहर्ता", "विश्वनेता", "विराट्पति", "श्रीपति", "वाक्पति", "शृाक्पति", "अश्रितवत्सल", "शश्रितवत्सल", "शीघ्रकारी", "शाश्वत", "बाश्वत", "बलोत्थित", "भवात्मज", "पुराणपुरुष", "पूषा", "पुष्करोत्षिप्तवारी", "अग्रगण्य", "अग्रपूज्य", "अग्रगामी", "मन्त्रकृत्", "चामीकरप्रभ", "सर्व", "सर्वोपास्य", "सर्वकर्ता", "सर्वनेता", "सर्वसिद्धिप्रद", "सिद्धि", "पञ्चहस्त", "पार्वतीनन्दन", "प्रभु", "कुमारगुरु", "अक्षोभ्य", "कुञ्जरासुरभञ्जन", "प्रमोद", "मोदकप्रिय", "कान्तिमान्", "धृतिमान्", "कपित्थपनसप्रिय", "ब्रह्मचारी", "ब्रह्मरूपी", "ब्रह्मविद्यादिदानभू", "जिष्णु", "विष्णुप्रिय", "भक्तजीवित", "जितमन्मथ", "ऐश्वर्यकारण", "ज्यायस्", "यक्षकिन्नरसेवित", "गङ्गासुत", "गणाधीश", "गम्भीरनिनद", "वटु", "अभीष्टवरद", "ज्योतिस्", "भक्तनिधि", "भावगम्य", "मङ्गलप्रद", "अव्यक्त", "अप्राकृतपराक्रम", "सत्यधर्मी", "सखा", "सरसाम्बुनिधि", "महेश", "दिव्याङ्ग", "मणिकिङ्किणीमेखल", "समस्तदेवतामूर्ति", "सहिष्णु", "सततोत्थित", "विघातकारी", "विश्वग्दृक्", "विश्वग्दृक्", "कल्याणगुरु", "उन्मत्तवेष", "अपराजित", "सपराजित", "सर्वैश्वर्यप्रद", "आक्रान्तचिदचित्प्रभु", "श्री विघ्नेश्वर"]
  },
  {
    god: "हनूमान्",
    nama: ["आञ्जनेय", "महावीर", "हनूमान्", "मारुतात्मज", "तत्वज्ञानप्रद", "सीतादेवीमुद्राप्रदायक", "अशोकवनिकाच्छेत्ता", "सर्वमायाविभञ्जन", "सर्वबन्धविमोक्ता", "रक्षोविध्वंसकारक", "परविद्यापरिहार", "परशौर्यविनाशन", "परमन्त्रनिराकर्ता", "परयन्त्रप्रभेदक", "सर्वग्रहविनाशी", "भीमसेनसहायकृत्", "सर्वदुःखहर", "सर्वलोकचारी", "मनोजव", "पारिजातद्रुमूलस्थ", "सर्वमन्त्रस्वरूपवान्", "सर्वतन्त्रस्वरूपी", "सर्वयन्त्रात्मक", "कपीश्वर", "महाकाय", "सर्वरोगहर", "बलसिद्धिकर", "सर्वविद्यासम्पत्प्रदायक", "कपिसेनानायक", "भविष्यच्चतुरानन", "कुमारब्रह्मचारी", "रत्नकुण्डलदीप्तिमान्", "सञ्चलद्बालसन्नद्धलम्बमानशिखोज्ज्वल", "गन्धर्वविद्यातत्वज्ञ", "महाबलपराक्रम", "कारागृहविमोक्ता", "शृङ्खलाबन्धमोचक", "सागरोत्तारक", "प्राज्ञ", "रामदूत", "प्रतापवान्", "वानर", "केसरीसुत", "सीताशोकनिवारक", "अञ्जनागर्भसम्भूत", "बालार्कसदृशानन", "विभीषणप्रियकर", "दशग्रीवकुलान्तक", "लक्ष्मणप्राणदाता", "वज्रकाय", "महाद्युति", "चिरञ्जीवी", "रामभक्त", "दैत्यकार्यविघातक", "अक्षहन्ता", "काञ्चनाभ", "पञ्चवक्त्र", "महातपस्", "लङ्किनीभञ्जन", "श्रीमान्", "सिंहिकाप्राणभञ्जन", "गन्धमादनशैलस्थ", "लङ्कापुरविदाहक", "सुग्रीवसचिव", "धीर", "शूर", "दैत्यकुलान्तक", "सुरार्चित", "महातेजस्", "रामचूडामणिप्रद", "कामरूपी", "पिङ्गलाक्ष", "वार्धिमैनाकपूजित", "कवलीकृतमार्तण्डमण्डल", "विजितेन्द्रिय", "रामसुग्रीवसन्धाता", "महारावणमर्दन", "स्फटिकाभ", "वागधीश", "नवव्याकृतिपण्डित", "चतुर्बाहु", "दीनबन्धु", "महात्मा", "भक्तवत्सल", "सञ्जीवननगाहर्ता", "शुचि", "वाग्मी", "दृढव्रत", "कालनेमिप्रमथन", "हरिमर्कटमर्कट", "दान्त", "शान्त", "प्रसन्नात्मा", "शतकण्ठमदापहृत्", "योगी", "रामकथालोल", "सीतान्वेषणपण्डित", "वज्रदंष्ट्र", "वज्रनख", "रुद्रवीर्यसमुद्भव", "पार्थध्वजाग्रसंवासी", "शरपञ्जरभेदक", "दशबाहु", "लोकपूज्य", "जाम्बवत्प्रीतिवर्धन", "सीतासमेतश्रीरामपादसेवाधुरन्धर"]
  },
  {
    god: "विष्णु",
    nama: ["विष्णु", "लक्ष्मीपति", "वैकुण्ठ", "गरुडध्वज", "परब्रह्म", "जगन्नाथ", "वासुदेव", "त्रिविक्रम", "दैत्यान्तक", "मधुरिपु", "तार्क्ष्यवाहन", "सनातन", "नारायण", "पद्मनाभ", "हृषीकेश", "सुधाप्रद", "माधव", "पुण्डरीकाक्ष", "स्थितिकर्ता", "परात्पर", "वनमाली", "यज्ञरूप", "चक्रपाणि", "गदाधर", "उपेन्द्र", "केशव", "हंस", "समुद्रमथन", "हरि", "ब्रह्मजनक", "कैटभासुरमर्दन", "श्रीधर", "कामजनक", "शेषशायी", "चतुर्भुज", "पाञ्चजन्यधर", "श्रीमान्", "शार्ङ्गपाणि", "जनार्दन", "पीताम्बरधर", "देव", "सूर्यचन्द्रविलोचन", "मत्स्यरूप", "कूर्मतनु", "क्रोडरूप", "नृकेसरि", "वामन", "भार्गव", "बली", "कल्कि", "हयानन", "विश्वम्भर", "शिशुमार", "श्रीकर", "कपिल", "ध्रुव", "दत्तत्रेय", "अच्युत", "अनन्त", "मुकुन्द", "दधिवामन", "धन्वन्तरि", "श्रीनिवास", "प्रद्युम्न", "पुरुषोत्तम", "श्रीवत्सकौस्तुभधर", "मुराराति", "अधोक्षज", "ऋषभ", "मोहिनीरूपधारी", "सङ्कर्षण", "पृथु", "क्षीराब्धिशायी", "भूतात्मा", "अनिरुद्ध", "नर", "गजेन्द्रवरद", "त्रिधाम", "भूतभावन", "श्वेतद्वीपसुवास्तव्य", "सनकादिमुनिध्येय", "भगवान्", "शङ्करप्रिय", "नीलकान्त", "धराकान्त", "वेदात्मा", "बादरायण", "भागीरथीजन्मभूमिपादपद्म", "सतां प्रभु", "स्वभु", "विभु", "घनश्याम", "जगत्कारण", "अव्यय", "बुद्धावतार", "शान्तात्मा", "लीलामानुषविग्रह", "दामोदर", "विराड्रूप", "भूतभव्यभवत्प्रभु", "आदिदेव", "देवदेव", "प्रह्लादपरिपालक", "श्रीमहाविष्णु"]
  },
  {
    god: "शिव",
    nama: ["शिव", "महेश्वर", "शम्भु", "पिनाकी", "शशिशेखर", "वामदेव", "विरूपाक्ष", "कपर्दी", "नीललोहित", "शङ्कर", "शूलपाणी", "खट्वाङ्गी", "विष्णुवल्लभ", "शिपिविष्ट", "अम्बिकानाथ", "श्रीकण्ठ", "भक्तवत्सल", "भव", "शर्व", "त्रिलोकेश", "शितिकण्ठ", "उग्र", "कपाली", "कामारि", "अन्धकासुरसूदन", "गङ्गाधर", "ललाटाक्ष", "कालकाल", "कृपानिधि", "भीम", "परशुहस्त", "मृगपाणि", "जटाधर", "कैलासवासी", "कवची", "कठोर", "त्रिपुरान्तक", "वृषाङ्क", "वृषभारूढ", "भस्मोद्धूलितविग्रह", "सामप्रिय", "स्वरमय", "त्रयीमूर्ति", "अनीश्वर", "सर्वज्ञ", "सोमसूर्याग्निलोचन", "हविस्", "यज्ञमय", "सोम", "सदाशिव", "विश्वेश्वर", "वीरभद्र", "गणनाथ", "प्रजापति", "हिरण्यरेता", "दुर्धर्ष", "गिरीश", "अनघ", "भुजङ्गभूषण", "भर्ग", "गिरिधन्वा", "गिरिप्रिय", "कृत्तिवासा", "पुराराति", "भगवान्", "प्रमथाधिप", "मृत्युञ्जय", "सूक्ष्मतनु", "जगद्व्यापी", "व्योमकेश", "महासेनजनक", "चारुविक्रम", "रुद्र", "भूतपति", "स्थाणु", "अहिर्बुध्न्य", "दिगम्बर", "अष्टमूर्ति", "अनेकात्मा", "सात्त्विक", "शुद्धविग्रह", "शाश्वत", "खण्डपरशु", "अज", "पाशविमोचक", "मृड", "पशुपति", "महादेव", "अव्यय", "पूषदन्तभिद्", "अव्यग्र", "दक्षाध्वरहर", "हर", "भगनेत्रभित्", "अव्यक्त", "सहस्राक्ष", "सहस्रपात्", "अपवर्गप्रद", "तारक", "परमेश्वर"]
  },
  {
    god: "राम",
    nama: ["श्रीराम", "रामभद्र", "रामचन्द्र", "राजीवलोचन", "राजेन्द्र", "रघुपुङ्गव", "जानकीवल्लभ", "जैत्र", "जितामित्र", "विश्वामित्रप्रिय", "शरणत्राणतत्पर", "वालिप्रमथन", "सत्यवाक्", "सत्यविक्रम", "सत्यव्रत", "व्रतधर", "सदा हनुमदाश्रित", "कौसलेय", "खरध्वंसी", "विराधवधपण्डित", "विभीषणपरित्राता", "हरकोदण्डखण्डन", "सप्ततालप्रभेत्ता", "दशग्रीवशिरोहर", "जामदग्न्यमहादर्पदलन", "ताटकान्तक", "वेदान्तसार", "वेदात्मा", "भवरोगस्य भेषजम्", "दूषणत्रिशिरोहन्ता", "त्रिमूर्ति", "त्रिगुणात्मक", "त्रिलोकात्मा", "पुण्यचारित्रकीर्तन", "त्रिलोकरक्षक", "धन्वी", "दण्डकारण्यकर्तन", "अहल्याशापशमन", "पितृभक्त", "वरप्रद", "जितेन्द्रिय", "जितक्रोध", "ऋक्षवानरसङ्घाती", "चित्रकूटसमाश्रय", "जयन्तत्राणवरद", "सुमित्रापुत्रसेवित", "सर्वदेवादिदेव", "मृतवानरजीवन", "मायामारीचहन्ता", "महाभुज", "सर्वदेवस्तुत", "सौम्य", "ब्रह्मण्य", "मुनिसंस्तुत", "महायोगी", "सुग्रीवेप्सितराज्यद", "सर्वपुण्याधिकफल", "स्मृतसर्वाघनाशन", "आदिपुरुष", "परमपुरुषाय", "महापुरुषाय", "पुण्योदय", "दयासार", "पुराणपुरुषोत्तम", "स्मितवक्त्र", "मितभाषी", "पूर्वभाषी", "राघव", "अनन्तगुणगम्भीर", "धीरोदात्तगुणोत्तम", "मायामानुषचारित्र", "महादेवादिपूजित", "सेतुकृत्", "जितवारीश", "सर्वतीर्थमय", "श्यामाङ्ग", "सुन्दर", "पीतवासा", "धनुर्धर", "सर्वयज्ञाधिप", "यज्वी", "जरामरणवर्जित", "शिवलिङ्गप्रतिष्ठाता", "सर्वापगुणवर्जित", "परमात्मा", "सच्चिदानन्दविग्रह", "परं ज्योतिस्", "परं धाम", "पराकाश", "परेश", "पारग", "पार", "सर्वदेवात्मक", "परम्"]
  },
  {
    god: "कृष्ण",
    nama: ["श्रीकृष्ण", "कमलानाथ", "वासुदेव", "सनातन", "वसुदेवात्मज", "पुण्य", "लीलामानुषविग्रह", "श्रीवत्सकौस्तुभधर", "यशोदावत्सल", "हरि", "चतुर्भुजात्तचक्रासिगदाशङ्खाम्बुजायुध", "देवकीनन्दन", "श्रीश", "नन्दगोपप्रियात्मज", "यमुनावेगसंहारी", "बलभद्रप्रियानुज", "पूतनाजीवितहर", "शकटासुरभञ्जन", "नन्दव्रजजनानन्दी", "सच्चिदानन्दविग्रह", "नवनीतविलिप्ताङ्ग", "नवनीतनट", "अनघ", "नवनीतनवाहार", "मुचुकुन्दप्रसादक", "षोडशस्त्रीसहस्रेश", "त्रिभङ्गी", "मधुराकृति", "शुकवागमृताब्धीन्दु", "गोविन्द", "योगिपति", "धेनुकासुरभञ्जन", "तृणीकृततृणावर्त", "यमलार्जुनभञ्जन", "उत्तालतालभेत्ता", "तमालश्यामलाकृति", "योगी", "कोटिसूर्यसमप्रभ", "इलापति", "परं ज्योतिस्", "यादवेन्द्र", "यदूद्वह", "वनमाली", "पीतवासा", "पारिजातापहारक", "गोवर्धनाचलोद्धर्ता", "गोपाल", "सर्वपालक", "अज", "कामजनक", "कञ्जलोचन", "मधुघ्ना", "मथुरानाथ", "बलि", "वृन्दावनान्तसञ्चारी", "तुलसीदामभूषण", "स्यमन्तकमणेर्हर्ता", "नरनारायणात्मक", "कुब्जाकृष्णाम्बरधर", "मुष्टिकासुरचाणूरमल्लयुद्धविशारद", "संसारवैरी", "कंसारि", "मुरारि", "नरकान्तक", "अनादिब्रह्मचारी", "कृष्णाव्यसनकर्षक", "शिशुपालशिरश्छेत्ता", "दुर्योधनकुलान्तक", "विदुराक्रूरवरद", "सत्यवाक्", "सत्यसङ्कल्प", "सत्यभामारत", "जयी", "भीष्ममुक्तिप्रदायक", "जगद्गुरु", "जगन्नाथ", "वेणुनादविशारद", "वृषभासुरविध्वंसी", "बाणासुरकरान्तक", "युधिष्ठिरप्रतिष्ठाता", "बर्हिबर्हावतंसक", "पार्थसारथि", "अव्यक्त", "दामोदर", "यज्ञभोक्ता", "परब्रह्म", "पन्नगाशनवाहन", "जलक्रीडासमासक्तगोपीवस्त्रापहारक", "पुण्यश्लोक", "तीर्थकर", "वेदवेद्य", "दयानिधि", "सर्वतीर्थात्मक"]
  },
  {
    god: "लक्ष्मी",
    nama: ["प्रकृति", "विकृति", "विद्या", "सर्वभूतहितप्रदा", "श्रद्धा", "विभूति", "सुरभि", "परमात्मिका", "वाक्", "पद्मालया", "पद्मा", "शुचि", "स्वाहा", "स्वधा", "सुधा", "धन्या", "हिरण्मयी", "लक्ष्मी", "नित्यपुष्टा", "विभावरी", "अदिति", "दिति", "दीपा", "वसुधा", "वसुधारिणी", "कमला", "कान्ता", "कामाक्षी", "क्षीरोधसम्भवा", "अनुग्रहप्रदा", "बुद्धि", "हरिवल्लभा", "अशोका", "अमृता", "दीप्ता", "लोकशोकविनाशिनी", "धर्मनिलया", "करुणा", "लोकमाता", "पद्मप्रिया", "पद्महस्ता", "पद्माक्षी", "पद्मसुन्दरी", "पद्मोद्भवा", "पद्ममुखी", "पद्मनाभप्रिया", "पद्ममालाधरा", "देवी", "पद्मिनी", "पद्मगन्धिनी", "पुण्यगन्धा", "सुप्रसन्ना", "प्रसादाभिमुखी", "प्रभा", "चन्द्रवदना", "चन्द्रा", "चन्द्रसहोदरी", "चन्द्ररूपा", "इन्दिरा", "इन्दुशीतला", "आह्लादजननी", "पुष्टि", "शिवकरी", "सत्या", "विमला", "विश्वजननी", "तुष्टि", "दारिद्र्यनाशिनी", "प्रीतिपुष्करिणी", "शुक्लमाल्याम्बरा", "श्री", "भास्करी", "बिल्वनिलया", "वरारोहा", "यशस्विनी", "वसुन्धरा", "उदाराङ्गा", "हरिणी", "हेममालिनी", "धनधान्यकरी", "सिद्धि", "स्त्रैणसौम्या", "शुभप्रदा", "नृपवेश्मगतानन्दा", "वरलक्ष्मी", "वसुप्रदा", "शुभा", "हिरण्यप्राकारा", "समुद्रतनया", "जया", "मङ्गलादेवी", "विष्णुवक्षस्स्थलस्थिता", "विष्णुपत्नी", "प्रसन्नाक्षी", "नारायणसमाश्रिता", "दारिद्र्यध्वंसिनी", "देवी", "सर्वोपद्रववारिणी", "नवदुर्गा", "महाकाली", "ब्रह्माविष्णुशिवात्मिका", "त्रिकालज्ञानसम्पन्ना", "भुवनेश्वरी"]
  },
  {
    god: "सरस्वती",
    nama: ["सरस्वती", "महाभद्रा", "महामाया", "श्रीप्रदा", "पद्मनिलया", "पद्माक्षी", "पद्मवक्त्रका", "शिवानुजा", "पुस्तकभृत्", "ज्ञानमुद्रा", "कामरूपा", "महाविद्या", "महापातकनाशिनी", "महाश्रया", "मालिनी", "महाभोगा", "महाभागा", "महोत्साहा", "दिव्याङ्गा", "सुरवन्दिता", "महापाशा", "महाकारा", "महाङ्कुशा", "पीता", "विश्वा", "विद्युन्माला", "वैष्णवी", "चन्द्रिका", "चन्द्रलेखाविभूषिता", "सावित्री", "सुरसा", "दिव्यालङ्कारभूषिता", "वाग्देवी", "तीव्रा", "भोगदा", "भारती", "भामा", "गोमती", "जटिला", "विन्ध्यवासा", "विन्ध्याचलविराजिता", "चण्डिका", "ब्राह्मी", "ब्रह्मज्ञानैकसाधना", "सौदामिनी", "सुधामूर्ति", "सुभद्रा", "सुरपूजिता", "सुवासिनी", "सुनासा", "विनिद्रा", "पद्मलोचना", "विद्यारूपा", "विशालाक्षी", "ब्रह्मजाया", "महाफला", "त्रिकालज्ञा", "त्रिगुणा", "शास्त्ररूपिणी", "शुम्भासुरप्रमथिनी", "शुभदा", "स्वरात्मिका", "रक्तबीजनिहन्त्री", "चामुण्डा", "अम्बिका", "मुण्डकायप्रहरणा", "धूम्रलोचनमर्दना", "सौम्या", "सुरासुरनमस्कृता", "कालरात्रि", "कलाधारा", "रूपसौभाग्यदायिनी", "वाग्देवी", "वाराही", "वारिजासना", "चित्राम्बरा", "चित्रगन्धा", "चित्रमाल्यविभूषिता", "वन्द्या", "विद्याधरसुपूजिता", "श्वेतानना", "नीलभुजा", "चतुर्वर्गफलप्रदा", "चतुराननसाम्राज्या", "रक्तमध्या", "हंसासना", "नीलजङ्घा"]
  }
];


let numSelected, num_wrong_guesses = 0, num_found = 0, num_hint_given = 0;

let already_guessed = [], all_guess_IDs = [];

let list_hint_class = ["hinted", "hint_group1", "hint_group2", "hint_group3"];

let name_gods = [];
let gameStartedAt = null;
let gameTimer = null;
let scoreSubmitted = false;
const scoreConfig = window.NAMAVALI_SCORE_CONFIG;

function updateGameStats() {
  const elapsedMilliseconds = gameStartedAt ? Date.now() - gameStartedAt : 0;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const timeBonus = num_found === 3
    ? (scoreConfig.timeBonuses.find(bonus => elapsedMilliseconds < bonus.underSeconds * 1000)?.points || 0)
    : 0;
  const score = Math.max(
    scoreConfig.minimumScore,
    num_found * scoreConfig.groupPoints -
      num_hint_given * scoreConfig.hintPenalty -
      num_wrong_guesses * scoreConfig.mistakePenalty +
      timeBonus
  );
  scoreDisplay.textContent = String(score);
  hintsLeftDisplay.textContent = String(Math.max(0, 3 - num_hint_given));
  mistakeCountDisplay.textContent = String(num_wrong_guesses);

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  timeDisplay.textContent = `${minutes}:${seconds}`;
}


function createGame() {
  
  const name_list = [];
  name_gods = [];
  document.body.classList.remove("winner");
  status.innerHTML = ``;
  share.style.display = "none";
  image.style.display = "none";
  gameContent.hidden = false;
  gameOverModal.hidden = true;
  leaderboardStatus.className = "zatam-game-status zatam-game-status-info";
  
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
      name_gods.push(god_obj.god);
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
  num_found = 0;

  if (gameTimer) clearInterval(gameTimer);
  scoreSubmitted = false;
  if (window.zatamScore && typeof window.zatamScore.reset === "function") {
    window.zatamScore.reset();
  }
  gameStartedAt = Date.now();
  updateGameStats();
  gameTimer = setInterval(updateGameStats, 1000);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createGridItems(words) {
    gridContainer.innerHTML = "";
    words.forEach((word, index) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item"); 
        
        gridItem.textContent = word;
        gridItem.setAttribute("data-id", `item-${index}`);
        gridItem.setAttribute("data-selected", "false");
        gridItem.setAttribute("data-locked", "false");

        gridItem.addEventListener("click", function() {
            toggleSelect(gridItem);
        });
 
        gridContainer.appendChild(gridItem);
    });

}

function toggleSelect(item) {
  
  const isSelected = item.getAttribute("data-selected") === "true";
  
  if ( (isSelected == false) && (numSelected>=3) ) {
      return;
    }
  const newSelectState = isSelected ? "false" : "true";
  
  item.setAttribute("data-selected", newSelectState);
  item.classList.toggle("selected");
  if (newSelectState === "true") {
    numSelected += 1;  
  } else {
    numSelected -= 1;
  }
}

function shuffleGrid() {
    const unlockedItems = Array.from(gridContainer.querySelectorAll(".grid-item[data-locked='false']"));
    const shuffledItems = unlockedItems.sort(() => Math.random() - 0.5);

    const lockedItemPositions = new Map();
    const gridItems = gridContainer.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
        if (item.getAttribute("data-locked") === "true") {
            lockedItemPositions.set(item, index);
        }
    });

    gridContainer.innerHTML = "";
    shuffledItems.forEach((item) => {
        gridContainer.appendChild(item);
    });

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
  
  let guess = selectedGroupIDs.toSorted().join('');
  
  if (already_guessed.includes(guess)) {
    num_wrong_guesses += 1;
    status.innerHTML = num_wrong_guesses >= 4
      ? `Already guessed. Wrong guess no. ${num_wrong_guesses}. Game Over.`
      : `Already guessed. Wrong guess no. ${num_wrong_guesses}`;

    numSelected = 0;
    
    selectedItems.forEach((item, index) => {
      item.classList.remove("selected");
      item.setAttribute("data-selected", false);
    });

    updateGameStats();
    if (num_wrong_guesses >= 4) GameOver();
    return;
  }
  
  already_guessed.push(guess);
  
  all_guess_IDs.push(selectedGroupIDs);
  
  let grp1 =0, grp2=0, grp3=0;
  
  selectedGroupIDs.forEach( (IDX, ind) => {
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
  
  if (num_wrong_guesses == 4) {
    status.innerHTML = `Wrong guess no. ${num_wrong_guesses}. Game Over.`;
    
  } 
  
  if (num_found == 3) {
    status.innerHTML = `You won the Game.`;
    
    document.body.classList.add("winner");
  }
    
  const targetItems = gridContainer.querySelectorAll(".grid-item[data-locked='false']");

  selectedItems.forEach((item, index) => {

    item.classList.remove("selected");
    item.setAttribute("data-selected", false);
    
    if (success) {
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
  
  updateGameStats();
  
  if ( (num_found == 3) || (num_wrong_guesses == 4) ) {
    GameOver();
  }
  
}

function GetaHint() {
  
    if ( (num_found == 3) || (num_wrong_guesses == 4) ) {
      status.innerHTML = `Game Over!`;
      return;
    }
  
  if (num_hint_given >= 3) {
    status.innerHTML = `All hints used up.`
    return;
  }
  
  const availableItems = Array.from(gridContainer.querySelectorAll(
    ".grid-item[data-locked='false']:not(.hinted):not(.selected)"
  ));
  
  if (availableItems.length === 0) {
    status.textContent = "No unhinted names remain.";
    return;
  }
  
  const hintedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
  const hint_indx = Number(hintedItem.getAttribute("data-id").match(/\d+/)[0]);
  const group = `hint_group${Math.floor(hint_indx / 3) + 1}`;
  
  hintedItem.classList.add(group);
  hintedItem.classList.add("hinted");
  
  num_hint_given += 1;
  updateGameStats();

  const godNamesInEnglish = {
    "गणेश": "Ganesha",
    "हनूमान्": "Hanuman",
    "विष्णु": "Vishnu",
    "शिव": "Shiva",
    "राम": "Rama",
    "कृष्ण": "Krishna",
    "लक्ष्मी": "Lakshmi",
    "सरस्वती": "Saraswati"
  };
  const hintedGod = name_gods[hint_indx];
  status.textContent = `Hint ${num_hint_given}: ${hintedItem.textContent} belongs to ${godNamesInEnglish[hintedGod] || hintedGod}'s group.`;
}

async function submitScoreToLeaderboard() {
  if (scoreSubmitted) return;
  scoreSubmitted = true;
  leaderboardStatus.className = "zatam-game-status zatam-game-status-info";
  leaderboardStatus.textContent = "Saving your score...";

  const score = Number(scoreDisplay.textContent);
  const elapsedSeconds = gameStartedAt
    ? Math.floor((Date.now() - gameStartedAt) / 1000)
    : 0;
  const won = num_found === 3;
  gameOverTitle.textContent = won ? "You won!" : "Game over";
  resultScore.textContent = String(score);
  resultTime.textContent = timeDisplay.textContent;
  gameOverModal.hidden = false;
  playAgainButton.focus();

  if (!window.zatamScore || typeof window.zatamScore.submit !== "function") {
    leaderboardStatus.className = "zatam-game-status zatam-game-status-error";
    leaderboardStatus.textContent = "The leaderboard is not available right now.";
    return;
  }

  try {
    const result = await window.zatamScore.submit(score, {
      result: won ? "won" : "lost",
      metrics: {
        pointsEarned: score,
        gameTimerSeconds: elapsedSeconds,
        completedGroups: num_found,
        hintsUsed: num_hint_given,
        mistakes: num_wrong_guesses,
        won
      }
    });

    if (result && result.ok) {
      leaderboardStatus.className = "zatam-game-status zatam-game-status-success";
      leaderboardStatus.textContent = "Score saved to the leaderboard ✓";
    } else if (result && result.reason === "not-signed-in") {
      leaderboardStatus.textContent = "Sign in to save your score to the leaderboard.";
    } else if (result && result.reason === "already-submitted") {
      leaderboardStatus.className = "zatam-game-status zatam-game-status-success";
      leaderboardStatus.textContent = "Score already saved ✓";
    } else {
      leaderboardStatus.className = "zatam-game-status zatam-game-status-error";
      leaderboardStatus.textContent = "Your score could not be saved.";
    }
  } catch (error) {
    console.error("[055-namavali] Score submission failed:", error);
    leaderboardStatus.className = "zatam-game-status zatam-game-status-error";
    leaderboardStatus.textContent = "The leaderboard score could not be saved.";
  }
}

function GameOver() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  updateGameStats();
  
  const targetItems = gridContainer.querySelectorAll(".grid-item[data-locked='false']");
  
  let group, sourceIDs = [];
  
  targetItems.forEach((item, index) => {
    
    const Id = item.getAttribute("data-id");
    let id = parseInt(Id.match(/\d+/)[0]);
    sourceIDs.push(id);
    
  });
  
  sourceIDs.sort((a,b) => a-b);
  
  targetItems.forEach((targetItem, index) => {
    
      const sourceItemId = sourceIDs[index];
      const sourceItem = gridContainer.querySelector(`[data-id="item-${sourceItemId}"]`);
            
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
      
      targetItem.classList.add(group);
      targetItem.classList.add("locked");
      targetItem.setAttribute("data-locked", true);
  });

  share.style.display = "revert";
  submitScoreToLeaderboard();
}

function ShareIt() {
  
  let square = "";
  let results = "";
  all_guess_IDs.forEach((guess_ID) => {
    guess_ID.forEach((IDX) => {
      let ID = Number(IDX);
      if ( ([0,1,2]).includes(ID) ) {
        square = "🟥";
      } else if ( ([3,4,5]).includes(ID) ) {
        square = "🟩";
      } else if ( ([6,7,8]).includes(ID) ) {
        square = "🟦";
      }
      
      results += square;
    });
    results += "\n";
  });
  
  let linkURL = window.location.href;
  
  const copyText = `#Namavali game\n${results} at ${linkURL}`;
  
  navigator.clipboard.writeText(copyText);
  
   if (navigator.canShare) {
    navigator.share({
      title: 'Share results',
      text: `#Namavali game\n${results} at ${linkURL}`,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  }
  
  tooltip.innerHTML = "Results copied";
}
function outFunc() {
  tooltip.innerHTML = "Copy to clipboard";
}

share.style.display = "none";
submitButton.style.display = "none";
shuffleButton.style.display = "none";
HintButton.style.display = "none";

newGameButton.addEventListener("click", createGame);
playAgainButton.addEventListener("click", createGame);
shuffleButton.addEventListener("click", shuffleGrid);
submitButton.addEventListener("click", checkGroup);
HintButton.addEventListener("click", GetaHint);
