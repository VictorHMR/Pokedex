/*---------------------------------------------Variaveis Globais-------------------------------------------------------*/

var Ninicial;
var NFinal = 100;
var regiao;
var GNumber;
let pokeP;
var contador = 0;
var Ftype;
const MP = 809;
const url= "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
var urlM = url;


/*---------------------------------------------Funções-------------------------------------------------------------*/
function fetchPokemon(geracao){
    const getPokemonUrl =  id =>`https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokePromises = [];
    $("#mais").hide();
    fecharMod();
    Ftype = '';
switch(geracao){
    case 0:  Ninicial = 1;
             regiao= "Pokedex(1-7gen)";
             GNumber=0;
             $("#mais").show();
    break;
    case 1:  Ninicial = 1;
             NFinal= 151; 
             regiao= "Kanto";
             GNumber=1;
             $(".btn").attr('disabled', false);
             $(".btnPurple").attr('disabled', true);

    break;
    case 2:  Ninicial = 152;
             NFinal = 251;
             regiao= "Johto";
             GNumber= 2;
             $(".btn").attr('disabled', false);
             $(".btnPink").attr('disabled', true);
    break;
    case 3:  Ninicial = 252;
             NFinal = 386;
             regiao= "Hoenn";
             GNumber=3;
             $(".btn").attr('disabled', false);
             $(".btnBabyPink").attr('disabled', true);
    break;
    case 4:  Ninicial = 387;
             NFinal = 494;
             regiao= "Sinnoh";
             GNumber=4;
             $(".btn").attr('disabled', false);
             $(".btnAqua").attr('disabled', true);
    break;
    case 5:  Ninicial = 495;
             NFinal = 649;
             regiao= "Unova";
             GNumber=5;
             $(".btn").attr('disabled', false);
             $(".btnGreen").attr('disabled', true);
    break;
    case 6: Ninicial = 650;
            NFinal = 721;
            regiao= "Kalos";
            GNumber=6;
            $(".btn").attr('disabled', false);
            $(".btnYellow").attr('disabled', true);
    break;
    case 7: Ninicial = 722;
            NFinal = 809;
            regiao= "Alola";
            GNumber=7;
            $(".btn").attr('disabled', false);
            $(".btnWhite").attr('disabled', true);
    break;
    default: Ninicial = 1;
             NFinal = 100;
             regiao= "Pokedex(1-7gen)";
             GNumber=0;
             $("#mais").show();
             $(".btn").attr('disabled', false);

    break;
    
}
    for(let i =Ninicial; i <= NFinal; i++){
        pokePromises.push(fetch(getPokemonUrl(i)).then(response => response.json()));
    }
    Promise.all(pokePromises)
    .then(pokemons =>{
        const liPoke = pokemons.reduce((accumulator, pokemon) =>{
            const types = pokemon.types.map(typeInfo => typeInfo.type.name)
            
            accumulator += `
                <li class="card ${types[0]}" onclick="PokeModal('${pokemon.id}')" id="${pokemon.name}">
                <img class="card-image" alt="${pokemon.name}" width="50%" src="${urlM}/${pokemon.id}.png" />
                <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
                <p class="card-subtitle"> ${types.join(' | ')}</p>
                <p class="card-subtitle">`  
                for(i=0; i < types.length;i++){
                    accumulator += `<img class="iconT" src="img/elements/${types[i]}.ico">`
                } 
            accumulator += `</p></li>`
               

            return accumulator
        }, '')
        const ul = document.querySelector('[data-js="pokedex"]');
        $(ul).html(liPoke);
        $("#tituloP").html(regiao);
        $("#aviso").html((NFinal - Ninicial +1) + " Resultados Exibidos");
        
    })


}

function ShinyChange(){
    if( $("#ShinyC").is(':checked') == true ){
        urlM = url + "/shiny"

    }else if( $("#ShinyC").is(':checked') == false){
        urlM = url;
    }
    if(Ftype != ''){
        searchType(Ftype);
        return;
    }
    if($("#search").val() == ""){
        fetchPokemon(GNumber)
    }else{
        searchPoke();
    }
}

function searchPoke(){
    $("#mais").hide();
    let value = $("#search").val().toLowerCase();
    Ftype = '';
    fecharMod();
    if(value == ""){
        fetchPokemon(GNumber);
    }
    else{
    const getPokemonUrl =  id =>`https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokePromises = [];

    if(isNaN(value)){
        for(let i = 1 ; i <= MP; i++){
            pokePromises.push(fetch(getPokemonUrl(i)).then(response => response.json()));
        }
    }else{
        pokePromises.push(fetch(getPokemonUrl(value)).then(response => response.json()));
    }
    Promise.all(pokePromises)
    .then(pokemons =>{
        const liPoke = pokemons.reduce((accumulator, pokemon) =>{
            const types = pokemon.types.map(typeInfo => typeInfo.type.name)

            if(isNaN(value)){
                if(pokemon.name.startsWith(value)){
                    contador++;
                    pokeP = value;
                    accumulator += `
                        <li class="card ${types[0]}" onclick="PokeModal('${pokemon.id}')">
                        <img class="card-image" alt="${pokemon.name}" width="50%" src="${urlM}/${pokemon.id}.png" />
                        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
                        <p class="card-subtitle"> ${types.join(' | ')}</p>
                        <p class="card-subtitle">`  
                        for(i=0; i < types.length;i++){
                            accumulator += `<img class="iconT" src="img/elements/${types[i]}.ico">`
                        } 
                    accumulator += `</p></li>`
                    $("#aviso").html(contador + " Resultados");
                }else{
                    pokeP = value
                    if(accumulator.length <= 0){
                        $("#aviso").html("Sem Resultados");
                    } 
                }
            }else{
                pokeP = pokemon.name;
                contador = 1;
                accumulator += `
                    <li class="card ${types[0]} solo" onclick="PokeModal('${pokemon.id}')">
                    <img class="card-image" alt="${pokemon.name}" width="50%" src="${urlM}/${pokemon.id}.png" />
                    <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
                    <p class="card-subtitle"> ${types.join(' | ')}</p>
                    <p class="card-subtitle">`  
                    for(i=0; i < types.length;i++){
                        accumulator += `<img class="iconT" src="img/elements/${types[i]}.ico">`
                    } 
                accumulator += `</p></li>`
                $("#aviso").html(contador + " Resultados");

            }
           

            return accumulator
        }, '')
        const ul = document.querySelector('[data-js="pokedex"]');
        $(ul).html(liPoke);
        $("#tituloP").html(pokeP[0].toUpperCase() + pokeP.slice(1));
        contador= 0;

    })
    }
}

