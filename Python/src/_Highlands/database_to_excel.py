############################################################
#
#    Highlands Server
#
############################################################

import pymysql.cursors
import pandas as pd
from ast import literal_eval
import collections


def connect():
    connection = pymysql.connect(host='localhost',
                                 user=manager,
                                 password=managerPassword,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    return connection

def getNamesAndPasswords():
    pd.set_option('display.width', 1000)
    table = pd.read_excel('setup.xlsx', 'Sheet1')
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

def getChartData():
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
 
            resultsArray = []
            orderedDict = collections.OrderedDict()
            
            for row in results:
                for key in row:
                    if key == 'result':
                        keyValuePairs = literal_eval(row['result'])
                        for key in keyValuePairs:
                            for k in key:   # should only be 1 key
                                entry = key[k]
                                question = entry['question']
                                for key in entry:
                                    theKey = "{}-{}".format(question, key)
                                    theValue = entry[key]
                                    orderedDict[theKey] = theValue
                                pass
                    else:
                        orderedDict[key] = row[key]
                resultsArray.append(orderedDict)
        chartData = pd.DataFrame(resultsArray)
    finally:
        connection.close()
    return chartData


root, rootPassword, manager, managerPassword, database, table, server, port = getNamesAndPasswords()
outFile = 'results.xlsx'
getChartData().to_excel(outFile, index = False)
print("MySql database[{}],table[{}] exported to Excel[{}]".format(database, table, outFile))
