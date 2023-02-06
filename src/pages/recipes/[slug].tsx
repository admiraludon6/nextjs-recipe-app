import { sanityClient, urlFor, useDefinePreview, PortableText } from "../../lib/sanity";
import { PreviewSuspense } from 'next-sanity/preview'
import { useState } from "react";
import { useRouter } from "next/router";

const recipesQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredients[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
}`;

interface OneRecipeProps{
    data: {
        recipe: Recipe;
    },
    preview: boolean
}

interface Recipe {
    _id: string;
    name: string;
    slug      : {
        _type   : string;
        current : string;
    };
    mainImage: string;
    ingredients: {
        _key: string;
        unit: string;
        wholeNumber: string;
        fraction: string;
        ingredient: {
            name: string;
        }
    }[];
    instructions: any;
    likes: number;
}

export default function OneRecipe(props: OneRecipeProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const {preview} = props;
    if (preview) {
        return (
        <PreviewSuspense fallback={<div>Loading preview...</div>}>
            <RecipeContainer {...props} />
        </PreviewSuspense>
        );
    }
    return <RecipeContainer {...props} />;
}

function RecipeContainer(props: OneRecipeProps) {
    
    const {data, preview} = props;    

    // const recipe: Recipe = preview ? useDefinePreview(null, recipesQuery, {
    //     params: { slug: data.recipe?.slug.current },
    //     initialData: data,
    //     enabled: preview
    // }) : data.recipe;

    const recipe: Recipe = data.recipe;
    
    const [likes, setLikes] = useState(recipe?.likes);

    const addLike = async () => {
        const res: any = await fetch("/api/handle-like", {
            method: "POST",
            body: JSON.stringify({ _id: recipe._id})
        }).catch((error) => console.error(error));
        const data = await res.json();

        setLikes(data.likes);
    }

    return (
        <article className="recipe">
            <h1>{recipe?.name}</h1>
            <button className="like-button" onClick={addLike}>{likes} ❤️</button>
            <main className="content">
                <img src={recipe ? urlFor(recipe.mainImage).url() : ""} alt={recipe?.name} />
                <div className="breakdown">
                    <ul className="ingredients">
                        {recipe?.ingredients?.map(element => (
                            <li key={element._key} className="ingredient">
                                {element?.wholeNumber}
                                {element?.fraction}
                                {" "}
                                {element?.unit}
                                <br />
                                {element?.ingredient?.name}
                            </li>
                        ))}
                    </ul>
                    <PortableText value={recipe?.instructions} className="instructions"/>
                </div>
            </main>
        </article>
    )
}

export async function getStaticPaths() {
    const definedSlugs = `*[_type == "recipe" && defined(slug.current)]{
        // this will create an array of object 
        // (same like .map function in js)
        "params": {
            "slug": slug.current
        }
    }`;
    const paths = await sanityClient.fetch(definedSlugs);

    return {
        paths,
        fallback: true
    };
}

interface GetStaticProps {
    params: {
        slug: string;
    }
}

export async function getStaticProps(props : GetStaticProps ) {
    const { slug } = props.params;
    const recipe = await sanityClient.fetch(recipesQuery, {slug});

    return { props: { data: { recipe }, preview: false}}
}

