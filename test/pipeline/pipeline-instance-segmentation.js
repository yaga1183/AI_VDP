import http from "k6/http";
import {
    group,
} from "k6";
import {
    FormData
} from "https://jslib.k6.io/formdata/0.0.2/index.js";
import encoding from "k6/encoding";
import {
    textSummary
} from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

import * as constant from "./const.js"
import * as verify from "./verify-instance-segmentation.js"
import * as helper from "./helper.js"

const model = "instance-segmentation";
const modelRepository = "instill-ai/model-instance-segmentation-dvc";

let modelTags

if (__ENV.TEST_CPU_ONLY) {
    modelTags = [
        `v1.0-cpu`,
    ]
} else if (__ENV.TEST_GPU_ONLY) {
    modelTags = [
        `v1.0-gpu`,
    ]
} else {
    modelTags = [
        `v1.0-cpu`,
        `v1.0-gpu`,
    ]
}

export let options = {
    setupTimeout: '30000s',
    insecureSkipTLSVerify: true,
    thresholds: {
        checks: ["rate == 1.0"],
    },
};

export function setup() {
    if (__ENV.MODE == "demo") {
    } else {
        helper.setupConnectors()
        helper.deployModel(model, modelRepository, modelTags)
        helper.createPipeline(model, modelTags)
    }
}

export default function () {
    group("Trigger: Instance Segmentation model", function () {

        verify.verifyInstanceSegmentation(`${model}`, "url", modelTags, http.request("POST", `${constant.apiHost}/v1alpha/pipelines/${model}/trigger`, JSON.stringify({
            "task_inputs": [{
                "instance_segmentation": {
                    "image_url": "https://artifacts.instill.tech/imgs/dog.jpg",
                }
            }, {
                "instance_segmentation": {
                    "image_url": "https://artifacts.instill.tech/imgs/bear.jpg",
                }
            }]
        }), {
            headers: {
                "Content-Type": "application/json",
            },
        }))

        verify.verifyInstanceSegmentation(`${model}`, "base64", modelTags, http.request("POST", `${constant.apiHost}/v1alpha/pipelines/${model}/trigger`, JSON.stringify({
            "task_inputs": [{
                "instance_segmentation": {
                    "image_base64": encoding.b64encode(constant.dogImg, "b"),
                },
            }, {
                "instance_segmentation": {
                    "image_base64": encoding.b64encode(constant.bearImg, "b"),
                },
            }]
        }), {
            headers: {
                "Content-Type": "application/json",
            },
        }))

        var fd = new FormData();
        fd.append("file", http.file(constant.dogImg, "dog.jpg"));
        fd.append("file", http.file(constant.bearImg, "bear.jpg"));
        verify.verifyInstanceSegmentation(`${model}`, "form_data", modelTags, http.request("POST", `${constant.apiHost}/v1alpha/pipelines/${model}/trigger-multipart`, fd.body(), {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${fd.boundary}`,
            },
        }))

    });
}

export function teardown(data) {
    if (__ENV.MODE == "demo") {
    } else {
        helper.cleanup(model, modelTags)
    }
}

export function handleSummary(data) {
    if (__ENV.NOTIFICATION == "true") {
        helper.sendSlackMessages(data);
    }
    return {
        stdout: textSummary(data, {
            indent: "→",
            enableColors: true
        }),
    };
}