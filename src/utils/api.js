class Api {
  constructor(url) {
    this.url = url;
  }

  async fetchPosts() {
    try {
      const request = new Request(`${this.url}/posts.json`, {
        method: 'get',
      });
      return await this.useRequest(request);

    } catch (error) {
      console.error(error);
    }
  }

  async addPost(post) {
    try {
      const request = new Request(`${this.url}posts.json`, {
        method: 'post',
        body: JSON.stringify(post)
      });
      return await this.useRequest(request);

    } catch (error) {
      console.error(error);
    }
  }

  async deletePostById(id) {
    try {
      const request = new Request(`${this.url}/posts/${id}.json`, {
        method: 'delete'
      });
      return await this.useRequest(request);

    } catch (error) {
      console.error(error);
    }
  }

  async changePostById(id) {

  }

  async useRequest(request) {
    const response = await fetch(request);
    return await response.json();
  }
}

export const apiService = new Api('https://notebook-js-app.firebaseio.com/');