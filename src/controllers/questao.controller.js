const mysql = require('../../mysql');

exports.insertQuestao = async (req, res) => {
    try {
        const {
            titulo,
            resposta_a,
            resposta_b,
            resposta_c,
            resposta_d,
            resposta_e,
            questao_certa,
            ano_da_prova,
            url_anexo,
            id_area,
            confianca
        } = req.body;

        // Campos obrigatórios: titulo, resposta_a, resposta_b, resposta_c, resposta_d, resposta_e, questao_certa, id_area, ano_da_prova
        if (!titulo || !resposta_a || !resposta_b || !resposta_c || !resposta_d || !resposta_e || !questao_certa || !id_area || !ano_da_prova) {
            return res.status(400).json({ message: 'Campos obrigatórios: titulo, resposta_a, resposta_b, resposta_c, resposta_d, resposta_e, questao_certa, id_area, ano_da_prova' });
        }

        const query = `
            INSERT INTO questoes (titulo, resposta_a, resposta_b, resposta_c, resposta_d, resposta_e, questao_certa, ano_da_prova, url_anexo, id_area, confianca)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [titulo, resposta_a, resposta_b, resposta_c || null, resposta_d || null, resposta_e || null, questao_certa, ano_da_prova || null, url_anexo || null, id_area || null, typeof confianca === 'number' ? confianca : null];

        const result = await mysql.execute(query, params);

        return res.status(201).json({ message: 'Questão inserida com sucesso', insertId: result.insertId });
    } catch (error) {
        console.error('Error inserting question:', error);
        return res.status(500).json({ message: 'Error inserting question', error: error.message });
    }
};
