const searchInput = document.querySelector('.search__input')
const guessList = document.querySelector('.guess-list')
const repoList = document.querySelector('.repo-list')



const testBtn = document.querySelector('.test-btn')

const guessFullData = []
const repoArr = []


async function requestData() {

    guessFullData.length = 0
    guessList.innerHTML = ''
    // let userInput = 'React'
    console.log(this.userInput)
    let url = `https://api.github.com/search/repositories`;
    let urlRequest = url + '?q=' + encodeURIComponent(this.userInput)
    let response = await fetch(urlRequest);

    if (!response.ok) {
        renderGuessItem(0, `Ошибка соединения ${response.status}`)
        return
    }
    let responseBody = await response.json();
    console.log(responseBody)
    console.log(Array.isArray(responseBody.items))
    
    guessFullData.length = 0

    let arrLength = responseBody.items.length > 5 ? 5 : responseBody.items.length
    if (!arrLength) {
        renderGuessItem(0, 'Ничего не найдено :(')
    } else {
        for (let i = 0; i < arrLength; ++i ){
            renderGuessItem(i, responseBody.items[i].name)
            guessFullData.push(responseBody.items[i])
        }
    }
}

function renderGuessItem(id, text) {
    const newGuessItem = document.createElement('li')
    newGuessItem.classList.add('guess-list__item', `js-guess-${id}`)
    newGuessItem.textContent = text
    guessList.append(newGuessItem)
}

function searchIdNodeClass(startsWith, classList) {
    for (nodeClass of classList) {
        if (~nodeClass.indexOf(startsWith)) {
            return nodeClass.match(/\d+/)[0]
        }
    }
    return -1
}

function repoRender() {
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
    repoRender()
}

testBtn.addEventListener('click', {handleEvent: requestData, userInput: 'react',})
guessList.addEventListener('click', event => {
    // console.log(event.target)
    // console.log(guessFullData)
    

    let currentId = searchIdNodeClass('js-guess-', Array.from(event.target.classList))
    if (currentId === -1) return
    console.log(currentId)
    // console.log(guessFullData, guessFullData)
    // console.log(guessFullData[currentId])
    repoArr.push(guessFullData[currentId])
    console.log(repoArr)
    repoRender()

})

repoList.addEventListener('click', event => {
    console.log(event.target)
    let currentId = searchIdNodeClass('js-delete-btn-', Array.from(event.target.classList))
    if (currentId > -1 ) deleteRepoItem(currentId)
    // console.log(currentId)


})