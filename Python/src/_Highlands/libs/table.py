import os
if __name__ == "__main__": os.chdir("..")
import pandas as pd
from ast import literal_eval
from myglobals import MyGlobals
from database import Database
g = MyGlobals()
db = Database()

class Table:
    def getTableData(self):
        """
        """
        return "Hello"
        client = None
        results = db.getDatabaseResults()
        for row in results:
            keyValuePairs = literal_eval(row['result'])

            for pair in keyValuePairs:
                if "client" in pair: 
                    client = pair["client"]["name"]
                    break
            
            for pair in keyValuePairs:
                if "email" in pair: 
                    email = pair["email"]["name"]
                    break
            
            for pair in keyValuePairs:
                if 'table' in pair:
                    x = 100
        return None    # return a dict

if __name__ == "__main__":
    table = Table()
    data = table.getTableData()
    print(data)
    
