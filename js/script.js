

var ws;
var url = "https://setimodigito.net/api/";

function initWS(pURL,pMethod){
    ws = new XMLHttpRequest();
    ws.open(pMethod,url + pURL,true);
    ws.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
}

function load(){
    initWS("games.php?p=select","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            let resp = JSON.parse(ws.responseText);
            if(resp.status == 1){
                json = JSON.parse(ws.responseText);
                json = json.game;
                init();
            }
        }
    }
    ws.send(JSON.stringify({idGame : 27}));
}

function save(){
    initWS("games.php?p=update","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            console.log(ws.responseText);
        }
    }
    ws.send(JSON.stringify({idGame : 27, game : json}));
}

function remove(id,elem){
    const index = json.findIndex(objeto => objeto.id === id);
    json.splice(index,1);
    elem.parentNode.parentNode.parentNode.remove();
}

function edit(id,elem){
    const index = json.findIndex(objeto => objeto.id === id);
    json[index].text = prompt("Digite o texto para alterar",json[index].text);
    elem = elem.parentNode.parentNode.parentNode;
    elem.cells[0].innerText = json[index].text;
}

function add(){
    text =  prompt("Digite a nova frase:");
    var maxId= json.reduce(function(objetoMax, objetoAtual) {
        return objetoAtual.id > objetoMax.id ? objetoAtual : objetoMax;
    });
    obj = {id : maxId.id + 1, text : text}
    json.push(obj);
    table = document.getElementById("table");
    let tr = table.insertRow();
    insertRow(tr,obj.id,obj.text);
}

function init(){

    table = document.getElementById("table");
    for(let a in json){
        let tr = table.insertRow();
        insertRow(tr,json[a].id,json[a].text);
    }
}

function insertRow(tr,id,text){
    tr.innerHTML+=
    "<td><span>" + text + "</span></td> " +
    "<td>" + 
    "    <div class='icon'>" +
    "        <i class='fab fa-instagram'></i>" +
    "        <i class='far fa-copy' onclick=copy(" + id + ")></i>" +
    "        <i class='fas fa-edit' onclick=edit(" + id + ",this)></i> " +
    "        <i class='fas fa-trash' onclick='remove(" + id + ",this)'></i> " +
    "    </div> " +
    "</td> ";
}

function copy(id) {
    const index = json.findIndex(objeto => objeto.id === id);
    var inputElement = document.createElement('input');
    inputElement.value = json[index].text;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
}


load();