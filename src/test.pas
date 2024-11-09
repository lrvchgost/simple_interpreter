BEGIN

    BEGIN
        number := 3;
        a := number;
        b := 10 * a + 10 * number div 4;
        c := a - - b;
    END;

    x := 11;

    BEGIN
        number := 3;
        a := number + 1;
        b := 10 * a + 10 * number div 4;
        c := a - - b;
    END;

END.
