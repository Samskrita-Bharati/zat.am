module Card exposing (generateChoices, generateDeck)

import List.Nonempty as NEL exposing (Nonempty(..))
import Random exposing (Generator)
import Random.Extra
import Random.List as RL
import Types


generateDeck : Int -> Nonempty Types.Subject -> Generator (List Types.Card)
generateDeck numChoices allSubjects =
    RL.shuffle
        (NEL.toList allSubjects)
        |> (Random.andThen <|
                subjects2CardsGenerator numChoices allSubjects
           )


subjects2CardsGenerator :
    Int
    -> Nonempty Types.Subject
    -> List Types.Subject
    -> Generator (List Types.Card)
subjects2CardsGenerator numChoices allSubjects =
    Random.Extra.traverse
        (\subj ->
            generateChoices numChoices allSubjects subj
                |> Random.map (\chs -> { subject = subj, choices = chs })
        )


generateChoices :
    Int
    -> Nonempty Types.Subject
    -> Types.Subject
    -> Generator (List Types.Subject)
generateChoices numChoices allSubjects correctSubject =
    let
        -- the "wrong" subjects from the list of all subjects
        wrongSubjects =
            -- filter out the correct subject and any subject
            -- that has the same localNames as the correct subject.
            -- This is to avoid prompting for Madam! with both मान्ये and आर्ये as
            -- choices, both of which should be correct; or prompting for
            -- मान्ये with both Madam! and Madam! as choices, which would appear
            -- the same as each other
            NEL.filter
                (\a ->
                    a.subjectId
                        /= correctSubject.subjectId
                        && (a.localNames
                                /= correctSubject.localNames
                           )
                )
                Types.invalidSubject
                allSubjects

        choicesGenerator =
            Random.map Tuple.first <| RL.choices (numChoices - 1) (NEL.toList wrongSubjects)
    in
    -- correct position
    Random.int 0 (numChoices - 1)
        |> Random.andThen
            (\correctPos ->
                -- starts recursion
                Random.map
                    (\selected ->
                        List.take correctPos selected ++ (correctSubject :: List.drop correctPos selected)
                    )
                    choicesGenerator
            )
