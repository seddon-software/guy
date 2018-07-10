To setup users and tables (you must have a root and manager user):
	setup tab of highlands.xlsx

To edit questions:
	questions tab of highlands.xlsx
	
To change answers in automatic testing, edit:
	test_data.xlsx

To initilize the system (requires "highlands.xlsx"):
	python initialize_database.py

To run the server (requires "highlands.xlsx"):
	python server.py
	
To start the client assessment in a browser:
	http://<server-ip>:<port>/client.html

To start the client with the charts in a browser:
	http://<server-ip>:<port>/client.html?charts

To run automatic tests (requires "test_data.xlsx"), you need to install selenium:
	pip install selenium  (if required)
	cd testing
	python tests_from_excel.py
	

