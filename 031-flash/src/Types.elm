module Types exposing
    ( Card
    , Config
    , Model
    , Msg(..)
    , Script(..)
    , Settings
    , Subject
    , SubjectField(..)
    , TrainMode(..)
    , defaultConfig
    , defaultModel
    , emptyCard
    , invalidCards
    , invalidSubject
    , invalidSubjectList
    )

import Dict exposing (Dict)
import List.Nonempty exposing (Nonempty(..))


type alias Model =
    { config : Config
    , settings : Settings
    , remainingDeck : Nonempty Card -- remaining cards in deck, head is current one
    , previousDeck : List Card -- previous cards, head is most recent
    , userAnswer : Maybe String -- user's answer among the choices
    , total : Int -- total number of quiz questions answered so far
    , score : Int -- number of correct answers so far
    , inSettingsScreen : Bool -- true if in settings screen
    , showAudio : Bool
    }


defaultModel : Model
defaultModel =
    { config = defaultConfig
    , settings = { trainMode = Review, script = Latin, group = Nothing }
    , remainingDeck = invalidCards
    , previousDeck = []
    , userAnswer = Nothing
    , total = 0
    , score = 0
    , inSettingsScreen = True
    , showAudio = True
    }


type alias Config =
    { deckId : String
    , deckTitle : String
    , landingPage : Maybe String
    , initialScript : Script
    , scriptCanBeSet : Bool
    , groupCanBeSet : Bool
    , groupDisplay : String
    , showTooltipsForOtherScript : Bool
    , showDescriptionWithUrNameQuiz : Bool
    , showAudioWithUrNameQuiz : Bool
    , showAudioWithUrnameQuizAnswers : Bool
    , showDescriptionWithLocalNameQuiz : Bool
    , showAudioWithLocalNameQuiz : Bool
    , showDescription : Bool
    , showAudio : Bool
    , trainingModes : List TrainMode
    , sortReviewBy : SubjectField
    , pluralSubjectName : String
    , copyrightNotice : String
    , numChoices : Int
    , trainModeDisplay : Dict String String
    , scriptHeading : String
    , mainPartFontSize : Maybe String
    , allSubjects : Nonempty Subject
    }


defaultConfig : Config
defaultConfig =
    { deckId = "invalid deck"
    , deckTitle = "invalid deck"
    , landingPage = Nothing
    , initialScript = Latin
    , scriptCanBeSet = True
    , groupCanBeSet = False
    , groupDisplay = ""
    , showTooltipsForOtherScript = True
    , showDescriptionWithUrNameQuiz = True
    , showAudioWithUrNameQuiz = True
    , showAudioWithUrnameQuizAnswers = True
    , showDescriptionWithLocalNameQuiz = True
    , showAudioWithLocalNameQuiz = True
    , showDescription = True
    , showAudio = True
    , trainingModes = []
    , sortReviewBy = SubjectId
    , pluralSubjectName = ""
    , copyrightNotice = ""
    , numChoices = 0
    , trainModeDisplay = Dict.empty
    , scriptHeading = ""
    , mainPartFontSize = Nothing
    , allSubjects = invalidSubjectList
    }


type alias Settings =
    { trainMode : TrainMode
    , script : Script
    , group : Maybe String
    }


type TrainMode
    = Review
    | Urname
    | LocalName
    | Description


type Script
    = Latin
    | Unicode


type Msg
    = Next
    | Previous
    | ShowAudio
    | SetTrainMode String
    | SetGroup String
    | SetScript String
    | Start
    | Reset
    | Answer String
    | Shuffle (List Card)
    | CharacterKeyPressed Char
    | ControlKeyPressed String
    | MouseClick
    | CurrentDeckLoaded String
    | GoLanding


type alias Card =
    { subject : Subject
    , choices : List Subject
    }


invalidCards : Nonempty Card
invalidCards =
    Nonempty emptyCard []


emptyCard : Card
emptyCard =
    { subject = invalidSubject, choices = [] }


type alias Subject =
    { subjectId : Int
    , imageUrl : Maybe String
    , audioUrl : Maybe String
    , unicode : String
    , latin : String
    , localName : String
    , description : String
    , group : Maybe String
    }


invalidSubject : Subject
invalidSubject =
    Subject -1 Nothing Nothing "invalid" "invalid" "invalid" "invalid" Nothing


invalidSubjectList : Nonempty Subject
invalidSubjectList =
    Nonempty invalidSubject []


type SubjectField
    = LatinName
    | UnicodeName
    | SubjectId
