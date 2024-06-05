const searchInput = document.querySelector('.search__input')
const guessList = document.querySelector('.guess-list')
const repoList = document.querySelector('.repo-list')

const guessFullData = []
const repoArr = []


async function requestData() {
    guessFullData.length = 0
    let userInput = this.value

    if (userInput.length < 1 ) {
        renderGuessList()
        return
    }
    
    let url = `https://api.github.com/search/repositories`;
    let urlRequest = url + '?q=' + encodeURIComponent(userInput)
    let response = await fetch(urlRequest);

    if (!response.ok) {
        renderNoGuess(`Ошибка соединения ${response.status}`)
        return
    }
    let responseBody = await response.json();
    
    if(responseBody.items.length < 1) renderNoGuess('Ничего не найдено :(')
    else renderGuessList(responseBody.items.slice(0, 5))
}

function renderGuessItem(text, id = '') {
    const newGuessItem = document.createElement('li')
    newGuessItem.classList.add('guess-list__item', `js-guess-${id}`)
    newGuessItem.textContent = text
    guessList.append(newGuessItem)
}

function renderNoGuess(text) {
    guessList.innerHTML = ''
    renderGuessItem(text)
}

function renderGuessList(guessArr) {
    guessList.innerHTML = ''

    if (guessArr === undefined) return

    for (let i = 0; i < guessArr.length; ++i ){
        renderGuessItem(guessArr[i].name, i)
        guessFullData.push(guessArr[i])
    }
}

function searchIdNodeClass(startsWith, classList) {
    for (nodeClass of classList) {
        if (~nodeClass.indexOf(startsWith)) {
            if (nodeClass.match(/\d+/) === null) return -1
            return nodeClass.match(/\d+/)[0]
        }
    }
    return -1
}

function renderRepoList() {
    repoList.innerHTML = ''

    repoArr.forEach((repo, id) => {

        const newRepoItem = document.createElement('li')
        newRepoItem.classList.add('repo-list__item', 'repo-item', `js-repo-item-${id}`)

        const repoData = document.createElement('div')
        repoData.classList.add('repo-item__data')

        const dataName = document.createElement('div')
        dataName.textContent = `Name: ${repo.name}`
        repoData.append(dataName)

        const dataOwner = document.createElement('div')
        dataOwner.textContent = `Owner: ${repo.owner.login}`
        repoData.append(dataOwner)

        const dataStars = document.createElement('div')
        dataStars.textContent = `Stars: ${repo.stargazers_count}`
        repoData.append(dataStars)

        newRepoItem.append(repoData)

        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('repo-item__remove', 'delete-btn', `js-delete-btn-${id}`)
        newRepoItem.append(deleteBtn)

        repoList.append(newRepoItem)
        
    })
}

function deleteRepoItem(id) {
    repoArr.splice(id, 1)
    renderRepoList()
}

searchInput.addEventListener('keyup', debounce(requestData, 180))

guessList.addEventListener('click', event => {
    let currentId = searchIdNodeClass('js-guess-', Array.from(event.target.classList))
    if (currentId === -1) return
    
    repoArr.push(guessFullData[currentId])
    searchInput.value = ''
    guessFullData.length = 0

    renderGuessList()
    renderRepoList()

})

repoList.addEventListener('click', event => {
    let currentId = searchIdNodeClass('js-delete-btn-', Array.from(event.target.classList))
    if (currentId > -1 ) deleteRepoItem(currentId)
})

function debounce(fn, ms) {
    let lastRequest
    return function() {
        clearTimeout(lastRequest)
        lastRequest = setTimeout(fn.bind(this, arguments), ms)
    }
}
