from test_library import *

try:
    startServer()
    startBrowser("http://192.168.0.89:9097/client.html")
    enterText(3, "seddon@demon.co.uk");   
    enterText(7, "chris seddon");   
    enterText(8, "Logsys");
    enterText(11, "Guy Lloyd");
    enterText(13, "Finance");

    enterText(16, "Microsoft");
    enterText(17, "Wokingham");
    clickRadioSet(21, 1, 3)
    clickRadioSet(21, 2, 2)
    clickRadioSet(21, 3, 1)
    clickRadioSet(21, 4, 3)
    clickRadio(32, 1)
    enterTextArea(35, "Line 1\nLine 2\nLine 3\n");
    clickCheckbox(37, 1)
    clickCheckbox(37, 3)
    submit("Yes")

    enterText(16, "Smiths");
    enterText(17, "Basingstoke");
    clickRadioSet(21, 1, 2)
    clickRadioSet(21, 2, 2)
    clickRadioSet(21, 3, 3)
    clickRadioSet(21, 4, 1)
    clickRadio(32, 1)
    enterTextArea(35, "ABC\nDEF\nGEH\n");
    clickCheckbox(37, 2)
except Exception as e:
    print(e)
    
