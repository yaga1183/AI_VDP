import {
    check,
} from "k6";

import encoding from 'k6/encoding';


export function verifyTextToImage(pipelineId, triggerType, modelTags, resp) {
    check((resp), {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response status is 200`]: (r) => r.status === 200,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs.length == 1`]: (r) => r.json().model_outputs.length == modelTags.length,
    });
    for (let i = 0; i < modelTags.length; i++) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[${i}].model`]: (r) => r.json().model_outputs[i].model === modelTags[i],
        });
    }

    check(resp, {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task`]: (r) => r.json().model_outputs[0].task === "TASK_TEXT_TO_IMAGE",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].text_to_image.images.length`]: (r) => r.json().model_outputs[0].task_outputs[0].text_to_image.images.length > 0,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].text_to_image.images[0]`]: (r) => encoding.b64decode(r.json().model_outputs[0].task_outputs[0].text_to_image.images[0]).byteLength > 0,
    });

    if (resp.json().model_outputs.length == 2) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task`]: (r) => r.json().model_outputs[1].task === "TASK_TEXT_TO_IMAGE",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].text_to_image.images.length`]: (r) => r.json().model_outputs[1].task_outputs[0].text_to_image.images.length > 0,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].text_to_image.images[0]`]: (r) => encoding.b64decode(r.json().model_outputs[1].task_outputs[0].text_to_image.images[0]).byteLength > 0,
        })
    }
}