import { NavLink } from 'react-router-dom'

import classes from './MainNavigation.module.css'

export function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/settings'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
