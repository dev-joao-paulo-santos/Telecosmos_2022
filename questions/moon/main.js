$(document).ready(function() {
    $("#resposta").submit(function(e) {
        e.preventDefault()


        const result = {
            selecionado: $("input:checked")[0],
            certo: $("[data-resposta='true'")[0],
        }

        const respondeucerto = true

        if(result.selecionado == result.certo){
            $(result.selecionado).parent().addClass("resultado-right");
        }
        else{
            $(result.selecionado).parent().addClass("resultado-wrong");
            $(result.certo).parent().addClass("resultado-right");
        }

        $("input[type=submit ]").prop("disabled", true)
       // $("input[type=button]").prop("disabled", true)
    })
})

function startcronometro(duracao, tela){

    var cronometer = duracao, segundos
    var interval = setInterval(function(){

        
        segundos = parseInt(cronometer % 60, 10)
        
        segundos = segundos < 10 ? "0" + segundos : segundos

        tela.textContent = segundos


        if (--cronometer < -2) {
            cronometer = duracao
        }

        if (cronometer == -2){
          clearInterval(interval)
          alert("Acabou o tempo!")
          $("input[type=submit]").prop("disabled", true)
          $("div[id=cronometer]").attr("id", "cronometerhidden")
        }
        //https://www.youtube.com/watch?v=nMn2_5kvbHo

    }, 1000)

}

window.onload = function(){
    var duracao = 40 
    var tela = document.querySelector("#cronometer")

    startcronometro(duracao, tela)
}
