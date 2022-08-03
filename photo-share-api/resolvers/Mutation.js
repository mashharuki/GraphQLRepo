module.exports = {

      /**
       * post new photo mutation
       * @param {*} parent 
       * @param {*} args 
       * @returns 
       */
      async postPhoto(parent, args) {
            // create new photo
            var newPhoto = {
                  id: _id++,
                  ...args.input,
                  created: new Date()
            };
            // add
            photos.push(newPhoto)
            return newPhoto
      }
}