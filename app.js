"use strict"

function resetView() {
    document.querySelector(".repo-view").innerHTML = "";
}

function searchRepo() {
    resetView();
    getRepo(getInput());
}

function getInput() {
    return input.value; 
}

function makeRepoHTML(data) {
    for (let repo of data) {
        let div1 = document.createElement("div");
        let h2 = document.createElement("h2");
        let div2 = document.createElement("div");
        let ul = document.createElement("ul");
        let span1 = document.createElement("span");
        let span2 = document.createElement("span");
        let owner = document.createElement("li");
        owner.textContent = `Owner: ${repo["owner"]["login"]}`;
        ul.appendChild(owner);
        span1.textContent = "42";
        span2.textContent = "commits";
        div2.appendChild(span1);
        div2.appendChild(span2);
        div1.className = "repo";
        div1.dataset.repoName = repo["name"];
        div1.dataset.ownerName = repo["owner"]["login"];
        h2.textContent = repo["name"];
        div2.className = "commit-count";
        div1.appendChild(h2);
        div1.appendChild(div2);
        div1.appendChild(ul);
        document.querySelector(".repo-view").appendChild(div1);
    }
}

function showRepo(event, data) {
    makeRepoHTML(JSON.parse(this.responseText));
}

function getRepo(user) {
    const req = new XMLHttpRequest();
    req.open("GET", `https://api.github.com/users/${user || "octocat"}/repos`);
    req.send();
    req.addEventListener("load", showRepo);
}

const input = document.querySelector("input");
const btn = document.querySelector("button");
btn.addEventListener("click", searchRepo);