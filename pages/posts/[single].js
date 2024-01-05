import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import { parseMDX } from "@lib/utils/mdxParser";
import PDFViewer from "tailwind-pdf-viewer";
const { blog_folder } = config.settings;

// post single layout
const Article = ({ post, mdxContent, slug, posts, importPdf }) => {
  if (importPdf) {
    return (
        <PDFViewer pdfURL={importPdf} />
    );
  } else {
    return (
        <PostSingle mdxContent={mdxContent} slug={slug} post={post} posts={posts} />
    );
  }
};

// get post single slug
export const getStaticPaths = () => {
  const allSlug = getSinglePage(`content/${blog_folder}`);
  const paths = allSlug.map((item) => ({
    params: {
      single: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

// get post single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const posts = getSinglePage(`content/${blog_folder}`);
  const post = posts?.filter((p) => p.slug === single);
  const mdxContent = await parseMDX(post[0].content || "");
  const importPdf = post[0].import || "";

  return {
    props: {
      post: post,
      mdxContent: mdxContent,
      slug: single,
      posts: posts,
      importPdf,
    },
  };
};

export default Article;
