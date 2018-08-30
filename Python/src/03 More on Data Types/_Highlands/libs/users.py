import pandas as pd
import os, sys
from myglobals import MyGlobals

if __name__ == "__main__":
    os.chdir("..")


class Users:
    def __init__(self):
        self.excelFile = "users.xlsx"
        table = pd.read_excel(self.excelFile, 'users')
        table.dropna(inplace=True)
        self.users = table
        
    def getUsers(self):
        return self.users
    
    def getPassword(self, user):
        table = self.users
        entry = table.loc[table['email'] == user]
        return entry['password'].values.tolist()[0]

    def changePassword(self, user, password):
        writer = pd.ExcelWriter(self.excelFile)
        table = self.users
        table.loc[table['email'] == user, 'password'] = password
        table.to_excel(writer, 'users', index=False)      

if __name__ == "__main__":
    u = Users()
    u.changePassword("johxn@abc.co.uk", "xyz2")
    print(u.getUsers())
    print("password = ",u.getPassword("john@abc.co.uk"))
    