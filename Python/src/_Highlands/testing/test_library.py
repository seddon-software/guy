import os, sys, time
from threading import Thread
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


browser = None
def startBrowser(url):
    global browser
    os.environ["PATH"] = "." + os.pathsep + os.environ["PATH"]

    try:
        browser = webdriver.Chrome(executable_path=r"chromedriver.exe")
    except: pass
    try:
        browser = webdriver.Chrome(executable_path=r"chromedriver")
    except: pass
    try:
        browser.get(url)
    except Exception as e:
        print(e)
        print("aborting ...")
        sys.exit()

def stopBrowser():
    global browser
    browser.close()

def scrollTo(element):
    global browser
    browser.execute_script("arguments[0].scrollIntoView();", element)
    
def enterText(question, text):
    global browser
    selector = "input#text-{}".format(question)
    element = browser.find_element_by_css_selector(selector)
    scrollTo(element)
    element.send_keys(text);   

def enterTextArea(question, text):
    global browser
    selector = "textarea#text-{}".format(question)
    element = browser.find_element_by_css_selector(selector)
    scrollTo(element)
    element.send_keys(text);   

def clickTable(question, row, col):
    selector = "input#radio-{}-{}-{}".format(question, row, col)
    clickIt(selector)
    
def clickTable2(question, row, col):
    selector = "input#radio-{}-{}-{}".format(question, row, col)
    clickIt(selector)
    
def clickRadio(question, col):
    selector = "input#radio-{}-{}".format(question, col-1)
    clickIt(selector)

def clickCheckbox(question, col):
    selector = "input#check-{}-{}".format(question, col-1)
    clickIt(selector)

def submit(choice):
    global browser
    clickIt("#showResults")
    browser.implicitly_wait(10) # seconds
    if choice == "Yes": clickIt("#continue-yes")
    if choice == "No": clickIt("#continue-no")


def clickIt(selector):
    global browser
    element = browser.find_element_by_css_selector(selector)
    scrollTo(element)
    element.click();   

def startServer():
    # start the server in a background thread
    cwd = os.getcwd()
    serverThread = Thread(target=startServerInBackground)
    serverThread.start()
    time.sleep(5)
    os.chdir(cwd)
    
def startServerInBackground():
    os.chdir("..")
    try:
        pass
        import server
    except OSError as e:
        pass    # server has already started
