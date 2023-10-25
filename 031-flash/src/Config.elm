module Config exposing
    ( configDecoder
    , readScript
    , readTrainMode
    , scriptHeading
    , showTrainMode
    )

import Dict
import Html exposing (..)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (optional, required)
import List.Nonempty as NEL exposing (Nonempty(..))
import Types exposing (..)
import Unwrap


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

        subjectFieldDecoder : Decoder SubjectField
        subjectFieldDecoder =
            Decode.map
                (\s ->
                    Unwrap.maybe <|
                        case s of
                            "LatinName" ->
                                Just LatinName

                            "UnicodeName" ->
                                Just UnicodeName

                            "SubjectId" ->
                                Just SubjectId

                            _ ->
                                Nothing
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
                |> required "localNames"
                    (Decode.andThen
                        (\lst ->
                            case NEL.fromList lst of
                                Just ne ->
                                    Decode.succeed ne

                                Nothing ->
                                    Decode.fail "Requires at least one localName"
                        )
                        (list string)
                    )
                |> required "description" string
                |> optional "group" (nullable string) Nothing
    in
    Decode.succeed Config
        |> required "deckId" string
        |> required "deckTitle" string
        |> optional "landingPage" (nullable string) Nothing
        |> optional "initialScript" scriptDecoder Latin
        |> optional "scriptCanBeSet" bool False
        |> optional "groupCanBeSet" bool False
        |> optional "groupDisplay" string ""
        |> optional "showTooltipsForOtherScript" bool True
        |> optional "showDescriptionWithUrNameQuiz" bool True
        |> optional "showAudioWithUrNameQuiz" bool True
        |> optional "showAudioWithUrnameQuizAnswers" bool True
        |> optional "showDescriptionWithLocalNameQuiz" bool True
        |> optional "showAudioWithLocalNameQuiz" bool True
        |> optional "showDescription" bool True
        |> optional "showAudio" bool True
        |> required "trainingModes" (list trainModeDecoder)
        |> optional "sortReviewBy" subjectFieldDecoder SubjectId
        |> required "pluralSubjectName" string
        |> optional "copyrightNotice" string ""
        |> optional "numChoices" int 4
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
