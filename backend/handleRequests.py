import re

from pydantic import BaseModel, EmailStr, field_validator

class LoginRequest(BaseModel):
    username:str
    password:str
    @field_validator("username")
    def validUsername(cls, value:str):
        print("validating username: ", value)
        return value
    @field_validator("password")
    def validPassword(cls, value:str):
        print("validating password: ", value)
        return value

class SignupRequest(LoginRequest):
    # email: EmailStr
    email: str
    @field_validator("email")
    def validEmail(cls, value:str):
        return value
    # @field_validator("password")
    # def validPassword(cls, value:str):
    #     pattern = r'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W])(?=.{8})'
    #     if re.match(pattern, value):
    #         print("valid password")
    #         return
    #     Exception("Invalid Password")
    # @field_validator("username")
    # def validUsername(cls, value:str):
    #     pattern = r'(?=.*\W)'
    #     if not re.match(pattern, value):
    #         Exception("Invalid Password")
    #     return
