module Model exposing
    ( getAnswer
    , initWithModel
    , initialModel
    , nextEnabled
    , processSelectedDeck
    )

import List.Nonempty as NEL
import Maybe.Extra as MaybeX
import Types exposing (..)


initialModel : Config -> Model
initialModel cfg =
    let
        mdl =
            defaultModel
    in
    { mdl | config = cfg }


initWithModel : Model -> ( Model, Cmd Msg )
initWithModel model =
    ( model
    , Cmd.none
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
