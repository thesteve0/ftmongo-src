# Vert.x Example Maven Project which has Java, Python, and a spatial feed.

Prequisites:

1) You need an OpenShift account

2) You need Maven installed on your local machine

Create a new OpenShift application with a vert.x cartridge

    rhc app create ftmongo jboss-vertx-2.1 mongodb-2.2 -g medium -s

For best performance and flexibility I used a medium gear and I made it scalable.

**This app works against a temporary API provided by Jason Denizac for buses in Chattanooga.
I did this as a last minute emergency rewrite so the object names still refer to airline flights
rather than buses.** 


Then clone this repo locally.

You need to have Maven installed to build this project.

Then inside the root of the repository do:

    mvn package

This will package up the project into a module. I used a module because there are three
different languages used in the application, JavaScript, Java, and Python. This wasn't required to make
the project but it was more to demonstrate the polyglot nature of vert.x

To deploy the application go into the new directory called _target_. Take the
directory titled "com.openshift~vertx-tracking~0.1" and copy it into the _mod_ directory inside the
git repository _ftmongo_. Then inside the git repository go into the _configuration_ directory
and edit _vertx.env_ file.

Uncomment export vertx_module and make it like this:

  export vertx_module=com.openshift~vertx-tracking~0.1

and comment out the rest of the export lines.

Remove server.js from the git repository.

Now you can do

    git add --all .
    git commit -am "your message"
    git push

When this is finished you should be able to go to

ftmongo-<yourdomain>.rhcloud.com

Remember you may have to wait a few seconds for the first pins to show up because pins aren't drawn
until a set of buses is pushed from the EventBus to index.html

_App.js_ loads the mongo persistor module with all the connection environment variables for the application. 
Inside _FlightPublisher.py_ you can see the code to push the JSON through the persistor into the collection named "buses".
