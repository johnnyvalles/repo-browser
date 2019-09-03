"use strict";

const input = document.querySelector("input");
const srchBtn = document.querySelector("button");
const repoView = document.querySelector(".repo-view");
let curr_repos = [];

function Repo(owner, name, watchers, forks) {
    this.owner = owner;
    this.name = name;
    this.watchers_count = watchers; 
    this.forks_count = forks;
    this.commits = [];  // Array for all commits
}

function resetRepoView() {
    repoView.innerHTML = "";
}

function parseResponse(res) {
    res = JSON.parse(res);
    for (let repo of res) {
        curr_repos.push(new Repo(repo["owner"]["login"], 
        repo["name"], repo["watchers_count"], repo["forks_count"]));
    }
}

function searchUser(user) {
    const req = new XMLHttpRequest();
    req.open("GET", `https://api.github.com/users/${user || "octocat"}/repos`);
    req.addEventListener("load", () => {
        parseResponse(req.responseText);
    });
    req.send();
}

function getInput() {
    return input.value;
}

function resetInput() {
    input.value = "";
}

function searchClicked() {
    let user = getInput();
    resetInput();
    resetRepoView();
    searchUser(user);
    console.log(curr_repos);
}

srchBtn.addEventListener("clicked", searchClicked);