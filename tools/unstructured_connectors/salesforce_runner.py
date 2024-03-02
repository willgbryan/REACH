from typing import List

def create_salesforce_ingest_script(
        consumer_key: str,
        username: str,
        private_key_path: str,
        categories: List[str],
        output_dir: str,
    ):

    """
    Args:
    - consumer_key (str): Consumer key for access config (user input).
    - username (str): Username for the Salesforce account (user input).
    - private_key_path (str): Path to the account private key (user input).
    - categories (List[str]): Categories to collect. Ex EmailMessage, Account, Lead, Case, Campaign (user input or agent selection)
    - output_dir (str): Directory to route results to (agent selection).
    """

    python_code = f"""
    from unstructured.ingest.connector.salesforce import SalesforceAccessConfig, SimpleSalesforceConfig
    from unstructured.ingest.interfaces import PartitionConfig, ProcessorConfig, ReadConfig
    from unstructured.ingest.runner import SalesforceRunner

    if __name__ == "__main__":
        runner = SalesforceRunner(
            processor_config=ProcessorConfig(
                verbose=True,
                output_dir={output_dir},
                num_processes=2,
            ),
            read_config=ReadConfig(),
            partition_config=PartitionConfig(),
            connector_config=SimpleSalesforceConfig(
                access_config=SalesforceAccessConfig(
                    consumer_key={consumer_key},
                ),
                username={username},
                private_key_path={private_key_path},
                categories={categories},
                recursive=True,
            ),
        )
        runner.run()
    """
    with open("script_to_run.py", "w") as file:
        file.write(python_code)
