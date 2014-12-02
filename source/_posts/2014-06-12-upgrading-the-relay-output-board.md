---
title: Upgrading the Relay Output Board
author: Ashley
layout: post
permalink: /upgrading-the-relay-output-board/
evolve_full_width:
  - no
evolve_slider_type:
  - no
categories:
  - Oversized RC Cars
  - Robo Club
tags:
  - modification
  - prototyping
  - relay
  - Robo Club
---
Continuing work on the [Oversized RC Car Project][1], we last left off after the sprint day. Theoretically the code should be all working, except that we couldn&#8217;t get the MOSFET H-bridge working. We needed this working because the relay board used before this couldn&#8217;t handle the motor stall current.

<a href="http://theredwheel.com/wp-content/uploads/2014/06/relays.jpg" data-gallery><img class="alignnone wp-image-78 size-thumbnail" src="http://theredwheel.com/wp-content/uploads/2014/06/relays-150x150.jpg" alt="Relays" width="150" height="150" /> <img class="alignnone wp-image-79 size-thumbnail" src="http://theredwheel.com/wp-content/uploads/2014/06/relayBottom-150x150.jpg" alt="relayBottom" width="150" height="150" /></a>

Rather than keeping on with the MOSFET design (for now), I went out and ordered some higher current relays. Using the HRM-S-DC5V relays instead of the old M4-5H relays takes the current capacity from 0.5A to 5A, enough for the stall current of 5V. The issue with the newer relays however is a different footprint.

I chose the new relays to have a similar footprint, indeed the NC and NO output pins are the same. The only difference is the relay coil pins are spaced further apart. I was able to deal with this by raising the relays using header strips, then use wires to connect the coil.<figure id="attachment_88" style="width: 150px;" class="wp-caption alignnone">

<a href="http://theredwheel.com/wp-content/uploads/2014/06/modHeader.jpg" data-gallery><img class="size-thumbnail wp-image-88" src="http://theredwheel.com/wp-content/uploads/2014/06/modHeader-150x150.jpg" alt="Removing pins to fit the header" width="150" height="150" /></a><figcaption class="wp-caption-text">Removing pins to fit the header</figcaption></figure> <figure id="attachment_85" style="width: 150px;" class="wp-caption alignnone"><a href="http://theredwheel.com/wp-content/uploads/2014/06/boardWithHeader1.jpg" data-gallery><img class="size-thumbnail wp-image-85" src="http://theredwheel.com/wp-content/uploads/2014/06/boardWithHeader1-150x150.jpg" alt="The board with new headers attached" width="150" height="150" /></a><figcaption class="wp-caption-text">The board with new headers attached</figcaption></figure> <figure id="attachment_89" style="width: 150px;" class="wp-caption alignnone"><a href="http://theredwheel.com/wp-content/uploads/2014/06/RelayWithWire1.jpg" data-gallery><img class="size-thumbnail wp-image-89" src="http://theredwheel.com/wp-content/uploads/2014/06/RelayWithWire1-150x150.jpg" alt="Adding wires" width="150" height="150" /></a><figcaption class="wp-caption-text">Adding wires</figcaption></figure> 
Now that this is working, hopefully we can test the code for the cars soon and have them running for the upcoming open day.<figure id="attachment_86" style="width: 1000px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/06/FinalSide.jpg" data-gallery><img class="wp-image-86 size-full" src="http://theredwheel.com/wp-content/uploads/2014/06/FinalSide.jpg" alt="Finished" width="1000" height="562" /></a><figcaption class="wp-caption-text">Finished</figcaption></figure> 
<a href="http://theredwheel.com/wp-content/uploads/2014/06/FinalTop1.jpg" data-gallery><img class="aligncenter wp-image-87 size-full" src="http://theredwheel.com/wp-content/uploads/2014/06/FinalTop1.jpg" alt="FinalTop" width="1000" height="562" /></a>

 [1]: http://theredwheel.com/category/robo-club/oversized-rc-cars/