module View exposing (view)

import Config
import Flip exposing (flip)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as HE
import List.Extra as ListX
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
                    ++ (if model.config.groupCanBeSet then
                            [ groupFieldSet model ]

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
                                [ class "button startButton end-button"
                                , HE.onClick GoLanding
                                ]
                                [ text "Change Deck" ]
                            ]

                        else
                            []
                       )
                )
            ]
        ]


groupFieldSet : Model -> Html Msg
groupFieldSet model =
    let
        discoveredGroups =
            model.config.allSubjects
                |> NEL.map .group
                |> NEL.filter MaybeX.isJust
                    (Just "err: must have at least one subject with group")
                |> NEL.map (Maybe.withDefault "err: unexpected Nothing")
                |> NEL.uniq
                |> NEL.sort
                |> flip NEL.append (NEL.singleton "All")

        groupInput group =
            let
                inputId =
                    String.filter (\c -> c /= ' ') group ++ "Input"
            in
            [ tr []
                [ td [ class "quiz" ]
                    [ input
                        [ id <| inputId
                        , name inputId
                        , type_ "radio"
                        , value group
                        , HE.onInput SetGroup
                        , checked <|
                            case group of
                                "All" ->
                                    MaybeX.isNothing model.settings.group

                                grp ->
                                    model.settings.group == Just grp
                        ]
                        []
                    ]
                , td [ class "quiz" ]
                    [ label [ for inputId ]
                        [ text group ]
                    ]
                ]
            ]
    in
    fieldset []
        [ legend [] [ strong [] [ text model.config.groupDisplay ] ]
        , table [] <|
            NEL.foldl
                (\grp acc -> acc ++ groupInput grp)
                []
                discoveredGroups
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

        trainModeInput ( mode, modeString ) =
            [ tr []
                [ td [ class "quiz" ]
                    [ input
                        [ id modeString
                        , name "trainMode"
                        , type_ "radio"
                        , value modeString
                        , HE.onInput SetTrainMode
                        , checked <| model.settings.trainMode == mode
                        ]
                        []
                    ]
                , td [ class "quiz" ]
                    [ label [ for modeString ]
                        [ text (Config.showTrainMode model.config mode) ]
                    ]
                ]
            ]
    in
    fieldset []
        [ legend [] [ strong [] [ text "Training Mode" ] ]
        , table [] <|
            List.foldl
                (\modeAndName acc ->
                    acc
                        ++ filterConfig
                            (Tuple.first modeAndName)
                            (trainModeInput modeAndName)
                )
                []
                [ ( Review, "Review" )
                , ( Urname, "Urname" )
                , ( LocalName, "LocalName" )
                , ( Description, "Description" )
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
                        [ id "unicode"
                        , name "script"
                        , type_ "radio"
                        , value "Unicode"
                        , HE.onInput SetScript
                        , checked <| model.settings.script == Unicode
                        ]
                        []
                    ]
                , td [ class "quiz" ]
                    [ label [ for "unicode" ] <| radioScriptLabelHtml Unicode ]
                ]
            , tr []
                [ td [ class "quiz" ]
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
                , td [ class "quiz" ]
                    [ label [ for "latin" ] <| radioScriptLabelHtml Latin ]
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
                                [ class (buttonStyle <| Model.nextEnabled model)
                                , disabled <| not (Model.nextEnabled model)
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
            String.fromInt
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
                        ++ String.fromInt model.score
                        ++ "/"
                        ++ String.fromInt model.total
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
                            ++ String.fromInt (remaining - 1)
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
            Model.getAnswer model.settings card.subject == val

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
            List.map (Model.getAnswer model.settings) card.choices
                -- if duplicates, number of choices will be less than numChoices
                |> ListX.unique
                |> List.indexedMap toInputView

        toInputView : Int -> String -> Html Msg
        toInputView i val =
            tr []
                [ td [ class "quiz", style "width" "15px" ]
                    [ input
                        [ id ("choice" ++ String.fromInt i)
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
                    [ label (for ("choice" ++ String.fromInt i) :: labelAttributes val)
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
