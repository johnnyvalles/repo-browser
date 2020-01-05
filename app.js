"use strict";

const input = document.querySelector("input");
const srchBtn = document.querySelector("button");
srchBtn.addEventListener("click", searchClicked);
const repoView = document.querySelector(".repo-view");

function Repo(owner, name, forks, stars, branches = 0) {
    this.owner = owner;
    this.name = name;
    this.forks_count = forks;
    this.stargazers_count = stars;
    this.branch_count = branches; 
}

function makeRepoHTML(repo) {
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
        let branches = document.createElement("li");
        branches.textContent = `Branches: ${repo["branch_count"]}`;
        let forks = document.createElement("li");
        forks.textContent = `Forks: ${repo["forks_count"]}`;
        ul.appendChild(owner);
        ul.appendChild(branches);
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

function createRepoObjects(data) {
    let repos = [];
    data.forEach(function(repo) {
        repos.push(new Repo(
            repo["owner"]["login"],
            repo["name"],
            repo["forks_count"],
            repo["stargazers_count"]
        ));
    });
    return repos;
}

function getUserData(user) {
    // Create the first request to get the user's list of repositories.
    let repoReq = new XMLHttpRequest();
    repoReq.open("GET", `https://api.github.com/users/${user || 'octocat'}/repos`);
    repoReq.addEventListener("load", function() {
        /* 
            Check if the request was successfull. 
            If server response is not 200, there was an error.
            Otherwise, continue through and begin requesting branch
            data for each repository.
        */
        if (repoReq.status != 200) {
            console.log(`Error getting the repo data for user ${user}`);
        } else {
            // Parse response (returns the user's repositories)
            let repoData = JSON.parse(repoReq.responseText);
            
            // Create Repo objects from response data.
            let repos = createRepoObjects(repoData);

            // For each Repo object in repos, request its branch count.
            repos.forEach(function(repo) {
                // Create a request for the repos' branches.
                let branchReq = new XMLHttpRequest();
                branchReq.open("GET", `https://api.github.com/repos/${repo.owner}/${repo.name}/branches`);
                
                branchReq.addEventListener("load", function() {
                    if (branchReq.status != 200) {
                        console.log(`Error getting the branches for repo ${repo.name}`);
                        repo.branch_count = "Error";
                    } else {
                        let res = JSON.parse(branchReq.responseText);
                        repo.branch_count = res.length;
                    }
                    makeRepoHTML(repo);
                });

                branchReq.send();
            });
        }
    });
    repoReq.send();
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
    let user = getInput();
    resetInput();
    resetRepoView();
    getUserData(user);
}