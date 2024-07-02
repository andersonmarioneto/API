const express = require('express');
const app = express();
const db = require('./database');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Orfanato API",
            version: "1.0.0",
            description: "API para o OrfanatoGR"
        },
    },
    apis: ["./app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * definitions:
 *   Funcionario:
 *     type: object
 *     required:
 *       - nome
 *       - cargo
 *       - salario
 *     properties:
 *       id:
 *         type: integer
 *       nome:
 *         type: string
 *       cargo:
 *         type: string
 *       salario:
 *         type: number
 */

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     tags:
 *       - Funcionarios
 *     description: Retorna todos os funcionários
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Funcionario'
 */
app.get('/funcionarios', (req, res) => {
    db.all("SELECT * FROM funcionario", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     tags:
 *       - Funcionarios
 *     description: Adiciona um novo funcionário
 *     parameters:
 *       - name: funcionario
 *         description: Objeto do funcionário
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Funcionario'
 *     responses:
 *       201:
 *         description: Funcionário criado
 */
app.post('/funcionarios', (req, res) => {
    const { nome, cargo, salario } = req.body;
    const stmt = db.prepare("INSERT INTO funcionario (nome, cargo, salario) VALUES (?, ?, ?)");
    stmt.run(nome, cargo, salario, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     tags:
 *       - Funcionarios
 *     description: Retorna um funcionário pelo ID
 *     parameters:
 *       - name: id
 *         description: ID do funcionário
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Funcionário encontrado
 *         schema:
 *           $ref: '#/definitions/Funcionario'
 *       404:
 *         description: Funcionário não encontrado
 */
app.get('/funcionarios/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM funcionario WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Funcionário não encontrado" });
            return;
        }
        res.json({ data: row });
    });
});

/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     tags:
 *       - Funcionarios
 *     description: Atualiza um funcionário pelo ID
 *     parameters:
 *       - name: id
 *         description: ID do funcionário
 *         in: path
 *         required: true
 *         type: integer
 *       - name: funcionario
 *         description: Objeto do funcionário
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Funcionario'
 *     responses:
 *       200:
 *         description: Funcionário atualizado
 *       404:
 *         description: Funcionário não encontrado
 */
app.put('/funcionarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cargo, salario } = req.body;
    db.run("UPDATE funcionario SET nome = ?, cargo = ?, salario = ? WHERE id = ?", [nome, cargo, salario, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Funcionário não encontrado" });
            return;
        }
        res.json({ message: "Funcionário atualizado" });
    });
});

/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     tags:
 *       - Funcionarios
 *     description: Deleta um funcionário pelo ID
 *     parameters:
 *       - name: id
 *         description: ID do funcionário
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Funcionário deletado
 *       404:
 *         description: Funcionário não encontrado
 */
app.delete('/funcionarios/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM funcionario WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Funcionário não encontrado" });
            return;
        }
        res.json({ message: "Funcionário deletado" });
    });
});

/**
 * @swagger
 * definitions:
 *   Crianca:
 *     type: object
 *     required:
 *       - nome
 *       - idade
 *       - historico
 *     properties:
 *       id:
 *         type: integer
 *       nome:
 *         type: string
 *       idade:
 *         type: integer
 *       historico:
 *         type: string
 */

/**
 * @swagger
 * /criancas:
 *   get:
 *     tags:
 *       - Criancas
 *     description: Retorna todas as crianças
 *     responses:
 *       200:
 *         description: Lista de crianças
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Crianca'
 */
app.get('/criancas', (req, res) => {
    db.all("SELECT * FROM crianca", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

/**
 * @swagger
 * /criancas:
 *   post:
 *     tags:
 *       - Criancas
 *     description: Adiciona uma nova criança
 *     parameters:
 *       - name: crianca
 *         description: Objeto da criança
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Crianca'
 *     responses:
 *       201:
 *         description: Criança criada
 */
app.post('/criancas', (req, res) => {
    const { nome, idade, historico } = req.body;
    const stmt = db.prepare("INSERT INTO crianca (nome, idade, historico) VALUES (?, ?, ?)");
    stmt.run(nome, idade, historico, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

/**
 * @swagger
 * /criancas/{id}:
 *   get:
 *     tags:
 *       - Criancas
 *     description: Retorna uma criança pelo ID
 *     parameters:
 *       - name: id
 *         description: ID da criança
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Criança encontrada
 *         schema:
 *           $ref: '#/definitions/Crianca'
 *       404:
 *         description: Criança não encontrada
 */
app.get('/criancas/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM crianca WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Criança não encontrada" });
            return;
        }
        res.json({ data: row });
    });
});

/**
 * @swagger
 * /criancas/{id}:
 *   put:
 *     tags:
 *       - Criancas
 *     description: Atualiza uma criança pelo ID
 *     parameters:
 *       - name: id
 *         description: ID da criança
 *         in: path
 *         required: true
 *         type: integer
 *       - name: crianca
 *         description: Objeto da criança
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Crianca'
 *     responses:
 *       200:
 *         description: Criança atualizada
 *       404:
 *         description: Criança não encontrada
 */
app.put('/criancas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, idade, historico } = req.body;
    db.run("UPDATE crianca SET nome = ?, idade = ?, historico = ? WHERE id = ?", [nome, idade, historico, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Criança não encontrada" });
            return;
        }
        res.json({ message: "Criança atualizada" });
    });
});

/**
 * @swagger
 * /criancas/{id}:
 *   delete:
 *     tags:
 *       - Criancas
 *     description: Deleta uma criança pelo ID
 *     parameters:
 *       - name: id
 *         description: ID da criança
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Criança deletada
 *       404:
 *         description: Criança não encontrada
 */
app.delete('/criancas/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM crianca WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Criança não encontrada" });
            return;
        }
        res.json({ message: "Criança deletada" });
    });
});



// Definição ddas rotas do crud e swagger aqui...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
