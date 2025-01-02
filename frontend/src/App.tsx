

function App() {
    const handleSignIn = () => {
        chrome.identity.getAuthToken({ interactive: true }, (token : any) => {
            if (chrome.runtime.lastError) {
                console.error("Sign-in failed:", chrome.runtime.lastError.message);
                return;
            }

            // Use the token to fetch user profile data
            fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("User data:", data);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        });
    };

    return (
        <div>
            <button onClick={handleSignIn}>Sign in with Google</button>
        </div>
    );
}

export default App;
