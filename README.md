# js.la

The static [js.la](http://js.la) pages

Please feel free to fork this and make it better. :yellow_heart: 

# setup

To get js.la working on your local enviroment up and running you will need [nodejs](http://nodejs.org/). After installing clone down the repo.

    $ git clone git@github.com:jsla/js.la.git
    $ cd js.la

Next you will need [Harpjs](http://harpjs.com/) and [Browserify](http://browserify.org/) you can install these by running.

    $ npm install 

Now you should be able to run the site.

    $ npm start

Everything will rebuild automatically except for the Javascript that you will need to run 

    $ npm run build

If you need to create a speaker avatar, we normalize them to be 160x160. Run the command on an existing image that hasn't been converted yet like so

    $ npm run speakerimages -- --imagepath=public/images/speakers/avatarname.jpeg

