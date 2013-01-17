#Sliding Puzzle

By Hans Joachim Desserud

##Description
A JavaScript implementation of that good old sliding tile puzzle where you push
the tiles around in order to form an image. This version uses numbers instead 
of a picture, though. It was originally written as an assignment in a course
I took in the spring semester 2008. It was tested and found to work in
Internet Explorer, Mozilla Firefox, Opera, Netscape and Safari at the time.

I recently rediscovered this project when going through some boxes in the
digital attic. I always had a plan of putting it up somewhere, because I think
it is a small and neat example. Skimming over the source code reveals that it 
was indeed written a while back, and probably isn't as representative of my
work as it was at the time. Though on the other hand, the code does what it is
supposed to, and as a game it still works great! There is room for improvements
though, and I should probably get round to fixing at least the worst issues.
Hopefully that will take less time than what it took getting it published.

A feature left out from this version, is that it would originally play a sound
when you won or pressed a tile you couldn't move. At the time I couldn't find a
proper cross-browser solution for playing sound, so I removed that part shortly
after the final version had been graded. I may of course reimplement this at
some point, but I'd rather have something working across all browsers than just
some.

##Known issues
From my old notes (not sure if these are still relevant for newer browsers or
if they are simply historical notes at this point):
* Supports zooming in two levels (one of the requirements for the assignment),
but Internet Explorer had some issue with radio buttons and the text, but that
seemed to also be true for other documents with radio buttons.
* The HTML didn't validate, which I of course should fix. (Past self: why
didn't you fix this?)
* As mentioned above, didn't get Safari to play sound. Though sound has been
removed from this version either way.

