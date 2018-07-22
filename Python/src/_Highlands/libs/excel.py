import pandas as pd
import math
import json
from myglobals import MyGlobals

g = MyGlobals()

class Excel:
    def isAutoFill(self, field):
        if(isinstance(field, str)): 
            return field.strip() == "autofill"
        else:
            return False
        
    def extractQuestions(self, df):
        '''questions will be a list of [QuestionNo, Section, Question, Type, Autofill] tuples'''
        questions = []    
        for row in df.itertuples():
            if(isinstance(row[3], str)):
                questions.append([str(row[1]), row[2], row[3], row[4], self.isAutoFill(row[5])])
        return questions
    
    
    def extractOptions(self, df):
        df.drop(['Number', 'Section', 'Question','Type'], axis = 1, inplace = True)
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
        
    def filterQuestions(self, questionType):
        listQuestions = []
        for question, option in zip(self.questions, self.options):
            if(question[3] == questionType): listQuestions.append(question)
        return pd.DataFrame(listQuestions)
     
    def filterOptions(self, questionType):
        listOptions = []
        for question, option in zip(self.questions, self.options):
            if(question[3] == questionType): listOptions.append(option)
        return pd.DataFrame(listOptions)
    
    def getQuestions(self):
        return self.questions
    
    def getOptions(self):
        return self.options
    
    def __init__(self):
        global excelFile, questions, options
        excelFile = g.get("excelFile")
        pd.set_option('display.width', 1000)
        table = pd.read_excel(excelFile, 'questions')
        table = table.drop(['Comments'], axis=1)
        table[['Number']] = table[['Number']].fillna(value=0)
        table['Number'] = table.Number.astype(int)
        table[['Section']] = table[['Section']].fillna(value="")
        self.questions = self.extractQuestions(table[['Number', 'Section', 'Question', 'Type', 'Option1']])
        self.options = self.extractOptions(table)
