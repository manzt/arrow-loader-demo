import pandas as pd
import numpy as np
import pyarrow as pa
import requests

DATASET = "linnarsson"
SCHEMA = "molecules"
JSON_DATA_URL = f"https://s3.amazonaws.com/vitessce-data/0.0.18/reorganize_folders/{DATASET}/{DATASET}.{SCHEMA}.json"

def flatten(key, values):
    df = pd.DataFrame(values, columns=list("xy"))
    df["names"] = np.repeat(key, len(values))
    return df

if __name__ == "__main__":
    print("fetching json ...")
    res = requests.get(JSON_DATA_URL)
    print("converting to pandas DataFrame...")
    # there is probably a better way to do this with pandas.io.json.json_normalize ... 
    molecules = pd.concat(flatten(key, values) for key, values in res.json().items())
    # use more memory efficient encoding
    molecules = molecules.astype({
        'x': 'int32',
        'y': 'int32',
        'names': 'category'
    })
    print("converting to arrow table and writing to disk...")
    table = pa.Table.from_pandas(molecules)
    writer = pa.RecordBatchFileWriter(f"{DATASET}.{SCHEMA}.arrow", table.schema)
    writer.write(table)
    writer.close()
    print("done.")
