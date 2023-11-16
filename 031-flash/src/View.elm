module View exposing (view)

import Config
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as HE
import List
import List.Nonempty as NEL exposing (Nonempty(..))
import Maybe.Extra as MaybeX
import Model
import Types exposing (..)


view : Model -> Html Msg
view model =
    div []
        [ if model.inSettingsScreen then
            viewSettings model

          else
            viewCard model (NEL.head model.remainingDeck)
        , p [ class "copyright" ] [ text model.config.copyrightNotice ]
        ]


viewSettings : Model -> Html Msg
viewSettings model =
    div [ class "w3-container w3-card-4 card" ]
        [ h1 [ class "center" ] [ text model.config.deckTitle ]
        , h2 [ class "center" ] [ text "Settings" ]
        , div []
            (trainModeSelect model
                :: br [] []
                :: quizTypeSelect model
                :: br [] []
                :: (if model.config.scriptCanBeSet then
                        [ scriptFieldSet model ]

                    else
                        []
                   )
                ++ (if model.config.groupCanBeSet then
                        [ groupSelect model ]

                    else
                        []
                   )
            )
        , br [] []
        , div [ class "center" ]
            (button
                [ class "w3-btn startButton", HE.onClick Start ]
                [ text "Start" ]
                :: (if MaybeX.isJust model.config.landingPage then
                        [ button
                            [ class "w3-btn end-button"
                            , HE.onClick GoLanding
                            ]
                            [ text "Change Deck" ]
                        ]

                    else
                        []
                   )
            )
        ]


trainModeSelect : Model -> Html Msg
trainModeSelect model =
    let
        filterConfig : TrainMode -> List (Html Msg) -> List (Html Msg)
        filterConfig trainMode htmlElements =
            if List.member trainMode model.config.trainingModes then
                htmlElements

            else
                []

        trainModeOption ( mode, modeString ) =
            [ option
                [ value modeString
                , selected <| model.settings.trainMode == mode
                ]
                [ text <| Config.showTrainMode model.config mode ]
            ]
    in
    div [ class "w3-container w3-card" ]
        [ h3 [] [ text "Select Training Mode…" ]
        , select
            [ class "w3-select w3-border settings-select"
            , name "trainMode"
            , HE.onInput SetTrainMode
            ]
            (List.foldl
                (\modeAndName acc ->
                    acc
                        ++ filterConfig
                            (Tuple.first modeAndName)
                            (trainModeOption modeAndName)
                )
                []
                [ ( Review, "Review" )
                , ( Urname, "Urname" )
                , ( LocalName, "LocalName" )
                , ( Description, "Description" )
                ]
            )
        ]


groupSelect : Model -> Html Msg
groupSelect model =
    let
        discoveredGroups =
            model.config.allSubjects
                |> NEL.map .group
                |> NEL.filter MaybeX.isJust
                    (Just "err: must have at least one subject with group")
                |> NEL.map (Maybe.withDefault "err: unexpected Nothing")
                |> NEL.uniq
                |> NEL.sort
                |> NEL.cons "All"

        groupOption : String -> Html Msg
        groupOption group =
            option
                [ value group
                , selected <|
                    case group of
                        "All" ->
                            MaybeX.isNothing model.settings.group

                        grp ->
                            model.settings.group == Just grp
                ]
                [ text group ]
    in
    div [ class "w3-container w3-card" ]
        [ h3 [] [ text <| "Select " ++ model.config.groupDisplay ++ "…" ]
        , select
            [ class "w3-select w3-border settings-select"
            , name "group"
            , HE.onInput SetGroup
            ]
          <|
            NEL.foldl
                (\grp acc -> acc ++ [ groupOption grp ])
                []
                discoveredGroups
        ]


