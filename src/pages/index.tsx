import Head from 'next/head'
import Link from 'next/link';
import { sanityClient, urlFor } from "../lib/sanity";

const receipesQuery = `*[_type =="recipe"]{
  _id,
  name,
  slug,
  mainImage
}`;

interface HomeProps {
  recipes: { 
    _id       : string; 
    name      : string;
    slug      : {
      _type   : string;
      current : string;
    };
    mainImage : string;
  }[];
}

export default function Home(props: HomeProps) {
  const { recipes } = props;
  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to Ahmad's Kitchen 🧑🏼‍🍳</h1>
      <ul className='recipes-list'>
        { recipes?.length > 0 && recipes.map((recipe) => (
          <li key={recipe?._id} className="recipes-card">
            <Link href={`/recipes/${recipe?.slug.current}`}>
              <div>
                <img src={urlFor(recipe?.mainImage).url()} alt={recipe?.name} />
                <span>{recipe?.name}</span>
              </div>
            </Link>
          </li>
        )) }
      </ul>
    </div>
  )
}

export async function getStaticProps(){
  const recipes = await sanityClient.fetch(receipesQuery);
  return {
    props: { 
      recipes 
    }
  }
}