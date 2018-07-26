'''
var tableData = {
    '26':{
         'question': 'This is Question A',
         'tabs':["Last 30 days", "Last 90 days", "Last 180 days", "In the past year"],    
         'data':
            {'all':[
                [["Extremely serious", 5], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 2], ["Significant but quickly resolved", 0], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 0], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]],
             'BT':[
                [["Extremely serious", 2], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 3], ["Significant but quickly resolved", 4], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 1], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]]
            }
    },
    '31':{
         'question': 'This is Question B',
         'tabs':["Last 30 days", "Last 90 days", "Last 180 days", "In the past year"],    
         'data':
            {'all':[
                [["Extremely serious", 5], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 2], ["Significant but quickly resolved", 0], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 0], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]],
             'BT':[
                [["Extremely serious", 2], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 3], ["Significant but quickly resolved", 4], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 1], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]]
            }
    },
    '37':{
         'question': 'This is Question C',
         'tabs':["Last 30 days", "Last 90 days", "Last 180 days", "In the past year"],    
         'data':
            {'all':[
                [["Extremely serious", 5], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 2], ["Significant but quickly resolved", 0], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 0], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]],
             'BT':[
                [["Extremely serious", 2], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 3], ["Significant but quickly resolved", 4], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 1], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]]
            }
    },
    '41':{
         'question': 'This is Question D',
         'tabs':["Last 30 days", "Last 90 days", "Last 180 days", "In the past year"],    
         'data':
            {'all':[
                [["Extremely serious", 5], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 2], ["Significant but quickly resolved", 0], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 0], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]],
             'BT':[
                [["Extremely serious", 2], ["Significant but quickly resolved", 2], ["Minor", 2], ["None", 2]],
                [["Extremely serious", 3], ["Significant but quickly resolved", 4], ["Minor", 0], ["None", 0]],
                [["Extremely serious", 4], ["Significant but quickly resolved", 1], ["Minor", 1], ["None", 4]],
                [["Extremely serious", 1], ["Significant but quickly resolved", 3], ["Minor", 0], ["None", 1]]]
            }
    }
}

'''
import os
if __name__ == "__main__": os.chdir("..")
import pandas as pd
from ast import literal_eval
from myglobals import MyGlobals
from database import Database
from excel import Excel

g = MyGlobals()
db = Database()
xl = Excel()

class Table:
    def getTableData(self):
        """
        returns tableData in the form:
            tableData = { key1:entry1, key2:entry2 ... ]
        where keys are question numbers and each entry is of the form:
            entry = {'question': <question text>,
                     'tabs': [<tab-heading-1>, <tab-heading-2>, ...],
                     'data': { 'all': <3D-array>, 
                               'client-1': <3D-array>,
                               'client-2': <3D-array>,
                               ...
                               'email-1': <3D-array>,
                               'email-2': <3D-array>,
                               ... 
                            }
                    }
        where each 3D-array is of the form:
            3D-array = [
                [[<tab-1-option-1>, <frequency>], [<tab-1-option-1>, <frequency>], ... ],
                [[<tab-2-option-1>, <frequency>], [<tab-2-option-1>, <frequency>], ... ],
                ...
            ]
        """
        # this routine assumes the client always comes before other results        
        questions = xl.filterQuestions("table")
        options = xl.filterOptions("table")
        questions.columns = ["Number", "Section", "Question", "Type", "Ignore"]
    
        # filter out unwanted columns
        questions = questions[["Number", "Question"]]    
    
        # join the two dataframes
        df = pd.concat([questions, options], axis=1)
        tableData = {}
        for i, row in df.iterrows():
            # row : Number, Question, DataItems, Tab-1, Tab-2, ...
            row.dropna(inplace=True)
            info = row.tolist()
            number = info[0]
            question = info[1]
            dataItems = info[2]
            dataItems = dataItems[1:]   # ignore first entry
            
            def getTabTitles():
                startOfTabInfo = 3
                tabTitles = []
                for value in info[startOfTabInfo:]:
                    tabTitles.append(value[0])
                return tabTitles
            
            if number not in tableData:
                tableData[number] = {
                    'question': question,
                    'tabs': getTabTitles(),
                    'dataItems': dataItems,
                    'data': {}
                };
       
        client = None
        results = db.getDatabaseResults()
        n = 0
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
                    table = pair['table']
                    number = table['question']
                    selections = table['selection']
                    optionCount = table['optionCount']

                    if 'all' not in tableData[number]['data']:
                        tableData[number]['data']['all'] = [[["A",0] for _ in range(optionCount)] for _ in range(len(selections))]
                    if client not in tableData[number]['data']:
                        tableData[number]['data'][client] = [[["B",0] for _ in range(optionCount)] for _ in range(len(selections))]
                    if email not in tableData[number]['data']:
                        tableData[number]['data'][email] = [[["B",0] for _ in range(optionCount)] for _ in range(len(selections))]
                    
                    for i, selection in enumerate(selections):
                        tableData[number]['data']['all'][i][selection-1][1] += 1
                        tableData[number]['data'][client][i][selection-1][1] += 1
                        tableData[number]['data'][email][i][selection-1][1] += 1
            # add labels
            for key in tableData:
                rows = list(range(len(tableData[key]['data']['all'])))
                cols = list(range(len(tableData[key]['data']['all'][0])))
                
                for row in rows:
                    for col in cols:
                        o = tableData[key]['data']
                        for k in o:
                            tableData[key]['data'][k][row][col][0] = tableData[key]['dataItems'][col]
        return tableData

if __name__ == "__main__":
    table = Table()
    data = table.getTableData()
    for key in data: 
        print(key, data[key]['data']['BT'])
    
