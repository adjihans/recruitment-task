import { useState } from 'react'
import './App.css'
import { Octokit } from '@octokit/core'

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

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<SearchUsersResponseType[]>([])
  const octokit = new Octokit({
    auth: import.meta.env.VITE_FINE_GRAINED_PA_ACCESS_TOKEN
  })

  const getUser = async (search: string) => {
    try {
      setIsLoading(true)
      const { data: { items } } = await octokit.request(`GET /search/users?q=${search}&per_page=5`, {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
      setUsers(items)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  return <div className='container'>
    <form className='search-form' onSubmit={(e) => {
      e.preventDefault()
      getUser(search)
    }
    }>
      <input className='search-input' onChange={(event) => {
        const value = event.target.value
        setSearch(value)
      }}
        value={search}
        placeholder='Enter username'
      />
      <button className='search-button' type='submit'>Search</button>
    </form>
    {isLoading ? <p>'Loading...'</p>
      : <div>
        <p>Showing users for "{search}"</p>
        {users.map(user => (
          <div key={user.id}>{user.login}</div>
        ))}
      </div>}
  </div>
}

export default App
