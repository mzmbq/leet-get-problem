---
<%* 
let url = await tp.system.clipboard();
let question = await tp.user.getLeetcodeProblem(tp, url, download_imgs=true, img_folder="assets/leetcode_imgs");

// console.log(question);

tp.file.rename(question.questionId + ". " + question.title);

_%>
Date: <% tp.file.creation_date() %>
Link: <% `https://leetcode.com/problems/${question.titleSlug}/` %>
Category: 
<%*
question.topicTags.forEach(item => {
	tR += `- ${item.name}\n`
}) _%>
Difficulty: <% question.difficulty %>
Completed: false
---

## Problem

<% question.content %>

<%*
question.hints.forEach(item => {
	tR += `> [!note]- Hint\n> ${item}\n\n`
})
_%>


## Solution 


## Notes