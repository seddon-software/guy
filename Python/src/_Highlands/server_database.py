############################################################
#
#    Highlands Server
#
#    © Highlands Negotiations, June 2018, v0.5
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
pd.set_option('display.max_rows', 1000)

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

def saveResults(results):
    connection = connect()
    try:
        resultsAsString = ','.join(str(e) for e in results)
        
        resultsAsTuple = literal_eval(resultsAsString)
        email = ""
        for keyValuePair in resultsAsTuple:
            if "email" in keyValuePair: 
                d = keyValuePair["email"]
                email = d["name"]
                break
            
        with connection.cursor() as cursor:
            # Create a new record
            sql = """INSERT INTO `{}` (`guid`, `timestamp`, `email`, `question`, `section`, `result`) 
                               VALUES (   %s,          %s,      %s,         %s,         %s,       %s)""".format(table)
            guid = str(uuid.uuid4())
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            questionsAsString = "-"
            section = "-"
            cursor.execute(sql, (guid, timestamp, email, questionsAsString, section, resultsAsString))
        # connection is not autocommit by default. So you must commit to save your changes.
        connection.commit()    
    finally:
        connection.rollback()
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

def getChartData2():
    """
    Summary of marks grouped by {section,client} pairs
    xaxis: marks
    yaxis: [section, client]
    """
    try:
        client
    except NameError:
        client = ""
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            
            chartData = pd.DataFrame(columns=['client','section','marks'])
            
            for row in results:
                keyValuePairs = literal_eval(row['result'])

                for pair in keyValuePairs:
                    if "client" in pair: 
                        d = pair["client"]
                        client = d["name"]
                        break
                
                # not used at present
                for pair in keyValuePairs:
                    if "email" in pair: 
                        d = pair["email"]
                        email = d["name"]
                        break
                
                for pair in keyValuePairs:
                    def addItem(section, marks): # last parameter must be a list
                        for mark in marks:
                            data = {
                                    'client' : client,
                                    'section': section,
                                    'email': email,
                                    'marks'  : mark
                                   }
                            return chartData.append(data, ignore_index=True)
                    # marks are presented differently in radio, checkbox and table entries:
                    #   radio:    a single mark which needs to be put in a list
                    #   checkbox: a string of marks which need to be split() into a list
                    #   table:    marks are already a list
                    if 'radio' in pair:
                        chartData = addItem(pair["radio"]["section"], [pair["radio"]["marks"]])
                    if 'checkbox' in pair:
                        chartData = addItem(pair["checkbox"]["section"], pair["checkbox"]["marks"].split())
                    if 'table' in pair:
                        chartData = addItem(pair["table"]["section"], pair["table"]["marks"])
        chartData[['marks']] = chartData[['marks']].apply(pd.to_numeric)  
        chartData = chartData.groupby(['section', 'client']).sum()
        chartData = chartData.to_dict()['marks']
        chartData = {"{},{}".format(compositeKey[0], compositeKey[1]):chartData[compositeKey] for compositeKey in chartData}
    finally:
        connection.close()
    return chartData

