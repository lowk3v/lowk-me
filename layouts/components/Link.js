import { dateFormat } from "@lib/utils/dateFormat";
import Link from "next/link";

const PostLink = ({ post, className }) => {
  return (
    <div className={className}>
      <div className="card">
        
        <div className="grid grid-cols-2 gap-4">
          {/* category */}
          <ul className="flex items-center space-x-4">
            {post.frontmatter.categories.map((category, index) => (
              <li key={index}>
                <Link
                  className="text-lime-500"
                  href={`/categories/${category.toLowerCase()}`}
                  target='_blank'
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>

          {/* icon */}
          <div className="grid justify-items-end">
            <Link
              className="btn-link inline-flex items-center hover:text-primary"
              href={post.frontmatter.url || ''} target='_blank'
            >
              <svg className="ml-1" width="22" height="11" viewBox="0 0 16 8" fill="currentcolor" xmlns="http://www.w3.org/2000/svg" >
                <path d="M15.3536 4.35355c.1952-.19526.1952-.51184.0-.7071L12.1716.464467C11.9763.269205 11.6597.269205 11.4645.464467c-.1953.195262-.1953.511845.0.707103L14.2929 4 11.4645 6.82843c-.1953.19526-.1953.51184.0.7071C11.6597 7.7308 11.9763 7.7308 12.1716 7.53553l3.182-3.18198zM-.437114e-7 4.5H15v-1H.437114e-7l-.874228e-7 1z"></path>
              </svg>
            </Link>
          </div>
        </div>
        
        {/* date time */}
        <div className="my-4">{dateFormat(post.frontmatter.date)}</div>

        {/* title  */}
        <div>
          <h2 className="h3 mb-2 font-normal">
            <Link href={post.frontmatter.url || ''} className="block" target='_blank'>
              {post.frontmatter.title || ''}
            </Link>
          </h2>
        </div>

        {/* description */}
        <div>
          {post.frontmatter.description || ''}
        </div>
        <br/>

      </div>
    </div>
  );
};

export default PostLink;
