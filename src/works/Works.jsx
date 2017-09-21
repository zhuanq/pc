/**
 * Created by army8735 on 2017/9/21.
 */

import Title from './Title.jsx';
import Author from './Author.jsx';
import Media from './Media.jsx';
import itemTemplate from './itemTemplate';

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  load(worksID) {
    let self = this;
    let title = self.ref.title;
    let media = self.ref.media;
    util.postJSON('api/works/GetWorkDetails', { WorksID: worksID }, function(res) {
      if(res.success) {
        let data = res.data;
        title.title = data.Title;
        title.subTitle = data.sub_Title;
        media.setCover(data.cover_Pic);

        let works = data.Works_Items;
        let workHash = {};
        let workList = [];
        let authorList = [];
        works.forEach(function(item) {
          // 先按每个小作品类型排序其作者
          util.sort(item.Works_Item_Author, itemTemplate(item.ItemType).authorSort || function() {});
          // 将每个小作品根据小类型映射到大类型上，再归类
          let bigType = itemTemplate(item.ItemType).bigType;
          workHash[bigType] = workHash[bigType] || [];
          workHash[bigType].push(item);
        });
        Object.keys(workHash).forEach(function(k) {
          workList.push({
            bigType: k,
            value: workHash[k],
          });
        });
        util.sort(workList, function(a, b) {
          return a.bigType > b.bigType;
        });
        workList.forEach(function(works) {
          let authors = [];
          works.value.forEach(function(work) {
            authors = authors.concat(work.Works_Item_Author);
          });
          // 去重
          let hash = {};
          for(let i = 0; i < authors.length; i++) {
            let author = authors[i];
            let key = author.ID + ',' + author.WorksAuthorType;
            if(hash[key]) {
              authors.splice(i--, 1);
              continue;
            }
            else {
              hash[key] = true;
            }
          }
          // 合并
          hash = {};
          let nAuthors = [];
          authors.forEach(function(author) {
            if(hash.hasOwnProperty(author.WorksAuthorType)) {
              nAuthors[hash[author.WorksAuthorType]].list.push(author);
            }
            else {
              hash[author.WorksAuthorType] = nAuthors.length;
              nAuthors.push({
                type: author.WorksAuthorType,
                list: [author]
              });
            }
          });
          authorList.push(nAuthors);
        });
        self.ref.author.setAuthor(authorList);

        media.setWorks(workList);

        let hasAudio = false;
        let hasVideo = false;
        workList.forEach(function(item) {
          if(item.bigType === 'audio') {
            hasAudio = true;
            $(self.ref.type.element).find('.audio').removeClass('fn-hide');
          }
          else if(item.bigType === 'video') {
            hasVideo = true;
            $(self.ref.type.element).find('.video').removeClass('fn-hide');
          }
        });
        if(hasAudio) {
          $(self.ref.type.element).find('.audio').addClass('cur');
        }
        else if(hasVideo) {
          $(self.ref.type.element).find('.video').addClass('cur');
        }
        // media.popular = data.Popular;
        // intro.tags = data.ReturnTagData || [];
        // $(self.ref.form.element).removeClass('fn-hide');
      }
      else {
        alert(res.message);
      }
    });
  }
  render() {
    return <div class="works">
      <Title ref="title"/>
      <Author ref="author"/>
      <Media ref="media"/>
      <ul class="type" ref="type" onClick={ { li: this.clickType } }>
        <li class="audio fn-hide" rel="audio">音频</li>
        <li class="video fn-hide" rel="video">视频</li>
      </ul>
    </div>;
  }
}

export default Works;