def getChartData3():
    """
    Summary of marks grouped by {section,client,email} triples
    xaxis: marks
    yaxis: [section, client, email]
    """
    try:
        client
    except NameError:
        client = ""
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            
            chartData = pd.DataFrame(columns=['client','section','email','marks'])
            
            for row in results:
                keyValuePairs = literal_eval(row['result'])

                for pair in keyValuePairs:
                    if "client" in pair: 
                        d = pair["client"]
                        client = d["name"]
                        break
                
                # not used at present
                for pair in keyValuePairs:
                    if "email" in pair: 
                        d = pair["email"]
                        email = d["name"]
                        break
                
                for pair in keyValuePairs:
                    def addItem(section, marks): # last parameter must be a list
                        for mark in marks:
                            data = {
                                    'client' : client,
                                    'section': section,
                                    'email': email,
                                    'marks'  : mark
                                   }
                            return chartData.append(data, ignore_index=True)
                    # marks are presented differently in radio, checkbox and table entries:
                    #   radio:    a single mark which needs to be put in a list
                    #   checkbox: a string of marks which need to be split() into a list
                    #   table:    marks are already a list
                    if 'radio' in pair:
                        chartData = addItem(pair["radio"]["section"], [pair["radio"]["marks"]])
                    if 'checkbox' in pair:
                        chartData = addItem(pair["checkbox"]["section"], pair["checkbox"]["marks"].split())
                    if 'table' in pair:
                        chartData = addItem(pair["table"]["section"], pair["table"]["marks"])
        chartData[['marks']] = chartData[['marks']].apply(pd.to_numeric)  
        chartData = chartData.groupby(['section', 'client', 'email']).sum()
        chartData = chartData.to_dict()['marks']
        chartData = {"{},{},{}".format(compositeKey[0], compositeKey[1], compositeKey[2]):chartData[compositeKey] for compositeKey in chartData}
    finally:
        connection.close()
    return chartData

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
    
    def seriesAsFrequencies(series):
        # pd.value_count doesn't return anything for missing indices and sorts highest frequency first
        # so convert to a list in order including zero counts
        optionCount = int(series.index.values.tolist()[0][1])
        frequencies = [0]*optionCount
        for (value,size),count in series.iteritems():
            frequencies[int(value)] = count
        return frequencies
        
    recordCount = chartData.shape[1]
    frequencies = []
    for i in range(recordCount):
        series = pd.value_counts(chartData[i])
        frequencies.append(seriesAsFrequencies(series))
    chartData = pd.DataFrame(frequencies)
    chartData.fillna(-1, inplace=True)
    chartData = chartData.astype(int)

    return pd.DataFrame(chartData).values.tolist()

def getChartData():
    """
    Summary of marks for each database record
    xaxis: marks
    yaxis: [section, client]
    tooltip: email
    """
    try:
        client
    except NameError:
        client = ""
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            chartData = pd.DataFrame(columns=['guid', 'client','section','email','marks'])
            
            for row in results:
                guid = row['guid']
                keyValuePairs = literal_eval(row['result'])

                for pair in keyValuePairs:
                    if "client" in pair: 
                        d = pair["client"]
                        client = d["name"]
                        break
                
                for pair in keyValuePairs:
                    if "email" in pair: 
                        d = pair["email"]
                        email = d["name"]
                        break
                
                for pair in keyValuePairs:
                    def addItem(section, marks): # last parameter must be a list
                        for mark in marks:
                            data = {
                                    'guid'   : guid,
                                    'client' : client,
                                    'section': section,
                                    'email'  : email,
                                    'marks'  : mark
                                   }
                            return chartData.append(data, ignore_index=True)
                    # marks are presented differently in radio, checkbox and table entries:
                    #   radio:    a single mark which needs to be put in a list
                    #   checkbox: a string of marks which need to be split() into a list
                    #   table:    marks are already a list
                    if 'radio' in pair:
                        chartData = addItem(pair["radio"]["section"], [pair["radio"]["marks"]])
                    if 'checkbox' in pair:
                        chartData = addItem(pair["checkbox"]["section"], pair["checkbox"]["marks"].split())
                    if 'table' in pair:
                        chartData = addItem(pair["table"]["section"], pair["table"]["marks"])
        chartData[['marks']] = chartData[['marks']].apply(pd.to_numeric)
        print(chartData)  
        chartData = chartData.groupby(['section', 'client','email','guid']).sum()
        chartData = chartData.to_dict()['marks']
        print(len(chartData))  
        chartData = {"{},{} <{}>,{}".format(compositeKey[0], compositeKey[1], compositeKey[2], compositeKey[3]):chartData[compositeKey] for compositeKey in chartData}
    finally:
        connection.close()
        print(chartData)
    return chartData


root, rootPassword, manager, managerPassword, database, table, server, port = getNamesAndPasswords()
if __name__ == "__main__":
    import json
    data = getChartData()
    for key in data:
        print(key, data[key])
    jsonString = json.dumps(getChartData())
    jsonAsBytes = jsonString.encode("UTF-8")
    #print(jsonAsBytes)
