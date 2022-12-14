module Config exposing
    ( configDecoder
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
