import Header from './components/Header';
import Aside from './components/Aside';
import { Outlet } from 'react-router-dom';
import styles from './assets/styles/layout.module.css'

const Layout = () => {
  return (
    <>
      <div className={styles.layoutcontainer}>
        <div className={styles.asidebox}>
          <Aside />
        </div>
        <main className={styles.maincontent}>
          <Header />
          <Outlet />
          <div className={styles.phonebox}>
            <Aside />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
