window.onload = () => {
    loadPage();
}

const domain = 'https://api.github.com';
const user = 'Vinny147';

function loadPage() {
    let xhrUser = new XMLHttpRequest();
    xhrUser.onload = function () { // pega os dados do usuário na api e coloca nos elementos html
        let userData = JSON.parse(this.responseText);
        let htmlProfile = ` <img id="profileImg" src="${userData.avatar_url}" alt="Imagem de perfil do Github">
                            <div id="profileContent">
                                <a target="_blank" href="${userData.html_url}">
                                    <h1 id="name">${userData.name}</h1>
                                </a>
                                <h4 id="userName">${userData.login}</h4>
                                <p id="bio">${userData.bio}</p>
                                <div id="status">
                                    <a target="_blank" href="${userData.html_url + '?tab=followers'}">
                                        <i class="bi bi-people"></i>
                                        <p>${userData.followers}</p>
                                        <h6>seguidores</h6>
                                    </a>
                                    <i class="bi bi-dot"></i>
                                    <a target="_blank" href="${userData.html_url + '?tab=following'}">
                                        <p>${userData.following}</p>
                                        <h6>seguindo</h6>
                                    </a>
                                    <i class="bi bi-dot"></i>
                                    <a target="_blank" href="${userData.html_url + '?tab=stars'}">
                                        <i class="bi bi-star"></i>
                                        <h6>starred</h6>
                                    </a>
                                </div>
                                <div id="location">
                                    <i class="bi bi-geo-alt"></i>
                                    <p>${userData.location}<div>
                                </div>
                            </div>`;
        document.getElementById('tabIcon').href = userData.avatar_url; //coloca imagem de perfil do github no ícone da aba do navegador
        document.getElementById('profile').innerHTML = htmlProfile; // adiciona os elementos com as informações recebidas da api no html
        document.getElementsByTagName('title')[0].innerHTML = userData.name; // muda o titulo da pagina para o nome real do usuário do github
    }
    xhrUser.open ('GET', domain + '/users/' + user);
    xhrUser.send ();

    let xhrRepos = new XMLHttpRequest();
    xhrRepos.onload = function () { // coloca 3 repositórios em destaque
        let reposData = JSON.parse(this.responseText);
        let aux = [], year = [], month = [], day = [], date = [], index = []; // variáveis para criar um formato de data compreensível
        for(let i = 0; i < reposData.length; i++) {
            aux[i] = new Date(reposData[i].updated_at).toString(); // converte data para o formato padrão do js
            year[i] = reposData[i].updated_at.substr(0, 4); // pega a parte da string que corresponde ao ano
            month[i] = reposData[i].updated_at.substr(5, 2); // pega a parte da string que corresponde ao mes
            day[i] = aux[i].substr(8, 2); // pega a parte da string que corresponde ao dia
            date[i] = day[i] + '/' + month[i] + '/' + year[i]; // transforma a data em um formato apropriado
            if (reposData[i].name.includes('CRUD')) index[0] = i;
            else if (reposData[i].name.includes('T2-DIW')) index[1] = i;
            else if (reposData[i].name.includes('SPRINT-2')) index[2] = i;
        } // pega os dados dos repositórios escolhidos na api e coloca nos elementos html
        let htmlTopRepos = `<div class="card text-white text-center bg-dark mb-3" style="width: 18rem;">
                                <div class="card-body">
                                    <a class="repo-link" target="_blank" href="${reposData[index[0]].html_url}">
                                        <h5 class="card-title">${reposData[index[0]].name}</h5>
                                    </a>
                                    <p class="card-text">${reposData[index[0]].description}</p>
                                    <p class="card-text"><small class="text-muted">Atualizado em: ${date[index[0]]}</small></p>
                                </div>
                            </div>
                            <div class="card text-white text-center bg-dark mb-3" style="width: 18rem;">
                                <div class="card-body">
                                    <a class="repo-link" target="_blank" href="${reposData[index[1]].html_url}">
                                        <h5 class="card-title">${reposData[index[1]].name}</h5>
                                    </a>
                                    <p class="card-text">${reposData[index[1]].description}</p>
                                    <p class="card-text"><small class="text-muted">Atualizado em: ${date[index[1]]}</small></p>
                                </div>
                            </div>
                            <div class="card text-white text-center bg-dark mb-3" style="width: 18rem;">
                                <div class="card-body">
                                    <a class="repo-link" target="_blank" href="${reposData[index[2]].html_url}">
                                        <h5 class="card-title">${reposData[index[2]].name}</h5>
                                    </a>
                                    <p class="card-text">${reposData[index[2]].description}</p>
                                    <p class="card-text"><small class="text-muted">Atualizado em: ${date[index[2]]}</small></p>
                                </div>
                            </div>`;
                                
        document.getElementById('topRepos').children[1].innerHTML = htmlTopRepos; // adiciona os elementos com as informações recebidas da api no html
    }
    xhrRepos.open ('GET', domain + '/users/' + user + '/repos');
    xhrRepos.send ();
}

