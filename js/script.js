

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
                json = JSON.parse(ws.responseText).game;
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
            let resp = JSON.parse(ws.responseText);
            if(resp.status == 1){
                document.getElementById('icon-save').style.color = 'orange'; 
                setTimeout(function() {
                    document.getElementById('icon-save').style.color = 'white'; 
            }, 1000);
            }
            
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
    text =  text.replace(/"/g,'');

    var maxId= json.reduce(function(objetoMax, objetoAtual) {
        return objetoAtual.id > objetoMax.id ? objetoAtual : objetoMax;
    });
    obj = {id : maxId.id + 1, text : text}
    json.push(obj);
    table = document.getElementById("table");
    let tr = table.insertRow();
    insertRow(tr,obj.id,obj.text);
}

function search(){
    table = document.getElementById("table");
    text =  prompt("Digite palavra chave para pesquisa:").toLowerCase();
    for(let a = 0 ; a < table.rows.length; a ++){
        aux = table.rows[a].cells[0].innerText;
        if(aux.includes(text)){
            table.rows[a].style.display = "";
        }else{
            table.rows[a].style.display = "none";
        }
       
    }
}

function init(){

    table = document.getElementById("table");
    for (let a = json.length - 1; a >= 0; a--) {
        let tr = table.insertRow();
        insertRow(tr,json[a].id,json[a].text);
    }
}

function insertRow(tr,id,text){
    tr.innerHTML+=
    "<td><span>" + decode(text) + "</span></td> " +
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

function decode(value){
     value = value.replace(/u00e9/g,"é");
     value = value.replace(/u00e3/g,"ã");
     value = value.replace(/u00e7/g,"ç");
     value = value.replace(/u00ea/g,"ê");
     value = value.replace(/u00f3/g,"ó");
     value = value.replace(/u00e1/g,"á");
     value = value.replace(/u00ed/g,"í");
     value = value.replace(/u00e0/g,"à");

     return value;
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault(); // Impede que o navegador execute sua função padrão
      save(); // Chama a função salvar
    }
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault(); 
      add(); 
    }
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault(); 
      search(); 
    }
  });


load();