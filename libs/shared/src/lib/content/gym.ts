import {AdminHomeContent, HomeContent, MenuBarContent, UsersContent} from '../types'

export const adminHomeContent: AdminHomeContent = {
  heading: 'Welcome {firstName}firstName{/firstName}! 👋',
  users: 'User list',
}

export const homeContent: HomeContent = {
  heading: 'Welcome',
}

export const usersContent: UsersContent = {
  heading: 'User list',
}

export const menuBarContent: MenuBarContent = {
  admin: {
    users: 'Users',
    home: 'Home',
  },
}
