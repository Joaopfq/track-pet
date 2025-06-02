# TrackPet

**TrackPet** é uma plataforma social que ajuda a reunir pets perdidos com seus donos. Usuários podem publicar sobre animais **perdidos** ou **encontrados**, compartilhar fotos e se conectar com outras pessoas da comunidade para aumentar as chances de um reencontro seguro.

---

## Funcionalidades

- Publicar pets perdidos com descrição e fotos
- Publicar pets encontrados para tentar localizar o dono
- Buscar e visualizar ocorrências próximas
- Autenticação de usuários com Clerk
- Upload de imagens com UploadThing
- Comentários e interações entre usuários
- Suporte a modos claro e escuro (light/dark)

---

## Tech Stack

| Tecnologia        | Descrição                                        |
|-------------------|--------------------------------------------------|
| **Next.js**       | Framework React fullstack                        |
| **React**         | Biblioteca para criação de interfaces            |
| **TypeScript**    | Superset de JavaScript com tipagem estática      |
| **Tailwind CSS**  | Framework de utilitários CSS                     |
| **shadcn/ui**     | Componentes de UI acessíveis e customizáveis     |
| **Clerk**         | Gerenciamento de usuários e autenticação         |
| **Neon**          | Banco de dados PostgreSQL serverless             |
| **PostgreSQL**    | Banco de dados relacional                        |
| **Prisma**        | ORM type-safe para acesso ao banco               |
| **UploadThing**   | Serviço de upload de imagens                     |
| **Vercel**        | Plataforma de deploy para frontend e backend     |

---

## Instalação

Para rodar o projeto localmente:

```bash
# Clone o repositório
git clone git@github.com:Joaopfq/track-pet.git

# Acesse a pasta do projeto
cd track-pet

# Instale as dependências
npm install

# Rode a aplicação
npm run dev
