---
title: 'Bluetooth controlled Zumo&#8217;s from a Pi'
author: Ashley
layout: post
permalink: /bluetooth-controlled-zumos-from-a-pi/
evolve_full_width:
  - no
evolve_slider_type:
  - no
categories:
  - Project Mario
---
As the first stage of Project Mario, I will implement bluetooth control of a Polulo Zumo using a controller from a USB joystick attached to a Raspberry Pi.

The USB dongle I&#8217;m using is called a Bluetooth CSR 4.0 Dongle, which is a very cheap BT 4.0 compatible dongle. I actually forgot to check ahead of time it was compatible with the Pi, but luckily enough it is. The BT receiver on the Zumo used is a HC-05 (kindly lent by Brendan Calvert). Finally, the joystick is a cheap Playstation 2 imitation USB controller, bought on the cheap from eBay.

The first step I took was to ensure I could read the joystick on the Pi. I decided to read the joystick using the <a href="http://www.pygame.org/news.html" target="_blank">pygame</a> joystick module. I found a simple piece of test code <a href="http://www.raspberrypi.org/forums/viewtopic.php?f=78&t=43589" target="_blank">here</a>, which ran successfully on the Pi except that I ran it from command line and therefore couldn&#8217;t hit the close button to quit (ctrl-c didn&#8217;t work either).

The next step was to send some test serial messages over bluetooth. As my test receiver I used an Arduino connected to my laptop, with the HC-05 tx and rx connected to pins 8 and 9. I simply used the <a href="https://www.pjrc.com/teensy/td_libs_AltSoftSerial.html" target="_blank">AltSoftwareSerial</a> example, which relayed any received messages from one serial connection to another so I could monitor any received massages. Setup and testing of the bluetooth module was done using the process outlined <a href="http://blog.dawnrobotics.co.uk/2013/11/talking-to-a-bluetooth-serial-module-with-a-raspberry-pi/" target="_blank">here</a>.

I already had code that would control a Zumo over bluetooth using a computer keyboard, implemented using the <a href="http://lightblue.sourceforge.net/" target="_blank">lightblue</a> bluetooth module for Mac and Tkinter to get keyboard input. Now was just a simple case of modifying the output to use the serial module and pygame joystick input as in the above examples. I also found <a href="http://nullege.com/codes/show/src%40c%40r%40crazyflie-clients-python-HEAD%40lib%40cfclient%40utils%40pygamereader.py/134/pygame.joystick.init/python" target="_blank">this</a> code, a module for controlling a quad-rotor using similar joysticks, very useful.

Here is the result:

https://github.com/jcuroboclub/Project-Mario/blob/master/Pi/test/BTcontrol.py

https://github.com/jcuroboclub/Project-Mario/blob/master/Zumo/BT\_basicCtrl/BT\_basicCtrl.ino



&nbsp;