import { Header } from '../components/Header';
import { Player } from '../components/Player';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {


  return (
    // the context must surround the components 
    // where its info will be used
    // in this case we went over kill and surrounded everything
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
