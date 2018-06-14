############################################################
#
#    Highlands Server
#
############################################################

import pandas as pd
import math
import json

pd.set_option('display.width', 1000)
table = pd.read_excel('questions.xlsx', 'Sheet1')
table[['Number']] = table[['Number']].fillna(value=0)
table['Number'] = table.Number.astype(int)

def isAutoFill(field):
    if(isinstance(field, str)): 
        return field.strip() == "autofill"
    else:
        return False
    
def extractQuestions(df):
    '''questions will be a list of [Question, Type] pairs'''
    questions = []    
    for row in df.itertuples():
        if(isinstance(row[2], str)):
            questions.append([str(row[1]), row[2], row[3], isAutoFill(row[4])])
    return questions


def extractOptions(df):
    df.drop(['Number', 'Question','Type'], axis = 1, inplace = True)
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
    
def filterQuestions(questionType):
    listQuestions = []
    for question, option in zip(questions, options):
        if(question[2] == questionType): listQuestions.append(question)
    return pd.DataFrame(listQuestions)

def filterOptions(questionType):
    listOptions = []
    for question, option in zip(questions, options):
        if(question[2] == questionType): listOptions.append(option)
    return pd.DataFrame(listOptions)

questions = extractQuestions(table[['Number', 'Question', 'Type', 'Option1']])
options = extractOptions(table)

if __name__ == "__main__":
    for q in questions:
        print(q)
    jsonString = json.dumps(questions)
        
    for z in options:
        print(z)
    jsonString = json.dumps(options)
