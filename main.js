const https = require("https");

function fetchLeetProblem(slug) {
    // link = await tp.system.prompt("Problem URL or slug") ?? "Untitled";

    // let title = tp.file.title
    // if (title.startsWith("Untitled")) {
    //     title = await tp.system.prompt("Title") ?? "Untitled";
    //     await tp.file.rename(`${title}`);
    // } 


    return new Promise((resolve, reject) => {
        let bodyContent = JSON.stringify({
            "operationName": "questionData",
            "variables": {
                "titleSlug": slug
            },
            "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n         title\n    titleSlug\n    content\n    }}\n"
        });

        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
        }

        let options = {
            hostname: "leetcode.com",
            port: 443,
            path: "/graphql",
            method: "POST",
            headers: headersList,
            body: bodyContent,
        }


        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let body = "";

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                resolve(body);
            });

        })

        req.on('error', (e) => {
            reject(e.message);
        })

        req.write(bodyContent);
        req.end();

    })
}

function extractProblemSlug(url) {
    const regex = /\/problems\/([^/]+)\//;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    } else {
        return null; // Invalid or unsupported URL format
    }
}




fetchLeetProblem(extractProblemSlug("https://leetcode.com/problems/merge-strings-alternately/description/?envType=study-plan-v2&envId=leetcode-75")).then((data) => {
    console.log(JSON.parse(data)["data"]["question"]["content"]);
})




module.exports = fetchLeetProblem

fetchLeetProblem(null)