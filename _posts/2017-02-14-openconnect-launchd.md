---
title: Managing an Openconnect VPN Connection with launchd on OSX
author: Ashley Gillman
layout: post
tags: OSX, launchd, openconnect, vpn
---

[Openconnect](http://www.infradead.org/openconnect/) is an open source implementation of the Cisco AnyConnect client. It provides easier installation on OSX, via [Homebrew](https://brew.sh/), and, and a command-line interface. In this article I investigate using launchd to manage the connection. This saves having to leave a terminal open with the connection running, or having to look up the PID if running in the background to kill the connection.

Openconnect requires sudo access, so I decided to configure the service as a system daemon. You could also configure the service as a user Agent and configure [openconnct to have password-less sudo priviledges](https://gist.github.com/moklett/3170636).

If your VPN server does not support certificates for authentication, as mine, you will have to save your password to a file. You can do this as follows:

```sh
sudo -e /etc/vpn_secret          # enter your password, with no newlines
sudo chmod og-rw /etc/vpn_secret # remove read/write access from all but root
```

I also ran into a hiccup: launchd ends processes by sending SIGTERM, which is meant to indicate that a program should end gracefully. Unfortunately, openconnect will only close gracefully on a SIGINT signal, and I cannot see a way to configure launchd to change the signal sent. To get around this, I wrote a wrapper to catch a SIGTERM and send a SIGINT to openconnect, saved as `/etc/openconnect_wrapper`.

{% gist 6c833e4962a4c86860b46017fca76702 openconnect_wrapper %}

Make sure this file has execute rights.

```sh
sudo chmod +x /etc/openconnect_wrapper
```

Finally, we can write the job definition to `/Library/LaunchDaemons/vpn.openconnect.plist`, or in `/Library/LaunchAgents` if you decided to use an agent.

{% gist 6c833e4962a4c86860b46017fca76702 vpn.openconnect.plist %}

Replace `__KEYS__` in the above with your specific requirements.

Now the connection can be started and stopped with `sudo launchctl start vpn.openconnect` and `sudo launchctl stop vpn.openconnect`.

### Future work
`launchctl start` and `launchctl stop` are deprecated. If anyone knows the correct way to start and stop these services, please let me know in the comments or via email.

I like to have a visual indicator when I am connected to VPN, and this is one thing I miss about Cisco AnyConnect. I have been playing with [Ubersicht](http://tracesof.net/uebersicht/), so a desktop indicator could be helpful.

