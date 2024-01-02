import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Post from "@layouts/components/Post";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { slugify } from "@lib/utils/textConverter";
import PostLink from "@layouts/components/Link";

const { blog_folder } = config.settings;

const Category = ({ posts, links, slug }) => {
  return (
    <Base>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <h1 className="text-center capitalize">{slug}</h1>
              <div className="row pt-12">
                {posts.map((post, i) => (
                  <Post
                    className="mb-6 sm:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
                {links.map((post, i) => (
                  <PostLink
                    className="mb-6 sm:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Category;

export const getStaticPaths = () => {
  const allCategory = getTaxonomy(`content/${blog_folder}`, "categories");
  const paths = allCategory.map((category) => ({
    params: {
      category: category,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({ params }) => {
  const posts = getSinglePage(`content/${blog_folder}`);

  // get posts are contain category Link
  let filteredPostLinks = []
  if (params.category.toLowerCase() === 'Link') {
    filteredPostLinks = posts.filter((post) =>
      post.frontmatter.categories.find((category) =>
        slugify(category).includes(params.category)
      )
    );
  }

  const filteredPosts = posts.filter((post) =>
    post.frontmatter.categories
      .find((category) => slugify(category).includes(params.category)
    )
  ).filter((post) => !filteredPostLinks.includes(post));

  return {
    props: {
      posts: sortByDate(filteredPosts),
      links: sortByDate(filteredPostLinks),
      slug: params.category,
    },
  };
};
