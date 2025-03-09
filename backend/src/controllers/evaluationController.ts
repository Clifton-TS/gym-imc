import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Evaluation } from "../entities/Evaluation";
import { User } from "../entities/User";

const evaluationRepo = AppDataSource.getRepository(Evaluation);
const userRepo = AppDataSource.getRepository(User);

// Função para validar se um usuário existe e está ativo
async function validateStudent(idUsuarioAluno: string) {
    const student = await userRepo.findOneBy({ id: idUsuarioAluno });
    if (!student || student.perfil !== "aluno") {
        throw new Error("Aluno não encontrado");
    }
    if (student.situacao === "inativo") {
        throw new Error("Usuário inativo não pode receber avaliações");
    }
    return student;
}

// Função para calcular IMC
function calculateIMC(peso: number, altura: number) {
    const imc = peso / (altura * altura);
    let classificacao = "";

    switch (true) {
        case imc < 18.5:
            classificacao = "Abaixo do peso";
            break;
        case imc >= 18.5 && imc < 24.9:
            classificacao = "Peso normal";
            break;
        case imc >= 25 && imc < 29.9:
            classificacao = "Sobrepeso";
            break;
        case imc >= 30 && imc < 34.9:
            classificacao = "Obesidade grau I";
            break;
        case imc >= 35 && imc < 39.9:
            classificacao = "Obesidade grau II";
            break;
        default:
            classificacao = "Obesidade grau III";
            break;
    }

    return { imc, classificacao };
}

export const EvaluationController = {
    // Função para criar uma nova avaliação
    async createEvaluation(req: Request, res: Response) {
        try {
            const { idUsuarioAluno, altura, peso } = req.body;
            const requester = (req as any).user;

            // Validar existência e status do aluno
            const student = await validateStudent(idUsuarioAluno);

            // Calcular IMC
            const { imc, classificacao } = calculateIMC(peso, altura);

            const evaluation = evaluationRepo.create({
                altura,
                peso,
                imc,
                classificacao,
                idUsuarioAvaliacao: requester.id,
                idUsuarioAluno,
            });

            await evaluationRepo.save(evaluation);
            res.status(201).json(evaluation);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Função para obter avaliações
    async getEvaluations(req: Request, res: Response) {
        const requester = (req as any).user;
        let evaluations;

        if (requester.perfil === "aluno") {
            evaluations = await evaluationRepo.find({ where: { idUsuarioAluno: requester.id } });
        } else {
            evaluations = await evaluationRepo.find();
        }

        res.json(evaluations);
    },

    // Função para atualizar uma avaliação
    async updateEvaluation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { altura, peso } = req.body;
            const requester = (req as any).user;

            const evaluation = await evaluationRepo.findOneBy({ id });
            if (!evaluation) {
                res.status(404).json({ message: "Avaliação não encontrada" });
                return;
            }

            // Professores só podem atualizar avaliações feitas por eles
            if (requester.perfil == "professor" && requester.id !== evaluation.idUsuarioAvaliacao) {
                res.status(403).json({ message: "Acesso negado" });
                return;
            }

            // Calcular novo IMC
            const { imc, classificacao } = calculateIMC(peso, altura);

            evaluation.altura = altura;
            evaluation.peso = peso;
            evaluation.imc = imc;
            evaluation.classificacao = classificacao;

            await evaluationRepo.save(evaluation);
            res.json({ message: "Avaliação atualizada com sucesso" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Função para deletar uma avaliação
    async deleteEvaluation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const requester = (req as any).user;

            if (requester.perfil !== "admin") {
                res.status(403).json({ message: "Acesso negado" });
                return;
            }

            const evaluation = await evaluationRepo.findOneBy({ id });
            if (!evaluation) {
                res.status(404).json({ message: "Avaliação não encontrada" });
                return;
            }

            await evaluationRepo.remove(evaluation);
            res.json({ message: "Avaliação deletada com sucesso" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
};
