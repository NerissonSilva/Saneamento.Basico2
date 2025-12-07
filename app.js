const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) verifyToken(token);
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function showLogin(event) {
  if (event) event.preventDefault();
  showPage('loginPage');
  clearErrors();
}

function showRegister(event) {
  if (event) event.preventDefault();
  showPage('registerPage');
  clearErrors();
}

function showDashboard() {
  showPage('dashboardPage');
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('userEmail').textContent = user.email;
  }
  loadDashboardData();
}

function clearErrors() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('registerError').textContent = '';
}

async function verifyToken(token) {
  try {
    const response = await fetch(`${API_URL}/saneamento/estatisticas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      showDashboard();
    } else {
      localStorage.clear();
      showLogin();
    }
  } catch (error) {
    showLogin();
  }
}

// Login
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showDashboard();
    } else {
      errorDiv.textContent = data.error || 'Login falhou';
    }
  } catch (error) {
    errorDiv.textContent = 'Erro ao conectar';
  }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('registerError');

  if (password !== confirmPassword) {
    errorDiv.textContent = 'As senhas não coincidem';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert('Cadastro realizado! Faça login.');
      showLogin();
    } else {
      errorDiv.textContent = data.error || 'Cadastro falhou';
    }
  } catch (error) {
    errorDiv.textContent = 'Erro ao conectar';
  }
});

function logout() {
  localStorage.clear();
  showLogin();
}

// Load Dashboard Data
async function loadDashboardData() {
  const token = localStorage.getItem('token');
  
  try {
    // Estatísticas gerais
    const statsRes = await fetch(`${API_URL}/saneamento/estatisticas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const stats = await statsRes.json();
    
    document.getElementById('aguaTotal').textContent = `${stats.aguaPotavel.total}%`;
    document.getElementById('esgotoTotal').textContent = `${stats.esgoto.total}%`;
    document.getElementById('coletaTotal').textContent = `${stats.coleta.total}%`;
    document.getElementById('tratamentoTotal').textContent = `${stats.tratamento.total}%`;

    // Dados por região
    const regioesRes = await fetch(`${API_URL}/saneamento/regioes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const regioes = await regioesRes.json();
    renderRegioesChart(regioes);

    // Investimentos
    const investRes = await fetch(`${API_URL}/saneamento/investimentos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const invest = await investRes.json();
    renderInvestimentosChart(invest.anos);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

function renderRegioesChart(regioes) {
  const container = document.getElementById('regioesChart');
  container.innerHTML = regioes
    .map(
      r => `
    <div class="chart-bar">
      <div class="chart-label">${r.regiao}</div>
      <div class="chart-bar-container">
        <div class="chart-bar-fill blue" style="width: ${r.agua}%">${r.agua}%</div>
      </div>
    </div>
  `
    )
    .join('');
}

function renderInvestimentosChart(anos) {
  const container = document.getElementById('investimentosChart');
  const maxValor = Math.max(...anos.map(a => a.valor));
  container.innerHTML = anos
    .map(
      a => `
    <div class="chart-bar">
      <div class="chart-label">${a.ano}</div>
      <div class="chart-bar-container">
        <div class="chart-bar-fill green" style="width: ${(a.valor / maxValor) * 100}%">
          R$ ${a.valor}B
        </div>
      </div>
    </div>
  `
    )
    .join('');
}
