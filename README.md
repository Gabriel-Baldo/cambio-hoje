# Câmbio Hoje — Conversor BRL ⇄ USD/EUR/BTC

Serviço web da disciplina **Programação para Web 1 (UTFPR)**: conversor com cotação viva, 100% front estático (HTML + CSS + JS puro, sem back-end próprio).

> Projeto 1 (site pessoal) mora no repo **[portfolio](https://github.com/Gabriel-Baldo/portfolio)**. Este repo é **só o Projeto 2** + base do Projeto Final (refatoração React) — sem código do site pessoal aqui.
>
> Histórico: a Etapa 1 do site pessoal (HTML puro) foi versionada neste repo antes da separação — ver `git log` (commits até `e70bf0a`).

## Escopo deste repo (Projeto 2)

- **APIs:** PTAX/SGS do Banco Central (`api.bcb.gov.br`, sem chave, com CORS) + CoinGecko keyless (`api.coingecko.com`, sem chave, com CORS)
- **Layout exigido:** HEADER / FERRAMENTA / ANÚNCIO 300x250 / instruções / FOOTER com link pro site pessoal

## Rodar com Docker (recomendado)

```bash
docker compose up --build
# http://localhost:8080
```

## Rodar sem Docker

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Publicação (GitHub Pages)

Settings → Pages → Deploy from branch → `main` /root. O `index.html` está na raiz de propósito.

## Evolução (7 incrementos do Projeto 2)

- [x] 1. JS básico — `js/app.js`: primeira versão funcional (cálculo + fetch BCB/CoinGecko)
- [x] 2. DOM/eventos — converte sem recarregar (submit + input/change)
- [ ] 3. localStorage — histórico + moedas favoritas
- [ ] 4. fetch APIs — (base pronta; expandir: gráfico 7 dias)
- [ ] 5. async/Promise.all — (base usa `Promise.all`; expandir: requisições independentes do gráfico)
- [ ] 6. Web APIs — Clipboard/Share/Geolocation
- [ ] 7. Pages + monetização
