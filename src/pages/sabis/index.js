import { useEffect, useState, useRef } from 'react';
import Loading from './../loading/index.js';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faDoorOpen,
  faUser,
  faSpinner,
  faCircleExclamation,
  faGear,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
function Sabis(props) {
  const [process, setProcess] = useState(0);
  const [profile, setProfile] = useState([]);
  const [grades, setGrades] = useState([]);
  //const [btnActive, setBtnActive] = useState(false);
  const profileRef = useRef(null);
  const settingsRef = useRef(null);
  const [isNew, setIsNew] = useState(0);
  const sabisApi = async () => {
    setIsNew(0);
    let userJson = {};
    try {
      userJson = JSON.parse(props.log);
    } catch (error) {
      return;
    }
    const result = await window.electron.getSabis(
      userJson.username,
      userJson.password
    );
    if (result === -1) {
      // props.write('./loginData.json', '');
      props.setE(-1);
      props.setP(0);
    } else if (result === 0) {
      //props.write('./loginData.json', '');
      props.setE(0);
      props.setP(0);
    } else if (result === -3000) {
      setIsNew(-1);
      return;
    } else {
      const data = JSON.parse(result);
      setProfile(data[0]);
      setGrades(data[1]);
      props.write('./sabisData.json', result);
      props.setE(0);
      if (process !== 1) setProcess(1);
      setIsNew(1);
    }
  };

  const localSabis = async () => {
    setProcess(0);
    try {
      const save = await props.read('./sabisData.json');
      const result = await JSON.parse(save);
      setProfile(result[0]);
      setGrades(result[1]);
      if (result[0].toString() != '') setProcess(1);
    } catch (error) {
      return;
    } finally {
      sabisApi();
    }
  };

  useEffect(() => {
    localSabis();
    //sabisApi();
  }, []);

  const cleanThem = (array) => {
    try {
      return array.map((line, index) => {
        if (index === 0) {
          return (
            <thead>
              <tr key={index} className={styles.gradesTitle}>
                <th colSpan={4}>{line}</th>
              </tr>
              <tr key={index} className={styles.gradesTitle2}>
                <th>{'Oran'}</th>
                <th>{'Çalışma Tipi'}</th>
                <th>{'Not'}</th>
                <th>{'Ort'}</th>
              </tr>
            </thead>
          );
        } else {
          const parts = line.split('-');
          return (
            <tbody>
              <tr key={index} className={styles.gradesLine}>
                <td className={styles.gradesContribution}>
                  {parts[0] === 'x' ? ' ' : parts[0]}
                </td>
                <td className={styles.gradesExam}>{parts[1]}</td>
                <td
                  className={`${styles.gradesValue} ${
                    parts[2] === 'AA' || parts[2] === 'BA' || parts[2] === 'BB'
                      ? styles.perfectAv
                      : parts[2] === 'CB'
                      ? styles.goodAv
                      : parts[2] === 'CC'
                      ? styles.normalAv
                      : parts[2] === 'DC' || parts[2] === 'DD'
                      ? styles.endAv
                      : parts[2] === 'DC' || parts[2] === 'DD'
                      ? styles.badAv
                      : ''
                  }`}
                >
                  {parts[2]}
                </td>
                <td className={styles.gradesAv}>{parts[3]}</td>
              </tr>
            </tbody>
          );
        }
      });
    } catch (error) {
      setProcess(0);
    }
  };

  return (
    <div className={styles.container}>
      {process === 0 && <Loading />}
      {process === 1 && (
        <div className={styles.settingsCon}>
          <div
            ref={settingsRef}
            className={`${styles.settings} ${
              props.theme === 0 ? styles.backLight : styles.backDark
            }`}
          >
            <div className={styles.setTitle}>Ayarlar</div>
            <div className={styles.setting}>
              <div className={styles.settingName}>Tema</div>
              {/* <div className={styles.settingValue}>
                {props.theme === 0 ? '(Açık)' : '(Koyu)'}
              </div> */}
              <div
                onClick={() => {
                  if (props.theme === 0) props.setT(1);
                  else props.setT(0);
                }}
                className={`${styles.settingToggleButton} ${
                  props.theme === 0 ? styles.toggleLight : styles.toggleDark
                } $`}
              >
                <div
                  className={`${
                    props.theme === 0
                      ? styles.toggleDeactive
                      : styles.toggleActive
                  } ${props.theme === 0 ? styles.backDark : styles.backLight}`}
                ></div>
              </div>
            </div>
            <div className={styles.setting}>
              <div className={styles.settingName}>Arkaplan</div>
              {/* <div className={styles.settingValue}>
                {props.back === 0 ? '(Kapalı)' : '(Açık)'}
              </div> */}
              <div
                onClick={() => {
                  if (props.back === 0) props.setB(1);
                  else props.setB(0);
                }}
                className={`${styles.settingToggleButton} ${
                  props.theme === 0 ? styles.toggleLight : styles.toggleDark
                } $`}
              >
                <div
                  className={`${
                    props.back === 0
                      ? styles.toggleDeactive
                      : styles.toggleActive
                  } ${props.theme === 0 ? styles.backDark : styles.backLight}`}
                ></div>
              </div>
            </div>
            <div className={styles.setting}>
              <div className={styles.settingName}>Hesaptan Çık</div>
              <div
                onClick={() => {
                  const clean = async () => {
                    try {
                      await props.write(
                        './loginData.json',
                        '{"username":"","password":""}'
                      );
                      await props.write('./sabisData.json', '[[],[]]');
                      await props.setP(0);
                    } catch (error) {}
                  };
                  clean();
                }}
                className={styles.settingButton}
              >
                <FontAwesomeIcon icon={faRightFromBracket} size='lg' color='' />
              </div>
            </div>
            <div className={styles.setting}>
              <div className={styles.settingName}>Çıkış</div>
              <div
                onClick={() => {
                  window.electron.quitApp();
                }}
                className={styles.settingButton}
              >
                {' '}
                <FontAwesomeIcon icon={faDoorOpen} size='lg' color='' />
              </div>
            </div>
          </div>
        </div>
      )}
      {process === 1 && (
        <div className={styles.topBar}>
          <div className={styles.buttonCon}>
            <button
              className={styles.settingsButton}
              onClick={() => {
                if (settingsRef.current.style.transform === 'translateY(140%)')
                  settingsRef.current.style.transform = 'unset';
                else settingsRef.current.style.transform = 'translateY(140%)';
              }}
            >
              <FontAwesomeIcon icon={faGear} size='2x' color='' />
            </button>
            <button
              type='button'
              onClick={() => {
                if (
                  settingsRef.current.style.transform !== 'translateY(140%)'
                ) {
                  if (
                    profileRef.current.style.transform !== 'translateY(130%)'
                  ) {
                    profileRef.current.style.transform = 'translateY(130%)';
                  } else {
                    profileRef.current.style.transform = 'unset';
                  }
                }
              }}
              onBlur={() => {
                profileRef.current.style.transform = 'unset';
              }}
              className={styles.account}
            >
              <FontAwesomeIcon icon={faUser} size='2x' color='' />
            </button>
            <button
              type='button'
              className={`${styles.reload} ${
                isNew === 1 ? styles.isNew : styles.isNotNew
              }`}
              onClick={() => {
                sabisApi();
              }}
            >
              {isNew === 1 ? (
                <FontAwesomeIcon icon={faCheck} size='2x' color='' />
              ) : isNew === 0 ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  size='2x'
                  color=''
                  spinPulse
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size='2x'
                  color=''
                />
              )}
            </button>
          </div>
        </div>
      )}
      {process === 1 && (
        <div className={styles.profileCon}>
          <div
            ref={profileRef}
            className={`${styles.profileTable} ${
              props.theme === 0 ? styles.backLight : styles.backDark
            }`}
          >
            {process === 1 && isNew !== -1 && (
              <img
                className={styles.profileDetail}
                style={{ width: '75px' }}
                src={profile[0]}
              ></img>
            )}
            {process === 1 &&
              profile.map((line, index) => (
                <div key={index} className={styles.profileDetail}>
                  {index !== 0 && line}
                </div>
              ))}
          </div>
        </div>
      )}
      {process === 1 && (
        <div className={styles.gradesContainer}>
          {grades.map((table, index) => (
            <table
              key={index}
              className={`${styles.gradesTable} ${
                props.theme === 0 ? styles.backLight : styles.backDark
              }`}
            >
              {cleanThem(table)}
            </table>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sabis;
