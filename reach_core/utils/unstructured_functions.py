import subprocess

def run_command(command: str) -> str:

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    if result.stderr:
        raise Exception(result.stderr.decode())
    return resutl.stdout.decode()

def process_pdf(pdf_path: str, container_name: str = "unstructured") -> str:

    copy_command = f"docker cp {pdf_path} {container_name}:/tmp"
    run_command(copy_command)

    python_command = f'docker exec {container_name} python3 -c "from unstructured.partition.pdf import partition_pdf; elements = partition_pdf(filename=\'/tmp/{pdf_path.split("/")[-1]}\'); print(\'\\n\\n\'.join([str(el) for el in elements]))"'
    output = run_command(python_command)

    return output

