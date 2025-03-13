import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

// Função para criar usuários padrão
async function createDefaultUsers() {
    const userRepo = AppDataSource.getRepository(User);

    // Lista de usuários padrão
    const defaultUsers = [
        { nome: "Admin", usuario: "admin", senha: "123456", perfil: "admin" },
        { nome: "Professor", usuario: "professor", senha: "123456", perfil: "professor" },
        { nome: "Aluno", usuario: "aluno", senha: "123456", perfil: "aluno" },
    ];

    // Itera sobre a lista de usuários padrão
    for (const userData of defaultUsers) {
        // Verifica se o usuário já existe no banco de dados
        const existingUser = await userRepo.findOneBy({ usuario: userData.usuario });
        if (!existingUser) {
            // Se o usuário não existir, cria um novo com a senha criptografada
            const hashedPassword = await bcrypt.hash(userData.senha, 10);
            const newUser = userRepo.create({
                ...userData,
                senha: hashedPassword,
                situacao: "ativo",
            } as Partial<User>);
            // Salva o novo usuário no banco de dados
            await userRepo.save(newUser);
            console.log(`Usuário padrão criado: ${userData.usuario}`);
        }
    }
}

export default createDefaultUsers;