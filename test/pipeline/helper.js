import http from "k6/http";
import {
    check,
    group,
    sleep,
} from "k6";
import {
    randomString
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


import * as constant from "./const.js"

export function setupConnectors() {
    group("Connector Backend API: Create a http source connector", function () {

        var res = http.request("POST", `${constant.apiHost}/v1alpha/source-connectors`,
            JSON.stringify({
                "id": "source-http",
                "source_connector_definition": "source-connector-definitions/source-http",
                "connector": {
                    "configuration": {}
                }
            }), {
                headers: {
                    "Content-Type": "application/json"
                },
            })
        check(res, {
            "POST /v1alpha/source-connectors response status for creating HTTP source connector 201": (r) => r.status === 201,
        })

    });

    group("Connector Backend API: Create a http destination connector", function () {

        var res = http.request("POST", `${constant.apiHost}/v1alpha/destination-connectors`,
            JSON.stringify({
                "id": "destination-http",
                "destination_connector_definition": "destination-connector-definitions/destination-http",
                "connector": {
                    "configuration": {}
                }
            }), {
                headers: {
                    "Content-Type": "application/json"
                },
            })
        check(res, {
            "POST /v1alpha/destination-connectors response status for creating HTTP destination connector 201": (r) => r.status === 201,
        })

    });
}

export function deployModel(model, repository, modelTags) {
    group(`Model Backend API: Deploy a model repo ${repository}`, function () {
        for (let i = 0; i < modelTags.length; i++) {
            let modelID = `${model}-${modelTags[i]}`.replace(".", "")
            let createModelResp = http.request("POST", `${constant.apiHost}/v1alpha/models`, JSON.stringify({
                "id": modelID,
                "model_definition": "model-definitions/github",
                "configuration": {
                    "repository": `${repository}`,
                    "tag": `${modelTags[i]}`
                }
            }), {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log("------>>>>> createModelResp ",  JSON.stringify({
                "id": modelID,
                "model_definition": "model-definitions/github",
                "configuration": {
                    "repository": `${repository}`,
                    "tag": `${modelTags[i]}`
                }
            }))
            console.log("------>>>>> createModelResp json ", createModelResp.json().operation.name)
            check(createModelResp, {
                [`POST /v1alpha/models ${model} response status`]: (r) =>
                    r.status === 201
            });
    
            // Check model creation finished
            let currentTime = new Date().getTime();
            let timeoutTime = new Date().getTime() + 10 * 60 * 1000;
            while (timeoutTime > currentTime) {
                let res = http.get(`${constant.apiHost}/v1alpha/${createModelResp.json().operation.name}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                if (res.json().operation.done === true) {
                    break
                }
                sleep(1)
                currentTime = new Date().getTime();
            }

            console.log("----->> modelID ", modelID)            
            check(http.post(`${constant.apiHost}/v1alpha/models/${modelID}/deploy`, {}, {
                headers: {
                    "Content-Type": "application/json",
                },
            }), {
                [`POST /v1alpha/models/${modelID}/deploy online response status`]: (r) =>
                    r.status === 200,
            });

            // Check the model state being updated in 24 hours. Some GitHub models is huge.
            currentTime = new Date().getTime();
            timeoutTime = new Date().getTime() + 24 * 60 * 60 * 1000;
            while (timeoutTime > currentTime) {
                var res = http.get(`${constant.apiHost}/v1alpha/models/${modelID}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                console.log("----->> res ", res.status)
                console.log("----->> res body ", res.json().model.state)
                if (res.json().model.state === "STATE_ONLINE") {
                    break
                }
                sleep(1)
                currentTime = new Date().getTime();
            }
        }
    });
}

export function createPipeline(model, modelTags) {
    let models = []
    for (let i = 0; i < modelTags.length; i++) {
        models.push(`models/${model}-${modelTags[i]}`.replace(".", ""))
    }
    var syncHTTPMultiModelRecipe = {
        recipe: {
            source: `source-connectors/source-http`,
            models: models,
            destination: `destination-connectors/destination-http`
        }
    }
    var reqHTTP = Object.assign({
            id: `${model}`,
            description: randomString(50),
        },
        syncHTTPMultiModelRecipe
    );

    check(http.request("POST", `${constant.apiHost}/v1alpha/pipelines`, JSON.stringify(reqHTTP), {
        headers: {
            "Content-Type": "application/json",
        },
    }), {
        "POST /v1alpha/pipelines response status is 201": (r) => r.status === 201,
    });
}


export function cleanup(model, modelTags) {
    check(http.request("DELETE", `${constant.apiHost}/v1alpha/pipelines/${model}`, null, {}), {
        [`DELETE /v1alpha/pipelines/${model} response status 204`]: (r) => r.status === 204,
    });

    check(http.request("DELETE", `${constant.apiHost}/v1alpha/source-connectors/source-http`), {
        [`DELETE /v1alpha/source-connectors/source-http response status 204`]: (r) => r.status === 204,
    });

    check(http.request("DELETE", `${constant.apiHost}/v1alpha/destination-connectors/destination-http`), {
        [`DELETE /v1alpha/destination-connectors/destination-http response status 204`]: (r) => r.status === 204,
    });

    for (let i = 0; i < modelTags.length; i++) {
        check(http.request("DELETE", `${constant.apiHost}/v1alpha/models/${model}-${modelTags[i]}.replace(".", "")`, null, {}), {
            [`DELETE /v1alpha/models/${model}-${modelTags[i]}.replace(".", "") response status is 204`]: (r) => r.status === 204,
        });
    }
}

// Initialize
export function sendSlackMessages(data) {
    // Create the payload for the Slack message
    const payload = {
        channel: "msg-automation-test",
        attachments: [{
            color: "#9205a2",
            blocks: [{
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text:  data.metrics.checks.values ,
                    },
                },
                {
                    type: "divider",
                },
                {
                    type: "context",
                    elements: [{
                            type: "image",
                            image_url: "https://raw.githubusercontent.com/k6io/awesome-k6/master/assets/bert.png",
                            alt_text: "k6 croc",
                        },
                        {
                            type: "mrkdwn",
                            text: "*Crocodile* has approved this message.",
                        },
                    ],
                },
            ],
        }, ],
    };

    // Send a message to Slack
    const res = http.post(
        "https://slack.com/api/chat.postMessage",
        JSON.stringify(payload), {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + constant.slackToken,
            },
        }
    );

    // Check the response
    check(res, {
        "is status 200": (r) => r.status === 200,
    });
}