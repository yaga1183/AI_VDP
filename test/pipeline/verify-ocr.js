import {
    check,
} from "k6";


export function verifyOcr(pipelineId, triggerType, modelTags, resp) {
    check((resp), {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response status is 200`]: (r) => r.status === 200,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs.length == 1`]: (r) => r.json().model_outputs.length == modelTags.length,
    });
    for (let i = 0; i < modelTags.length; i++) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[${i}].model`]: (r) => r.json().model_outputs[i].model === `models/${pipelineId}-${modelTags[i]}`.replace(".", ""),
        });
    }

    check(resp, {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task`]: (r) => r.json().model_outputs[0].task === "TASK_OCR",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs.length`]: (r) => r.json().model_outputs[0].task_outputs.length === 2,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects.length`]: (r) => r.json().model_outputs[0].task_outputs[0].ocr.objects.length === 6,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects[0].score`]: (r) => r.json().model_outputs[0].task_outputs[0].ocr.objects[0].score > 0.7,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects[0].text`]: (r) => r.json().model_outputs[0].task_outputs[0].ocr.objects[0].text == "WAITING?",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.top - 139) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.left - 59) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.width - 339) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[0].ocr.objects[0].bounding_box.height - 66) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects.length`]: (r) => r.json().model_outputs[0].task_outputs[1].ocr.objects.length === 3,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects[0].score`]: (r) => r.json().model_outputs[0].task_outputs[1].ocr.objects[0].score > 0.7,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects[0].text`]: (r) => r.json().model_outputs[0].task_outputs[1].ocr.objects[0].text == "EMERGENCY",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.top - 181) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.left - 331) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.width - 1063) < 5,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[0].task_outputs[1].ocr.objects[0].bounding_box.height - 186) < 5,
    });
    if (resp.json().model_outputs.length == 2) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task`]: (r) => r.json().model_outputs[1].task === "TASK_OCR",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs.length`]: (r) => r.json().model_outputs[1].task_outputs.length === 2,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects.length`]: (r) => r.json().model_outputs[1].task_outputs[0].ocr.objects.length === 6,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects[0].score`]: (r) => r.json().model_outputs[1].task_outputs[0].ocr.objects[0].score > 0.7,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects[0].text`]: (r) => r.json().model_outputs[1].task_outputs[0].ocr.objects[0].text == "WAITING?",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.top - 139) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.left - 59) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.width - 339) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[0].ocr.objects[0].bounding_box.height - 66) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects.length`]: (r) => r.json().model_outputs[1].task_outputs[1].ocr.objects.length === 3,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects[0].score`]: (r) => r.json().model_outputs[1].task_outputs[1].ocr.objects[0].score > 0.7,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects[0].text`]: (r) => r.json().model_outputs[1].task_outputs[1].ocr.objects[0].text == "EMERGENCY",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.top`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.top - 181) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.left`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.left - 331) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.width`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.width - 1063) < 5,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.height`]: (r) => Math.abs(r.json().model_outputs[1].task_outputs[1].ocr.objects[0].bounding_box.height - 186) < 5,
        });
    }
}