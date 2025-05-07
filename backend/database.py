#!/usr/bin/env python3

from datetime import datetime
from logging import log
import mysql.connector
from mysql.connector.abstracts import MySQLCursorAbstract
import sys
import subprocess

from const import PROJECT_DIR
from handleRequests import LoginRequest, SignupRequest

ENV_PATH = f"{PROJECT_DIR}backend/.env"
DB_DIR = f"{PROJECT_DIR}backend/Database/"

class UserData():
    def __init__(self, username:str, email:str, hasPicture:bool=False, totalPoints:int=0, created_at:datetime=datetime.now()) -> None:
        print("initializing user data")
        self.username = username
        self.email = email
        self.hasPicture = hasPicture
        self.totalPoints = totalPoints
        self.creationDay = [created_at.year, created_at.month, created_at.day]
    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'hasPicture': self.hasPicture,
            'totalPoints': self.totalPoints,
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
    def validLoginUsername(self, user):
        print("checking valid login username: ", user)
        self.cursor.execute(f"SELECT username FROM users WHERE username=%s", (user,))
        fetched = self.cursor.fetchone()
        print("valid username fetched: ", fetched)
        if fetched != None:
            return True
        return False
    def validLoginPassword(self, user, password):
        self.cursor.execute(f"SELECT password FROM users WHERE username=%s", (user,))
        fetched = self.cursor.fetchone()
        found = fetched[0]
        if found  == password:
            return True
        return False
    def insertNewUser(self, user, password, email):
        print("adding user to db")
        # insert into users tables
        insertQuery = f"INSERT INTO users (username, password, email) VALUES(%s, %s, %s)"
        values = (user, password, email)
        self.cursor.execute(insertQuery, values)
        # insert into ranking tables
        values = (user, )
        insertQuery = f"INSERT INTO dailyRanking (username) VALUES(%s)"
        self.cursor.execute(insertQuery, values)
        insertQuery = f"INSERT INTO weeklyRanking (username) VALUES(%s)"
        self.cursor.execute(insertQuery, values)
        insertQuery = f"INSERT INTO allTimeRanking (username) VALUES(%s)"
        self.cursor.execute(insertQuery, values)

    def userNotExists(self, username):
        self.cursor.execute("SELECT username FROM users WHERE username=%s", (username,))
        fetched = self.cursor.fetchone()
        if fetched == None:
            return True
        return False
    def fetchUserData(self, username) -> UserData:
        self.cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        columns = self.cursor.fetchone()
        print("!!! COLUMNS:")
        print(type(columns))
        print(columns)
        userData = UserData(username, columns[4], columns[5], columns[6], columns[1])
        return userData

class Database(BaseDatabase):
    def clearDatabase(self):
        print("clearing database")
        subprocess.run(f"sudo mysql -e 'DROP DATABASE {self.name}' ", shell=True)
        print("cleared")
    def resetDaily(self):
        print("reseting daily database")
        self.cursor.execute(f"UPDATE dailyRanking SET points=0")
    def resetWeekly(self):
        print("reseting weekly database")
        self.cursor.execute(f"UPDATE weeklyRanking SET points=0")
    def login(self, loginObject: LoginRequest)-> dict:
        print("db.login()")
        if not self.validLoginUsername(loginObject.username):
            raise Exception("username does not exist")
        if not self.validLoginPassword(loginObject.username, loginObject.password):
            raise Exception("wrong password")
        userData = self.fetchUserData(username=loginObject.username)
        return userData.to_dict()
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
    def addPointsToUser(self, username:str, extraPoints:int):
        print("adding points to user")
        print(username)
        print(extraPoints)
        self.cursor.execute(f"UPDATE users SET totalpoints = totalpoints + %s where username=%s", (extraPoints, username))
        self.cursor.execute(f"UPDATE dailyRanking SET points = points + %s where username=%s", (extraPoints, username))
        self.cursor.execute(f"UPDATE weeklyRanking SET points = points + %s where username=%s", (extraPoints, username))
        self.cursor.execute(f"UPDATE allTimeRanking SET points = points + %s where username=%s", (extraPoints, username))

# 0-daily 1-weekly 2-alltime
    def getRankings(self, period:int) -> list[tuple[str, int]]:
        match period:
            case 0:
                self.cursor.execute(f"SELECT * FROM dailyRanking ORDER BY points DESC")
            case 1:
                self.cursor.execute(f"SELECT * FROM weeklyRanking ORDER BY points DESC")
            case 2:
                self.cursor.execute(f"SELECT * FROM allTimeRanking ORDER BY points DESC")
        rankings = self.cursor.fetchall()
        print("Rankings fetched: ", rankings)
        return rankings
    def storeSessionId(self, sessionToken:str, username:str):
        self.cursor.execute("UPDATE users SET sessionToken = %s where username = %s", (sessionToken, username))
        return


if __name__ == "__main__":
    db = Database()
    if(len(sys.argv) > 1 and sys.argv[1] == "dailyReset"):
        db.resetDaily()
    elif(len(sys.argv) > 1 and sys.argv[1] == "weeklyReset"):
        db.resetWeekly()
    elif(len(sys.argv) > 1 and sys.argv[1] == "clear"):
        answer = input("Are you sure you want to delete the database? this action is irreversible (Y/n): ")
        if answer != "Y" and answer != "y" and answer != "yes":
           print("Operation was cancelled")
        db.clearDatabase()

