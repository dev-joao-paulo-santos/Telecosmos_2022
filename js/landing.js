let formulario = document.getElementById("formularioderegistro")
let texto = document.getElementsByClassName("titulo")
function apareca() {
    formulario.style.marginRight = "3vw"
}
function desapareca() {
    formulario.style.marginRight = "-30vw"
}
 function showsidebar() {
    document.getElementById('sidebar').classList.toggle('active')

}


$(function(){
    $("#arrow").click(function(){
        document.getElementById('arrow').classList.toggle('active')
    })
})

var db = openDatabase("siteDB", "1.0", "siteDB", 65535);
$(function(){

    $("#create").click(function(){
        db.transaction(function(transaction){
            var sql = "CREATE TABLE user "+
             "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
            "nome VARCHAR(100) NOT NULL," +
            "email VARCHAR(200) NOT NULL," +
            "password INT NOT NULL)";
            transaction.executeSql(sql, undefined, function(){
               console.log("Data is created successfully")
            }, function(transaction, err){
                console.log(err.message)
            })
        })
    })

    //remover
//    $("#delete").click(function(){
 //       if(!confirm("Are you sure to delete this table?", "")) return;;
 //       db.transaction(function(transaction){
 //           var sql = "DROP TABLE items";
 //           transaction.executeSql(sql, undefined, function(){
 //               alert("Table deleted")
 //           }, function(transaction, err){
 //               alert(err.message)
 //           })
 //       })
 //   })

    //insert
    $("#insert").click(function(){
        var nome = $("#name").val()
        var email = $("#email").val();
        var password = $("#password").val()
        db.transaction(function(transaction){
            var sql = "INSERT INTO user(nome, email, password) VALUES(?, ?, ?)";
            transaction.executeSql(sql, [nome, email, password],
            function(){
                alert("Nova pessoa registrada!");
            }, function(transaction, err){
                alert(err.message)
            })
        })

    })

})
