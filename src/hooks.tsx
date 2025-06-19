import { useState } from "react";
import type { SearchUsersResponseType, UserRepositoriesResponseType } from "./type";
import { Octokit } from '@octokit/core'

export const useSearchUsername = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState<Array<SearchUsersResponseType & { isOpen: boolean }> | null>(null);
    const [isReposLoading, setIsReposLoading] = useState(false);
    const [repos, setRepos] = useState<UserRepositoriesResponseType[]>([])
    const octokit = new Octokit();

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

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e?.currentTarget)
        const value = formData.get('keyword') as string
        setKeyword(value)
        getUser(value)
    }

    const handleOnClickUserCard = (user: SearchUsersResponseType & {
        isOpen: boolean;
    }) => async (e: React.MouseEvent<HTMLDivElement>) => {
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
    }

    return {
        isLoading,
        isReposLoading,
        keyword,
        users,
        repos,
        handleOnClickUserCard,
        handleOnSubmit,
    }
}