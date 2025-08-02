// Input validation helpers

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username) {
  // Username should be 3-20 characters, alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password) {
  // Password should be at least 6 characters
  return password && password.length >= 6;
}

export function validateAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 1000000;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

export function validateTransfer(fromUserId, toUserId, amount, userBalance) {
  const errors = [];
  
  if (!fromUserId || !toUserId) {
    errors.push('Invalid user IDs');
  }
  
  if (fromUserId === toUserId) {
    errors.push('Cannot transfer to yourself');
  }
  
  const transferAmount = parseFloat(amount);
  if (!validateAmount(amount)) {
    errors.push('Invalid transfer amount');
  }
  
  if (transferAmount > userBalance) {
    errors.push('Insufficient funds');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateWithdraw(amount, userBalance) {
  const errors = [];
  
  const withdrawAmount = parseFloat(amount);
  if (!validateAmount(amount)) {
    errors.push('Invalid withdrawal amount');
  }
  
  if (withdrawAmount > userBalance) {
    errors.push('Insufficient funds');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateDeposit(amount) {
  const errors = [];
  
  if (!validateAmount(amount)) {
    errors.push('Invalid deposit amount');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Format currency for display
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
}

// Format date for display
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}

// Generate secure random ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}