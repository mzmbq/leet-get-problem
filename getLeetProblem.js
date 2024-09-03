const path = require('path');
const fs = require('fs');
let tp = null;

const headersList = {
  Accept: "*/*",
  "User-Agent": "leet-get-problem",
  "Content-Type": "application/json",
};

/**
 * Retrieves a LeetCode problem.
 *
 * @async
 * @param {Object} tp - The templater object.
 * @param {string} url - Leetcode problem URL.
 * @param {boolean} [download_imgs=false] - Whether to download images or not.
 * @param {string} [img_folder="assets/leetcode_images"] - The folder in which to save the images.
 * @returns {Promise<Object>} - The LeetCode problem object.
 * 
 */
async function getLeetcodeProblem(tp_object, url, download_imgs = true, img_folder = "leetcode/images") {
  // initialize the templater object
  tp = tp_object;

  const question = await fetchLeetcodeAPI(url);
  question.content = tp.obsidian.htmlToMarkdown(question.content);

  if (download_imgs) {
    question.content = await getImages(question.content, img_folder, question.questionId);
  }
  return question;
}

async function fetchLeetcodeAPI(url) {
  const titleSlug = extractProblemSlug(url);
  if (!titleSlug) {
    console.error("Invalid or unsupported URL format.");
    return null;
  }

  const gqlBody = {
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
    variables: { titleSlug: titleSlug },
  };
  const bodyContent = JSON.stringify(gqlBody);

  const response = await tp.obsidian.request({
    url: "https://leetcode.com/graphql",
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  const problem = await JSON.parse(response);
  return problem.data.question;
}

function extractProblemSlug(url) {
  const regex = /\/problems\/([^/]+)\//;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error("Invalid or unsupported URL format.");
  }
}

/**
 * Downlaods images from the links in the content. Replaces the links with the relative path of the downloaded images.
 */
async function getImages(content, img_folder, prefix) {
  const img_folder_path = path.join(vaultPath(), img_folder);
  mkdir(img_folder_path);
  const note_folder_path = path.join(vaultPath(), tp.config.target_file.parent.path);

  for (const match of findImgLinks(content)) {
    // Download image
    const img_url = match.groups.url;
    const img_filename = `${prefix}_${path.basename(img_url)}`;
    const img_path = path.join(img_folder_path, img_filename);
    await downloadImage(img_url, img_path);
    // Update content
    const relative_img_path = path.relative(note_folder_path, img_path);
    content = content.replace(img_url, relative_img_path.replace(/\\/g, "/"));
  }

  return content;
}

async function downloadImage(url, filepath) {
  // console.log("leet-get-problem: Downloading image: " + url);
  const response = await tp.obsidian.requestUrl({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer',
    headers: {
      ...headersList,
    },
  });

  if (response.status == 200) {
    fs.writeFileSync(filepath, Buffer.from(response.arrayBuffer), 'binary');
  } else {
    console.error("leet-get-problem: Failed to download image: " + url);
  }
}

function vaultPath() {
  // TODO: Find a better way to get vault path
  return tp.config.target_file.vault.adapter.basePath;
}

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function findImgLinks(content) {
  const regex = /!\[.*?\]\((?<url>.*?)\)/g;
  return content.matchAll(regex);
}


module.exports = getLeetcodeProblem;
