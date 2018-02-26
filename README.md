# gsim

### [Try the simulation](https://pfrazee.github.io/gsim/)

## What is this?

This is a little physics simulation which uses time-dilation to create attraction. The interesting part of the simulation is, it's able to create attraction by "bending" time but not space; the internal forces of the orbiting body create a net pull towards the point where time moves slowest.

## Background

A while ago I read a paper about how to handle networked physics with many users, and they suggested using time dilation (like Eve Online) but in one continuous space, so that crowded regions would slow down time in order to handle the load better. I was curious what time dilation would do to your physics engine -- because a 'body' could literally have two or more different tick rates at once -- so I rigged up two point masses connected by a spring-force and applied time dilation. What this ended up doing is modulating the spring-force in such a way that there was a net force on the point-masses that 'pulled' them to the time-dilation center. I thought it was pretty interesting that a mechanism used to handle the propagation of information could end up creating something that behaves like gravity.
