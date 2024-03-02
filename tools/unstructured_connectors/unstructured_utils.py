import subprocess

def run_command(command: str) -> str:
    """
    Executes a shell command and returns the output.

    Args:
    - command (str): The command to run.

    Returns:
    - str: The output of the command.
    """
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    if result.stderr:
        raise Exception(result.stderr.decode())
    return result.stdout.decode()

def run_script_in_container(container_name: str, script_path: str) -> str:
    """
    Executes a custom Python script within a Docker container.

    Args:
    - container_name (str): The name of the Docker container.
    - script_path (str): The local path to the Python script.

    Returns:
    - str: The output from executing the script.
    """
    copy_command = f"docker cp {script_path} {container_name}:/tmp/script_to_run.py"
    run_command(copy_command)

    exec_command = f"docker exec {container_name} python3 /tmp/script_to_run.py"
    output = run_command(exec_command)

    return output