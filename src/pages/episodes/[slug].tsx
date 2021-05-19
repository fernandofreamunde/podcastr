import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from './episode.module.scss';
import Link from "next/link";

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  description: string,
  duration: number,
  durationAsString: string,
  url: string,
}

type EpisodeProps = {
  episode: Episode,
}

export default function Episode({ episode }: EpisodeProps) {
  // only needed if we are using fallback true
  // since fallback blocking is new 
  // we probably wont need this ever again
  
  // const router = useRouter();

  // if (router.isFallback) {
  //   return(
  //     <p>Loading...</p>
  //   );
  // }

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/" >
          <button type="button" >
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image 
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type='button'> 
          <img src="/play.svg" alt="Tocar episodio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description}} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {

  // get a limited ammount to generate static pages
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort:'published_at',
      _order:'desc',
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    // paths: [
    //   { params: {slug: 'como-virar-lider-desenvolvimento'} },
    //   { params: {slug: 'comunidades-e-tecnologia'} },
    //   { params: {slug: 'typescript-vale-a-pena'} },
    //   { params: {slug: 'estrategias-de-autenticacao-jwt-oauth'} },
    // ],
    // fallback false if not in list above it will return 404
    // fallback true it will call the api via client browser
    // fallback 'blocking' it will call the api via next server and cached
    fallback: 'blocking',
  }

  // true and blocking are incremental static regeneration
} 

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: pt}),
    thumbnail: data.thumbnail,
    description: data.description,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
} 
