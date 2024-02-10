async function getLeetProblem(tp, url) {

    console.log(url)

    let titleSlug = extractProblemSlug(url);

    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
    }

    let gqlBody = {
        query: `query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            boundTopicId
            title
            titleSlug
            content
            translatedTitle
            translatedContent
            isPaidOnly
            difficulty
            likes
            dislikes
            isLiked
            similarQuestions
            contributors {
                username
                profileUrl
                avatarUrl
                __typename
            }
            langToValidPlayground
            topicTags {
                name
                slug
                translatedName
                __typename
            }
            companyTagStats
            codeSnippets {
                lang
                langSlug
                code
                __typename
            }
            stats
            hints
            solution {
                id
                canSeeDetail
                __typename
            }
            status
            sampleTestCase
            metaData
            judgerAvailable
            judgeType
            mysqlSchemas
            enableRunCode
            enableTestMode
            envInfo
            libraryUrl
            __typename
            }
        }`,
        variables: { "titleSlug": "two-sum" }
    }

    let bodyContent = JSON.stringify(gqlBody);

    let response = await tp.obsidian.request({
        url: "https://leetcode.com/graphql",
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    // console.log(response);
    return response
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


module.exports = getLeetProblem;