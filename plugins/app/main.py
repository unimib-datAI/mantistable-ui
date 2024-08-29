"""main entry for fastapi"""
import os
import json
import shutil
import zipfile
import subprocess
from collections import Counter
from pydantic import BaseModel
from database import PostgresDB, MongoDB
from literal_checker import LiteralRecognizer
from fastapi import FastAPI, Query, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

postgres_db = PostgresDB()
mongo_db = MongoDB()
literal_recognizer = LiteralRecognizer()
# root_path = '/plugin_api'
app = FastAPI(title="Plugins API", root_path="/plugin_api")
origins = [
    "http://localhost:3000",
    "http://149.132.176.51:3002",
    "https://mantistable.datai.disco.unimib.it"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
PLUGINS_FOLDER = "./plugins"


class AddonData(BaseModel):
    """Addon Data Type"""
    table_id: int
    addon: str
    addon_data: dict


class ColumnData(BaseModel):
    """Column Data Type"""
    columns: dict[str, list]


async def handle_file(file: UploadFile):
    """handle file uplodaing"""
    configs = {
        "error": False
    }
    if file.content_type != "application/zip":
        configs["error"] = True
        raise HTTPException(status_code=415, detail="Unsupported Media Type")
    file_path = os.path.join(f"{PLUGINS_FOLDER}", file.filename)
    try:
        # copy zip file to -> f"{PLUGINS_FOLDER}"/file.filename.zip
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        # unpack file
        with zipfile.ZipFile(f"{PLUGINS_FOLDER}/{file.filename}", 'r') as zip_ref:
            zip_ref.extractall(PLUGINS_FOLDER)

        # delete zip
        os.remove(f"{PLUGINS_FOLDER}/{file.filename}")

        # rename folder
        folder_name: str = file.filename.replace(".zip", "")
        plugin_name = "default"
        with open(f"{PLUGINS_FOLDER}/{folder_name}/config.json", 'r', encoding='utf-8') as config_file:
            conf = json.load(config_file)
            plugin_name = conf["name"]

        os.rename(f"{PLUGINS_FOLDER}/{folder_name}",
                  f"{PLUGINS_FOLDER}/{plugin_name}")
        # read config.json
        with open(f"{PLUGINS_FOLDER}/{plugin_name}/config.json", 'r', encoding='utf-8') as config_file:
            conf = json.load(config_file)
            configs["paths"] = {
                "type": conf['type'],
                "base_path": f"{PLUGINS_FOLDER}/{plugin_name}",
                "mainfile": f"{PLUGINS_FOLDER}/{plugin_name}/{conf['entry_file']}",
                "outputfile": f"{conf['output']}"
            }
            configs["configurations"] = conf
            return configs
    except Exception as e:
        print(e)


async def apply_plugin(annotated_table, base_path: str, main_file_path: str, output_file_path: str, input_data: dict = None, is_export: bool = False):
    """Apply Export Plugin"""
    # save json file
    with open(f"{base_path}/input.json", 'w', encoding="utf-8") as f:
        json.dump(annotated_table, f)
    if not is_export:
        with open(f"{base_path}/inputData.json", 'w', encoding="utf-8") as f:
            json.dump(input_data, f)
    # run plugin
    subprocess.run(["python", main_file_path], check=True)
    # check file
    file_exists = os.path.isfile(
        output_file_path)
    # return file
    return file_exists


async def get_selected_column(annotated_table: dict, col_id: int):
    """Extract column from annotated table"""
    table: dict = annotated_table.get("data", annotated_table)
    rows: list = table.get("rows", None)
    if rows is None:
        raise HTTPException(
            status_code=404, detail="Table not found")
    selected_column = []
    for row in rows:
        cell = row["data"][col_id]
        if cell is None:
            raise HTTPException(
                status_code=404, detail="Cell in column not found")
        selected_column.append(cell)

    return selected_column


@app.get('/export/{export_type}/{table_id}')
async def export_service(export_type: str, table_id: int):
    """Export Service Function"""
    headers = {'Access-Control-Expose-Headers': 'Content-Disposition'}
    # get annotated table
    annotated_table = postgres_db.get_table(table_id)
    # map correct plugins
    plugin = mongo_db.get_plugin(export_type)
    if plugin is None:
        raise HTTPException(
            status_code=404, detail="Export resource not found")
    file_exists = await apply_plugin(
        annotated_table,
        plugin["paths"]["base_path"],
        plugin["paths"]["mainfile"],
        f"{plugin['paths']['base_path']}/output/{plugin['paths']['outputfile']}",
        is_export=True
    )
    # return file
    if file_exists:
        return FileResponse(
            f"{plugin['paths']['base_path']}/output/{plugin['paths']['outputfile']}",
            filename=plugin['paths']['outputfile'],
            headers=headers
        )
    else:
        raise HTTPException(
            status_code=404, detail="Export file not found")


@app.get('/addon/{addon_plugin}/input')
async def addon(addon_plugin: str):
    """addon input html"""
    plugin = mongo_db.get_plugin(addon_plugin)
    file_exists = os.path.isfile(
        f"{plugin['paths']['base_path']}/input.html")

    if file_exists:
        file = open(
            f"{plugin['paths']['base_path']}/input.html", "r", encoding='utf-8')
        content = file.read()
        file.close()
        return HTMLResponse(content=content, status_code=200)
    else:
        raise HTTPException(
            status_code=404, detail="No Addon Input Found")


@app.get('/transform/{transform_plugin}/{table_id}/{col_id}')
async def transform_service(transform_plugin: str, table_id: int, col_id: int):
    """Export Service Function"""
    # get annotated table
    annotated_table = postgres_db.get_table(table_id)
    # get column
    column = await get_selected_column(
        annotated_table=annotated_table, col_id=col_id)
    original_column = {"original_column": column}
    # map correct plugins
    plugin = mongo_db.get_plugin(transform_plugin)
    if plugin is None:
        raise HTTPException(
            status_code=404, detail="Transform resource not found")
    file_exists = await apply_plugin(
        original_column,
        plugin["paths"]["base_path"],
        plugin["paths"]["mainfile"],
        f"{plugin['paths']['base_path']}/output/{plugin['paths']['outputfile']}",
        is_export=True
    )
    if file_exists:
        file_to_read = open(
            f"{plugin['paths']['base_path']}/output/{plugin['paths']['outputfile']}", encoding="utf-8")
        new_column = json.load(file_to_read)
        new_column_to_send = new_column.get("new_column", None)
        if new_column_to_send is None:
            raise HTTPException(
                status_code=404, detail="Plugin output not weel formatted")
        return {"original_column": column, "new_column": new_column_to_send}
    else:
        raise HTTPException(
            status_code=404, detail="Transform column output file not found")


@app.post('/apply_addon')
async def lexicalize(data: AddonData):
    """Lexicalize Service Function"""
    table_id = data.table_id
    addon_to_execute = data.addon
    input_data = data.addon_data
    # get annotated table
    annotated_table = postgres_db.get_table(table_id)
    # map correct plugins
    plugin = mongo_db.get_plugin(addon_to_execute)
    if plugin is None:
        raise HTTPException(
            status_code=404, detail="Plugin Resource not found")
    file_exists = await apply_plugin(
        annotated_table,
        plugin["paths"]["base_path"],
        plugin["paths"]["mainfile"],
        f"{plugin['paths']['base_path']}/{plugin['paths']['outputfile']}",
        input_data=input_data,
        is_export=False
    )
    if file_exists:
        file = open(
            f"{plugin['paths']['base_path']}/{plugin['paths']['outputfile']}", "r", encoding='utf-8')
        content = file.read()
        file.close()
        return HTMLResponse(content=content, status_code=200)
    else:
        raise HTTPException(
            status_code=404, detail="No Addon Found")


@app.post('/load_plugin')
async def load_plugin(file: UploadFile = File(...)):
    """Load plugin service"""
    if file is not None:
        result = await handle_file(file)
        if not result["error"]:
            mongo_db.save_plugin({
                "name": result["configurations"]["name"],
                "configurations": result["configurations"],
                "paths": result["paths"],
            })
        return {
            "error": False
        }
    else:
        raise HTTPException(
            status_code=406, detail="Error on loading ")


@app.delete('/delete_plugin')
async def delete_plugin(plugin: str = Query("None", enum=mongo_db.get_name_plugins())):
    """Remove Plugin"""
    plugin_to_remove = mongo_db.get_plugin(plugin)
    if plugin_to_remove is None:
        raise HTTPException(
            status_code=404, detail="Export resource not found")
    base_path = plugin_to_remove["paths"]["base_path"]
    shutil.rmtree(base_path)
    mongo_db.delete_plugin(plugin)
    return {
        "error": False,
    }


@app.get('/plugin_exports')
async def plugin_exports():
    """return all plugins"""
    plugins = mongo_db.get_plugins("export")
    return {
        "plugins": plugins
    }


@app.get('/plugin_addon')
async def plugin_addon():
    """return all plugins"""
    plugins = mongo_db.get_plugins("addon")
    return {
        "plugins": plugins
    }


@app.get('/plugin_transform')
async def plugin_transform():
    """return all plugins"""
    plugins = mongo_db.get_plugins("transform")
    return {
        "plugins": plugins
    }


@app.get('/plugins')
async def all_lugins():
    """return all plugins"""
    plugins = mongo_db.get_all_plugins()
    return {
        "plugins": plugins
    }


@app.post('/column_analysis')
async def column_analysis(data: ColumnData):
    """Load plugin service"""
    columns = data.columns
    result = []
    for col_head, col_values in columns.items():
        lit_results = []
        for cell in col_values:
            lit = literal_recognizer.check_literal(str(cell))
            lit_results.append(lit)
        most_common = Counter(lit_results).most_common()[0][0]
        result.append({"column": col_head, "category": most_common})
    return result
