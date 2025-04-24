import mysql.connector
from mysql.connector.abstracts import MySQLCursorAbstract
import pymysql
import sys
import subprocess

from const import PROJECT_DIR

ENV_PATH = f"{PROJECT_DIR}backend/.env"

class Database():
    def __init__(self):
        self.host:str = ""
        self.username:str = ""
        self.password:str = ""
        self.name:str = ""
        self.fetchCredentials()
        self.cursor:MySQLCursorAbstract
        self.setupConnector()
        self.buildDatabase()
    def setupConnector(self):
        print(f"name: {self.name}, host: {self.host}, username: {self.username}, password: {self.password}")
        print(f"'{self.password}'")
        with mysql.connector.connect(
            host=self.host,
            port=3306,
            user=self.username,
            password=self.password,
            auth_plugin='mysql_native_password'
        ) as db:
            self.cursor = db.cursor()

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
                        self.username = value
                    elif key == "DB_PASSWORD":
                        self.password = value
                    elif key == "DB_NAME":
                        self.name = value
    # def buildDatabase(self):
    #     CWD = f"{PROJECT_DIR}backend/Database/"
    #     subprocess.run(["touch createTemp.sql"], shell=True, cwd=CWD)
    #     with open(f"{CWD}create.sql", "r") as readfile:
    #         lines = readfile.readlines()
    #         for line in lines:
    #             line.replace("DB_HOST", self.host)
    #             line.replace("DB_USER", self.username)
    #             line.replace("DB_PASSWORD", self.password)
    #             line.replace("DB_NAME", self.name)
    #     subprocess.run(["rm createTemp.sql"], shell=True, cwd=CWD)
    # def clearDatabase(self):
    #     self.cursor.execute(f"DROP user {self.username}@{self.host}")
    #     self.cursor.execute(f"DROP database {self.name}")

if __name__ == "__main__":
    db = Database()
    # if(len(sys.argv) > 1 and sys.argv[1] == "clear"):
       # db.clearDatabase()
    # db.buildDatabase()

