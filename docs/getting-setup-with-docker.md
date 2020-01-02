![StayWoke Logo](https://staywoke-github.s3.us-east-1.amazonaws.com/common/logo.png "StayWoke Logo")

**[↤ Developer Overview](../README.md)**

Getting Setup with Docker ( Recommended )
===

Requirements
---

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/) _( this comes pre-installed with latest version of Docker )_


Installing
---

Using Docker is Super Easy once it's installed, you just need to run the following commands:

```bash
cd /path/to/api
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.5.1
docker-compose up --build
```

Accessing the API via Browser
---

Once the API is up and running you can access a local URL via:

```text
http://localhost:5000/v1/token?apikey=YOUR_API_KEY&pretty
```

`YOUR_API_KEY` is whatever you setup in [Downloading API](../docs/downloading-api.md)