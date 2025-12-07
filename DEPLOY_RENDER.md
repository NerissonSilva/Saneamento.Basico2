# 🚀 Guia de Deploy no Render - CORRIGIDO

## ✅ Problema Resolvido

O erro `Cannot find module '/opt/render/project/src/src/server.js'` foi corrigido!

**Causa:** O Render clona para `/opt/render/project/src` e o comando estava duplicando o caminho.

**Solução:** Atualizado `startCommand` para `cd backend && node src/server.js`

## 📋 Passo a Passo para Deploy

### 1. Push para GitHub

```bash
# Se ainda não adicionou o remote
git remote add origin https://github.com/SEU-USUARIO/saneamento-app.git

# Push
git push -u origin main
```

### 2. Deploy no Render

#### Opção A: Blueprint (Automático - Recomendado)

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **New** > **Blueprint**
3. Conecte seu repositório GitHub
4. O Render detectará o `render.yaml`
5. Clique em **Apply**
6. Aguarde o deploy (5-10 minutos)

#### Opção B: Manual

1. **Criar Web Service:**
   - New > Web Service
   - Conectar repositório
   - Name: `saneamento-app`
   - Runtime: **Node**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node src/server.js`
   - Plan: **Free**

2. **Configurar Variáveis de Ambiente:**
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (clique em Generate)
   - `FRONTEND_URL` = `https://saneamento-app.onrender.com`

### 3. Verificar Deploy

Após o deploy, acesse:

- **Frontend:** `https://saneamento-app.onrender.com/`
- **API Docs:** `https://saneamento-app.onrender.com/api-docs`
- **Health Check:** `https://saneamento-app.onrender.com/api/health`

### 4. Logs do Build

Você deve ver:
```
=== Build started ===
Current directory: /opt/render/project/src
backend/
frontend/
...
=== Build completed ===
```

### 5. Logs do Servidor

Você deve ver:
```
✅ Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
🌐 Frontend: http://localhost:3000
```

## 🔧 Configuração Corrigida

### render.yaml (Atualizado)

```yaml
services:
  - type: web
    name: saneamento-app
    runtime: node
    plan: free
    buildCommand: |
      echo "=== Build started ==="
      echo "Current directory: $(pwd)"
      ls -la
      cd backend && npm install
      echo "=== Build completed ==="
    startCommand: cd backend && node src/server.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://saneamento-app.onrender.com
```

## 📁 Estrutura no Render

```
/opt/render/project/src/
├── backend/
│   ├── src/
│   │   └── server.js  ← Arquivo correto
│   ├── node_modules/
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── render.yaml
```

## ✅ Checklist de Deploy

- [ ] Código commitado no Git
- [ ] Push para GitHub
- [ ] Repositório conectado ao Render
- [ ] Blueprint aplicado ou Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build completado com sucesso
- [ ] Servidor iniciado sem erros
- [ ] Frontend acessível
- [ ] API Docs funcionando
- [ ] Login/Cadastro funcionando
- [ ] Dashboard carregando estatísticas

## 🐛 Troubleshooting

### Erro: "Cannot find module"
**Solução:** Verifique se o `startCommand` está correto: `cd backend && node src/server.js`

### Erro: "npm install failed"
**Solução:** Verifique se `package.json` está em `backend/package.json`

### Frontend não carrega
**Solução:** Verifique se a pasta `frontend` está no mesmo nível que `backend`

### API retorna 401
**Solução:** Verifique se `JWT_SECRET` está configurado nas variáveis de ambiente

## 🎉 Deploy Bem-Sucedido!

Quando tudo estiver funcionando, você verá:

1. ✅ Build completado
2. ✅ Servidor rodando
3. ✅ Frontend acessível
4. ✅ API Docs disponível
5. ✅ Login funcionando
6. ✅ Dashboard com estatísticas

## 📝 Comandos Úteis

```bash
# Ver logs do Render
# Acesse: Dashboard > Seu serviço > Logs

# Fazer redeploy
git add .
git commit -m "Update"
git push

# O Render fará redeploy automaticamente
```

## 🔗 Links Importantes

- **Dashboard Render:** https://dashboard.render.com/
- **Documentação Render:** https://render.com/docs
- **Suporte Render:** https://render.com/support

## ✨ Pronto!

Seu Sistema de Saneamento Básico está no ar! 🎉💧
