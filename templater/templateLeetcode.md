---
<%* 
let url = await tp.system.clipboard();
let problem = await tp.user.getLeetProblem(tp, url);
let question = problem.data.question;

console.log(question);

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

<% tp.obsidian.htmlToMarkdown(question.content) %>

<%*
question.hints.forEach(item => {
	tR += `> [!note]- Hint\n> ${item}\n\n`
})
_%>


## Solution 


## Notes