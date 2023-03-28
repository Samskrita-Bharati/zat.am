module Main exposing (main)

import Browser
import Browser.Events as BE
import Browser.Navigation as BN
import Card
import Config
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as HE
import Json.Decode as Decode
import List
import List.Extra as ListX
import List.Nonempty as NEL exposing (Nonempty(..))
import Maybe.Extra as MaybeX
import Process
import Random
import String exposing (fromInt)
import Task
import Types exposing (..)



-- Consider allowing numChoices to be configured by user


main : Program Decode.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Decode.Value -> ( Model, Cmd Msg )
init configValue =
    let
        mdl =
            initialModel <|
                case Decode.decodeValue Config.configDecoder configValue of
                    Ok cfg ->
                        cfg

                    Err _ ->
                        -- Debug.log (Decode.errorToString err) defaultConfig
                        defaultConfig
    in
    processSelectedDeck mdl


view : Model -> Html Msg
view model =
    div []
        [ if model.inSettingsScreen then
            viewSettings model

          else
            viewCard model (NEL.head model.remainingDeck)
        , p [ class "copyright" ] [ text model.config.copyrightNotice ]
        ]


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

        newModel =
            case msg of
                Shuffle shuffledDeck ->
                    { model
                        | remainingDeck =
                            MaybeX.withDefaultLazy (\_ -> invalidCards) <| NEL.fromList shuffledDeck
                    }

                SetTrainMode trainMode ->
                    { model
                        | settings =
                            Settings (Config.readTrainMode trainMode) model.settings.script
                    }

                SetScript script ->
                    { model
                        | settings =
                            Settings model.settings.trainMode <| Config.readScript script
                    }

                Reset ->
                    -- keep config and settings
                    let
                        mdl =
                            Config.defaultModel
                    in
                    { mdl
                        | config = model.config
                        , settings = model.settings
                    }

                Answer str ->
                    { model
                        | total = model.total + 1
                        , score =
                            if str == getAnswer model.settings (NEL.head model.remainingDeck).subject then
                                model.score + 1

                            else
                                model.score
                        , userAnswer = Just str
                    }

                Start ->
                    { model | inSettingsScreen = False }

                ShowAudio ->
                    { model | showAudio = True }

                Next ->
                    { model
                        | previousDeck = nextCard :: model.previousDeck
                        , remainingDeck = NEL.pop model.remainingDeck
                        , userAnswer = Nothing
                        , showAudio = not <| hasAudio <| (NEL.head model.remainingDeck).subject
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

                else if nextEnabled model then
                    update Next newModel

                else
                    ( newModel, Cmd.none )
    in
    case msg of
        Reset ->
            initWithModel newModel

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


initialModel : Config -> Model
initialModel cfg =
    let
        mdl =
            Config.defaultModel
    in
    { mdl | config = cfg }


initWithModel : Model -> ( Model, Cmd Msg )
initWithModel model =
    ( model
    , Random.generate
        Shuffle
        (Card.generateDeck
            model.config.numChoices
            model.config.allSubjects
        )
    )


processSelectedDeck : Model -> ( Model, Cmd Msg )
processSelectedDeck model =
    let
        sttgs =
            model.settings

        newModel =
            { model
                | settings = { sttgs | script = model.config.initialScript }
            }
    in
    initWithModel newModel


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


viewSettings : Model -> Html Msg
viewSettings model =
    div []
        [ h1 [ class "center" ] [ text model.config.deckTitle ]
        , h2 [ class "center" ] [ text "Settings" ]
        , div []
            [ Html.form []
                (trainModeFieldSet model
                    :: br [] []
                    :: (if model.config.scriptCanBeSet then
                            [ scriptFieldSet model ]

                        else
                            []
                       )
                )
            , br [] []
            , div [ class "center" ]
                (button
                    [ class "button startButton", HE.onClick Start ]
                    [ text "Start" ]
                    :: (if MaybeX.isJust model.config.landingPage then
                            [ button
                                [ class "button startButton end-button", HE.onClick GoLanding ]
                                [ text "Change Deck" ]
                            ]

                        else
                            []
                       )
                )
            ]
        ]


trainModeFieldSet : Model -> Html Msg
trainModeFieldSet model =
    let
        filterConfig : TrainMode -> List (Html Msg) -> List (Html Msg)
        filterConfig trainMode htmlElements =
            if List.member trainMode model.config.trainingModes then
                htmlElements

            else
                []

        reviewTrainModeInput =
            [ input
                [ id "review"
                , name "trainMode"
                , type_ "radio"
                , value "Review"
                , HE.onInput SetTrainMode
                , checked <| model.settings.trainMode == Review
                ]
                []
            , label [ for "review" ] [ text (Config.showTrainMode model.config Review), br [] [] ]
            ]

        urnameTrainModeInput =
            [ input
                [ id "urname"
                , name "trainMode"
                , type_ "radio"
                , value "Urname"
                , HE.onInput SetTrainMode
                , checked <| model.settings.trainMode == Urname
                ]
                []
            , label [ for "urname" ] [ text (Config.showTrainMode model.config Urname), br [] [] ]
            ]

        localNameTrainModeInput =
            [ input
                [ id "localName"
                , name "trainMode"
                , type_ "radio"
                , value "LocalName"
                , HE.onInput SetTrainMode
                , checked <| model.settings.trainMode == LocalName
                ]
                []
            , label [ for "localName" ] [ text (Config.showTrainMode model.config LocalName), br [] [] ]
            ]

        descriptionTrainModeInput =
            [ input
                [ id "description"
                , name "trainMode"
                , type_ "radio"
                , value "Description"
                , HE.onInput SetTrainMode
                , checked <| model.settings.trainMode == Description
                ]
                []
            , label [ for "description" ] [ text (Config.showTrainMode model.config Description) ]
            ]
    in
    fieldset []
        (legend [] [ strong [] [ text "Training Mode" ] ]
            -- todo simplify with a fold
            :: (filterConfig Review reviewTrainModeInput
                    ++ filterConfig Urname urnameTrainModeInput
                    ++ filterConfig LocalName localNameTrainModeInput
                    ++ filterConfig Description descriptionTrainModeInput
               )
        )


scriptFieldSet : Model -> Html Msg
scriptFieldSet model =
    fieldset []
        [ legend [] [ strong [] [ text <| Config.scriptHeading ] ]
        , table []
            [ tr []
                [ td []
                    [ input
                        [ id "unicode"
                        , name "script"
                        , type_ "radio"
                        , value "Unicode"
                        , HE.onInput SetScript
                        , checked <| model.settings.script == Unicode
                        ]
                        []
                    ]
                , td [] [ label [ for "unicode" ] <| radioScriptLabelHtml Unicode ]
                ]
            , tr []
                [ td []
                    [ input
                        [ id "latin"
                        , name "script"
                        , type_ "radio"
                        , value "Latin"
                        , HE.onInput SetScript
                        , checked <| model.settings.script == Latin
                        ]
                        []
                    ]
                , td [] [ label [ for "latin" ] <| radioScriptLabelHtml Latin ]
                ]
            ]
        ]


radioScriptLabelHtml : Script -> List (Html Msg)
radioScriptLabelHtml script =
    case script of
        Unicode ->
            [ text " Devanagari — the \"divine script\", e.g. ", b [] [ text "योग" ] ]

        Latin ->
            [ text " ISO 15919 — transliterated to Latin letters, e.g. ", b [] [ text "yōga" ] ]


viewCard : Model -> Card -> Html Msg
viewCard model card =
    div [] <|
        viewImage card.subject.imageUrl
            ++ [ div [] <|
                    let
                        mainPartAttributes =
                            class "mainPart"
                                :: MaybeX.unwrap []
                                    (\fs -> [ style "font-size" fs ])
                                    model.config.mainPartFontSize

                        contentViews =
                            case model.settings.trainMode of
                                Review ->
                                    [ table [ class "card" ]
                                        ([ tr mainPartAttributes [ viewUrname card.subject model.settings model.config ]
                                         , tr [ class "minorPart" ] [ viewLocalName card.subject ]
                                         ]
                                            ++ showDescriptionInCard model card
                                            ++ playAudio model card.subject.audioUrl
                                        )
                                    , hr [] []
                                    ]

                                Urname ->
                                    let
                                        descriptionHtml =
                                            if model.config.showDescriptionWithUrNameQuiz then
                                                showDescriptionInCard model card

                                            else
                                                []

                                        audioHtml =
                                            if model.config.showAudioWithUrNameQuiz then
                                                playAudio model card.subject.audioUrl

                                            else
                                                []
                                    in
                                    [ table [ class "card" ]
                                        (tr mainPartAttributes [ viewLocalName card.subject ]
                                            :: (descriptionHtml
                                                    ++ audioHtml
                                               )
                                        )
                                    , viewQuiz (Config.showTrainMode model.config Urname) model card
                                    ]

                                LocalName ->
                                    let
                                        descriptionHtml =
                                            if model.config.showDescriptionWithLocalNameQuiz then
                                                showDescriptionInCard model card

                                            else
                                                []

                                        audioHtml =
                                            if model.config.showAudioWithLocalNameQuiz then
                                                playAudio model card.subject.audioUrl

                                            else
                                                []
                                    in
                                    [ table [ class "card" ] <|
                                        tr mainPartAttributes [ viewUrname card.subject model.settings model.config ]
                                            :: descriptionHtml
                                            ++ audioHtml
                                            ++ [ viewQuiz (Config.showTrainMode model.config LocalName) model card ]
                                    ]

                                Description ->
                                    [ table [ class "card" ]
                                        ([ tr mainPartAttributes [ viewUrname card.subject model.settings model.config ]
                                         , tr [ class "minorPart" ] [ viewLocalName card.subject ]
                                         ]
                                            ++ playAudio model card.subject.audioUrl
                                        )
                                    , viewQuiz (Config.showTrainMode model.config Description) model card
                                    ]

                        prevEnabled =
                            model.settings.trainMode == Review && not (List.isEmpty model.previousDeck)

                        buttonStyle isEnabled =
                            if isEnabled then
                                "button"

                            else
                                "disabledButton"

                        nextButton =
                            button
                                [ class (buttonStyle <| nextEnabled model)
                                , disabled <| not (nextEnabled model)
                                , HE.onClick <| Next
                                ]
                                [ text "Next ⇨" ]

                        prevButton =
                            button [ class (buttonStyle prevEnabled), disabled (not prevEnabled), HE.onClick Previous ]
                                [ text "⇦ Prev" ]

                        startOver =
                            button
                                [ class "button", HE.onClick Reset ]
                                [ text "Start Over" ]
                                :: (if MaybeX.isJust model.config.landingPage then
                                        [ button
                                            [ class "button end-button", HE.onClick GoLanding ]
                                            [ text "Change Deck" ]
                                        ]

                                    else
                                        []
                                   )

                        allFinished =
                            button [ class "end-button", HE.onClick Reset ] [ text "All Finished! Train Again?" ]
                                :: (if MaybeX.isJust model.config.landingPage then
                                        [ button
                                            [ class "end-button", HE.onClick GoLanding ]
                                            [ text "Change Deck" ]
                                        ]

                                    else
                                        []
                                   )

                        allButtons =
                            [ prevButton
                            , nextButton
                            , br [] []
                            ]
                                ++ startOver

                        midwayButtons =
                            case model.settings.trainMode of
                                Review ->
                                    allButtons

                                _ ->
                                    -- remove Prev button
                                    List.drop 1 allButtons

                        endButtons =
                            div [ id "buttons" ] <|
                                if model.settings.trainMode == Review then
                                    [ prevButton
                                    , nextButton
                                    , br [] []
                                    , br [] []
                                    ]
                                        ++ allFinished

                                else if MaybeX.isJust model.userAnswer then
                                    [ nextButton
                                    , br [] []
                                    , br [] []
                                    ]
                                        ++ allFinished

                                else
                                    [ nextButton
                                    , br [] []
                                    , br [] []
                                    ]
                                        ++ startOver
                    in
                    contentViews
                        ++ [ div [ class "center" ]
                                [ if NEL.isSingleton model.remainingDeck then
                                    endButtons

                                  else
                                    div [ id "buttons" ]
                                        midwayButtons
                                , viewScore model
                                ]
                           ]
               ]


viewImage : Maybe String -> List (Html Msg)
viewImage maybeUrl =
    case maybeUrl of
        Just url ->
            [ img [ src url ] [] ]

        Nothing ->
            [ br [] [] ]


showDescriptionInCard : Model -> Card -> List (Html Msg)
showDescriptionInCard model card =
    let
        descriptionHtml subject =
            if String.isEmpty subject.description then
                []

            else
                [ p [ class "descriptionText" ]
                    [ text <| "\"" ++ subject.description ++ "\"" ]
                ]
    in
    if model.config.showDescription then
        [ tr [ class "minorPart descriptionBlock" ] (descriptionHtml card.subject) ]

    else
        []


playAudio : Model -> Maybe String -> List (Html Msg)
playAudio model maybeUrl =
    if model.config.showAudio then
        if model.showAudio then
            case maybeUrl of
                Just url ->
                    [ tr [ class "audio" ]
                        [ audio [ controls True, autoplay True ]
                            [ source [ src url, type_ "audio/mpeg" ] []
                            , text "Your browser does not support the audio element"
                            ]
                        ]
                    ]

                Nothing ->
                    [ tr [ class "audio" ] [] ]

        else
            [ tr [ class "audio" ] [] ]

    else
        []


viewScore : Model -> Html Msg
viewScore model =
    let
        percentValue =
            fromInt
                << round
            <|
                if model.total == 0 then
                    0.0

                else
                    100 * toFloat model.score / toFloat model.total

        percentString =
            " ( " ++ percentValue ++ "%)"

        scoreView =
            if model.settings.trainMode == Review then
                []

            else
                [ text <|
                    "Score: "
                        ++ fromInt model.score
                        ++ "/"
                        ++ fromInt model.total
                        ++ percentString
                , br [] []
                ]

        remaining =
            NEL.length model.remainingDeck
    in
    h3 [ class "score" ] <|
        scoreView
            ++ (if remaining > 0 then
                    [ text <|
                        "Number of "
                            ++ model.config.pluralSubjectName
                            ++ " Remaining: "
                            ++ fromInt (remaining - 1)
                    ]

                else
                    []
               )


attrsForUrname : Subject -> Settings -> Config -> List (Attribute msg)
attrsForUrname subject settings config =
    if not config.showTooltipsForOtherScript then
        []

    else
        case settings.script of
            Latin ->
                [ title subject.unicode ]

            Unicode ->
                [ title subject.latin ]


viewUrname : Subject -> Settings -> Config -> Html Msg
viewUrname subject settings config =
    let
        attrs =
            attrsForUrname subject settings config
    in
    case settings.script of
        Latin ->
            p attrs [ text subject.latin ]

        Unicode ->
            p attrs [ text subject.unicode ]


viewLocalName : Subject -> Html Msg
viewLocalName subject =
    p [] [ text subject.localName ]


viewQuiz : String -> Model -> Card -> Html Msg
viewQuiz legendLabel model card =
    let
        isDisabled =
            MaybeX.isJust model.userAnswer

        isChecked val =
            model.userAnswer == Just val

        isCorrect val =
            getAnswer model.settings card.subject == val

        correctAttributes =
            [ class "correct" ]

        incorrectAttributes =
            [ class "incorrect" ]

        labelAttributes val =
            (if model.settings.trainMode == Description then
                [ class "italic" ]

             else
                []
            )
                ++ (if isDisabled then
                        if isCorrect val then
                            correctAttributes

                        else
                            incorrectAttributes

                    else
                        []
                   )

        getChoices =
            List.map (getAnswer model.settings) card.choices
                -- if duplicates, number of choices will be less than numChoices
                |> ListX.unique
                |> List.indexedMap toInputView

        toInputView : Int -> String -> Html Msg
        toInputView i val =
            tr []
                [ td [ class "quiz", style "width" "15px" ]
                    [ input
                        [ id ("choice" ++ fromInt i)
                        , name "choice"
                        , placeholder val
                        , type_ "radio"
                        , value val
                        , HE.onInput Answer
                        , checked <| isChecked val
                        , disabled isDisabled
                        ]
                        []
                    ]
                , td
                    (class "quiz"
                        :: (if isDisabled && isCorrect val then
                                correctAttributes

                            else
                                []
                           )
                    )
                    [ label (for ("choice" ++ fromInt i) :: labelAttributes val)
                        [ text val ]
                    ]
                ]
    in
    div
        (if model.settings.trainMode == Description then
            [ class "descriptionQuiz" ]

         else
            []
        )
        [ Html.form []
            [ fieldset
                []
                [ table []
                    (tr [] [ th [] [], th [ class "quizHeader" ] [ text legendLabel ] ]
                        :: getChoices
                    )
                ]
            ]
        , br [] []
        ]


getAnswer : Settings -> Subject -> String
getAnswer { trainMode, script } =
    case trainMode of
        Review ->
            always "N/A"

        Urname ->
            if script == Latin then
                .latin

            else
                .unicode

        LocalName ->
            .localName

        Description ->
            .description


nextEnabled : Model -> Bool
nextEnabled model =
    let
        notEnd =
            not (NEL.isSingleton model.remainingDeck)

        inReview =
            model.settings.trainMode == Review

        answered =
            MaybeX.isJust model.userAnswer
    in
    not model.inSettingsScreen && notEnd && (inReview || answered)
