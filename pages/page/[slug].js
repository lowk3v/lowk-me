import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Post from "@layouts/components/Post";
import { getSinglePage } from "@lib/contentParser";
import {useEffect, useState} from "react";
import {Loading} from "@components/loading";
import Substack from "@components/Substack";
import PostLink from "@components/Link";
import Report from "@components/Report";
const { blog_folder } = config.settings;

// blog pagination
const BlogPagination = ({ posts, currentPage, pagination }) => {
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const [ allPosts, setAllPosts ] = useState(posts)
  const [ totalPages, setTotalPages ] = useState(Math.ceil(allPosts.length / pagination))
  const [ isFeeding, setIsFeeding ] = useState(true)

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
        setAllPosts(
          sortedPosts.slice(indexOfFirstPost, indexOfLastPost)
        )
        setTotalPages(Math.ceil(sortedPosts.length / pagination))
        setIsFeeding(false)
      })
    })
  }, []);

  return (
    <div className="section container">
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
              )} else {
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
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
};

export default BlogPagination;

// get blog pagination slug
export const getStaticPaths = () => {
  let totalSubstackPosts = 0;
  fetch("/api/feeds", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      totalSubstackPosts = data.length
    })
  })
  const getAllSlug = getSinglePage(`content/${blog_folder}`);
  const allSlug = getAllSlug.map((item) => item.slug);
  const { pagination } = config.settings;
  const totalPages = Math.ceil(allSlug.length + totalSubstackPosts / pagination);
  let paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

// get blog pagination content
export const getStaticProps = async ({ params }) => {
  return {
    props: {
      pagination: config.settings.pagination,
        posts: getSinglePage(`content/${blog_folder}`),
        currentPage: parseInt((params && params.slug) || 1),
    },
  }
};
