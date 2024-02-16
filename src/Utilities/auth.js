const API_BASE_URL = 'https://api.vaxtrax.pet'; // Base URL for your API

function storeTokens(tokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
}

function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token');
}

function refreshAccessToken() {
    return new Promise((resolve, reject) => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            reject(new Error('No refresh token available'));
        }

        fetch(`${API_BASE_URL}/token/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to refresh token');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('access_token', data.access_token);
            resolve(data.access_token);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function fetchWithToken(url) {
    return new Promise((resolve, reject) => {
        const accessToken = localStorage.getItem('access_token');

        fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                return refreshAccessToken()
                .then(newAccessToken => {
                    return fetch(`${API_BASE_URL}${url}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newAccessToken}`
                        }
                    });
                });
            }
            return response;
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network request failed');
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            console.error('Error in fetchWithToken:', error);
            reject(error);
        });
    });
}

// Function to check if the user is authenticated
function checkAuthentication() {
    return new Promise((resolve, reject) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            reject(new Error('No access token found'));
            return;
        }
    
        // Make a GET request to the protected route
        fetch(`/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, 
            },
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Access granted');
                resolve(true);
            } 
            else if (response.status === 403) {
                console.log('Unauthorized access');
                window.location.href = '/';
                resolve(false);
            } 
            else {
                console.log('Unexpected error');
                window.location.href = '/';
                reject(new Error('Unexpected error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            reject(error);
        // Handle network errors or other issues
        });
    });
}
  

// Exporting the functions
export {
    storeTokens,
    clearTokens,
    getAccessToken,
    getRefreshToken,
    refreshAccessToken,
    fetchWithToken,
    checkAuthentication
};
