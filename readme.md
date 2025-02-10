Contexto do Sistema
Sistema de gerenciamento de biblioteca onde usuários podem alugar livros, verificar taxas de atraso e acompanhar o histórico de empréstimos. O sistema também precisa controlar os custos dos aluguéis e permitir que os administradores gerenciem os livros e usuários.

Usuários principais:
* Leitor: Pode alugar livros, visualizar histórico e pagar taxas.
* Administrador: Gerencia livros, usuários e regras de empréstimos.


MVP > O sistema deve permitir >
    Criar *cadastro de usuários* (Leitor e Administrador)
    Criar *cadastro de livros* (Autor, Titulo, Categoria, Status)
    Implementar sistema de *empréstimo* e *devolução* de livros
    *Cálculo de taxas* por atraso
    *Listagem* de livros
    *Busca* de livros
    Autenticação com *login e senha*
    Registro de *histórico de emprestimo*

# Requisitos não funcionais

* O Sistema deve ser desenvolvido utilizando VueJs no Front e Express no Back
* O Banco de dados deve ser implementado utilizando PostgreSQL
* O Sistema deve utilizar JWT para autenticação
* O tempo de resposta das APIs deve ser inferior a 500ms para operações simples(CRUDs)
* O sistema deve ser responsivo para acesso via desktop e mobile
* O sistema deve registrar logs de operações críticas (empréstimos, devoluções e pagamentos)


# Requisitos Funcionais
## Módulo de usuários
- [] O sistema deve permitir o cadastro de usuários com nome, e-mail e senha
- [] O sistema deve permitir que os usuarios façam login/logout
- [] O sistema deve permitir que um usuário tenha diferentes papéis(Admin ou Leitor)

## Módulo de livros
- [] O sistema deve permitir o cadastro, edição e exclusão de um ou mais livros(Somente admins)
- [] O sistema deve permitir que usuarios busquem e listem livros por titulo, autor ou categoria
- [x] O sistema deve exibir o status dos livros

## Módulo de emprestimo
- [] O sistema deve permitir que um usuário alugue um livro disponível
- [] O sistema deve permitir a devolução de livros e registrar a data da devolução
- [] O sistema deve calcular automáticamente multas por atraso
- [] O sistema deve permitir que administradores visualizem o histórico de empréstimos

## Módulo de pagamentos
- [] O sistema deve permitir que um usuário visualize suas multas pendentes
- [] O sistema deve permitir o pagamento das multas e registrar no histórico


# Regras de Negocio
* Um usuario pode alugar no até *3 livros simultaneamente*
* O prazo para *devolução* de um livro é no máximo *7 dias úteis*
* O valor da multa é *R$5.00 por dia de atraso*
* Um *usuário não pode alugar* um novo livro *se tiver multas pendentes*
* *Somente *admins podem cadastrar/editar/excluir* livros


TODO:
Criar o diagrama do banco de dados
Definir as rotas e endpoints da API
Criar a arquitetura do projeto (pastas, serviços, controllers, repositórios, etc.)