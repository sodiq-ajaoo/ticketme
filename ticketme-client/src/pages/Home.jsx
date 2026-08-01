import { useRef, useState } from 'react';

import Hero from '../components/home/Hero/Hero';
import SearchBar from '../components/home/SearchBar';
import Categories from '../components/home/Categories';
import FeaturedEvents from '../components/home/FeaturedEvents';

function Home() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const featuredRef = useRef(null);

  return (
    <>
      <Hero />

      <SearchBar
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
        date={date}
        setDate={setDate}
        category={category}
        setCategory={setCategory}
      />

      <div ref={featuredRef}>
        <FeaturedEvents
          search={search}
          location={location}
          date={date}
          category={category}
          featuredRef={featuredRef}
        />
      </div>
      <Categories category={category} setCategory={setCategory} />
    </>
  );
}

export default Home;
