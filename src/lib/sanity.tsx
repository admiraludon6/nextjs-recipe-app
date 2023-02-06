import { createClient } from "next-sanity";
import { definePreview } from "next-sanity/preview";
import createImageUrlBuilder from "@sanity/image-url";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const config = {
    projectId: "2q97fx9p",
    dataset: "production",
    apiVersion: "2023-02-06",
    useCdn: false
};

export const sanityClient = createClient(config);

export const useDefinePreview = definePreview(config);

export const urlFor = (source: SanityImageSource) => createImageUrlBuilder(config).image(source);

export const PortableText = (props: any) => <PortableTextComponent components={{}} {...props} />;