# js.la

The static [js.la](http://js.la) pages

Please feel free to fork this and make it better. :yellow_heart: 

# setup

To get JS.LA working on your local enviroment up and running you will need [nodejs](http://nodejs.org/). After installing clone down the repo.

    $ git clone git@github.com:jsla/js.la.git
    $ cd js.la

Next you will need [Harpjs](http://harpjs.com/) and [Browserify](http://browserify.org/) you can install these by running.

    $ npm install 

Now you should be able to run the site.

    $ npm start

Everything will rebuild automatically except for the Javascript that you will need to run 

    $ npm run build

## notes

Right now we do not have a script to resize images maybe in to future :), but the simpliest way to do it is to have (imagemagick)[http://www.imagemagick.org/] installed. Then run this command on avatars.

```shell
 convert ${SPEAKERDIR}/${USERNAME}.${FILE_EXT} -resize 160x160^ -gravity center -extent 160x160 ${SPEAKERDIR}/${USERNAME}.jpg
```

Then replace those variables with the correct location of the speakers avatars, and the username of the speaker. This will require you to have already placed the avatar in the that directory. Also the old file if its not overwritten should be removed. The size is 160x160 because the largest display size is 80 and 2x dpi would be 160.
