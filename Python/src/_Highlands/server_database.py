############################################################
#
#    Highlands Server
#
############################################################

import pymysql.cursors
import cgitb
import numpy as np
import pandas as pd
from ast import literal_eval
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

def saveResults(results):
    connection = connect()
    try:
        resultsAsString = ','.join(str(e) for e in results)
        with connection.cursor() as cursor:
            # Create a new record
            sql = "INSERT INTO `{}` (`question`, `result`) VALUES (%s, %s)".format(table)
            cursor.execute(sql, ("no used", resultsAsString))
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

def getChartData():
    connection = connect()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            entries = len(results)
            
            totals = []
            for row in results:
                arr = []
                keyValuePairs = row['result'].split(",")
                for pair in keyValuePairs:
                    h = literal_eval(pair)
                    if 'radio' in h:
                        arr.append(h["radio"])
                totals.append(arr)
        # all totals should be of the same length, but during development this might be the case
        def getMinSize():
            minimum = 100
            for array in totals:
                if len(array) < minimum: minimum = len(array)
            return minimum
        def truncateArrays(length):
            for i in range(len(totals)):
                totals[i] = totals[i][:length]
        try:
            truncateArrays(getMinSize())            
            totals = np.array(totals)
            totals = np.sum(totals, axis=0)/entries
        except Exception as e:
            print(e) 
    finally:
        connection.close()
    
    chartData = {}
    for i, val in enumerate(totals):
        chartData["Q{}".format(i)] = val
    return chartData

root, rootPassword, manager, managerPassword, database, table, server, port = getNamesAndPasswords()
if __name__ == "__main__":
    print(getChartData())