function searchType(tipo){
    $("#mais").hide();
    $("#search").val('');
    $(".btn").attr('disabled', false);
    Ftype = tipo;
    fecharMod();
    alert('Pode demorar um pouco dependendo da sua conexão, aguarde !')
    const getPokemonUrl =  id =>`https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokePromises = [];
    for(let i = 1 ; i <= MP; i++){
        pokePromises.push(fetch(getPokemonUrl(i)).then(response => response.json()));
    }
    
    Promise.all(pokePromises)
    .then(pokemons =>{
        const liPoke = pokemons.reduce((accumulator, pokemon) =>{
            const types = pokemon.types.map(typeInfo => typeInfo.type.name)

                if(types[0] == tipo || types[1] == tipo){
                    contador++;
                    pokeP = tipo;
                    accumulator += `
                        <li class="card ${types[0]}" onclick="PokeModal('${pokemon.id}')">
                        <img class="card-image" alt="${pokemon.name}" width="50%" src="${urlM}/${pokemon.id}.png" />
                        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
                        <p class="card-subtitle"> ${types.join(' | ')}</p>
                        <p class="card-subtitle">`  
                        for(i=0; i < types.length;i++){
                            accumulator += `<img class="iconT" src="img/elements/${types[i]}.ico">`
                        } 
                    accumulator += `</p></li>`
                    $("#aviso").html(contador + " Resultados");
                }
            return accumulator
        }, '')
        const ul = document.querySelector('[data-js="pokedex"]');
        $(ul).html(liPoke);
        $("#tituloP").html(pokeP[0].toUpperCase() + pokeP.slice(1));
        contador= 0;

    })
}

function MorePoke(){
    if(NFinal >= MP){
        $("#mais").hide();
        NFinal = MP;
        fetchPokemon(0);
    }else{
        NFinal += 50;
        fetchPokemon(0);
    }
}

function PokeModal(number){
    const getPokemonUrl =  id =>`https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokePromises = [];    
    pokePromises.push(fetch(getPokemonUrl(number)).then(response => response.json()));
    Promise.all(pokePromises)
    .then(pokemons =>{
        const MdPoke = pokemons.reduce((accumulator, pokemon) =>{
            const types = pokemon.types.map(typeInfo => typeInfo.type.name);
            const statsV = pokemon.stats.map(statsInfo => statsInfo.base_stat);
            const abilities = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name)
            /*Definindo a Cor*/$('.modalPoke').attr('class', `modalPoke ${types[0]}`);
            /*Imagem do Poke*/ $("#modalImg").attr('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`);
           /*Id + Nome no Titulo*/ $('#modalName').html( pokemon.id +"."+ pokemon.name);
           /*Definindo a Altura + */ $("#alturaP").html(`${pokemon.height / 10 + " m"}`);
           /*Definindo o Peso*/ $("#pesoP").html(`${pokemon.weight / 10 + " kg"}`);
           /*Definindo as Habilidades*/$("#habilidadesP").html(`-${abilities.join('<br>-')}`);
           /*Definindo os Tipos */$("#tiposP").html(`${types.join(" | ")}`)
            $("#hpP").html(`${statsV[0]}`)
            $("#attackP").html(`${statsV[1]}`)
            $("#defenseP").html(`${statsV[2]}`)
            $("#attackSP").html(`${statsV[3]}`)
            $("#defenseSP").html(`${statsV[4]}`)
            $("#speedP").html(`${statsV[5]}`)



        }, '')
    $(".containerPoke").css("display", 'Flex')
    $("html,body").css({"overflow":"hidden"});
    })


}

function fecharMod(){
    $(".containerPoke").css("display", 'none')
    $("html,body").css({"overflow":"auto"});
    $(".MudarD").attr('disabled', false);
    $(".MudarE").attr('disabled', false);
};

/*---------------------------------------------Eventos----------------------------------------------------------*/

$(".MudarD").on('click', ()=>{
    $(".InfoBox")[0].style.transform = 'rotateY(180deg)';
    $('.MudarD').attr('disabled', true);
    $('.MudarE').attr('disabled', false);

})

$(".MudarE").on('click', ()=>{
    $(".InfoBox")[0].style.transform = 'rotateY(0deg)';
    $('.MudarD').attr('disabled', false);
    $('.MudarE').attr('disabled', true);
})

$(".FecharX").on('click', () => {
    fecharMod();
})

$("#search").on('keyup',  (event) => {
    if (event.keyCode !== 13) return;
    searchPoke()
    $("#aviso").val("")
    $("#tituloP").val("")
    contador = 0;
});

$(".btn").on('click', () =>{
    $('html, body').animate({scrollTop:0}, 'fast');
    $("#search").val('');
});

$(document).keydown(function(e) {
    if(e.which === 27){
        fecharMod();
    } 
});
fetchPokemon();


