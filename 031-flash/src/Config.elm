module Config exposing
    ( allSubjects
    , configDecoder
    , defaultModel
    , readScript
    , readTrainMode
    , scriptHeading
    , showTrainMode
    )

import Card exposing (..)
import Dict
import Html exposing (..)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (optional, required)
import List.Nonempty as NEL exposing (Nonempty(..))
import Types exposing (..)


defaultModel : Model
defaultModel =
    { config = defaultConfig
    , settings = { trainMode = Review, script = Latin }
    , remainingDeck = invalidCards
    , previousDeck = []
    , userAnswer = Nothing
    , total = 0
    , score = 0
    , inSettingsScreen = True
    , showAudio = True
    }


configDecoder : Decoder Config
configDecoder =
    let
        trainModeDecoder : Decoder TrainMode
        trainModeDecoder =
            Decode.map
                (\s ->
                    case s of
                        "Review" ->
                            Review

                        "Urname" ->
                            Urname

                        "LocalName" ->
                            LocalName

                        "Description" ->
                            Description

                        _ ->
                            Review
                )
                string

        scriptDecoder : Decoder Script
        scriptDecoder =
            Decode.map
                (\s ->
                    case s of
                        "Latin" ->
                            Latin

                        "Unicode" ->
                            Unicode

                        _ ->
                            Latin
                )
                string

        subjectDecoder : Decoder Subject
        subjectDecoder =
            Decode.succeed Subject
                |> required "subjectId" int
                |> optional "imageUrl" (nullable string) Nothing
                |> optional "audioUrl" (nullable string) Nothing
                |> required "unicode" string
                |> required "latin" string
                |> required "localName" string
                |> required "description" string
    in
    Decode.succeed Config
        |> required "deckId" string
        |> required "deckTitle" string
        |> optional "landingPage" (nullable string) Nothing
        |> required "initialScript" scriptDecoder
        |> required "scriptCanBeSet" bool
        |> optional "showDescriptionWithUrNameQuiz" bool True
        |> optional "showAudioWithUrNameQuiz" bool True
        |> optional "showDescriptionWithLocalNameQuiz" bool True
        |> optional "showAudioWithLocalNameQuiz" bool True
        |> optional "showDescription" bool True
        |> optional "showAudio" bool True
        |> required "trainingModes" (list trainModeDecoder)
        |> required "pluralSubjectName" string
        |> required "copyrightNotice" string
        |> required "numChoices" int
        |> required "trainModeDisplay" (dict string)
        |> required "scriptHeading" string
        |> optional "mainPartFontSize" (nullable string) Nothing
        |> required "allSubjects"
            (Decode.map
                (Maybe.withDefault invalidSubjectList
                    << NEL.fromList
                )
                (list subjectDecoder)
            )


showTrainMode : Config -> TrainMode -> String
showTrainMode cfg trainMode =
    let
        modeAsString =
            case trainMode of
                Review ->
                    "Review"

                Urname ->
                    "Urname"

                LocalName ->
                    "LocalName"

                Description ->
                    "Description"
    in
    Maybe.withDefault "invalid" (Dict.get modeAsString cfg.trainModeDisplay)


readTrainMode : String -> TrainMode
readTrainMode s =
    case s of
        "Review" ->
            Review

        "Urname" ->
            Urname

        "LocalName" ->
            LocalName

        "Description" ->
            Description

        _ ->
            Review


scriptHeading : String
scriptHeading =
    "Sanskrit Script"


readScript : String -> Script
readScript s =
    case s of
        "Latin" ->
            Latin

        "Unicode" ->
            Unicode

        _ ->
            Latin


