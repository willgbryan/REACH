FROM python:3.11.4-slim-bullseye as install-browser

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       chromium \
       chromium-driver \
       firefox-esr \
       git \
       wget \
    && chromium --version && chromedriver --version \
    && wget https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-linux64.tar.gz \
    && tar -xvzf geckodriver* \
    && chmod +x geckodriver \
    && mv geckodriver /usr/local/bin/ \
    && rm -rf /var/lib/apt/lists/*

FROM install-browser as reach-install

ENV PIP_ROOT_USER_ACTION=ignore

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

FROM reach-install AS reach

RUN useradd -ms /bin/bash reach \
    && chown -R reach:reach /usr/src/app

USER reach

COPY --chown=reach:reach ./ ./

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]