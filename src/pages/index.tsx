// import { useEffect } from "react"; spa way

export default function Home(props) {
  // SSR and SSG
  // console.log(props.episodes); //this comes from getServerProps where the api call is made by the nextJs server
  
  // normal react way to get data from api on page load
  // SPA way of doing things
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }, []);

  return (
    <div> Index </div>
  )
}

// For Server Side Render use getServerSideProps()
// For Static Site Generation use getStaticProps() instead.
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    // for SSG pass revalidate to fetch new data each x amount of seconds
    // in this case we go fetch podcasts every 8h:
    revalidate: 60 * 60 * 8,
  }
}