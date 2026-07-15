from pydantic import Field;
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongodb_uri: str = Field(alias = "MONGODB_URI")
    mongodb_db_name: str = Field(default = "healthConnect", alias = "MONGODB_DB_NAME")
    groq_api_key: str = Field(alias = "GROQ_API_KEY")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

