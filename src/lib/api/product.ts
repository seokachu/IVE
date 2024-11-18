import axios from "axios";
import { GetStaticProps, GetStaticPaths } from "next";

const DEFAULT_URL = process.env.NEXT_PUBLIC_DEFAULT_URL;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(`${DEFAULT_URL}/shop`);
  const products = data;

  const paths = products.map((product: any) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await axios.get(`${DEFAULT_URL}/${params?.id}`);
  const product = res.data;

  return {
    props: {
      product,
    },
    revalidate: 86400,
  };
};
