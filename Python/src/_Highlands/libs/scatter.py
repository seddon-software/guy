import numpy as np
from ast import literal_eval
from database import Database

class Scatter:
    def getScatterChartData(self):
        '''
        This routine returns frequencies for 1 scatter chart only.  The data returned is an object of the form:
        
            {
                frequencies: { client1:[[mxn]], client2:[[mxn]], ... , all:[[mxn]], email1:[[mxn]], email2:[[mxn]], ... },
                xLabels: [label-x1, label-x2, ...],
                yLabels: [label-y1, label-y2, ...]
            }
            
            where [[mxn]] signifies a 2D array of shape mxn
        '''
            
        # this routine assumes the client always comes before other results
        scatterData = {}
        frequencies = {}
        db = Database()
        results = db.getDatabaseResults()
        for row in results:
            email = row["email"]
            keyValuePairs = literal_eval(row['result'])
            for pair in keyValuePairs:
                if 'client' in pair:
                    client = pair['client']['name']
                if 'table2' in pair:
                    choiceRow, choiceCol = [int(x) for x in pair['table2']['selection'].split(':')]
                    table2Rows, table2Cols = [int(x) for x in pair['table2']['optionCount'].split(':')]
                    r = choiceRow-1
                    c = choiceCol-1
                    if 'xLabels' not in scatterData: scatterData['xLabels'] = pair['table2']['xLabels']
                    if 'yLabels' not in scatterData: scatterData['yLabels'] = pair['table2']['yLabels']
                    if 'all' not in frequencies:  frequencies['all'] = np.zeros((table2Rows, table2Cols), int).tolist()
                    if client not in frequencies: frequencies[client] = np.zeros((table2Rows, table2Cols), int).tolist()
                    if email not in frequencies:  frequencies[email] = np.zeros((table2Rows, table2Cols), int).tolist()
                    frequencies['all'][r][c] += 1
                    frequencies[client][r][c] += 1
                    frequencies[email][r][c] += 1
        scatterData['frequencies'] = frequencies
        return scatterData
