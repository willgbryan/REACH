from setuptools import find_packages, setup

with open(r"README.md", "r", encoding="utf-8") as f:
    long_description = f.read()

with open("requirements.txt", "r") as f:
    reqs = [line.strip() for line in f if ('selenium' not in line and 'webdriver' not in line)]

setup(
    name="REACH",
    version="0.0.1",
    description="The AI Consultant",
    package_dir={'reach': 'reach'},
    packages=find_packages(),
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/willgbryan/REACH",
    author="Will",
    author_email="will.bryan421@gmail.com",
    license="MIT",
    classifiers=[
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Artificial Intelligence",
    ],
    install_requires=reqs,


)