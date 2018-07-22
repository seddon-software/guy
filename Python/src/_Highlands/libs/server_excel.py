############################################################
#
#    Highlands Server
#
#    © Highlands Negotiations, June 2018, v0.5
#
############################################################

# import pandas as pd
# import math
# import json
# 
# from excel import Excel
# xl = Excel()
 
# def isAutoFill(field):
#     if(isinstance(field, str)): 
#         return field.strip() == "autofill"
#     else:
#         return False
    
# def extractQuestions(df):
#     '''questions will be a list of [QuestionNo, Section, Question, Type, Autofill] tuples'''
#     questions = []    
#     for row in df.itertuples():
#         if(isinstance(row[3], str)):
#             questions.append([str(row[1]), row[2], row[3], row[4], xl.isAutoFill(row[5])])
#     return questions


# def extractOptions(df):
#     df.drop(['Number', 'Section', 'Question','Type'], axis = 1, inplace = True)
#     df = df.fillna(value='')
#     options = []
#     row = []
#     for t in df.itertuples():
#         if(t[1] != ''):
#             row.append([i for i in t[1:] if i != ''])
#         else:            
#             if(row): options.append(row)
#             row = []
#     if(row): options.append(row)    # for last row
#         
#     return options
#     
# def filterQuestions(questionType):
#     listQuestions = []
#     for question, option in zip(questions, options):
#         if(question[3] == questionType): listQuestions.append(question)
#     return pd.DataFrame(listQuestions)
# 
# def filterOptions(questionType):
#     listOptions = []
#     for question, option in zip(questions, options):
#         if(question[3] == questionType): listOptions.append(option)
#     return pd.DataFrame(listOptions)

# def main(file):
#     global excelFile, questions, options
#     excelFile = file
#     pd.set_option('display.width', 1000)
#     table = pd.read_excel(excelFile, 'questions')
#     table = table.drop(['Comments'], axis=1)
#     table[['Number']] = table[['Number']].fillna(value=0)
#     table['Number'] = table.Number.astype(int)
#     table[['Section']] = table[['Section']].fillna(value="")
#     questions = xl.extractQuestions(table[['Number', 'Section', 'Question', 'Type', 'Option1']])
#     options = xl.extractOptions(table)

# if __name__ == "__main__":
#     pass
