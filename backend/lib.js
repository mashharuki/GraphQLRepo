const fetch = require('node-fetch');
const fs = require('fs');

/**
 * GitHubへのアクセストークンを要求するためのメソッド
 * @param {*} credentials パスワード
 * @returns 
 */
const requestGithubToken = credentials => 
      fetch(
            'https://github.com/login/oauth/access_token',
            {
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json'
                  },
                  body: JSON.stringify(credentials)
            }
      ).then(res => res.json()); // json形式で返却

/**
 * GitHubのアカウント情報を取得するメソッド
 * @param {*} token アクセストークン
 * @returns 
 */
const requestGithubUserAccount = token => 
      fetch(`https://api.github.com/user?access_token=${token}`)
      .then(res => res.json()); // json形式で返却


/**
 * get Account Info & Access Token
 * @param {*} credentials password
 * @returns 
 */
const authorizeWithGithub = async credentials => {
      // requestGithubToken method call 
      const { access_token } = await requestGithubToken(credentials);
      // git Account Info
      const githubUser = await requestGithubUserAccount(access_token);
      return { ...githubUser, access_token };
}

/**
 * ファイルアップロードメソッド
 * @param {*} stream ファイル本体
 * @param {*} path ファイルパス
 * @returns 
 */
const uploadStream = (stream, path) => 
      new Promise((resolve, reject) => {
            stream.on('error', error => {
                  if (stream.truncated) {
                        fs.unlinkSync(path)
                  }
                  reject(error)
            }).on('end', resolve)
            .pipe(fs.createWriteStream(path))
})


module.exports = {
      // findBy, 
      authorizeWithGithub, 
      // generateFakeUsers, 
      // uploadFile
      uploadStream
}