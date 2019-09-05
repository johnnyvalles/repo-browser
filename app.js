"use strict";

const input = document.querySelector("input");
const srchBtn = document.querySelector("button");
srchBtn.addEventListener("click", searchClicked);
const repoView = document.querySelector(".repo-view");
let curr_repos = [];

function Repo(owner, name, watchers, forks, stars) {
    this.owner = owner;
    this.name = name;
    this.watchers_count = watchers; 
    this.forks_count = forks;
    this.stargazers_count = stars;
    this.commits = [];  // Array for all commits
}

function makeRepoHTML(data) {
    for (let repo of data) {
        // main parent DIV
        let card = document.createElement("div");
        card.className = "repo";
        card.dataset.repoName = repo["name"];
        card.dataset.ownerLogin = repo["owner"];

        // info DIV
        let info = document.createElement("div");
        info.className = "info";
        let h2 = document.createElement("h2");
        h2.textContent = repo["name"];
        let ul = document.createElement("ul");
        let owner = document.createElement("li");
        owner.textContent = `Owner: ${repo["owner"]}`;
        let watchers = document.createElement("li");
        watchers.textContent = `Watchers: ${repo["watchers_count"]}`;
        let forks = document.createElement("li");
        forks.textContent = `Forks: ${repo["forks_count"]}`;
        ul.appendChild(owner);
        ul.appendChild(watchers);
        ul.appendChild(forks);
        info.appendChild(h2);
        info.appendChild(ul);

        // stargazers DIV
        let starsCount = document.createElement("div");
        starsCount.className = "stars-count";
        let count = document.createElement("span");
        count.textContent = repo["stargazers_count"];
        let stars = document.createElement("span");
        stars.textContent = (repo["stargazers_count"] == 1 ? "star" : "stars");
        starsCount.appendChild(count);
        starsCount.appendChild(stars);

        // Add info and stargazers DIV to main DIV
        card.appendChild(info);
        card.appendChild(starsCount);
        document.querySelector(".repo-view").appendChild(card);
    }
}

function parseResponse(res) {
    for (let repo of res) {
        curr_repos.push(new Repo(repo["owner"]["login"], 
        repo["name"], repo["watchers_count"], 
        repo["forks_count"], repo["stargazers_count"]));
    }
}

function searchUser(user) {
    const req = new XMLHttpRequest();
    req.open("GET", `https://api.github.com/users/${user || "octocat"}/repos`);
    req.addEventListener("load", () => { 
        parseResponse(JSON.parse(req.responseText));
        makeRepoHTML(curr_repos);
    });
    req.send();
}

function resetRepoView() {
    repoView.innerHTML = "";
}

function resetInput() {
    input.value = "";
}

function getInput() {
    return input.value;
}

// Entry Point
function searchClicked() {
    console.log("SEARCH");
    let user = getInput();
    resetInput();
    resetRepoView();
    curr_repos = [];
    searchUser(user);
}