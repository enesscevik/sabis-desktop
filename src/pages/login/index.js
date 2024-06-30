import { useState, useRef } from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {} from '@fortawesome/fontawesome-svg-core';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userInput = useRef(null);
  const passInput = useRef(null);
  const sub = useRef(null);

  const submit = () => {
    const userJson =
      '{\n  "username": "' +
      username +
      '",\n  "password": "' +
      password +
      '" \n}';
    props.onSubmit('./loginData.json', userJson);
    props.setU(userJson);
    props.setP(1);
  };

  return (
    <div className={styles.loginPage}>
      <p
        style={
          props.err == -1
            ? props.theme === 0
              ? {
                  color: 'red',
                  backgroundColor: 'white',
                  boxShadow: '(0px 0px 10px rgba(255, 255, 255, 0.5)',
                }
              : {
                  color: 'red',
                  backgroundColor: '#282c34',
                  boxShadow: '0px 0px 10px #6a646480',
                }
            : props.err == 0
            ? { backgroundColor: 'transparent', color: 'transparent' }
            : props.theme === 0
            ? {
                color: 'black',
                backgroundColor: 'white',
                boxShadow: '(0px 0px 10px rgba(255, 255, 255, 0.5)',
              }
            : {
                color: 'white',
                backgroundColor: '#282c34',
                boxShadow: '0px 0px 10px #6a646480',
              }
        }
        className={styles.alert}
      >
        {props.err == -1
          ? 'Kullanıcı adı veya parola hatalı!'
          : props.err == 0
          ? '.'
          : 'Bir şeyler ters gitti! Tekrar deneyiniz!'}
      </p>
      <div
        className={`${styles.form} ${
          props.theme === 0 ? styles.backLight : styles.backDark
        }`}
      >
        <p
          className={`${styles.text} ${
            props.theme === 0 ? styles.textLight : styles.textDark
          }`}
        >
          Username
        </p>

        <input
          style={
            props.err == -1
              ? { borderBottom: '2px solid red' }
              : props.theme === 0
              ? { borderBottom: '2px solid #282c34' }
              : { borderBottom: '2px solid aliceblue' }
          }
          ref={userInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              passInput.current.focus();
            }
          }}
          onChange={(e) => {
            if (e.target.value.length <= 10) setUsername(e.target.value);
            else e.target.value = username; //e.target.value.substring(0, 10);
          }}
          className={`${styles.input} ${
            props.theme === 0 ? styles.inputLight : styles.inputDark
          }`}
          type='text'
          placeholder='B22*******'
        />
        <p
          className={`${styles.text} ${
            props.theme === 0 ? styles.textLight : styles.textDark
          }`}
        >
          Password
        </p>
        <input
          style={
            props.err == -1
              ? { borderBottom: '2px solid red' }
              : props.theme === 0
              ? { borderBottom: '2px solid #282c34' }
              : { borderBottom: '2px solid aliceblue' }
          }
          ref={passInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sub.current.click();
            if (e.key === ' ') e.preventDefault();
          }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className={`${styles.input} ${
            props.theme === 0 ? styles.inputLight : styles.inputDark
          }`} //replace(/\s+/g, '');
          type='password'
          placeholder='********'
        />
        <button
          ref={sub}
          name='but'
          className={`${styles.button} ${
            props.theme === 0 ? styles.butLight : styles.buttDark
          }`}
          type='button'
          onClick={() => {
            submit();
          }}
          onMouseDown={() => {
            submit();
          }}
        >
          Giriş Yap
        </button>
      </div>
      <FontAwesomeIcon
        className={styles.icon1}
        icon={faUser}
        size=''
        color={props.theme === 0 ? 'black' : 'white'}
      />
      <FontAwesomeIcon
        className={styles.icon2}
        icon={faLock}
        size=''
        color={props.theme === 0 ? 'black' : 'white'}
      />
    </div>
  );
}

export default Login;
