import './App.css'
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";
import { useSearchUsername } from './hooks';


function App() {
  const {
    isLoading,
    isReposLoading,
    keyword,
    users,
    repos,
    handleOnClickUserCard,
    handleOnSubmit,
  } = useSearchUsername()
  return (
    <div className='container'>
      <form
        className='search-form'
        onSubmit={handleOnSubmit}
      >
        <input className='search-input' name='keyword' placeholder='Enter username' type='text' />
        <button className='search-button' type='submit'>Search</button>
      </form>
      {users === null ? <></> : isLoading ? <div className="spinner spinner-username" />
        : !users?.length ? <p className='text-center'>No username found</p> : <div className='card-container'>
          <p>Showing users for "{keyword}"</p>
          {users.map(user => (
            <div className='user-card-container' key={user.id}>
              <div className='user-card' onClick={handleOnClickUserCard(user)}>
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
