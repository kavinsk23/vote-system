const API_BASE_URL = 'http://localhost/projects/login/api';

export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/register.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};

// Add more API calls as needed