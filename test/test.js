/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    Copyright (C) 2008, 2013 Hans Joachim Desserud

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

module("translations", {
  setup: function () {
    this.translations = {
      "nb" : {
        "example": "This is the translated content"
      }
    };
    init();
  }
});
test("can change language of an element", 2, function () {
  var e = document.getElementById("example");
  equal(e.innerHTML, "This is the original content");
  changeLanguage(this.translations, "nb");
  equal(e.innerHTML, "This is the translated content");
});

test("currently used language defaults to english", 1, function () {
  equal(currentLanguage, "en");
});

test("changing language affects currently used language", 1, function () {
  changeLanguage(this.translations, "nb");
  equal(currentLanguage, "nb");
});

//TODO: ensure the attempts display is updated properly when changing languages

module("updater", {
  setup: function () {
    var fixture = document.getElementById("qunit-fixture");
    var e = document.createElement("div");
    e.id = "attempts";
    fixture.appendChild(e);
    this.translations = {
      "nb" : {}
    };
    init();
  }
});

test("updates the background counter on a new attempt", 2, function () {
  updateAttempts();
  equal(SlidingPuzzle.attempts, 1);
  updateAttempts();
  equal(SlidingPuzzle.attempts, 2);
});

test("updates the counter on a new attempt", 2, function () {
  updateAttempts();
  equal(document.getElementById("attempts").innerHTML, "Attempts:&nbsp;1");
  updateAttempts();
  equal(document.getElementById("attempts").innerHTML, "Attempts:&nbsp;2");
});

test("updates the counter in the currently active language", 2, function () {
  changeLanguage(this.translations, "nb");
  updateAttempts();
  equal(document.getElementById("attempts").innerHTML, "Antall&nbsp;forsøk:&nbsp;1");
  updateAttempts();
  equal(document.getElementById("attempts").innerHTML, "Antall&nbsp;forsøk:&nbsp;2");
});

test("counter is not updated if we are setting up a new game", 2, function () {
  SlidingPuzzle.building = true;
  updateAttempts();

  equal(SlidingPuzzle.attempts, 0);
  equal(document.getElementById("attempts").innerHTML, "Attempts:&nbsp;0");
});


module("countdown", {
  setup: function () {
    var fixture = document.getElementById("qunit-fixture");
    var e = document.createElement("div");
    e.id = "countdown";
    fixture.appendChild(e);
    this.translations = {
      "nb" : {
        "countdown": "Spillet starter om... "
      }
    };
  }
});

test("updates the message when counting down to start a game automatically", function () {
  displayCountdown(4);
  equal(document.getElementById("countdown").innerHTML, "The game will start in... 4");
});

//FIXME: need to make sure the number in countdown message is persisted somehow when changing the language
/*test("doesn't changes the language of countdown message and retains number of seconds", function () {
  displayCountdown(4);
  equal(document.getElementById("countdown").innerHTML, "The game will start in... 4");
  changeLanguage(this.translations, "nb");
  equal(document.getElementById("countdown").innerHTML, "Spillet starter om... 4");
});*/

module("speed settings", {
  setup: function () {
    init();
  }
});

test("defaults to normal", function () {
  equal(SlidingPuzzle.speed["delay"], SlidingPuzzle.NORMAL_SPEED["delay"]);
  equal(SlidingPuzzle.speed["duration"], SlidingPuzzle.NORMAL_SPEED["duration"]);
});

test("changes speed", function () {
  changeSpeed(SlidingPuzzle.QUICK_SPEED);
  equal(SlidingPuzzle.speed, SlidingPuzzle.QUICK_SPEED);
});
