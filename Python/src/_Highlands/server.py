############################################################
#
#    Highlands Server
#
#    © Highlands Negotiations, June 2018, v0.5
#
############################################################

import http.server
#import cgitb
import sys, urllib.parse, json
import os.path


#cgitb.enable()

class Handler(http.server.BaseHTTPRequestHandler):

    def do_POST(self):
        jsonResponse = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        jsonAsString = jsonResponse.decode("UTF-8")
        results = json.loads(jsonAsString)

        sql.saveResults(results)
        return

    def do_GET(self):
        def getMimeType():
            extension = fileName.split(".")[-1]
            if(extension == "ico"): return "image/x-icon"
            if(extension == "css"): return "text/css"
            if(extension == "jpg"): return "image/jpeg"
            if(extension == "png"): return "image/png"
            if(extension == "svg"): return "image/svg+xml"    # svg svgz
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
        elif(fileName == "emails-and-clients"):
            sendHeaders()
            jsonString = json.dumps(sql.getEmailsAndClients())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "chart-data"):
            sendHeaders()
            jsonString = json.dumps(sql.getChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "piechart-data"):
            sendHeaders()
            jsonString = json.dumps(sql.getPieChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "scatter-data"):
            sendHeaders()
            jsonString = json.dumps(sql.getScatterChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "piechart-data2"):
            sendHeaders()
            jsonString = json.dumps(sql.getPieChartData2())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "piechart-questions-options"):
            sendHeaders()
            jsonString = json.dumps(sql.getPieChartQuestionsAndOptions())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        else:
            sendHeaders()
            extension = fileName.split(".")[-1]
            if(extension == "png" or extension == "jpg" or extension == "gif" ):
                f = open(fileName, "rb")
                data = f.read()
                self.wfile.write(data)
            else:
                f = open(fileName, "r", encoding="UTF-8")
                data = f.read()
                self.wfile.write(data.encode())

def parseCommandLine():
    # default excel file is "highlands.xlsx", but can be changed on command line:
    #    python server.py [excel-file]
    if len(sys.argv) > 2:
        print("Useage: python server.py [excel-file]")
        sys.exit()
    if len(sys.argv) == 1:
        excelFile = "highlands.xlsx"
    else:
        excelFile = sys.argv[1].replace(".xlsx", "") + ".xlsx"
    
    if not os.path.isfile(excelFile):
        print("{} does not exist".format(excelFile))
        sys.exit()

    return excelFile
    
excelFile = parseCommandLine()
import server_excel as xl
import server_database as sql
xl.main(excelFile)
sql.main(excelFile)
PORT = sql.port
SERVER = sql.server
httpd = http.server.HTTPServer((SERVER, PORT), Handler)
print("server:", SERVER)
print("port:", PORT)
print("database:", sql.database)
print("table:", sql.table)

try:
    httpd.serve_forever()
except:
    pass
