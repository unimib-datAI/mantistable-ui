import os
import json
import psycopg2
from pymongo import MongoClient

MONGO_INITDB_ROOT_USERNAME = os.environ.get("MONGO_INITDB_ROOT_USERNAME")
MONGO_INITDB_ROOT_PASSWORD = os.environ.get("MONGO_INITDB_ROOT_PASSWORD")


class PostgresDB:

    def __init__(self):
        self.connection = psycopg2.connect(database="postgrestableui", user="postgres",
                                           password="table_ui2024!", host="postgres", port=5432)

    def get_query(self, table_id: int):
        """Query for retrieving table"""
        return f"""
            SELECT "processableJsonResponseTable" from public.mantistable_tables WHERE id = {table_id};
            """

    def get_table(self, id_table: int):
        """Get table from postgres"""
        cursor = self.connection.cursor()
        cursor.execute(
            self.get_query(id_table))
        # Fetch all rows from database
        record = cursor.fetchone()
        json_data = json.loads(record[0])

        return json_data


class MongoDB:

    def __init__(self) -> None:
        self.connection = MongoClient(
            host="mongo", port=27017, username=MONGO_INITDB_ROOT_USERNAME, password=MONGO_INITDB_ROOT_PASSWORD)

    def save_plugin(self, plugin_obj):
        """save plugin"""
        self.connection["pluginsdb"]["plugins"].insert_one(
            plugin_obj)

    def get_plugin(self, plugin_name):
        """get plugin"""
        return self.connection["pluginsdb"]["plugins"].find_one({"name": plugin_name})

    def get_name_plugins(self):
        """get plugins"""
        plugins_available = []
        all_plugins = self.connection["pluginsdb"]["plugins"].find({}, {
                                                                   "_id": 0})
        for plugin in all_plugins:
            plugins_available.append(plugin["name"])

        return plugins_available

    def get_plugins(self, plugin_type: str):
        """get plugins"""
        plugins_available = []
        all_plugins = self.connection["pluginsdb"]["plugins"].find({"configurations.type": plugin_type}, {
                                                                   "_id": 0})
        for plugin in all_plugins:
            plugins_available.append(plugin)

        return plugins_available

    def get_all_plugins(self):
        """get plugins"""
        plugins_available = []
        all_plugins = self.connection["pluginsdb"]["plugins"].find({}, {
                                                                   "_id": 0})
        for plugin in all_plugins:
            plugins_available.append(plugin)

        return plugins_available

    def check_if_plugin_exists(self, plugin_name: str) -> bool:
        """Check if plugin exists"""
        return self.connection["pluginsdb"]["plugins"].count_documents({"name": plugin_name}, limit=1) != 0

    def delete_plugin(self, plugin_name: str):
        """delete plugin"""
        self.connection["pluginsdb"]["plugins"].delete_one(
            {"name": plugin_name})
