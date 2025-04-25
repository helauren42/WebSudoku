import mysql.connector
from mysql.connector.abstracts import MySQLCursorAbstract
import pymysql
import sys
import subprocess
from typing import Optional

from const import PROJECT_DIR

ENV_PATH = f"{PROJECT_DIR}backend/.env"
DB_DIR = f"{PROJECT_DIR}backend/Database/"

class Database():
    def __init__(self):
        self.host:str = ""
        self.user:str = ""
        self.password:str = ""
        self.name:str = ""
        self.cnx = None
        self.cursor = None 
        self.fetchCredentials()
        self.createDb()
        self.setupConnector()
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
                # lines[i] = lines[i].replace("'users'", "`users`")  # Fix table name quotes
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
    def setupConnector(self):
        print(f"name: {self.name}, host: {self.host}, username: {self.user}, password: {self.password}")
        print(f"'{self.password}'")
        self.cnx = mysql.connector.connect(host=self.host, port=3306, user=self.user, password=self.password, database=self.name, auth_plugin='mysql_native_password')
        self.cursor = self.cnx.cursor()
        self.cursor.execute("SHOW DATABASES")
        print(self.cursor.fetchall())
        print("set up cursor")
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

if __name__ == "__main__":
    db = Database()
    if(len(sys.argv) > 1 and sys.argv[1] == "clear"):
        answer = input("Are you sure you want to delete the database? this action is irreversible (Y/n): ")
        if answer != "Y" and answer != "y" and answer != "yes":
           print("Operation was cancelled")
           sys.exit(0)
        db.clearDatabase()
        sys.exit(0)

