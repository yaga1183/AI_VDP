import {
    check,
} from "k6";


export function verifyGPT2(pipelineId, triggerType, modelTags, resp) {
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
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task`]: (r) => r.json().model_outputs[0].task === "TASK_TEXT_GENERATION",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].text_generation.text.length`]: (r) => r.json().model_outputs[0].task_outputs[0].text_generation.text.length > 0,
    });

    if (resp.json().model_outputs.length == 2) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task`]: (r) => r.json().model_outputs[1].task === "TASK_TEXT_GENERATION",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].text_generation.text.length`]: (r) => r.json().model_outputs[1].task_outputs[0].text_generation.text.length > 0,
        })
    }
}