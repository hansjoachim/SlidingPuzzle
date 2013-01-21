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

##License
Sliding Puzzle's source code is released under the GNU GPL v3 (see COPYING for
details). 

Note that dependencies/QUnit includes the QUnit Javascript unit testing
framework, which is copyright jQuery Foundation and other contributors. QUnit is
released under the MIT license, see the headers of dependencies/QUnit/qunit.js
or dependencies/QUnit/qunit.css for details.

##Work in progress
There is a lot of stuff which can and should be improved the the code. However,
before I can change that I need to ensure that I know the code is still working
as expected afterwards and catch potential regressions. Therefore the first
step would be to add a test suite before refactoring parts. For this purpose
I have added the QUnit framework. With proper tests in place I can be more
confident my changes doesn't break anything and easier catch it if they do.

As of this writing some tests have been added, and more is to come.
Unfortunatly, the changes has caused some minor annoyances; such as the
attempts counter not including a number when switching language. This of course
breaks the rule that master should not be broken. However, the bugs are tiny
issues and most of them will soon be fixed (any major breakage will of course
not be integrated). I also think it makes more sense to allow smaller updates
rather than waiting untill everything works before committing. Not ideal, of
course, but should be only minor issues for a short time.

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

