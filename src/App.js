import './App.css';
import Login from './pages/login/index.js';
import Sabis from './pages/sabis/index.js';
import { useEffect, useState } from 'react';

function App() {
  const [page, setPage] = useState(1);
  const [user, setUser] = useState('');
  const [theme, setTheme] = useState(1);
  const [back, setBack] = useState(1);
  const [logErr, setLogErr] = useState(0);

  const readFile = async (filePath) => {
    const result = await window.electron.readFile(filePath);
    if (result.success) {
      return result.data.toString();
    } else {
      return '';
    }
  };
  const writeFile = async (filePath, content) => {
    await window.electron.writeFile(filePath, content);
  };

  useEffect(() => {
    const readLogin = async () => {
      const file = await readFile('./loginData.json');
      setUser(file);
    };
    readLogin();
  }, []);

  useEffect(() => {
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.username.length === 0 || parsed.password.length === 0) {
          setPage(0);
        } else {
          setPage(1);
        }
      } catch (error) {
        setPage(0);
      }
    } else {
      setPage(0);
    }
  }, [user]);

  return (
    <div
      className={`${'App'} ${
        back === 1 ? 'AppSabis' : theme === 0 ? 'AppColorLight' : 'AppColorDark'
      }`}
    >
      {page === 0 && (
        <Login
          onSubmit={writeFile}
          setP={setPage}
          err={logErr}
          setU={setUser}
          theme={theme}
        />
      )}
      {page === 1 && (
        <Sabis
          read={readFile}
          write={writeFile}
          log={user}
          setP={setPage}
          setE={setLogErr}
          setT={setTheme}
          theme={theme}
          setB={setBack}
          back={back}
        />
      )}
    </div>
  );
}

export default App;
