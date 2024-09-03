# LeetCode Problem to Obsidian

A script for Obsidian to fetch LeetCode problems as notes.
This script uses the [Templater](https://github.com/SilentVoid13/Templater) plugin.

## Demo

https://github.com/mzmbq/leet-get-problem/assets/100804739/5b2811d6-2998-4320-9f23-a49e74cfe4cb

## Setup

- Move `templates/templateLeetcode.md` to the template folder.
- Move `scripts/getLeetcodeProblem.js` to the script folder.

Template and script folders are set in Templater settings.

## Usage

- Copy the problem's URL.
- Create a new note.
- Run the `templateLeetcode` template from the **Templater: Open insert template modal** command.
- Watch the note get filled out with the content of the problem.

> [!TIP]
> You can create keyboard shortcuts for this Templater script.

## Template

If the problem contains images, they will be downloaded in the `assets/leetcode_imgs` folder.
You can modify the template to change this folder or disable image downloading.