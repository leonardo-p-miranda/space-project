# Gestão da Frota de Transporte Intergaláctico

Este projeto é uma aplicação voltada para a gestão da frota de transporte de mercadorias através de quatro planetas na galáxia. A aplicação oferece funcionalidades completas para gerenciar pilotos, naves, recursos e contratos de transporte.

## Funcionalidades

- **Gerenciamento de Pilotos**: Criação, leitura, atualização e exclusão de informações de pilotos.
- **Gerenciamento de Naves**: Gerenciamento completo de naves, incluindo criação, leitura, atualização e exclusão de registros de naves.
- **Gerenciamento de Recursos**: Manipulação de dados de recursos, com operações de criação, leitura, atualização e exclusão.
- **Gerenciamento de Contratos**: Aceitação e processamento de contratos de transporte.
- **Reabastecimento e Viagens**: Gerenciamento de reabastecimento de combustível e viagens interplanetárias.

## Início Rápido

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- Configuração de banco de dados (MySQL ou compatível)

### Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/gestao-frota-intergalactica.git
   cd gestao-frota-intergalactica
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure o banco de dados:

   Certifique-se de configurar suas credenciais de banco de dados no arquivo `db.js`.

4. Inicie a aplicação:

   ```sh
   npm start
   ```

   O servidor será iniciado em `http://localhost:5000`.

### Endpoints da API

#### Pilotos

- `GET /pilots`: Obter todos os pilotos
- `GET /pilots/:id`: Obter um piloto específico pelo ID de certificação
- `POST /pilots`: Criar um novo piloto
- `PUT /pilots/:id`: Atualizar um piloto existente pelo ID de certificação
- `DELETE /pilots/:id`: Excluir um piloto pelo ID de certificação

#### Naves

- `GET /ships`: Obter todas as naves
- `GET /ships/:id`: Obter uma nave específica pelo ID
- `POST /ships`: Criar uma nova nave
- `PUT /ships/:id`: Atualizar uma nave existente pelo ID
- `DELETE /ships/:id`: Excluir uma nave pelo ID

#### Recursos

- `GET /resources`: Obter todos os recursos
- `GET /resources/:id`: Obter um recurso específico pelo ID
- `POST /resources`: Criar um novo recurso
- `PUT /resources/:id`: Atualizar um recurso existente pelo ID
- `DELETE /resources/:id`: Excluir um recurso pelo ID

#### Contratos

- `GET /contracts`: Obter todos os contratos
- `PUT /contracts/accept/:id/:contractId`: Aceitar um contrato
- `PUT /contracts/travel/:id/:newLocation`: Viajar entre planetas
- `PUT /contracts/refill/:id`: Reabastecer combustível
