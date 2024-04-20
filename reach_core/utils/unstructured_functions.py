import os
import subprocess
from unstructured.partition.auto import partition

def run_command(command: str) -> str:

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    if result.stderr:
        raise Exception(result.stderr.decode())
    return resutl.stdout.decode()

async def process_unstructured(upload_dir: str = "uploads") -> list:

    output_list = []
    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            file_path = os.path.join(upload_dir, filename)
            if os.path.isfile(file_path):
                # TODO plenty of room to investigate different extraction methods, times, and strategies
                # TODO list element extraction strategies
                elements = partition(filename=file_path, strategy='fast')
                raw_content = "\n\n".join([str(el) for el in elements])
                output_list.append({'url': file_path, 'raw_content': raw_content})
    else:
        print(f"The directory {upload_dir} does not exist.")

    return output_list

