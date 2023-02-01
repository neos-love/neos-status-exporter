import axios from "axios";
import express from "express";
import fs from "fs/promises"

const API_ENDPOINT = "https://api.neos.com/api/stats/onlineUserStats"

let cache = ""

const app = express()
app.listen(3000, () => {console.log("OK 3000")})
app.get("*", async (req, res) => {
    res.header('Content-Type', 'text/plain;charset=utf-8');
    return res.send(cache)
})

const getStatus = async () => {
    try {
        /**
         * {
         *     "captureTimestamp": "2023-01-28T11:38:39.1834105Z",
         *     "registeredUserCount": 333,
         *     "instanceCount": 330,
         *     "vrUserCount": 119,
         *     "screenUserCount": 77,
         *     "headlessUserCount": 129,
         *     "mobileUserCount": 0,
         *     "publicSessionCount": 123,
         *     "activePublicSessionCount": 23,
         *     "publicWorldUserCount": 55,
         *     "PartitionKey": "2517273948808165894",
         *     "RowKey": "",
         *     "Timestamp": "0001-01-01T00:00:00+00:00",
         *     "ETag": null
         * }
         */
        const { data } = await axios.get(API_ENDPOINT)
        return formatData(data || {})
    } catch {
        console.error("err")
    }
}

const formatData = (data) => {
    let date = 0
    try {
        date = new Date(data.captureTimestamp).getTime()
    } catch {}

    return {
        captureTimestamp: date,
        registeredUserCount: data.registeredUserCount || 0,
        instanceCount: data.instanceCount || 0,
        vrUserCount: data.vrUserCount || 0,
        screenUserCount: data.screenUserCount || 0,
        headlessUserCount: data.headlessUserCount || 0,
        mobileUserCount: data.mobileUserCount || 0,
        publicSessionCount: data.publicSessionCount || 0,
        activePublicSessionCount: data.activePublicSessionCount || 0,
        publicWorldUserCount: data.publicWorldUserCount || 0,
    }
}

const makeGaugeText = (name, data) => {
    return `# HELP neos_${name} neos ${name} value
# TYPE neos_${name} gauge
neos_${name} ${data}`
}

const nameMap = {
    captureTimestamp: "capture_timestamp",
    registeredUserCount: "registered_users",
    instanceCount: "instances",
    vrUserCount: "users{device=\"vr\"}",
    screenUserCount: "users{device=\"screen\"}",
    headlessUserCount: "users{device=\"headless\"}",
    mobileUserCount: "users{device=\"mobile\"}",
    publicSessionCount: "public_sessions",
    activePublicSessionCount: "active_public_sessions",
    publicWorldUserCount: "public_world_users"
}

const updateData = async () => {
    const data = await getStatus()
    cache = Object.entries(data).map(([name, data]) => makeGaugeText(nameMap[name], data)).join("\n")
}
await updateData()
setInterval(async () => await updateData() , 60 * 1000)



