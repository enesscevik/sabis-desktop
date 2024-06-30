import styles from './styles.module.css';
function loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default loading;
