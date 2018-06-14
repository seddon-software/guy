############################################################
#
#    Highlands Server
#
############################################################

import pymysql.cursors
import cgitb
import numpy as np
import pandas as pd
import uuid
import datetime
from ast import literal_eval
import server_excel as xl

cgitb.enable()

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

def addSampleData(user, password, database):
    connection = connect(user, password, database)
    try:
        with connection.cursor() as cursor:
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            # pymysql.cursors.Cursor._defer_warnings = True
            sql = """INSERT INTO `{}` (`guid`, `timestamp`, `email`, `question`, `result`) 
                               VALUES (   %s,          %s,      %s,         %s,       %s)""".format(table)
            for i in range(10):
                guid = str(uuid.uuid4())
                cursor.execute(sql, (guid, timestamp, "abc@def.com", "abc", "def"))
        connection.commit()    
    finally:
        connection.close()

def saveResults(results):
    connection = connect()
    try:
        resultsAsString = ','.join(str(e) for e in results)
        resultsAsTuple = literal_eval(resultsAsString)
        email = ""
        for keyValuePair in resultsAsTuple:
            if "email" in keyValuePair: 
                email = keyValuePair["email"]
                break
            
        with connection.cursor() as cursor:
            # Create a new record
            sql = """INSERT INTO `{}` (`guid`, `timestamp`, `email`, `question`, `result`) 
                               VALUES (   %s,          %s,      %s,         %s,       %s)""".format(table)
            guid = str(uuid.uuid4())
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            question = "This is the question"
            cursor.execute(sql, (guid, timestamp, email, question, resultsAsString))
        # connection is not autocommit by default. So you must commit to save your changes.
        connection.commit()    
    finally:
        connection.close()

def printResults():
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            for row in results:
                print(row)
    finally:
        connection.close()
        
def getPieChartQuestionsAndOptions():
    questions = xl.filterQuestions("radio")
    options = xl.filterOptions("radio")
    questionsAndOptions = pd.concat([questions, options], axis=1)
    return questionsAndOptions.values.tolist()

def getPieChartData():
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            entries = len(results)
            
            chartData = []
            for row in results:
                arr = []
                keyValuePairs = literal_eval(row['result'])
                for pair in keyValuePairs:
                    if 'radio' in pair:
                        arr.append((pair["radio"]["selection"],pair["radio"]["optionCount"]))
                chartData.append(arr)
        def getMinSize():
            minimum = 100
            for array in chartData:
                if len(array) < minimum: minimum = len(array)
            return minimum
        def truncateArrays(length):
            for i in range(len(chartData)):
                chartData[i] = chartData[i][:length]
        try:
            # all totals should be of the same length, but during development this might be the case
            truncateArrays(getMinSize())            
        except Exception as e:
            print(e) 
    finally:
        connection.close()

    chartData = pd.DataFrame(chartData)
    
    def seriesAsFrequencies(s):
        # pd.value_count doesn't return anything for missing indices and sorts highest frequency first
        # so convert to a list in order including zero counts
        optionCount = int(s.index.values.tolist()[0][1])
        zz = [0]*optionCount
        for (value,size),count in s.iteritems():
            zz[int(value)] = count
        return zz
        
    print(chartData.shape, entries)
    recordCount = chartData.shape[1]
    for i in range(recordCount):
        series = pd.value_counts(chartData[i])
        zz = seriesAsFrequencies(series)
        print("zz:",zz)
        # !!!!!! aggregate the zz's to form a result to send to client
    return pd.DataFrame(chartData).values.tolist()

root, rootPassword, manager, managerPassword, database, table, server, port = getNamesAndPasswords()
if __name__ == "__main__":
    print(getPieChartData())

