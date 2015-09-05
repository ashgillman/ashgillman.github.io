---
title: Connecting with Arduino Nano Clone with CH340G (BAITE)
author: Ashley
layout: post
permalink: /connecting-with-arduino-nano-clone-with-ch340g-baite/
categories:
  - Uncategorized
tags:
  - Arduino
  - driver
  - help
---
A while ago the robotics club bought a number of Arduino Nano clones for [Project Mario][1]. We often use clones in our projects because of the very limited budgets we have.<figure id="attachment_106" style="width: 300px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/11/2014-11-06-17.36.51.jpg" data-gallery><img class="wp-image-106 size-medium" src="http://theredwheel.com/wp-content/uploads/2014/11/2014-11-06-17.36.51-e1415260199327-300x139.jpg" alt="BAITE NANO3 BTE14-01 Arduino Nano Clone" width="300" height="139" /></a><figcaption class="wp-caption-text">BAITE NANO3 BTE14-01 Arduino Nano Clone</figcaption></figure> 
However, I was never able to connect on my Mac to them. I could, from a windows PC, connect and upload projects, but the Mac was unable to see any serial device. The same was true for all of the same devices.

By going to Apple Logo > About this Mac > More Info&#8230; > System Report&#8230; > USB, with the device unplugged, plugging it in, then hitting reload (⌘R), I was able to verify that when the device was plugged in it was seen as USB2.0-Serial. After a closer inspection of the underside of the Nano clone, I noted that the board used a serial module I had not heard of, the CH340G.<figure id="attachment_107" style="width: 300px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/11/2014-11-06-17.37.31.jpg" data-gallery><img class="wp-image-107 size-medium" src="http://theredwheel.com/wp-content/uploads/2014/11/2014-11-06-17.37.31-e1415260289828-300x153.jpg" alt="Underside, the chip on the right is CH340G 202685306" width="300" height="153" /></a><figcaption class="wp-caption-text">Underside, the chip on the right is CH340G 202685306</figcaption></figure> 
This device did not work with the FTDI drivers, nor the PL2302 drivers.

<NOTE: Please read the edit below before using the Russian link.>

It took a bit of searching, but I found a <a title="CH340G" href="http://www.5v.ru/ch340g.htm" target="_blank">Russian website</a> with the required drivers. The website looks a little dodgy, but the drivers work so I&#8217;m happy. I just had to scroll down a little and click the link &#8220;USB CH341/CH340 MAC OS32, MAC OS64&#8243;, but there is also Windows and Linux should anyone need the drivers on these systems.

EDIT:

I since noticed that the driver above names the device something like `tty.wch ch341 USB=>RS232 xxxx`, which makes it difficult or even unsuitable to be used in some programs since spaces and special characters like the equal and greater than signs need to be escaped. Further <a title="Stack Exchange" href="http://arduino.stackexchange.com/questions/3700/rename-device-name-ch340-usb-to-serial-mac-os" target="_blank">searching</a> found an <a title="CH340 Driver" href="http://www.wch.cn/downloads.php?name=pro&proid=178" target="_blank">updated driver</a> that fixed this issue. The name is now `tty.wchusbserial1410`.

 [1]: http://theredwheel.com/category/robo-club/project-mario/ "Project Mario"