quizTypeSelect : Model -> Html Msg
quizTypeSelect model =
    div [ class "w3-container w3-card" ]
        [ h3 [] [ text <| "Select Quiz Type…" ]
        , select
            [ class "w3-select w3-border settings-select"
            , name "quizType"
            , HE.onInput SetQuizType
            , disabled <| model.settings.trainMode == Review
            ]
            [ option
                [ value "MultipleChoice"
                , selected <| model.settings.quizType == MultipleChoice
                ]
                [ text "Multiple Choice" ]
            , option
                [ value "TextField"
                , selected <| model.settings.quizType == TextField
                ]
                [ text "Text Field" ]
            ]
        ]


scriptFieldSet : Model -> Html Msg
scriptFieldSet model =
    fieldset []
        [ legend [] [ strong [] [ text <| Config.scriptHeading ] ]
        , table []
            [ tr []
                [ td [ class "quiz" ]
                    [ input
                        [ class "w3-radio radio"
                        , id "unicode"
                        , name "script"
                        , type_ "radio"
                        , value "Unicode"
                        , HE.onInput SetScript
                        , checked <| model.settings.script == Unicode
                        ]
                        []
                    ]
                , td [ class "quiz" ]
                    [ label
                        [ for "unicode" ]
                      <|
                        radioScriptLabelHtml Unicode
                    ]
                ]
            , tr []
                [ td [ class "quiz" ]
                    [ input
                        [ class "w3-radio radio"
                        , id "latin"
                        , name "script"
                        , type_ "radio"
                        , value "Latin"
                        , HE.onInput SetScript
                        , checked <| model.settings.script == Latin
                        ]
                        []
                    ]
                , td [ class "quiz" ]
                    [ label
                        [ for "latin" ]
                      <|
                        radioScriptLabelHtml Latin
                    ]
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
        let
            mainPartAttributes =
                class "mainPart"
                    :: MaybeX.unwrap []
                        (\fs -> [ style "font-size" fs ])
                        model.config.mainPartFontSize

            contentViews =
                viewImage card.subject.imageUrl
                    ++ (case model.settings.trainMode of
                            Review ->
                                [ table [ class "maxWidth" ]
                                    ([ tr mainPartAttributes [ viewUrname card.subject model.settings model.config ]
                                     , tr [ class "minorPart" ] [ viewLocalName card.subject ]
                                     ]
                                        ++ showDescriptionInCard model card
                                        ++ playAudio model card.subject.audioUrl
                                    )
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
                                [ table [ class "maxWidth" ]
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
                                [ table [ class "maxWidth" ] <|
                                    tr mainPartAttributes [ viewUrname card.subject model.settings model.config ]
                                        :: descriptionHtml
                                        ++ audioHtml
                                        ++ [ viewQuiz (Config.showTrainMode model.config LocalName) model card ]
                                ]

                            Description ->
                                [ table [ class "maxWidth" ]
                                    ([ tr mainPartAttributes [ viewUrname card.subject model.settings model.config ]
                                     , tr [ class "minorPart" ] [ viewLocalName card.subject ]
                                     ]
                                        ++ playAudio model card.subject.audioUrl
                                    )
                                , viewQuiz (Config.showTrainMode model.config Description) model card
                                ]
                       )

            nextButton =
                button
                    [ class "w3-btn"
                    , disabled <| not (Model.nextEnabled model)
                    , HE.onClick <| Next
                    ]
                    [ text "Next ⇨" ]

            prevButton =
                button
                    [ class "w3-btn"
                    , disabled (not (Model.prevEnabled model))
                    , HE.onClick Previous
                    ]
                    [ text "⇦ Prev" ]

            startOver =
                button
                    [ class "w3-btn", HE.onClick Reset ]
                    [ text "Start Over" ]
                    :: (if MaybeX.isJust model.config.landingPage then
                            [ button
                                [ class "w3-btn end-button", HE.onClick GoLanding ]
                                [ text "Change Deck" ]
                            ]

                        else
                            []
                       )

            allFinished =
                button [ class "w3-btn end-button", HE.onClick Reset ] [ text "All Finished! Train Again?" ]
                    :: (if MaybeX.isJust model.config.landingPage then
                            [ button
                                [ class "w3-btn end-button", HE.onClick GoLanding ]
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
                        ]
                            ++ allFinished

                    else if MaybeX.isJust model.userAnswer then
                        [ nextButton
                        , br [] []
                        ]
                            ++ allFinished

                    else
                        [ nextButton
                        , br [] []
                        ]
                            ++ startOver
        in
        [ div [ class "w3-card card" ] contentViews
        , div [ class "center" ]
            [ if NEL.isSingleton model.remainingDeck then
                endButtons

              else
                div [ id "buttons" ]
                    midwayButtons
            , viewScore model
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
        [ tr [ class "minorPart" ] (descriptionHtml card.subject) ]

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
        remaining =
            NEL.length model.remainingDeck
                - (if
                    model.settings.trainMode
                        == Review
                        || Model.isAnswered model
                   then
                    1

                   else
                    0
                  )

        score =
            round <|
                if model.total == 0 then
                    0.0

                else
                    100 * toFloat model.score / toFloat model.total

        scorePercent =
            String.fromInt score ++ "%"

        total =
            List.length model.previousDeck
                + NEL.length model.remainingDeck

        soFar =
            List.length model.previousDeck
                + (if
                    Model.isAnswered model
                        || model.settings.trainMode
                        == Review
                   then
                    1

                   else
                    0
                  )

        progress =
            round <|
                100
                    * toFloat soFar
                    / toFloat total

        progressPercent =
            String.fromInt progress ++ "%"

        progressFgClasses =
            case model.settings.trainMode of
                Review ->
                    "progress-fg review"

                _ ->
                    "progress-fg"
    in
    div [ class "w3-container cardWidth" ]
        [ div [ class "score" ]
            [ div [ class "score-remaining-container" ]
                [ div [ class "score-remaining-layer1" ]
                    (case model.settings.trainMode of
                        Review ->
                            [ text "Progress:" ]

                        _ ->
                            [ text <|
                                "Score: "
                            , span [ class "score-fg" ]
                                [ text <|
                                    String.fromInt model.score
                                        ++ "/"
                                        ++ String.fromInt model.total
                                        ++ " ("
                                        ++ scorePercent
                                        ++ ")"
                                ]
                            ]
                    )
                , div [ class "score-remaining-layer2" ] [ text <| "Remaining: " ++ String.fromInt remaining ]
                ]
            , div [ class "progress-bg" ]
                --w3-right-align
                [ div
                    [ class progressFgClasses
                    , style "width" progressPercent
                    ]
                    (if model.settings.trainMode == Review then
                        []

                     else
                        [ div
                            [ class
                                ("score-fg"
                                    ++ (if progress == 0 then
                                            " low-progress"

                                        else
                                            ""
                                       )
                                )
                            , style "width" scorePercent
                            ]
                            [ text scorePercent ]
                        ]
                    )
                ]
            ]
        ]


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
    p [ class "localNameText" ] [ text <| displayAnswer subject.localNames ]


viewQuiz : String -> Model -> Card -> Html Msg
viewQuiz legendLabel model card =
    let
        {- isCorrect val =
           NEL.member (Debug.log ("sanitized " ++ val) (Model.sanitize val)) <|
               (Debug.log "scrubbed" <|
                   Model.getScrubbedAnswers model.settings card.subject
               )
        -}
        isCorrect val =
            NEL.member (Model.sanitize val) <|
                Model.getScrubbedAnswers model.settings card.subject

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
                ++ correctnessAttributes val

        correctnessAttributes : String -> List (Attribute Msg)
        correctnessAttributes val =
            if Model.isAnswered model then
                if isCorrect val then
                    correctAttributes

                else
                    incorrectAttributes

            else
                []

        getChoices : List (Html Msg)
        getChoices =
            case model.settings.quizType of
                MultipleChoice ->
                    card.choices
                        |> List.indexedMap toInputView

                TextField ->
                    let
                        styleClasses =
                            if model.settings.trainMode == Description then
                                "textAnswer description"

                            else
                                "textAnswer"
                    in
                    [ tr []
                        [ td (class styleClasses :: correctnessAttributes model.userAnswerPending)
                            [ case model.settings.trainMode of
                                Description ->
                                    textarea
                                        (class ("w3-input " ++ styleClasses)
                                            :: correctnessAttributes model.userAnswerPending
                                            ++ [ HE.onInput TypeAnswer
                                               , disabled
                                                    (Model.isAnswered model)
                                               , id "answerTextField"
                                               , value model.userAnswerPending
                                               ]
                                        )
                                        []

                                _ ->
                                    input
                                        (class ("w3-input " ++ styleClasses)
                                            :: correctnessAttributes model.userAnswerPending
                                            ++ [ type_ "text"
                                               , value model.userAnswerPending
                                               , HE.onInput TypeAnswer
                                               , disabled (Model.isAnswered model)
                                               , id "answerTextField"
                                               ]
                                        )
                                        []
                            ]
                        ]
                    , if Model.isAnswered model then
                        if isCorrect model.userAnswerPending then
                            div []
                                [ text "Correct!"
                                , br [] []
                                , div [ class "correct localNameText" ]
                                    [ text <|
                                        displayAnswer <|
                                            Model.getCorrectAnswers model.settings card.subject
                                    ]
                                ]

                        else
                            div []
                                [ text
                                    "The correct answer is:"
                                , div [ class "correct localNameText" ]
                                    [ text <|
                                        displayAnswer <|
                                            Model.getCorrectAnswers model.settings card.subject
                                    ]
                                ]

                      else
                        tr []
                            [ td [ class styleClasses ]
                                [ button
                                    [ class "w3-btn submit"
                                    , class styleClasses
                                    , HE.onClick SubmitAnswer
                                    ]
                                    [ text "Submit" ]
                                ]
                            ]
                    ]

        toInputView : Int -> Subject -> Html Msg
        toInputView i subject =
            let
                answerChoiceI =
                    displayAnswer <| Model.getCorrectAnswers model.settings subject

                isChecked val =
                    model.userAnswer == Just (Model.sanitize val)

                audioButton url =
                    audio [ controls True, autoplay False, style "width" "100" ]
                        [ source [ src url, type_ "audio/mpeg" ] []
                        , text "Your browser does not support the audio element"
                        ]
            in
            tr [] <|
                (if
                    model.config.showAudio
                        && model.settings.trainMode
                        == Urname
                        && model.config.showAudioWithUrnameQuizAnswers
                 then
                    [ td [ class "quiz audioInQuiz" ]
                        (if model.showAudio then
                            case subject.audioUrl of
                                Just url ->
                                    [ audioButton url ]

                                Nothing ->
                                    []

                         else
                            []
                        )
                    ]

                 else
                    []
                )
                    ++ [ td [ class "quiz", style "width" "15px" ]
                            [ input
                                [ class "w3-radio radio"
                                , id ("choice" ++ String.fromInt i)
                                , name "choice"
                                , placeholder answerChoiceI
                                , type_ "radio"
                                , value answerChoiceI
                                , HE.onInput Answer
                                , checked <| isChecked answerChoiceI
                                , disabled (Model.isAnswered model)
                                ]
                                []
                            ]
                       , td
                            (class "quiz"
                                :: (if Model.isAnswered model && isCorrect answerChoiceI then
                                        correctAttributes

                                    else
                                        []
                                   )
                            )
                            [ label (for ("choice" ++ String.fromInt i) :: labelAttributes answerChoiceI)
                                [ text answerChoiceI ]
                            ]
                       ]
    in
    div
        (case model.settings.trainMode of
            Description ->
                case model.settings.quizType of
                    MultipleChoice ->
                        [ class "descriptionQuiz multipleChoice" ]

                    TextField ->
                        [ class "descriptionQuiz textField" ]

            _ ->
                []
        )
        [ fieldset
            [ class "quiz" ]
            [ table [ class "quiz" ]
                (th [ colspan 2, class "quizHeader" ] [ text legendLabel ]
                    :: getChoices
                )
            ]
        , br [] []
        ]


displayAnswer : Nonempty String -> String
displayAnswer localNames =
    String.concat <| List.intersperse " / " <| NEL.toList localNames
