---
title: 'Sprint Day &#8211; Oversized RC Cars'
author: Ashley
layout: post
permalink: /sprint-day-oversized-rc-cars/
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
  - sprint day
---
The club held its first sprint day on Saturday. The sprint was held for the oversized RC car project, but also to test out the sprint day format as a possible standard format for club projects.<figure id="attachment_60" style="width: 1000px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay1.jpg" data-gallery><img class="size-full wp-image-60" src="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay1.jpg" alt="Karl, Drew and Luke working on the Arduino code for the bluetooth comms" width="1000" height="563" /></a><figcaption class="wp-caption-text">Karl, Drew and Luke working on the Arduino code for the bluetooth comms</figcaption></figure> 
The aims of the day were to complete major aspects of the project: Android bluetooth communication code, Arduino bluetooth communication code, Arduino hardware interfacing, Relay replacement with MOSFETs, MOSFET H-bridge design

*   Android bluetooth communication code
*   Arduino bluetooth communication code
*   Arduino hardware interfacing
*   Relay replacement with MOSFETs
*   MOSFET H-bridge design, including PCB design (ready for milling)<figure id="attachment_62" style="width: 1000px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay3.jpg" data-gallery><img class="size-full wp-image-62" src="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay3.jpg" alt="Working on the design for the MOSFET H-bridge" width="1000" height="563" /></a><figcaption class="wp-caption-text">Working on the design for the MOSFET H-bridge</figcaption></figure> <figure id="attachment_61" style="width: 1000px;" class="wp-caption aligncenter"><a href="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay2.jpg" data-gallery><img class="size-full wp-image-61" src="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay2.jpg" alt="Brendan and Jayden troubleshoot the h-bridge design." width="1000" height="563" /></a><figcaption class="wp-caption-text">Brendan and Jayden troubleshoot the h-bridge design.</figcaption></figure> <figure id="attachment_65" style="width: 1000px;" class="wp-caption aligncenter"><a href="http://theredwheel.com/wp-content/uploads/2014/04/SprintDayDesign.jpg" data-gallery><img class="size-full wp-image-65" src="http://theredwheel.com/wp-content/uploads/2014/04/SprintDayDesign.jpg" alt="H-bridge design: Inputs are F (forward on/off), R (reverse on/off), PWMF (forward duty), PWMR (reverse duty). Also implemented was a logic circuit for 2 pin input (direction select and duty)." width="1000" height="562" /></a><figcaption class="wp-caption-text">H-bridge design: Inputs are F (forward on/off), R (reverse on/off), PWMF (forward duty), PWMR (reverse duty). Also implemented was a logic circuit for 2 pin input (direction select and duty).</figcaption></figure> 
In addition to the H-bridge circuitry, logic was implemented to ensure shorting 12V to GND was impossible. This also was able to reduce the required input pins to 2.<figure id="attachment_66" style="width: 1000px;" class="wp-caption aligncenter">

<a href="http://theredwheel.com/wp-content/uploads/2014/04/SprintDayProto.jpg" data-gallery><img class="size-full wp-image-66" src="http://theredwheel.com/wp-content/uploads/2014/04/SprintDayProto.jpg" alt="H-bridge Prototype" width="1000" height="562" /></a><figcaption class="wp-caption-text">H-bridge Prototype</figcaption></figure> 
Due to the higher current, it was decided to prototype the H-bridge using a terminal block. However, this monster ended up taking a lot of time and was very messy. I would recommend a better solution for future reference. Unfortunately, the MOSFET H-bridge design was not complete by the end of the day. We ran out of time for the troubleshooting, though we still managed to find time for lunch and a few beers during the day.

<a href="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay4.jpg" data-gallery><img class="aligncenter size-full wp-image-63" src="http://theredwheel.com/wp-content/uploads/2014/06/SprintDay4.jpg" alt="Sprint Day 4" width="1000" height="563" /></a>