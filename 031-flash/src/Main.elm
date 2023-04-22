module Main exposing (main)

import Browser
import Browser.Events as BE
import Browser.Navigation as BN
import Card
import Config
import Json.Decode as Decode
import List.Nonempty as NEL exposing (Nonempty(..))
import Maybe.Extra as MaybeX
import Model
import Process
import Random
import Task
import Types exposing (..)
import View



-- Consider allowing numChoices to be configured by user


main : Program Decode.Value Model Msg
main =
    Browser.element
        { init = init
        , view = View.view
        , update = update
        , subscriptions = subscriptions
        }


init : Decode.Value -> ( Model, Cmd Msg )
init configValue =
    let
        mdl =
            Model.initialModel <|
                case Decode.decodeValue Config.configDecoder configValue of
                    Ok cfg ->
                        cfg

                    Err _ ->
                        -- Debug.log (Decode.errorToString err) defaultConfig
                        defaultConfig
    in
    Model.processSelectedDeck mdl


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        hasAudio subj =
            MaybeX.isJust <| subj.audioUrl

        -- workaround for browsers not properly updating the audio tag
        sleepThenShowAudio : Subject -> Cmd Msg
        sleepThenShowAudio subj =
            if hasAudio subj then
                Task.perform (\_ -> ShowAudio) <| Process.sleep 100

            else
                Cmd.none

        prevCard =
            Maybe.withDefault emptyCard
                (List.head model.previousDeck)

        nextCard =
            NEL.head model.remainingDeck

        filteredSubjects : Model -> Nonempty Subject
        filteredSubjects mdl =
            let
                subjFilter subj =
                    case mdl.settings.group of
                        Nothing ->
                            True

                        maybeGrp ->
                            subj.group == maybeGrp
            in
            mdl.config.allSubjects
                |> NEL.filter subjFilter invalidSubject

        buildSortedDeckForReview =
            (case model.config.sortReviewBy of
                LatinName ->
                    NEL.sortBy .latin

                UnicodeName ->
                    NEL.sortBy .unicode

                SubjectId ->
                    NEL.sortBy .subjectId
            )
                (filteredSubjects model)
                |> NEL.map (\subj -> { subject = subj, choices = [] })

        buildShuffledDeckCmdForQuiz mdl =
            Random.generate
                Shuffle
            <|
                Card.generateDeck
                    mdl.config.numChoices
                <|
                    filteredSubjects mdl

        newModel =
            case msg of
                Start ->
                    { model
                        | inSettingsScreen = False
                        , remainingDeck =
                            -- if in Review mode, then sort cards by latin name
                            -- otherwise, cards will be shuffled (below)
                            if model.settings.trainMode == Review then
                                buildSortedDeckForReview

                            else
                                model.remainingDeck
                    }

                Shuffle shuffledDeck ->
                    { model
                        | remainingDeck =
                            MaybeX.withDefaultLazy (\_ -> invalidCards) <|
                                NEL.fromList shuffledDeck
                    }

                SetTrainMode trainMode ->
                    { model
                        | settings =
                            Settings (Config.readTrainMode trainMode)
                                model.settings.script
                                model.settings.group
                    }

                SetGroup groupLabel ->
                    { model
                        | settings =
                            Settings
                                model.settings.trainMode
                                model.settings.script
                                (case groupLabel of
                                    "All" ->
                                        Nothing

                                    grpLbl ->
                                        Just grpLbl
                                )
                    }

                SetScript script ->
                    { model
                        | settings =
                            Settings model.settings.trainMode
                                (Config.readScript script)
                                model.settings.group
                    }

                Reset ->
                    -- keep config and settings
                    let
                        mdl =
                            defaultModel
                    in
                    { mdl
                        | config = model.config
                        , settings = model.settings
                    }

                Answer str ->
                    { model
                        | total = model.total + 1
                        , score =
                            if
                                str
                                    == Model.getAnswer
                                        model.settings
                                        (NEL.head model.remainingDeck).subject
                            then
                                model.score + 1

                            else
                                model.score
                        , userAnswer = Just str
                    }

                ShowAudio ->
                    { model | showAudio = True }

                Next ->
                    { model
                        | previousDeck = nextCard :: model.previousDeck
                        , remainingDeck = NEL.pop model.remainingDeck
                        , userAnswer = Nothing
                        , showAudio =
                            not <|
                                hasAudio <|
                                    (NEL.head model.remainingDeck).subject
                    }

                Previous ->
                    let
                        remaining =
                            NEL.cons prevCard model.remainingDeck

                        newPrevDeck =
                            List.drop 1 model.previousDeck
                    in
                    { model
                        | previousDeck = newPrevDeck
                        , remainingDeck = remaining
                        , showAudio = not <| hasAudio <| prevCard.subject
                    }

                _ ->
                    model

        nextKeyPressed =
            \_ ->
                if newModel.inSettingsScreen then
                    update Start newModel

                else if Model.nextEnabled model then
                    update Next newModel

                else
                    ( newModel, Cmd.none )
    in
    case msg of
        Start ->
            ( newModel
            , if newModel.settings.trainMode /= Review then
                buildShuffledDeckCmdForQuiz newModel

              else
                Cmd.none
            )

        Reset ->
            Model.initWithModel newModel

        ControlKeyPressed "Enter" ->
            nextKeyPressed ()

        CharacterKeyPressed ' ' ->
            nextKeyPressed ()

        MouseClick ->
            ( newModel, Cmd.none )

        Next ->
            ( newModel, sleepThenShowAudio nextCard.subject )

        Previous ->
            ( newModel, sleepThenShowAudio prevCard.subject )

        GoLanding ->
            ( newModel
            , case model.config.landingPage of
                Just homePage ->
                    BN.load homePage

                Nothing ->
                    Cmd.none
            )

        _ ->
            ( newModel, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ BE.onKeyPress keyDecoder
        , BE.onClick (Decode.succeed MouseClick)
        ]


keyDecoder : Decode.Decoder Msg
keyDecoder =
    Decode.map toKey (Decode.field "key" Decode.string)


toKey : String -> Msg
toKey keyValue =
    case String.uncons keyValue of
        Just ( char, "" ) ->
            CharacterKeyPressed char

        _ ->
            ControlKeyPressed keyValue
