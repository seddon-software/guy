############################################################
#
#    Highlands Server
#
############################################################

import pandas as pd
import math

pd.set_option('display.width', 1000)
table = pd.read_excel('questions.xlsx', 'Sheet1')

def isAutoFill(field):
    if(isinstance(field, str)): 
        return field.strip() == "autofill"
    else:
        return False
    
def extractQuestions(df):
    '''questions will be a list of [Question, Type] pairs'''
    questions = []    
    for row in df.itertuples():
        if(isinstance(row[1], str)):
            questions.append([row[1], row[2], isAutoFill(row[3])])
    return questions


def extractOptions(df):
    df.drop(['Question','Type'], axis = 1, inplace = True)
    df = df.fillna(value='')
    options = []
    row = []
    for t in df.itertuples():
        if(t[1] != ''):
            row.append([i for i in t[1:] if i != ''])
        else:            
            if(row): options.append(row)
            row = []
    if(row): options.append(row)    # for last row
        
    return options
    
questions = extractQuestions(table[['Question', 'Type', 'Option1']])
options = extractOptions(table)

if __name__ == "__main__":
    for q in questions:
        print(q)
#     for z in options:
#         print(z)
