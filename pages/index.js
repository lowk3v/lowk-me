import config from "@config/config.json";
import social from "@config/social.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/components/Post";
import Social from "@layouts/components/Social";
import { getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import {useEffect, useState} from "react";
import Substack from "@components/Substack";
import PostLink from "@components/Link";
import Report from "@components/Report";
import {Loading} from "@components/loading";
const { blog_folder } = config.settings;

const Home = ({ posts }) => {
  const { pagination } = config.settings;
  const { name, image, designation, bio } = config.profile;
  const [ allPosts, setAllPosts ] = useState(posts)
  const [ isFeeding, setIsFeeding ] = useState(true)
  const [ totalPages, setTotalPages ] = useState(Math.ceil(allPosts.length / pagination))

  useEffect(() => {
    fetch("/api/feeds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        const sortedPosts = data.feeds.concat(allPosts).sort((a, b) => {
          return new Date(b.pubDate ? b.pubDate : b.frontmatter.date)
            - new Date(a.pubDate ? a.pubDate : a.frontmatter.date)
        })
        setAllPosts(sortedPosts)
        setTotalPages(Math.ceil(sortedPosts.length / pagination))
        setIsFeeding(false)
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
                { isFeeding ? (<Loading />) : ''}
              </div>
              <div className="row">
                {allPosts.slice(0, pagination).map((post, i) => {
                    if (post.source && post.source === 'Newsletter') {
                      return (
                        <Substack
                          className="col-12 mb-6 sm:col-6"
                          key={"key-" + i}
                          post={post}
                        />
                      )
                    } else if (post.frontmatter.categories.includes("Link")) {
                      // get posts are contain category Link
                      return (
                        <Post
                          className="col-12 mb-6 sm:col-6"
                          key={"post-key-" + i}
                          post={post}
                        />
                      );
                    } else if (post.frontmatter.categories.includes("Report")) {
                      return (
                        <Report
                          className="col-12 mb-6 sm:col-6"
                          key={"post-key-" + i}
                          post={post}
                        />
                    )}else {
                      // normal posts
                      return (
                        <PostLink
                          className="col-12 mb-6 sm:col-6"
                          key={"postLink-key-" + i}
                          post={post}
                        />
                      );
                    }
                })}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Pagination
              totalPages={totalPages}
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
export const getStaticProps = async () => ({
  props: {
    posts: getSinglePage(`content/${blog_folder}`)
  },
})
