# Concentra+ · protótipo front-end

Aplicativo móvel (Android e iOS) do Concentra+, o relógio de mesa que ajuda no foco e nos estudos. Para ver o protótipo, abra o `index.html` no navegador. Não precisa instalar nada.

O backlog tem 30 histórias de usuário, divididas em 5 blocos de 6\. Cada integrante cuida de um bloco, e cada arquivo tem **um único responsável**, indicado no comentário do topo dele.

## Integrantes

| Pessoa | Histórias | Parte | Integrante | Usuário do GitHub |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 01 a 06 | Cadastro, relógio e timers | \[LUCAS ARAUJO\] | \[@lucas-araujo01\] |
| 2 | 07 a 12 | Sessão, bloqueio e conta | \[CAMILA\] | \[@camilapgo\] |
| 3 | 13 a 18 | Início, metas e tema | \[THAIS\] | \[@thaisrpc\] |
| 4 | 19 a 24 | Tutorial, histórico e suporte | \[LUCAS RIBEIRO\] | \[@ribeiro8\] |
| 5 | 25 a 30 | Sons, dicas e aparência | \[PAMELA\] | \[@panspadaccia\] |

## Histórias e telas de cada pessoa

### Pessoa 1 · Cadastro, relógio e timers

| História | Tema | Tela(s) |
| :---- | :---- | :---- |
| 01 | Cadastro com e-mail | 01, 02, 03, 04, 41 |
| 02 | Alterar dados da conta | 35 |
| 03 | Conectar o app ao relógio | 06, 08 |
| 04 | Relatórios | 30, 42, PDF |
| 05 | Criar timers | 13 |
| 06 | Timers padrão | 12 |

### Pessoa 2 · Sessão, bloqueio e conta

| História | Tema | Tela(s) |
| :---- | :---- | :---- |
| 07 | Bloquear aplicativos | 22 |
| 08 | Pausar/retomar pelos botões do relógio | 15, relógio virtual |
| 09 | Volume dos alertas | 10 |
| 10 | Meta diária | 18 |
| 11 | Excluir meus dados | 39 |
| 12 | Lembretes | 33 |

### Pessoa 3 · Início, metas e tema

| História | Tema | Tela(s) |
| :---- | :---- | :---- |
| 13 | Bateria do relógio | 11 |
| 14 | Cronômetro sem o celular e sincronização | 16 |
| 15 | Modo Restrito | 14 |
| 16 | Integrar com a agenda | 32 |
| 17 | Ofensiva (streak) | 19 |
| 18 | Modo escuro | tema claro/escuro |

### Pessoa 4 · Tutorial, histórico e suporte

| História | Tema | Tela(s) |
| :---- | :---- | :---- |
| 19 | Tutorial inicial | 05, 07 |
| 20 | Permissões do bloqueio | 23, 24, 25 |
| 21 | Histórico em calendário | 29 |
| 22 | Central de ajuda | 26, 27 |
| 23 | Assinatura | 37, 38 |
| 24 | Recuperar histórico | 31 |

### Pessoa 5 · Sons, dicas e aparência

| História | Tema | Tela(s) |
| :---- | :---- | :---- |
| 25 | Formato 12/24 horas | 10 (tela da Pessoa 2\) |
| 26 | Músicas e sons | 17 |
| 27 | Informações do relógio | 09 |
| 28 | Tema claro/escuro | 36 |
| 29 | Sugestões | 28 |
| 30 | Dicas de concentração | 20, 21 |

## Arquivos de cada pessoa

**Pessoa 1**

- `js/pessoa1/pdf-relatorio.js`  
- `js/pessoa1/telas.js`

**Pessoa 2**

- `css/pessoa2/relogio.css`  
- `js/pessoa2/motor-da-sessao.js`  
- `js/pessoa2/relogio-virtual.js`  
- `js/pessoa2/telas.js`

**Pessoa 3**

- `README.md`  
- `css/pessoa3/telas-base-1.css`  
- `css/pessoa3/tema.css`  
- `index.html`  
- `js/pessoa3/02-estado-e-navegacao.js`  
- `js/pessoa3/telas.js`  
- `js/pessoa3/tema.js`

**Pessoa 4**

- `css/pessoa4/telas-base-2.css`  
- `js/pessoa4/historico-dados.js`  
- `js/pessoa4/iniciar.js`  
- `js/pessoa4/telas.js`

**Pessoa 5**

- `css/pessoa5/base.css`  
- `js/pessoa5/01-base.js`  
- `js/pessoa5/acoes.js`  
- `js/pessoa5/audio.js`  
- `js/pessoa5/painel-moderador.js`  
- `js/pessoa5/telas.js`

Observação: as telas 09 (Meu relógio) e 10 (Config. do relógio) atendem histórias de mais de uma pessoa (09 e 25 na tela 10; 13 e 27 na tela 09). Cada arquivo tem um dono só, o da tabela acima.