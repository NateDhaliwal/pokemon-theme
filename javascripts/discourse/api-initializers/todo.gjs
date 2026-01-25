import { apiInitializer } from "discourse/lib/api";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { htmlSafe } from "@ember/template";
import { ajax } from "discourse/lib/ajax";

class FirstPosts extends Component {
  @tracked posts = [];

  constructor() {
    super(...arguments);
    this.loadPosts();
  }

  async loadPosts() {
    console.log("Loading");
    let topicIds = [123, 1807]; // change to your topic IDs
    let posts = [];
    for (let id of topicIds) {
      // const data = await ajax(`/t/${id}.json`);
      // if (data.post_stream && data.post_stream.posts.length > 0) {
      //   posts.push(data.post_stream.posts[0]);
      // }
      let res = await fetch(`/t/${id}.json`);
      let data = await res.json();
      if (data.post_stream && data.post_stream.posts.length > 0) {
        posts.push(data.post_stream.posts[0]);
      }
    }
    this.posts = posts;
  }

  <template>
    {{#each this.posts as |post|}}
      <div class="first-post-preview">
        <h4>{{post.topic_title}}</h4>
        {{htmlSafe post.cooked}}
      </div>
    {{/each}}
  </template>;
}

export default apiInitializer((api) => {
  api.renderInOutlet("discovery-list-container-top", FirstPosts);
});
