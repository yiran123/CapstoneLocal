# Capstone Project: Green Bonds

## Start the Program.
0. **Make sure python version in your mac is python3**. Install pip3.
```
python3 -m pip install --user --upgrade pip
```

1. Enter virtual environment.
In backend folder, enter the command below:
```
source env/bin/activate
```
2. Make migrations to database.
Go to the the project folder:
```
cd greenBondProject
```

Every time a change is made to the database, run the command line below:
```
python3 manage.py makemigrations
python3 manage.py migrate
```
Actually, the database will constantly update. Remember to run these commands everytime you pull new changes from git.

3. For backend, the APIs of Project and Bonds are provided. If run locally, the program provides APIs like below:

```
http://127.0.0.1:8000/api/bond
http://127.0.0.1:8000/api/bond/1

http://127.0.0.1:8000/api/project
http://127.0.0.1:8000/api/project/1
```
4. For frontend, installation and start
```
npm install
npm start
```
