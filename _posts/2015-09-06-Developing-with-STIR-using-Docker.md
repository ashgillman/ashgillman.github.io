---
title: Developing with STIR using Docker
layout: post
tags: STIR, docker
---

# Developing with STIR using Docker

One of the issues I have found with the many open source medical
imaging projects, is that you can very soon find yourself in
dependency hell. It seems just about every project requires a
different version of [ITK](http://www.itk.org/) to work properly.

I also recently heard about [docker](https://www.docker.com/). Docker basically gives you a
development environment (or an anything environment) that runs
completely within a virtual machine. However, it is efficient and
lightweight enough that the [performance](http://domino.research.ibm.com/library/cyberdig.nsf/papers/0929052195DD819C85257D2300681E7B/$File/rc25482.pdf) is not significantly
affected. The end result means that you can automatically and
repeatably set up a development environment in Linux, with all your
required dependencies, but without having to actually install any of
them on your own system. Also, I use OSX at home, and Ubuntu at work,
so I don't have to worry about getting all the dependencies working on
two entirely different systems.

Here are some advantages of using docker.

## Isolated library dependencies

You can find and example [here](https://github.com/ashgillman/STIR-Docker/blob/master/Dockerfile), where I have set up a docker for
running [STIR](http://stir.sourceforge.net/). STIR requires ITK 3, and although it is possible to have
multiple versions installed on your computer, it is much easier to
have the two isolated where possible.

Of course, the commands become a little longer to run. Here is the
code to run STIR's OSMAPOSL reconstruction algorithm:

    docker run --rm -it -v `pwd`:/data -w /data stir:base \
      OSMAPOSL osmaposl_eg.par

The `--rm` flag ensures that the container is deleted once the code
has been run. The `-it` flags tell docker to run interactively and
through a pseudo tty connection respectively, so that we have the
command output echo back to us. The `-v` flag mounts a directory
within the virtual machine. So we are mounting the current working
directory from the host machine to the `/data` folder on the virtual
machine, and the `-w` flag then tells docker to use the `/data`
directory as the virtual machine's working directory. The name of the
container being run is `stir:base`: you will have had to built the
Dockerfile in the STIR-docker repository to be able to access the the
image. And finally, `OSMAPOSL osmaposl_eg.par` is a command, using the
STIR library, to perform a reconstruction.

## Easy installation of tools

Some tools are starting to release themselves in docker form. This is
great for tools you might want to install quickly, unsure whether you
want to commit to having them permanently installed on your
system. Interestingly, this can even be used for GUI tools (at least
on OSX and on Ubuntu, I am yet to try on Windows). One example of
these is [Fiji](http://fiji.sc/Fiji), and release of ImageJ with a number of plugins. ImageJ
is a image viewing tool, written in Java. However, I rarely use Java,
and would prefer not to install it.

[Fiji is available on docker hub](https://hub.docker.com/r/fiji/fiji/), so it is very easy to use. On Ubuntu,
it can be called with:

    xhost +
    docker run --rm -it -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
      -e DISPLAY=$DISPLAY -v `pwd`:/fiji/data fiji/fiji
    xhost -

Be sure to call `xhost -` afterwards, and not to use this method on an
untrusted network .

## Automatic documentation

Using Docker forces you to have a disposable environment with
everything needed to run your program. As such, you end up with
explicit documentation of everything you need to run the program. As
an added bonus, if you do things write the Dockerfile should be
relatively human-readable.

# STIR-Docker

So what does this mean for using STIR? The STIR system set up in
docker is available [on my GitHub page](https://github.com/ashgillman/STIR-Docker). Its usage is documented in the
readme, but it couldn't be easier to get started:

    $ docker build -t stir ~/proj/stir-docker/
    $ alias drun="docker run --rm -v $(pwd | sed 's/ /\\ /g'):/data -w /data"
    $ drun stir OSMAPOSL testdata/PETLM_pointy.par

<div id="footnotes">
<h2 class="footnotes">Footnotes: </h2>
<div id="text-footnotes">

<div class="footdef"><sup><a id="fn.1" name="fn.1" class="footnum" href="#fnr.1">1</a></sup> : (You can find more information on implementing this in a more
secure manner [here](http://stackoverflow.com/a/25334301/3903368)).</div>


</div>
</div>
