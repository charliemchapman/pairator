import { combineReducers } from 'redux';
import team from './team';
import stations from './stations';
import users from './users';

export default combineReducers({
  team,
  stations,
  users
});
