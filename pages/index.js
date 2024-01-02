import config from "@config/config.json";
import social from "@config/social.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/components/Post";
import Social from "@layouts/components/Social";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import {useEffect, useState} from "react";
import Substack from "@components/Substack";
import PostLink from "@components/Link";
import {Loading} from "@components/loading";
const { blog_folder } = config.settings;

const Home = ({ posts, links }) => {
  const { pagination } = config.settings;
  const { name, image, designation, bio } = config.profile;
  const sortPostByDate = sortByDate(posts);
  const sortPostLinkByDate = sortByDate(links);
  const [newsletters, setNewsletters] = useState([])

  useEffect(() => {
    fetch("/api/feeds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setNewsletters(data.feeds)
      })
    })
  }, []);

  return (
    <Base>
      {/* profile */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto text-center lg:col-8">
              <ImageFallback
                className="mx-auto rounded-full"
                src={image}
                width={220}
                height={220}
                priority={true}
                alt={name}
              />
              {markdownify(
                name,
                "h1",
                "mt-12 text-6xl lg:text-8xl font-semibold"
              )}
              {markdownify(designation, "p", "mt-6 text-primary text-xl")}
              {markdownify(bio, "p", "mt-4 leading-9 text-xl")}
              <Social source={social} className="profile-social-icons mt-8" />
            </div>
          </div>
        </div>
      </div>

      {/* posts */}
      <div className="pt-4">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <div className="row">
                { newsletters.length === 0 ? (<Loading />) : newsletters.slice(0, pagination).map((post, i) => (
                  <Substack
                    className="col-12 mb-6 sm:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
              <div className="row">
                {sortPostByDate.slice(0, pagination).map((post, i) => (
                  <Post
                    className="col-12 mb-6 sm:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
              <div className="row">
                {sortPostLinkByDate.slice(0, pagination).map((post, i) => (
                  <PostLink
                    className="col-12 mb-6 sm:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Pagination
              totalPages={Math.ceil(posts.length / pagination)}
              currentPage={1}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const blogPosts = getSinglePage(`content/${blog_folder}`);

  // get posts are contain category Link
  const postLinks = blogPosts.filter((post) =>
    post.frontmatter.categories.includes("Link")
  );

  // normal posts
  const genericPosts = blogPosts.filter((post) =>
    !postLinks.includes(post)
  );


  return {
    props: {
      posts: genericPosts,
      links: postLinks,
    },
  };
};
