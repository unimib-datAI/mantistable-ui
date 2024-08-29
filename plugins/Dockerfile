FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /plugins 
COPY ./requirements.txt /plugins/requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt 
COPY ./app /app/

EXPOSE 5000

ENV PYTHONPATH "${PYTHONPATH}:/plugins:/plugins/plugins"