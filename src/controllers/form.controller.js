const crypto = require("crypto");
const mysql = require("../../mysql");

exports.createFormToken = async (req, res, next) => {
    try {
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                message: "Questions array is required and cannot be empty",
            });
        }

        const ids = questions.sort((a, b) => a - b);
        const idString = ids.join(",");
        const hash = crypto.createHash("sha256").update(idString).digest("hex");
        
        const token = hash.substring(0, 6).toUpperCase();

        res.locals.subToken = token;
        res.locals.fullToken = hash;
        res.locals.questionsIds = ids;

        next()
    } catch (error) {
        return res.status(500).json({
            message: "Error creating form token",
            error: error.message,
        });
    }
}

exports.insertFormToken = async (req, res, next) => {
    try {
        const { subToken, fullToken, questionsIds } = res.locals;

        if (!subToken || !fullToken || !questionsIds) {
            return res.status(400).json({
                message: "Missing required tokens or questions ids",
            });
        }

        for (const questionId of questionsIds) {
            const query = `
                INSERT INTO provas (id_questao, sub_token, full_token)
                VALUES (?, ?, ?)
            `;
            
            await mysql.execute(query, [questionId, subToken, fullToken]);
        }

        return res.status(201).json({
            message: "Form token inserted successfully",
            subToken,
            fullToken,
            questionsCount: questionsIds.length,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error inserting form token",
            error: error.message,
        });
    }
}

exports.getForms = async (req, res) => {
    try {
        const token = req.params.token;
        const query = `
            SELECT questoes.id           AS id,
                   questoes.titulo       AS titulo,
                   questoes.resposta_a   AS resposta_a,
                   questoes.resposta_b   AS resposta_b,
                   questoes.resposta_c   AS resposta_c,
                   questoes.resposta_d   AS resposta_d,
                   questoes.resposta_e 	 AS resposta_e,
                   questoes.ano_da_prova AS ano,
                   questoes.url_anexo	 AS url_anexo
              FROM provas
        INNER JOIN questoes
                ON questoes.id = id_questao
             WHERE provas.sub_token = ?;
        `;

        const questions = await mysql.execute(query, [token]);

        return res.status(200).json({
            message: "Get questions successfully",
            results: questions
        });
    } catch (error) {
           return res.status(500).json({
            message: "Error getting questions",
            error: error.message,
        });
    }
}

exports.getRigthAnswer = async (req, res, next) => {
    try {
        const rightAnswer = await mysql.execute(
            `SELECT questao_certa FROM questoes WHERE id = ?;`,
            [req.body.id]
        );
        if (!rightAnswer || rightAnswer.length === 0) {
            return res.status(404).json({
                message: "Question not found",
            });
        }
        res.locals.rightAnswer = rightAnswer[0].questao_certa;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Error getting questions",
            error: error.message,
        });
    }
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.params.token;

        if (!token) {
            return res.status(400).json({
                message: "Token is required",
            });
        }

        const result = await mysql.execute(
            `SELECT sub_token FROM provas WHERE sub_token = ? LIMIT 1;`,
            [token]
        );

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "Token not found",
            });
        }

        res.locals.token = token;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Error verifying token",
            error: error.message,
        });
    }
}

exports.insertAnswer = async (req, res) => {
    try {
        const { nome, email, id, resposta_aluno } = req.body;

        if (!nome || !id || !resposta_aluno) {
            return res.status(400).json({
                message: "Missing required fields: nome, id_questao, resposta_aluno",
            });
        }

        const query = `
            INSERT INTO respostas (nome, email, id_questao, resposta_aluno, resposta_certa, token)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await mysql.execute(query, [nome, email || null, id, resposta_aluno, res.locals.rightAnswer, res.locals.token]);

        return res.status(201).json({
            message: "Answer inserted successfully",
            data: {
                nome,
                email,
                id,
                resposta_aluno
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error inserting answer",
            error: error.message,
        });
    }
}

exports.getAllAnswerByStudent = async (req, res, next) => {
    try {
        const results = await mysql.execute(
            `SELECT id_questao, resposta_aluno, resposta_certa, token, created 
             FROM respostas 
             WHERE token = ? AND nome = ?;`,
            [res.locals.token, req.body.nome]
        );

        return res.status(200).json({
            message: "Get answers successfully",
            results
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error getting data",
            error: error.message,
        });
    }
}