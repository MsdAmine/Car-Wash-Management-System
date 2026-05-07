import { APP_NAME, API_URL } from './config';

function App() {
    return (
        <div className="App">
            <h1>Welcome to {APP_NAME}</h1>
            <p>Backend API: {API_URL}</p>
        </div>
    );
}

export default App;