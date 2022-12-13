module Types exposing
    ( Card
    , Config
    , Model
    , Msg(..)
    , Script(..)
    , Settings
    , Subject
    , TrainMode(..)
    , defaultConfig
    , emptyCard
    , invalidCards
    , invalidSubject
    , invalidSubjectList
    , msgToString
    , subjectToJson
    )

import Dict exposing (Dict)
import Json.Encode as Encode
import Json.Encode.Extra as EncodeX
import List.Nonempty exposing (Nonempty(..))
import Maybe.Extra as MaybeX


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


type alias Config =
    { deckId : String
    , deckTitle : String
    , landingPage : Maybe String
    , initialScript : Script
    , scriptCanBeSet : Bool
    , showDescriptionWithUrNameQuiz : Bool
    , showAudioWithUrNameQuiz : Bool
    , showDescriptionWithLocalNameQuiz : Bool
    , showAudioWithLocalNameQuiz : Bool
    , showDescription : Bool
    , showAudio : Bool
    , trainingModes : List TrainMode
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
    Config
        "invalid deck"
        "invalid deck"
        Nothing
        Latin
        True
        True
        True
        True
        True
        True
        True
        []
        ""
        ""
        0
        Dict.empty
        ""
        Nothing
        invalidSubjectList


type alias Settings =
    { trainMode : TrainMode
    , script : Script
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


msgToString : Msg -> String
msgToString msg =
    case msg of
        Next ->
            "Next"

        Previous ->
            "Previous"

        ShowAudio ->
            "ShowAudio"

        SetTrainMode _ ->
            "SetTrainMode"

        SetScript _ ->
            "SetScript"

        Start ->
            "Start"

        Reset ->
            "Reset"

        Answer _ ->
            "Answer"

        Shuffle _ ->
            "Shuffle"

        CharacterKeyPressed _ ->
            "CharacterKeyPressed"

        ControlKeyPressed _ ->
            "ControlKeyPressed"

        MouseClick ->
            "MouseClick"

        CurrentDeckLoaded _ ->
            "CurrentDeckLoaded"

        GoLanding ->
            "GoLanding"


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
    }


invalidSubject : Subject
invalidSubject =
    Subject -1 Nothing Nothing "invalid" "invalid" "invalid" "invalid"


invalidSubjectList : Nonempty Subject
invalidSubjectList =
    Nonempty invalidSubject []


subjectToJson : Subject -> Encode.Value
subjectToJson subj =
    let
        encodeOptional fieldName maybeS =
            if MaybeX.isJust maybeS then
                [ ( fieldName, EncodeX.maybe Encode.string maybeS ) ]

            else
                []
    in
    Encode.object <|
        ( "subjectId", Encode.int subj.subjectId )
            :: (encodeOptional "imageUrl" subj.imageUrl
                    ++ encodeOptional "audioUrl" subj.audioUrl
                    ++ [ ( "unicode", Encode.string subj.unicode )
                       , ( "latin", Encode.string subj.latin )
                       , ( "localName", Encode.string subj.localName )
                       , ( "description", Encode.string subj.description )
                       ]
               )
