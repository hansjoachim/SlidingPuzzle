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
test( "can change language of an element", 2, function () {
  var e = document.getElementById("example");
  equal(e.innerHTML, "This is the original content");
  changeLanguage(this.translations, "nb");
  equal(e.innerHTML, "This is the translated content");
});

test( "currently used language defaults to english", 1, function () {
  equal(currentLanguage, "en");
});

test( "changing language affects currently used language", 1, function () {
  changeLanguage(this.translations, "nb");
  equal(currentLanguage, "nb");
});


module("updater", {
  setup: function () {
    var fixture = document.getElementById("qunit-fixture");
    var e = document.createElement("div");
    e.id = "attempts";
    fixture.appendChild(e);
    this.translations = {
      "nb" : {
        "attempts": "Forsøk:&nbsp;" + attempts
      }
    };
    init();
  }
});

test( "updates the counter on a new attempt", 2, function () {
  updateAttempts();
  equal(document.getElementById("attempts").innerHTML, "Attempts:&nbsp;1");
  updateAttempts();
  equal(document.getElementById("attempts").innerHTML, "Attempts:&nbsp;2");
});


//TODO: updater is aware of the current language,
//TODO: updater doesn't count when building/setting up a board
