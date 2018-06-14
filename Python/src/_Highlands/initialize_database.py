############################################################
#
#    Highlands Server
#
############################################################

import pymysql.cursors
import cgitb
cgitb.enable()
import uuid
import datetime
import pandas as pd


def execute(connection, sql):
    # connection is not autocommit by default. So you must commit to save your changes.
    try:
        with connection.cursor() as cursor:
            pymysql.cursors.Cursor._defer_warnings = True

            cursor.execute(sql)
        connection.commit()    
    finally:
        connection.close()

def connect(user, password, database=""):
    connection = pymysql.connect(host='localhost',
                                 user=user,
                                 password=password,
                                 db=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    return connection

def printTable(manager, managerPassword, database, table):
    connection = connect(manager, managerPassword, database)
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `*` FROM `{}`".format(table)
            cursor.execute(sql)
            results = cursor.fetchall()
            for row in results:
                print(row)
    finally:
        connection.close()

def getNamesAndPasswords():
    pd.set_option('display.width', 1000)
    table = pd.read_excel('setup.xlsx', 'Sheet1')
    rootFrame = table[(table.TYPE == "user") & (table.NAME == "root")]
    managerFrame = table[(table.TYPE == "user") & (table.NAME == "manager")]
    databaseFrame = table[table.TYPE == "database"]

    root = rootFrame["NAME"].tolist()[0]
    rootPassword = rootFrame["OPTION"].tolist()[0]
    manager = managerFrame["NAME"].tolist()[0]
    managerPassword = managerFrame["OPTION"].tolist()[0]
    database = databaseFrame["NAME"].tolist()[0]
    table = databaseFrame["OPTION"].tolist()[0]
    return [root, rootPassword, manager, managerPassword, database, table]

def createDatabase(root, rootPassword, database):
    connection = connect(root, rootPassword)
    sql = "CREATE DATABASE IF NOT EXISTS {}".format(database)
    execute(connection, sql)

def createManagerUser(root, rootPassword, manager, managerPassword):
    connection = connect(root, rootPassword)
    sql = "CREATE USER IF NOT EXISTS '{}'@'localhost' IDENTIFIED BY '{}'".format(manager, managerPassword)
    execute(connection, sql)

def grantPrivilegesToManager(root, rootPassword, manager, database):
    connection = connect(root, rootPassword, database)
    sql = "GRANT ALL PRIVILEGES ON {}.* TO '{}'@'localhost'".format(database, manager)
    execute(connection, sql)
    
def dropTable(table, manager, managerPassword, database):
    connection = connect(manager, managerPassword, database)
    sql = "DROP TABLE IF EXISTS {}".format(table)
    execute(connection, sql)

#         email VARCHAR(30) NOT NULL,

def createTable(table, manager, managerPassword, database):
    connection = connect(manager, managerPassword, database)
    sql = """CREATE TABLE IF NOT EXISTS {} (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        guid VARCHAR(36) NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        email VARCHAR(40) NOT NULL,
        question VARCHAR(60) NOT NULL,
        result VARCHAR(500) NOT NULL
        )""".format(table)
    execute(connection, sql)

def showTables(user, password, database):
    connection = connect(user, password, database)
    try:
        with connection.cursor() as cursor:
            sql = "SHOW TABLES"
            cursor.execute(sql)
            results = cursor.fetchall()
            for row in results: print(row)
    finally:
        connection.close()

def showUsers(user, password, database):
    connection = connect(user, password, database)
    try:
        with connection.cursor() as cursor:
            sql = "SELECT user FROM mysql.user GROUP BY user"
            cursor.execute(sql)
            results = cursor.fetchall()
            for row in results: print(row)
    finally:
        connection.close()

def addSampleData(user, password, database):
    connection = connect(user, password, database)
    try:
        with connection.cursor() as cursor:
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            # pymysql.cursors.Cursor._defer_warnings = True
            sql = """INSERT INTO `{}` (`guid`, `timestamp`, `email`, `question`, `result`) 
                               VALUES (   %s,          %s,      %s,         %s,       %s)""".format(table)
            
            samples = []
            samples.append(("{'title': 'blank'},{'email': 'bbb@def.co.uk'},{'text': 'chris'},{'text': 'ibm'},{'text': 'guy'},{'text': 'finance'},"  
                                                                      "{'radio': 3},{'radio': 7},{'radio': 1},{'radio': 5},{'radio': 5}"))
            for sample in samples:
                guid = str(uuid.uuid4())
                cursor.execute(sql, (guid, timestamp, "abc@def.com", "question", sample))
        connection.commit()    
    finally:
        connection.close()
#{'id': 5, 'guid': 'a27ba0d1-44d7-41bc-97d3-2f273db8e991', 'timestamp': datetime.datetime(2018, 6, 14, 16, 53, 11), 'email': 'bbb@def.co.uk', 'question': 'This is the question', 'result': "{'title': 'blank'},{'email': 'bbb@def.co.uk'},{'text': 'chris'},{'text': 'ibm'},{'text': 'guy'},{'text': 'finance'},{'radio': 3},{'radio': 7},{'radio': 1},{'radio': 5},{'radio': 5}"}


if __name__ == "__main__":
    root, rootPassword, manager, managerPassword, database, table = getNamesAndPasswords()
    createDatabase(root, rootPassword, database)
    createManagerUser(root, rootPassword, manager, managerPassword)
    grantPrivilegesToManager(root, rootPassword, manager, database)
    dropTable(table, manager, managerPassword, database)
    createTable(table, manager, managerPassword, database)
    showTables(manager, managerPassword, database)
    showUsers(root, rootPassword, database)
    addSampleData(manager, managerPassword, database)
    printTable(manager, managerPassword, database, table)
