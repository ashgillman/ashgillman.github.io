---
title: Introducing the Oversize RC Car Project
author: Ashley
layout: post
permalink: /introducing-the-oversize-rc-car-project/
evolve_full_width:
  - no
evolve_slider_type:
  - no
categories:
  - Oversized RC Cars
  - Robo Club
tags:
  - bluetooth
  - PCB design
  - remote control
---
<a href="http://theredwheel.com/wp-content/uploads/2014/06/ToddlerCars.jpg" data-gallery><img class="aligncenter size-full wp-image-52" src="http://theredwheel.com/wp-content/uploads/2014/06/ToddlerCars.jpg" alt="Toddler cars" width="1000" height="562" /></a>The JCU School of Engineering has two of these toddler cars, and are looking to kit them out into RC cars for use at show days, etc. These cars were used in CC3501 last year as the main project, however neither of the two teams in the class successfully got the cars going.

The [Robo Club][1] has agreed to take on this project this semester, and I will be leading the project. In fact I have already done some work on the project leading up to the beginning of the semester, having designed a relay board for use with an Arduino Pro Mini 5V.

<a href="http://theredwheel.com/wp-content/uploads/2014/06/5V-Relay-Outputs.png" data-gallery><img class="aligncenter size-full wp-image-55" src="http://theredwheel.com/wp-content/uploads/2014/06/5V-Relay-Outputs.png" alt="5V Relay Outputs" width="493" height="745" /></a>

&nbsp;

I used NPN transistor buffers from the output of the Arduino to drive the transistor coils. I did this because I don&#8217;t like the idea of the board driving the coil directly (although it should be possible). I feel safer having the inductive coil somewhat isolated from the circuit by the transistor.<figure id="attachment_53" style="width: 1000px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/06/RelayBreadBoard1.jpg" data-gallery><img class="size-full wp-image-53" src="http://theredwheel.com/wp-content/uploads/2014/06/RelayBreadBoard1.jpg" alt="Bread Board Prototype for bluetooth relay outputs" width="1000" height="563" /></a><figcaption class="wp-caption-text">Bread Board Prototype for bluetooth relay outputs</figcaption></figure> 
&nbsp;<figure id="attachment_54" style="width: 1000px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/06/relayBoard.jpg" data-gallery><img class="size-full wp-image-54" src="http://theredwheel.com/wp-content/uploads/2014/06/relayBoard.jpg" alt="Milled Board" width="1000" height="562" /></a><figcaption class="wp-caption-text">Milled Board</figcaption></figure> 
The relays used here are M4-5H, which are only rated to 0.5A. However, the motors can pull up to 3A stall current. Therefore, the relays aren&#8217;t expected to last. They do the job, however: for now..

This temporary solution is designed to allow the car to be shown off in order to raise interest from Robo Club members to participate in the project.

&nbsp;

 [1]: https://www.facebook.com/groups/JCUrobotics/