//configurando servidor
const express = require('express');
const server = express();

//configurar conexão com o banco de dados 
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando nunjucks(template engine)
const nunjucks = require('nunjucks');
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))


//configurando acesso ao arquivos estáticos no sistema (css)
server.use(express.static('public'))

//configurando apresentação da página
server.get('/', function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) res.send("Erro de banco de dados")

        const donors = result.rows

        return res.render("index.html", { donors })
    })

})

//receber dados
server.post('/', function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name !== "" && email !== "" && blood !== "") {
        const query = `INSERT INTO donors ("name", "blood", "email")
                       VALUES ($1, $2, $3)`
        db.query(query, [name, blood, email], function(err) {
            if (err) res.send("Erro no banco de dados")

            return res.redirect('/')
        })
    } else {
        res.send("Todos os campos são obrigatórios")
    }

})

//configurando porta de funcionamento do servidor
server.listen(3000, function() {
    console.log('servidor iniciado')
})