# GCR-fastify

```
    export PROJECT_ID=dulcet-day-241310
```

Build and tag the Docker image:

```
    docker build --tag eu.gcr.io/$PROJECT_ID/fastify-app:v1.0.0 .
```


Local run and check
```
    docker compose up --build
```


Push the Docker image to Cloud Registry

We can do that with command line:

```
    docker push eu.gcr.io/$PROJECT_ID/fastify-app:v1.0.0
```

Then we can use gcloud container CLI command to check if the image is already stored in the registry:

```
    gcloud container images list-tags eu.gcr.io/$PROJECT_ID/fastify-app
```

### Deploy to Cloud Run using CLI command

```
    gcloud run deploy --image eu.gcr.io/$PROJECT_ID/fastify-app:v1.0.0
```

We can inspect services via gcloud run services list command
```
    gcloud run services list
```

And by inspecting the Docker image, you can see its architecture:
```
    docker inspect eu.gcr.io/$PROJECT_ID/fastify-app:v1.0.0
```  
