############################################################
#
#    Highlands Server
#
############################################################

import pandas as pd
import http.server
#import cgi, random, sys
import cgitb
import urllib.parse
import json
import server_excel as xl
import server_database as sql

cgitb.enable()

class Handler(http.server.BaseHTTPRequestHandler):

    def do_POST(self):
        jsonResponse = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        print(jsonResponse)
        jsonAsString = jsonResponse.decode("UTF-8")
        results = json.loads(jsonAsString)

        sql.saveResults(results)
        sql.printResults()
        #print("results:", results)       # this is a list
        return

    def do_GET(self):
        def getMimeType():
            extension = fileName.split(".")[-1]
            if(extension == "ico"): return "image/x-icon"
            if(extension == "css"): return "text/css"
            return "text/html"
            
        def sendHeaders():
            self.send_response(200)
            self.send_header("Content-type", getMimeType())
            self.end_headers()
            
        parsedUrl = urllib.parse.urlparse(self.path) # returns a 6-tuple
        fileName = parsedUrl[2]
        queryString = parsedUrl[4]
        fileName = fileName[1:]  # remove leading '/'
        data = urllib.parse.parse_qs(queryString)
        
        if(fileName == "favicon.ico"):
            sendHeaders()
            return
        elif(fileName == "questions"):
            sendHeaders()
            jsonString = json.dumps(xl.questions)
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "options"):
            sendHeaders()
            jsonString = json.dumps(xl.options)
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "chart-data"):
            sendHeaders()
            jsonString = json.dumps(sql.getPieChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "chart-questions-options"):
            sendHeaders()
            jsonString = json.dumps(sql.getPieChartQuestionsAndOptions())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        else:
            sendHeaders()
            f = open(fileName, "r", encoding="UTF-8")
            data = f.read()
            self.wfile.write(data.encode())

PORT = sql.port
SERVER = sql.server
httpd = http.server.HTTPServer((SERVER, PORT), Handler)
print("server:", SERVER)
print("port:", PORT)
print("database:", sql.database)
print("table:", sql.table)
httpd.serve_forever()
# z = sql.getPieChartData()
# jsonString = json.dumps(z)
# jsonAsBytes = jsonString.encode("UTF-8")


# selections = sql.getPieChartData()
# pieChartQuestionsAndOptions = sql.getPieChartQuestionsAndOptions()
# z = pieChartQuestionsAndOptions
# print(z)
# zz = json.dumps(z)
# print(zz)
#print(selections)
#print(pieChartQuestionsAndOptions)
#print(xl.questions)