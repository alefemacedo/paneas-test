# Teste Paneas
> Este projeto foi criado para o teste de Desenvolvedor nível Pleno da Paneas.

> Abaixo estão descritos os requisitos e os comandos necessários para executá-lo.

## Requisitos
- Python ~3.9.5
- Pip ~23.3.1
- Mysql ~8.0
- NVM ~v20.9.0

## Instalação

### UI
1. Acesse a pasta `ui`
    ```
    cd ui
    ```
2. Instale as dependências com o NPM
    ```
    npm install
    ```
3. Execute o servidor node do angular
    ```
    ng serve
    ```

### API
1. Acesse a pasta `api`
    ```
    cd api
    ```
2. Instale o gerenciador de ambientes python Pipenv
    ```
    pip install --user pipenv
    ```
3. Instale as dependências python com o Pipenv
    ```
    pipenv install
    ```
4. Ative o ambiente python com o Pipenv
    ```
    pipenv shell
    ```
6. Crie um banco de dados mysql chamado `paneas` no seu `localhost` porta `3306`
5. Execute as migrations necessárias utilizando o Django
    ```
    python manage.py migrate
    ```
4. Execute o servidor python do Django
    ```
    python manage.py runserver
    ```