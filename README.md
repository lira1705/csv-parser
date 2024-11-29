# CSV Transactions Parser

O objetivo desse projeto é parsear um arquivo CSV, salvar as transações no banco de dados MySQL e recuperar um sumário com os resultados.

---

## Como Rodar o Projeto

### 1. Construir os Containers

Execute o comando para construir os containers com o Docker Compose:

docker-compose build
docker-compose up -d

### 2. Gere o arquivo de transações

node transactionGenerator

### 3. Faça uma requisição

curl --location 'http://localhost:3000/transactions/upload' \
--form 'file_asset=@"caminho para o arquivo"'

### Banco de dados

Os dados estão sendo salvos no banco de dados MySQL, que é configurado automaticamente pelo Docker Compose.

Ferramentas Recomendadas

- Para visualizar os dados, você pode usar uma das ferramentas abaixo:

- Beekeeper Studio
- MySQL Workbench
- DBeaver
