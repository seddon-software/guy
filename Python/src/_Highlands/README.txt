To setup users and tables (you must have a root and manager user):
	setup.xlsx

To edit questions:
	questions.xlsx
	
To change answers in automatic testing, edit:
	test_data.xlsx

To initilize the system (requires "setup.xlsx"):
	python initialize_database.py

To run the server (requires "questions.xlsx"):
	python server.py
	
To start the client assessment in a browser:
	http://<server-ip>:<port>/client.html

To start the client with the charts in a browser:
	http://<server-ip>:<port>/client.html?charts

To run automatic tests (requires "test_data.xlsx"):
	cd testing
	python tests_from_excel.py
	

