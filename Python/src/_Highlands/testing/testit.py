import os
os.chdir("..")
try:
    import server
except OSError as e:
    pass    # server has already started

    
# os.system("python server.py")
# try:
#     import subprocess
#     p = subprocess.Popen("python server.py".split(), cwd="..")
#     import time
#     time.sleep(5)
#     #os.system("ps -ef | grep 'python server.py'")
# except:
#     pass
