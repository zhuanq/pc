/**
 * Created by army8735 on 2017/9/21.
 */

import './my.html';
import './index.less';

import My from './My.jsx';
import BotNav from '../component/botnav/BotNav.jsx';

let my = migi.render(
  <My/>,
  '#page'
);
my.load();

migi.render(
  <BotNav/>,
  document.body
);
