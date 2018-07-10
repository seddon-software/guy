############################################################
#
#    Highlands Server
#
#    © Highlands Negotiations, June 2018, v0.6
#
############################################################

import pandas as pd
import numpy as np
import os

from test_library import (startBrowser, stopBrowser, enterText, enterTextArea, 
                          clickTable, clickTable2, clickRadio, clickCheckbox, submit, startServer)

startServer()

def getNamesAndPasswords():
    cwd = os.getcwd()
    os.chdir("..")
    pd.set_option('display.width', 1000)
    table = pd.read_excel('setup.xlsx', 'Sheet1')
    os.chdir(cwd)
    rootFrame = table[(table.TYPE == "user") & (table.NAME == "root")]
    managerFrame = table[(table.TYPE == "user") & (table.NAME == "manager")]
    databaseFrame = table[table.TYPE == "database"]
    hostFrame = table[table.TYPE == "host"]

    root = rootFrame["NAME"].tolist()[0]
    rootPassword = rootFrame["OPTION"].tolist()[0]
    manager = managerFrame["NAME"].tolist()[0]
    managerPassword = managerFrame["OPTION"].tolist()[0]
    database = databaseFrame["NAME"].tolist()[0]
    table = databaseFrame["OPTION"].tolist()[0]
    server = hostFrame["NAME"].tolist()[0]
    port = hostFrame["OPTION"].tolist()[0]
    return [root, rootPassword, manager, managerPassword, database, table, server, port]

root, rootPassword, manager, managerPassword, database, table, server, port = getNamesAndPasswords()
pd.set_option('display.width', 1000)
table = pd.read_excel('test_data.xlsx', 'Sheet1')
table = table[np.isfinite(table['Question'])]
table['Question'] = table['Question'].astype(int)
table = table.dropna(axis="columns")
table.drop(axis=1, labels="Text", inplace=True)


try:
    rows, cols = table.shape
    
    for testNo in range(1, cols-1):
        startBrowser("http://{}:{}/client.html".format(server, port))
        print("Starting Test {}".format(testNo))
        data = "Test{}".format(testNo)
        df = table[["Question", "Category", data]]
        for index, row in df.iterrows():
            question = row["Question"]
            category = row["Category"]
            values = row[data]
            if category == "text":     enterText(question, values)
            if category == "textarea": enterTextArea(question, values)
            if category == "radio":    clickRadio(question, values)
            if category == "email":    enterText(question, values)
            if category == "client":   enterText(question, values)
            if category == "table":
                for i, value in enumerate(values.split()):
                    clickTable(question, i+1, value)
            if category == "table2":
                values = str(values)
                row, col = values.split()
                clickTable2(question, row, col)
            if category == "checkbox":
                values = str(values)
                for value in values.split():
                    clickCheckbox(question, int(value))
        submit("No")
        stopBrowser()
        
except Exception as e:
    print(e)

print("Completed Tests")

