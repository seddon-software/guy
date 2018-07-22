import pymysql.cursors
from myglobals import MyGlobals

g = MyGlobals()

class Database:
    def connect(self):
        connection = pymysql.connect(host='localhost',
                                     user=g.get("manager"),
                                     password=g.get("managerPassword"),
                                     db=g.get("database"),
                                     charset='utf8mb4',
                                     cursorclass=pymysql.cursors.DictCursor)
        return connection

    def getDatabaseResults(self):
        connection = self.connect()
        try:
            with connection.cursor() as cursor:
                sql = "SELECT `*` FROM `{}`".format(g.get("table"))
                cursor.execute(sql)
                results = cursor.fetchall()
        finally:
            connection.close()
        return results