allSubjects : Nonempty Subject
allSubjects =
    Nonempty
        (Subject 0 (Just "assets/images/tadasana.png") Nothing "ताडासन" "tāḍāsana" "(Standing) Mountain Pose" "I stand ready to obey Thy least command.")
        [ Subject 1 (Just "assets/images/balasana.png") Nothing "बालासन" "bālāsana" "Child Pose" "I relax from outer involvement into my inner haven of peace."
        , Subject 2 (Just "assets/images/sarvangasana.png") Nothing "सर्वाङ्गासन" "sarvāṅgāsana" "Shoulderstand" "God's peace now floods my being."
        , Subject 3 (Just "assets/images/padahastasana.png") Nothing "पादहस्तासन" "pādahastāsana" "Jackknife Pose" "Nothing on earth can hold me!"
        , Subject 4 (Just "assets/images/purvotanasana.png") Nothing "पूर्वोत्तानासन" "pūrvōttānāsana" "Front Stretching Pose" "With a burst of energy, I rise to greet the world!"
        , Subject 5 (Just "assets/images/parvatasana.png") Nothing "पर्वतासन" "parvatāsana" "Front Stretching Pose" "With a burst of energy, I rise to greet the world!"
        , Subject 6 (Just "assets/images/parighasana.png") Nothing "परिघासन" "parighāsana" "Gate Pose" "Waves of joy surge upward in my spine."
        , Subject 7 (Just "assets/images/savasana.png") Nothing "शवासन" "śavāsana" "Corpse Pose" "Bones, muscles, movement I surrender now; anxiety, elation and depression, churning thoughts—all these I give into the hands of peace."
        , Subject 8 (Just "assets/images/natarajasana.png") Nothing "नटराजासन" "naṭarājāsana" "King-of-the-Dance Pose" "While I move through life, I am anchored in my Self."
        , Subject 9 (Just "assets/images/simhasana.png") Nothing "सिंहासन" "siṁhāsana" "Lion Pose" "I purify my thoughts, my speech, my every action."
        , Subject 10 (Just "assets/images/siddhasana.png") Nothing "सिद्धासन" "siddhāsana" "Perfect Pose" "I set ablaze the fire of inner joy."
        , Subject 11 (Just "assets/images/tolatrikonasana.png") Nothing "तोल त्रिकोणासन" "tōla trikōṇāsana" "Balancing Triangle Pose" "I expand fully into this moment."
        , Subject 12 (Just "assets/images/rajakapotasana.png") Nothing "राजकपोतासन" "rājakapōtāsana" "Pigeon Pose" "I rise above all thought of past and future, into the Eternal Now."
        , Subject 13 (Just "assets/images/parsvotanasana.png") Nothing "पार्श्वोत्तनासन" "pārśvōttanāsana" "Side Stretching Pose" "I offer myself fully into the flow of grace."
        , Subject 14 (Just "assets/images/viparitakarani.png") Nothing "विपरीतकरणी" "viparītakaraṇī" "Simple Inverted Pose" "Awake, my sleeping powers, awake!"
        , Subject 15 (Just "assets/images/ustrasana.png") Nothing "उष्ट्रासन" "uṣṭrāsana" "Camel Pose" "With calm faith, I open to Thy Light."
        , Subject 16 (Just "assets/images/parsvakonasana.png") Nothing "पार्श्वकोणासन" "pārśvakōṇāsana" "Side Angle Pose" "I am a fountain of boundless energy and power!"
        , Subject 17 (Just "assets/images/padmasana.png") Nothing "पद्मासन" "padmāsana" "Lotus Pose" "I sit serene, uplifted in Thy light."
        , Subject 18 (Just "assets/images/muktasana.png") Nothing "मुक्तासन" "muktāsana" "Freedom Pose" "I am free! I am free!"
        , Subject 19 (Just "assets/images/suptavajrasana.png") Nothing "सुप्त वज्रासन" "supta vajrāsana" "Supine Firm Pose" "Energetic movement or unmoving peace: The choice is mine alone! The choice is mine!"
        , Subject 20 (Just "assets/images/gomukhasana.png") Nothing "गोमुखासन" "gōmukhāsana" "Face-of-Light Pose" "Free in my heart, I live without fear."
        , Subject 21 (Just "assets/images/adhomukhashvanasana.png") Nothing "अधोमुखश्वानासन" "adhō mukha śvānāsana" "Downward-Facing-Dog Pose" "Calmness radiates from every fiber of my being."
        , Subject 22 (Just "assets/images/setubandhasana.png") Nothing "सेतुबन्धासन" "sētu bandhāsana" "Bridge Pose" "I offer every thought as a bridge to divine grace."
        , Subject 23 (Just "assets/images/matsyasana.png") Nothing "मत्स्यासन" "matsyāsana" "Fish Pose" "My soul floats on waves of cosmic light."
        , Subject 24 (Just "assets/images/chakrasana.png") Nothing "चक्रासन" "cakrāsana" "Circle Pose" "I am awake! Energetic! Enthusiastic!"
        , Subject 25 (Just "assets/images/sirshasana.png") Nothing "शीर्षासन" "śīrṣāsana" "Headstand" "I am He! I am He! Blissful Spirit, I am He!"
        , Subject 26 (Just "assets/images/pavanamuktasana.png") Nothing "पवनमुक्तासन" "pavanamuktāsana" "Wind-Freeing Pose" "I release my spinal energy to rise in light."
        , Subject 27 (Just "assets/images/bakasana.png") Nothing "बकासन" "bakāsana" "Crane Pose" "The silent power of the Infinite expands within me."
        , Subject 28 (Just "assets/images/vrikasana.png") Nothing "वृक्षासन" "vr̥kṣāsana" "Tree Pose" "I am calm, I am poised."
        , Subject 29 (Just "assets/images/vajrasana.png") Nothing "वज्रासन" "vajrāsana" "Firm Pose" "In stillness I touch my inner strength."
        , Subject 30 (Just "assets/images/ardhamatsyendrasana.png") Nothing "अर्धमत्स्येन्द्रासन" "ardhamatsyēndrāsana" "Half Spinal Twist" "I radiate love and goodwill to soul-friends everywhere."
        , Subject 31 (Just "assets/images/ardhachandrasana.png") Nothing "अर्धचन्द्रासन" "ardhacandrāsana" "Half-Moon Pose" "Strength and courage fill my body cells."
        , Subject 32 (Just "assets/images/paschimotanasana.png") Nothing "पश्चिमोत्तानासन" "paścimōttānāsana" "Posterior Stretching Pose" "I am safe. I am sound. All good things come to me; they give me peace!"
        , Subject 33 (Just "assets/images/suryanamaskar.png") Nothing "सुर्य नमस्कार" "surya namaskāra" "Sun Salutation" "Salutations to the sun, to the awakening light within, to the dawning of higher consciousness in all beings."
        , Subject 34 (Just "assets/images/upavisthakonasana.png") Nothing "उपविष्टकोणासन" "upaviṣṭakōṇāsana" "Seated Angle Pose" "I welcome every opportunity for further growth."
        , Subject 35 (Just "assets/images/garudasana.png") Nothing "गरुडासन" "garuḍāsana" "Eagle Pose" "At the center of life's storms I stand serene."
        , Subject 36 (Just "assets/images/virabhadrasana2.png") Nothing "वीरभद्रासन २" "vīrabhadrāsana II" "Warrior Pose II" "I joyfully manifest the power of God."
        , Subject 37 (Just "assets/images/halasana.png") Nothing "हलासन" "halāsana" "Plow Pose" "New life, new consciousness now flood my brain!"
        , Subject 38 (Just "assets/images/akarshanadhanurasana.png") Nothing "आकर्णधनुरासन" "ākarṇa dhanurāsana" "Pulling-the-Bow Pose" "With shafts of will I pierce the heart of worries."
        , Subject 39 (Just "assets/images/karnapirasana.png") Nothing "कर्णपीडासन" "karṇapīḍāsana" "Ear-Closing Pose" "My boat of life floats lightly on tides of peace."
        , Subject 40 (Just "assets/images/baddhakonasana.png") Nothing "बद्धकोणासन" "baddha kōṇāsana" "Bound Angle Pose (aka Butterfly Pose)" "Secure in my Self, I accept whatever is."
        , Subject 41 (Just "assets/images/prasaritapadotanasana.png") Nothing "प्रसारित पादोत्तानासन" "prasārita pādōttānāsana" "Wide-Stance Forward Bend" "I relax and cast aside all mental burdens."
        , Subject 42 (Just "assets/images/salabhasana.png") Nothing "शलभासन" "śalabhāsana" "Locust Pose" "I soar upward on wings of joy!"
        , Subject 43 (Just "assets/images/navasana.png") Nothing "नावासन" "nāvāsana" "Boat Pose" "Within my every breath is infinite power."
        , Subject 44 (Just "assets/images/jatharaparivartanasana.png") Nothing "ञटर परिवर्तनासन" "ñaṭara parivartanāsana" "Supine Twist" "I open to the flow of God's life within me."
        , Subject 45 (Just "assets/images/yogamudra.png") Nothing "योग मुद्रा" "yōga mudrā" "Symbol of Yoga" "I am Thine; receive me."
        , Subject 46 (Just "assets/images/mayurasana.png") Nothing "मयूरासन" "mayūrāsana" "Peacock Pose" "(no verbal affirmation; feel the awakening energy as the affirmation)"
        , Subject 47 (Just "assets/images/trikonasana.png") Nothing "त्रिकोणासन" "trikōṇāsana" "Triangle Pose" "Energy and joy flood my body cells! Joy descends to me!"
        , Subject 48 (Just "assets/images/vasishthasana.png") Nothing "वसिष्ठासन" "vasiṣṭhāsana" "Vashishtha's Pose" "The calm fire of my concentration burns all restlessness, all distraction."
        , Subject 49 (Just "assets/images/janushirasana.png") Nothing "जानु शीर्षासन" "jānu śīrṣāsana" "Head-to-the-Knee Pose" "Left and right and all around—life's harmonies are mine."
        , Subject 50 (Just "assets/images/sasamgasana.png") Nothing "ससन्गासन" "sasangāsana" "Hare Pose" "I am master of my energy, I am master of myself."
        , Subject 51 (Just "assets/images/bhujangasana.png") Nothing "भुजङ्गासन" "bhujaṅgāsana" "Cobra Pose" "I rise joyfully to meet each new opportunity."
        , Subject 52 (Just "assets/images/dhanurasana.png") Nothing "धनुरासन" "dhanurāsana" "Bow Pose" "I recall my scattered forces to recharge my spine."
        , Subject 53 (Just "assets/images/utkatasana.png") Nothing "उत्कटासन" "utkaṭāsana" "Chair Pose" "My body is no burden; it is light as air."
        , Subject 54 (Just "assets/images/ganapatiasana.png") Nothing "गणपतिासन" "gaṇapatiāsana" "Ganapati's Pose" "I sail serenely through the skies of inner freedom."
        , Subject 55 (Just "assets/images/pinchamayurasana.png") Nothing "पिञ्चमयूरासन" "piñca mayūrāsana" "Peacock Feather Pose" "The Infinite Light cascades through my spine."
        , Subject 56 (Just "assets/images/virabhadrasana1.png") Nothing "वीरभद्रासन १" "vīrabhadrāsana I" "Warrior Pose I" "I attune my will to the Source of all power."
        ]
