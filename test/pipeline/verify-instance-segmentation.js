import {
    check,
} from "k6";


export function verifyInstanceSegmentation(pipelineId,triggerType, modelTags, resp) {
    check(resp, {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response status is 200`]: (r) => r.status === 200,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs.length == 1`]: (r) => r.json().model_outputs.length >= 1,
    });

    for (let i = 0; i < modelTags.length; i++) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[${i}].model`]: (r) => r.json().model_outputs[i].model === modelTags[i],
        });
    }

    check(resp, {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task`]: (r) => r.json().model_outputs[0].task === "TASK_INSTANCE_SEGMENTATION",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs.length`]: (r) => r.json().model_outputs[0].task_outputs.length === 2,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects.length`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects.length === 2,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].category`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].category === "dog",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].score`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].score > 0.7,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].rle.length`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].rle.length > 0,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.top - 95) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.left - 320) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.width - 215) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[0].bounding_box.height - 406) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].category`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].category === "dog",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].score`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].score > 0.7,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].rle.length`]: (r) => r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].rle.length > 0,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.top - 194) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.left - 130) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.width - 197) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].instance_segmentation.objects[1].bounding_box.height - 248) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects.length`]: (r) => r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects.length === 1,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].category`]: (r) => r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].category === "bear",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].score`]: (r) => r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].score > 0.7,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].rle.length`]: (r) => r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].rle.length > 0,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.top - 77) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.left - 289) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.width - 559) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].instance_segmentation.objects[0].bounding_box.height - 777) < 5,
    });
    if (resp.json().model_outputs.length == 2) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task`]: (r) => r.json().model_outputs[1].task === "TASK_INSTANCE_SEGMENTATION",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs.length`]: (r) => r.json().model_outputs[1].task_outputs.length === 2,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects.length`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects.length === 2,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].category`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].category === "dog",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].score`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].score > 0.7,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].rle.length`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].rle.length > 0,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.top - 95) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.left - 320) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.width - 215) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[0].bounding_box.height - 406) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].category`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].category === "dog",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].score`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].rle.length > 0,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].rle.length`]: (r) => r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].score > 0.7,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.top - 194) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.left - 130) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.width - 197) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].instance_segmentation.objects[1].bounding_box.height - 248) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects.length`]: (r) => r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects.length === 1,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].category`]: (r) => r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].category === "bear",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].score`]: (r) => r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].score > 0.7,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].rle.length`]: (r) => r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].rle.length > 0,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.top - 77) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.left - 289) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.width - 559) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].instance_segmentation.objects[0].bounding_box.height - 777) < 5,
        });
    }
}