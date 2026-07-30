import Hero from '../components/home/Hero/Hero';
import SearchBar from '../components/home/SearchBar';
import Categories from '../components/home/Categories';
import FeaturedEvents from '../components/home/FeaturedEvents';

function Home() {
  return (
    <>
      <Hero />

      <SearchBar />

      <Categories />

      <FeaturedEvents />
    </>
  );
}

export default Home;
