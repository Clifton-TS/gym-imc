#### Visão Geral do Projeto
`gym-imc` é um projeto desenvolvido para ajudar na gestão de tarefas relacionadas a academias. Ele é construído usando uma estrutura monorepo com um frontend desenvolvido em Next.js e um backend desenvolvido em Express.

#### Primeiros Passos

##### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/Clifton-TS/gym-imc.git
   cd gym-imc
   ```

2. Instale as dependências para todo o projeto:
   ```bash
   npm install
   ```

##### Executando o Projeto

###### Backend
1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Execute as migrações:
   ```bash
   npm run migrate
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

###### Frontend
1. Navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

###### Executando o Frontend e Backend Simultaneamente
A partir do diretório raiz do projeto, execute:
```bash
npm run dev
```

Este comando iniciará simultaneamente os servidores backend e frontend.

#### Informações Adicionais
- O servidor backend será executado em `http://localhost:3000`.
- O servidor frontend será executado em `http://localhost:3001`.

Para agilizar o setup inicial, os seguintes usuários padrão são criados na inicialização do backend:

1. **Admin**: 
   - Usuário: admin
   - Senha: 123456
   - Perfil: admin

2. **Professor**:
   - Usuário: professor
   - Senha: 123456
   - Perfil: professor

3. **Aluno**:
   - Usuário: aluno
   - Senha: 123456
   - Perfil: aluno