document.getElementById('searchBtn').addEventListener('click', loadSearch);
document.getElementById('showAllBtn').addEventListener('click', loadSearch);

function loadSearch() {
    let inputFieldValue = document.getElementById('searchField').value; // pega o valor digitado na barra de pesquisa
    if (this.id === 'searchBtn' && inputFieldValue === '') { // evita que todos os repositórios sejam mostrados pelo botão de pesquisa
        document.getElementById('searchedReposContainer').innerHTML = `<h5 class="msg">Insira algo no campo de pesquisa.</h5>`;
        return;
    }
    // apaga os valores da variável coletados da barra de pesquisa para que não haja palavras-chave na query string e então a requisição busque por todos os repositórios do usuário
    if ( this.id === 'showAllBtn') inputFieldValue = '';
    const searchedRepos = `/search/repositories?q=${inputFieldValue}user:${user}`;
    document.getElementById('searchField').value = ''; // limpa o campo da barra de pesquisa
    let xhrSearchedRepos = new XMLHttpRequest();
    xhrSearchedRepos.onload = function () {
        let searchedReposData = JSON.parse(this.responseText);
        if (searchedReposData.items.length === 0) {
            document.getElementById('searchedReposContainer').innerHTML = `
            <h5 class="msg">Nenhum repositório que contenha o valor inserido no nome foi encontrado.</h5>`;
            return;
        }
        let htmlSearchedRepos = ''; // esvazia a variável para evitar problemas 
        let aux = [], year = [], month = [], day = [], date = [];
        searchedReposData.items.sort((a, b) => parseInt(b.id) - parseInt(a.id)); // ordena os repositórios do mais recente ao mais antigo
        for(let i = 0; i < searchedReposData.items.length; i++) {
            aux[i] = new Date(searchedReposData.items[i].updated_at).toString(); // converte data para o formato padrão do js
            year[i] = searchedReposData.items[i].updated_at.substr(0, 4); // pega a parte da string que corresponde ao ano
            month[i] = searchedReposData.items[i].updated_at.substr(5, 2); // pega a parte da string que corresponde ao mes
            day[i] = aux[i].substr(8, 2); // pega a parte da string que corresponde ao dia
            date[i] = day[i] + '/' + month[i] + '/' + year[i]; // transforma a data em um formato apropriado
            htmlSearchedRepos += `  <div class="card text-white bg-dark mb-3 w-100">
                                        <div class="card-body">
                                            <a class="repo-link" target="_blank" href="${searchedReposData.items[i].html_url}">
                                                <h5 class="card-title">${searchedReposData.items[i].name}</h5>
                                            </a>
                                            <p class="card-text">${searchedReposData.items[i].description}</p>
                                            <p class="card-text"><small class="text-muted">Atualizado em: ${date[i]}</small></p>
                                        </div>
                                    </div>`;
        }
        // adiciona os cards com as informações da api no html
        document.getElementById('searchedReposContainer').innerHTML = htmlSearchedRepos;
        document.getElementById('searchedReposContainer').children[0].scrollIntoView();
    }
    xhrSearchedRepos.open ('GET', domain + searchedRepos);
    xhrSearchedRepos.send ();
}

// Ignore apenas para atualizar o ano (nao q seja mt util kk)

let d = new Date();
document.getElementById('footer').innerHTML = `<h6>Copyright © ${d.getFullYear()} Vinicius Gabriel - Todos os direitos reservados</h6>`;