############################################################
#
#    Highlands Server
#
#    © Highlands Negotiations, June 2018, v0.5
#
############################################################

import sys
sys.path.append("libs")
import http.server
import urllib.parse, json
from myglobals import MyGlobals
from checkbox import Checkbox
from scatter import Scatter
from radio import Radio
from chart import Chart
from excel import Excel
from table import Table

checkbox = Checkbox()
scatter = Scatter()
radio = Radio()
chart = Chart()
xl = Excel()
table = Table()

class Handler(http.server.BaseHTTPRequestHandler):

    def do_POST(self):
        jsonResponse = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        jsonAsString = jsonResponse.decode("UTF-8")
        results = json.loads(jsonAsString)

        sql.saveResults(results, self.headers)
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
            jsonString = json.dumps(xl.getQuestions())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "options"):
            sendHeaders()
            jsonString = json.dumps(xl.getOptions())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "emails-and-clients"):
            sendHeaders()
            jsonString = json.dumps(sql.getEmailsAndClients())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "chart-data"):
            sendHeaders()
            jsonString = json.dumps(chart.getChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "piechart-data"):
            sendHeaders()
            jsonString = json.dumps(radio.getPieChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "table-data"):
            sendHeaders()
            jsonString = json.dumps(table.getTableData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "checkbox-data"):
            sendHeaders()
            jsonString = json.dumps(checkbox.getCheckboxData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "scatter-data"):
            sendHeaders()
            jsonString = json.dumps(scatter.getScatterChartData())
            jsonAsBytes = jsonString.encode("UTF-8")
            self.wfile.write(jsonAsBytes)
        elif(fileName == "piechart-data2"):
            sendHeaders()
            jsonString = json.dumps(radio.getPieChartData2())
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

g = MyGlobals()
import server_database as sql
PORT = g.get("port")
SERVER = g.get("server")
httpd = http.server.HTTPServer((SERVER, PORT), Handler)
import ssl
# httpd.socket = ssl.wrap_socket (httpd.socket, certfile='path/to/localhost.pem', server_side=True)
print("server:", SERVER)
print("port:", PORT)
print("database:", g.get("database"))
print("table:", g.get("table"))

httpd.serve_forever()




