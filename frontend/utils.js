const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function setUser(user, token) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  document.body.insertBefore(errorDiv, document.body.firstChild);
  setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success';
  successDiv.textContent = message;
  document.body.insertBefore(successDiv, document.body.firstChild);
  setTimeout(() => successDiv.remove(), 5000);
}

async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const token = getToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If response not ok, throw the text (trimmed) so caller sees useful info
      if (!response.ok) {
        const snippet = text ? text.substring(0, 200) : 'Non-JSON response';
        throw new Error(snippet.replace(/\s+/g, ' '));
      }
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
    }

    if (!response.ok) {
      throw new Error((data && data.error) ? data.error : 'API Error');
    }

    return data;
  } catch(err) {
    showError(err.message);
    throw err;
  }
}

function updateNav() {
  const user = getUser();
  const navContainer = document.querySelector('nav');
  
  navContainer.innerHTML = '';

  if (user) {
    navContainer.innerHTML = `
      <a href="index.html">Shop</a>
      ${user.role === 'admin' ? '<a href="admin.html">Admin Panel</a>' : ''}
      <a href="orders.html">My Orders</a>
      <span>Welcome, ${user.name} ${user.role === 'admin' ? '<span class="role-badge admin">Admin</span>' : ''}</span>
      <button class="nav-btn" onclick="logout()">Logout</button>
    `;
  } else {
    navContainer.innerHTML = `
      <a href="index.html">Shop</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

function logout() {
  clearAuth();
  updateNav();
  window.location.href = 'index.html';
  showSuccess('Logged out successfully');
}

document.addEventListener('DOMContentLoaded', updateNav);
