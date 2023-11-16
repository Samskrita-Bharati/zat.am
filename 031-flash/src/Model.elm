module Model exposing
    ( getCorrectAnswers
    , getScrubbedAnswers
    , initWithModel
    , initialModel
    , isAnswered
    , nextEnabled
    , prevEnabled
    , processSelectedDeck
    , sanitize
    )

import Dict exposing (Dict)
import List.Extra as ListX
import List.Nonempty as NEL exposing (Nonempty(..))
import Maybe.Extra as MaybeX
import Types exposing (..)
import Unicode


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


stdReplacements : Dict String String
stdReplacements =
    Dict.fromList
        [ ( "I", "1" )
        , ( "II", "2" )
        , ( "III", "3" )
        , ( "IV", "4" )
        ]


sanitize : String -> String
sanitize =
    String.join " "
        << List.map
            (\wrd ->
                case Dict.get wrd stdReplacements of
                    Just w ->
                        w

                    Nothing ->
                        wrd
            )
        << List.filter (\wrd -> wrd /= "POSE")
        << ListX.takeWhile (\wrd -> wrd /= "/")
        << String.words
        << String.foldr
            (\ch acc ->
                if
                    {- Debug.log ("isAlpha " ++ Debug.toString ch) (Unicode.isAlpha ch)
                       || Debug.log ("isDigit " ++ Debug.toString ch) (Unicode.isDigit ch)
                       || List.member (Debug.log ("category=" ++ Debug.toString ch) (Unicode.getCategory ch))
                           [ Just Unicode.MarkNonSpacing, Just Unicode.MarkSpacingCombining ]
                    -}
                    Unicode.isAlpha ch
                        || Unicode.isDigit ch
                        || List.member (Unicode.getCategory ch)
                            [ Just Unicode.MarkNonSpacing, Just Unicode.MarkSpacingCombining ]
                then
                    String.cons ch acc

                else
                    case ch of
                        '-' ->
                            String.cons ' ' acc

                        '—' ->
                            String.cons ' ' acc

                        ' ' ->
                            String.cons ' ' acc

                        '\n' ->
                            String.cons ' ' acc

                        '/' ->
                            " / " ++ acc

                        _ ->
                            -- remove other non-alpha
                            acc
            )
            ""
        << String.toUpper
        << (\str ->
                if String.startsWith "[" str && String.endsWith "]" str then
                    ""

                else
                    str
           )


isAnswered : { a | userAnswer : Maybe b } -> Bool
isAnswered model =
    MaybeX.isJust model.userAnswer


getScrubbedAnswers : Settings -> Subject -> Nonempty String
getScrubbedAnswers settings subj =
    let
        -- ["(Standing) Mountain Pose", "Other Name"]
        listOfNames : List String
        listOfNames =
            NEL.toList <| getCorrectAnswers settings subj

        -- [["(Standing)", "Mountain", "Pose"], ["Other", "Name"]]
        listsOfWords : List (List String)
        listsOfWords =
            List.map String.words listOfNames

        -- after wordToList:
        -- [[["(Standing)", ""], ["Mountain"], ["Pose"]], [["Other"], ["Name"]]]
        -- after traversal:
        -- [[["(Standing)", "Mountain", "Pose"], ["", "Mountain", "Pose"]], [["Other"], ["Name"]]]
        traversedListsOfLists : List (List (List String))
        traversedListsOfLists =
            List.map (listTraverse wordToList) listsOfWords

        -- [["(Standing) Mountain Pose", "Mountain Pose"], ["Other Name"]]
        joinedStringLists : List (List String)
        joinedStringLists =
            (List.map << List.map) (String.join " ") traversedListsOfLists

        -- Nonempty "(Standing) Mountain Pose" ["Mountain Pose", "Other Name"]
        joinedLists : List String
        joinedLists =
            List.concat joinedStringLists

        sanitizedList : List String
        sanitizedList =
            List.map sanitize joinedLists
    in
    case NEL.fromList sanitizedList of
        Just nel ->
            nel

        Nothing ->
            NEL.singleton "invalid"


getCorrectAnswers : Settings -> Subject -> Nonempty String
getCorrectAnswers { trainMode, script } subj =
    case trainMode of
        Review ->
            NEL.singleton "N/A"

        Urname ->
            if script == Latin then
                NEL.singleton subj.latin

            else
                NEL.singleton subj.unicode

        LocalName ->
            subj.localNames

        Description ->
            NEL.singleton subj.description


nextEnabled : Model -> Bool
nextEnabled model =
    let
        notEnd =
            not (NEL.isSingleton model.remainingDeck)

        inReview =
            model.settings.trainMode == Review
    in
    not model.inSettingsScreen && notEnd && (inReview || isAnswered model)


prevEnabled : Model -> Bool
prevEnabled model =
    model.settings.trainMode == Review && not (List.isEmpty model.previousDeck)


wordToList : String -> List String
wordToList w =
    if String.startsWith "(" w && String.endsWith ")" w then
        [ String.slice 1 -1 w, "" ]

    else
        [ w ]



{- listSequence : List (List a) -> List (List a)
   listSequence =
       listTraverse identity
-}


listTraverse : (a -> List b) -> List a -> List (List b)
listTraverse f =
    let
        listLift2 g x =
            listApply (List.map g x)

        consF x ys =
            listLift2 (::) (f x) ys

        listApply gs xs =
            gs
                |> List.concatMap
                    (\g ->
                        xs
                            |> List.concatMap
                                (\x ->
                                    [ g x ]
                                )
                    )
    in
    List.foldr consF [ [] ]
