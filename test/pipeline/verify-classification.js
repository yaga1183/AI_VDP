import {
    check,
} from "k6";

let classificationDog = "golden retriever"
let classificationBear = "brown bear"

if (__ENV.TARGET == "m1") { // m1 have problem with classification extension and result with the Triton 22.12 is wrong when running batching.
    classificationDog = "tile roof"
    classificationBear = "tile roof"
}

export function verifyClassification(pipelineId, triggerType, modelTags, resp) {
    check(resp, {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response status is 200`]: (r) => r.status === 200,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs.length == modelTags.length`]: (r) => r.json().model_outputs.length == modelTags.length,
    });

    for (let i = 0; i < modelTags.length; i++) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[${i}].model`]: (r) => r.json().model_outputs[i].model === modelTags[i],
        });
    }
    
    check(resp, {
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task`]: (r) => r.json().model_outputs[0].task === "TASK_CLASSIFICATION",
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs.length`]: (r) => r.json().model_outputs[0].task_outputs.length === 2,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].classification.category`]: (r) => r.json().model_outputs[0].task_outputs[0].classification.category === classificationDog,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[0].classification.score`]: (r) => r.json().model_outputs[0].task_outputs[0].classification.score > 0.7,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].classification.category`]: (r) => r.json().model_outputs[0].task_outputs[1].classification.category === classificationBear,
        [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[0].task_outputs[1].classification.score`]: (r) => r.json().model_outputs[0].task_outputs[1].classification.score > 0.7,
    });
    if (resp.json().model_outputs.length == 2) {
        check(resp, {
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task`]: (r) => r.json().model_outputs[1].task === "TASK_CLASSIFICATION",
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs.length`]: (r) => r.json().model_outputs[0].task_outputs.length === 2,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].classification.category`]: (r) => r.json().model_outputs[1].task_outputs[0].classification.category === classificationDog,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[0].classification.score`]: (r) => r.json().model_outputs[1].task_outputs[0].classification.score > 0.7,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].classification.category`]: (r) => r.json().model_outputs[1].task_outputs[1].classification.category === classificationBear,
            [`POST /v1alpha/pipelines/${pipelineId}/trigger (${triggerType}) response model_outputs[1].task_outputs[1].classification.score`]: (r) => r.json().model_outputs[1].task_outputs[1].classification.score > 0.7,
        });
    }
}
