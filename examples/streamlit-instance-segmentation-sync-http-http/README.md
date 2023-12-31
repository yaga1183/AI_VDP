# Instance Segmentation demo

This demo is to showcase using [VDP](https://github.com/instill-ai/vdp) to quickly set up a [Instance Segmentation](https://github.com/instill-ai/model-stomata-instance-segmentation-dvc) pipeline and [Streamlit](https://streamlit.io) to visualise the Instance Segmentation results.

## Preparation
Run VDP locally

```bash
$ git clone https://github.com/instill-ai/vdp.git && cd vdp
$ make all
```

If this is your first time setting up VDP, access the Console (http://localhost:3000) and you should see the onboarding page. Please enter your email and you are all set!

After onboarding, you will be redirected to the **Pipeline** page on the left sidebar, where you can build your first VDP pipeline by clicking **Set up your first pipeline** and forever change the way you approach visual data processing workflow development.

#### Create a SYNC pipeline `instance-segmentation`

**Step 1: Add a HTTP source**
A HTTP source accepts HTTP requests with image payloads to be processed by a pipeline.

To set it up,

1. click the **Pipeline mode** ▾ drop-down and choose `Sync`,
2. click the **Source type** ▾ drop-down and choose `HTTP`, and
3. click **Next**.

**Step 2: Import and deploy a model from GitHub**

To process images, here we import a [Mask R-CNN](https://github.com/onnx/models/blob/main/vision/object_detection_segmentation/mask-rcnn/model/MaskRCNN-10.onnx) model from our public GitHub repo [instill-ai/model-instance-segmentation-dvc](https://github.com/instill-ai/model-instance-segmentation-dvc).

To set it up,

1. give your model a unique ID `instance-segmentation`,
2. [optional] add description,
3. click the **Model source** ▾ drop-down and choose `GitHub`,
4. fill in the GitHub repository URL `instill-ai/model-instance-segmentation-dvc`, and the Git tag e.g., `v1.0-cpu` to import the corresponding model
5. click **Set up**.

**Step 3: Add a HTTP destination**

Since we are building a `SYNC` pipeline, the HTTP destination is automatically paired with the HTTP source.

Just click **Next**.

**Step 4: Set up the pipeline**

Almost done! Just

1. give your pipeline a unique ID `instance-segmentation`,
2. [optional] add description, and
3. click **Set up**.

Now you should see the newly created SYNC pipeline `instance-segmentation` on the Pipeline page 🎉

## How to run the demo
Run the following command
```bash
# Install dependencies
$ pip install -r requirements.txt

# Run the demo
#   --demo-url=< demo URL >
#   --api-gateway-url=< VDP API base URL >
#   --pipeline-id=< Pipeline ID >
$ streamlit run main.py -- --api-gateway-url=http://localhost:8080 --pipeline-id=instance-segmentation
```

Now go to `http://localhost:8501/` 🎉


## Deploy the demo using Docker
Alternatively, you can run the demo using Docker.

Build a Docker image
```bash
$ docker build -t vdp-streamlit-instance-segmentation .
```
Run the Docker container and connect to VDP
```bash
$ docker run --rm --name vdp-streamlit-instance-segmentation -p 8501:8501 --network instill-network vdp-streamlit-instance-segmentation -- --api-gateway-url=http://api-gateway:8080 --pipeline-id=instance-segmentation

You can now view your Streamlit app in your browser.

  URL: http://0.0.0.0:8501

```

## Shut down VDP

To shut down all running VDP services:
```
$ make down
```
