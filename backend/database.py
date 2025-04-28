from datetime import datetime
import mysql.connector
from mysql.connector.abstracts import MySQLCursorAbstract
import sys
import subprocess

from const import PROJECT_DIR
from handleRequests import LoginRequest, SignupRequest

ENV_PATH = f"{PROJECT_DIR}backend/.env"
DB_DIR = f"{PROJECT_DIR}backend/Database/"

class UserData():
    def __init__(self, username:str, email:str, hasPicture:bool=False, picturePath:str="", wins:int=0, created_at:datetime=datetime.now()) -> None:
        self.username = username
        self.email = email
        self.hasPicture = hasPicture
        self.picturePath = picturePath
        self.wins = wins
        self.creationDay = [created_at.year, created_at.month, created_at.day]
    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'hasPicture': self.hasPicture,
            'picturePath': self.picturePath,
            'wins': self.wins,
            'creationDay': self.creationDay
        }
class BaseDatabase():
    def __init__(self):
        self.host:str = ""
        self.user:str = ""
        self.password:str = ""
        self.name:str = ""
        self.fetchCredentials()
        self.createDb()
        self.setupCursor()
    def setupCursor(self):
        print(f"name: {self.name}, host: {self.host}, username: {self.user}, password: {self.password}")
        print(f"'{self.password}'")
        self.cnx = mysql.connector.connect(host=self.host, port=3306, user=self.user, password=self.password, database=self.name, auth_plugin='mysql_native_password', autocommit=True)
        self.cursor = self.cnx.cursor()
        self.cursor.execute(f"USE {self.name}")
    def createBuildFile(self):
        subprocess.run(["touch build.sql"], shell=True, cwd=DB_DIR)
        lines = []
        with open(f"{DB_DIR}create.sql", "r") as readfile:
            lines = readfile.readlines()
            for i in range(len(lines)):
                lines[i] = lines[i].replace("DB_HOST", self.host)
                lines[i] = lines[i].replace("DB_USER", self.user)
                lines[i] = lines[i].replace("DB_PASSWORD", self.password)
                lines[i] = lines[i].replace("DB_NAME", self.name)
        with open(f"{DB_DIR}build.sql", "w") as writeFile:
            for line in lines:
                writeFile.write(line)
        print(lines)
    def createDb(self):
        print("creating database")
        self.createBuildFile()
        print("running subprocess excecuting mysql build")
        subprocess.run(f"sudo mysql < {DB_DIR}build.sql", shell=True)
        subprocess.run(["rm build.sql"], shell=True, cwd=DB_DIR)
    def fetchCredentials(self):
        with open(ENV_PATH, "r") as file:
            lines = file.readlines()
            for line in lines:
                split = line.split("=")
                if len(split) == 2:
                    key = split[0].strip()
                    value = split[1].strip()
                    if key == "DB_HOST":
                        self.host = value
                    elif key == "DB_USER":
                        self.user = value
                    elif key == "DB_PASSWORD":
                        self.password = value
                    elif key == "DB_NAME":
                        self.name = value
    def insertNewUser(self, user, password, email):
        print("adding user to db")
        insertQuery = f"INSERT INTO users (username, password, email) VALUES(%s, %s, %s)"
        values = (user, password, email)
        self.cursor.execute(insertQuery, values)

    def userNotExists(self, username):
        self.cursor.execute("SELECT username FROM users WHERE username=%s", (username,))
        fetched = self.cursor.fetchone()
        print("userNotExists fetched: ", fetched)
        if not fetched:
            return True
        return False
    def fetchUserData(self, username):
        columns = self.cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        print("!!! COLUMNS:")
        print(type(columns))
        print(columns)

class Database(BaseDatabase):
    def clearDatabase(self):
        print("clearing database")
        subprocess.run(["touch clear.sql"], shell=True, cwd=DB_DIR)
        with open(f"{DB_DIR}drop.sql", "r") as readFile:
            lines = readFile.readlines()
            for i in range(len(lines)):
                lines[i] = lines[i].replace("DB_HOST", self.host)
                lines[i] = lines[i].replace("DB_USER", self.user)
                lines[i] = lines[i].replace("DB_PASSWORD", self.password)
                lines[i] = lines[i].replace("DB_NAME", self.name)
            with open(f"{DB_DIR}clear.sql", "w") as writeFile:
                for line in lines:
                    writeFile.write(line)
        subprocess.run(f"sudo mysql < {DB_DIR}clear.sql", shell=True)
        subprocess.run(["rm clear.sql"], shell=True, cwd=DB_DIR)
        print("cleared")
    def signup(self, signupObject: SignupRequest):
        print("db.signup()")
        if self.userNotExists(signupObject.username):
            self.insertNewUser(signupObject.username, signupObject.password, signupObject.email)
            userData = UserData(signupObject.username, signupObject.email).to_dict()
            print("userData: ", userData)
            print("userData: ", type(userData))
            return userData
        else:
            print("Username already taken")
            raise Exception("409\nUsername already taken")
    def validLoginUsername(self, user):
        self.cursor.execute(f"SELECT user FROM users WHERE users={user}")
        fetched = self.cursor.fetchone()
        print("valid password fetched: ", fetched)
    def validLoginPassword(self, user, password):
        self.cursor.execute(f"SELECT password FROM users WHERE users={user}")
        fetched = self.cursor.fetchone()
        print("valid password fetched: ", fetched)

if __name__ == "__main__":
    db = Database()
    if(len(sys.argv) > 1 and sys.argv[1] == "clear"):
        answer = input("Are you sure you want to delete the database? this action is irreversible (Y/n): ")
        if answer != "Y" and answer != "y" and answer != "yes":
           print("Operation was cancelled")
           sys.exit(0)
        db.clearDatabase()
        sys.exit(0)

