import { useState } from 'react'
import './App.css'
import { Octokit } from '@octokit/core'
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";

type SearchUsersResponseType = {
  "login": string,
  "id": number,
  "node_id": string,
  "avatar_url": string,
  "gravatar_id": Array<string | null>,
  "url": string,
  "html_url": string,
  "followers_url": string,
  "subscriptions_url": string,
  "organizations_url": string,
  "repos_url": string,
  "received_events_url": string,
  "type": string,
  "score": number,
  "following_url": string,
  "gists_url": string,
  "starred_url": string,
  "events_url": string,
  "public_repos": string,
  "public_gists": string,
  "followers": number,
  "following": number,
  "created_at": string,
  "updated_at": string,
  "name": Array<string | null>,
  "bio": Array<string | null>,
  "email": Array<string | null>,
  "location": Array<string | null>,
  "site_admin": {
    "type": "boolean"
  },
  "hireable": Array<boolean | null>,
  "text_matches": {
    "title": "Search Result Text Matches",
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "object_url": {
          "type": "string"
        },
        "object_type": {
          "type": [
            "string",
            "null"
          ]
        },
        "property": {
          "type": "string"
        },
        "fragment": {
          "type": "string"
        },
        "matches": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "text": {
                "type": "string"
              },
              "indices": {
                "type": "array",
                "items": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    }
  },
  "blog": Array<string | null>,
  "company": Array<string | null>
  "suspended_at": Array<string | null>,
  "user_view_type": string
}

type UserRepositoriesResponseType = {
  allow_forking: boolean;
  archive_url: string;
  archived: boolean;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  clone_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  created_at: string;
  default_branch: string;
  deployments_url: string;
  description: string;
  disabled: boolean;
  downloads_url: string;
  events_url: string;
  fork: boolean;
  forks: number;
  forks_count: number;
  forks_url: string;
  full_name: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  has_discussions: boolean;
  has_downloads: boolean;
  has_issues: boolean;
  has_pages: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  homepage: string;
  hooks_url: string;
  html_url: string;
  id: number;
  is_template: boolean;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  language: string;
  languages_url: string;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  };
  merges_url: string;
  milestones_url: string;
  mirror_url: string;
  name: string;
  node_id: string;
  notifications_url: string;
  open_issues: number;
  open_issues_count: number;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
  };
  permissions: { admin: boolean; maintain: boolean; push: boolean; triage: boolean; pull: boolean; }
  private: boolean;
  pulls_url: string;
  pushed_at: string;
  releases_url: string;
  size: number;
  ssh_url: string;
  stargazers_count: number;
  stargazers_url: number;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  svn_url: string;
  tags_url: string;
  teams_url: string;
  topics: string[];
  trees_url: string;
  updated_at: string;
  url: string;
  visibility: string;
  watchers: number;
  watchers_count: number;
  web_commit_signoff_required: boolean;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState<Array<SearchUsersResponseType & { isOpen: boolean }> | null>(null);
  const [repos, setRepos] = useState<UserRepositoriesResponseType[]>([])
  const octokit = new Octokit({
    auth: import.meta.env.VITE_FINE_GRAINED_PA_ACCESS_TOKEN
  });

  const getUser = async (search: string) => {
    try {
      setIsLoading(true);
      const { data: { items } } = await octokit.request(`GET /search/users?q=${search}&per_page=5`);
      setUsers(items);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getRepos = async (username: string) => {
    try {
      setIsReposLoading(true)
      const { data } = await octokit.request(`GET /users/${username}/repos?per_page=5`);
      setRepos(data)
    } catch (error) {
      console.error(error);
    } finally {
      setIsReposLoading(false)
    }
  }

  return (
    <div className='container'>
      <form
        className='search-form'
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e?.currentTarget)
          const value = formData.get('keyword') as string
          setKeyword(value)
          getUser(value)
        }}
      >
        <input className='search-input' name='keyword' placeholder='Enter username' type='text' />
        <button className='search-button' type='submit'>Search</button>
      </form>
      {users === null ? <></> : isLoading ? <div className="spinner spinner-username" />
        : !users?.length ? <p className='text-center'>No username found</p> : <div className='card-container'>
          <p>Showing users for "{keyword}"</p>
          {users.map(user => (
            <div className='user-card-container' key={user.id}>
              <div className='user-card' onClick={async (e) => {
                e.preventDefault()
                setUsers(prevs => prevs === null ? [] : prevs.map((prev => {
                  if (prev.id !== user.id) return {
                    ...prev,
                    isOpen: false
                  }
                  return {
                    ...prev,
                    isOpen: !prev.isOpen
                  }
                })))
                if (user.isOpen) return
                await getRepos(user.login)
              }}>
                <div className='username-section'>
                  <p>{user.login}</p>
                  <div className='icon-container'>
                    {user.isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
              </div>
              {!user.isOpen ? <></> : isReposLoading ? <div className="spinner spinner-repo" /> : !repos?.length ? <p className='text-center'>No repos found</p>
                : repos.map(repo => (
                  <div className='repo-card' key={repo.id}>
                    <div className='repo-title'>
                      <p className='title'>{repo.name}</p>
                      <div className='star'>{repo.stargazers_count}<IoIosStarOutline /></div>
                    </div>
                    <p className='description'>{repo.description || 'No description added'}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>}
    </div>
  )
}

export default App
