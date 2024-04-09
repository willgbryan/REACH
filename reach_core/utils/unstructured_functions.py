import subprocess

def run_command(command: str) -> str:

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    if result.stderr:
        raise Exception(result.stderr.decode())
    return resutl.stdout.decode()

def process_unstructured(upload_dir: str = "uploads") -> list:
    from unstructured.partition.auto import partition
    import os

    output_list = []
    for filename in os.listdir(upload_dir):
        print(f"filename {filename}")
        file_path = os.path.join(upload_dir, filename)
        print(f"file path {file_path}")
        if os.path.isfile(file_path):
            elements = partition(filename=file_path)
            raw_content = "\n\n".join([str(el) for el in elements])
            output_list.append({'url': file_path, 'raw_content': raw_content})
    print(f"output list: {output_list}")

    return output_list

