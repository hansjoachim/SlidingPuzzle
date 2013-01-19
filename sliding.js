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

        //konstanter
        var maxX = 4;    //antall rader/kolonner i arrayet over tallFeltene
        var maxY = 4;
        var xOrigo = 50;   //hvor radene/kolonnene starter og mellomrommet mellom dem
        var yOrigo = 70;
        var offset = 65;
        var xStorst = (xOrigo + ((maxX-1) * offset) );    //min-/maxverdier et felt kan (i pixler)
        var yStorst = (yOrigo + ((maxY-1) * offset) );
        var antallFeltFlytt = 200;        //antall felt som flyttes når spillet generer en oppgave

        var venteTid = 500;   //minmumsventetid før en knapp flyttes (angitt i millisekunder)
        var delay = 5;       //det lille tidsrommet som så påløper, også i millisekunder

        var emptyX = 0;      //holder orden på posisjonen til det tomme feltet
        var emptyY = 0;

        var merketFelt = null;        //feltet som er merket og flyttes
        var merketFeltFlyttX = 0;
        var merketFeltFlyttY = 0;

        var forsok = 0;           //teller hvor mange forsøk brukeren har brukt
        var gameOver = true;       //om man spiller eller ikke (om man kan bevege feltene)
        var bygger = false;        //om spillet lager en løsning skal man ikke vise "du har vunnet" hvis spillet blir løst
        var justRefreshed = true;  //nettopp lastet siden, vis beskjeden med nedtelling
        var sprak = "En";

        var forsteFlytt = null;    //første og siste flytt, for bruk til angring..
        var sisteFlytt = null;     //..forbundet via en lenket liste (se konstruktor for flytt-objekter)

        function newGame()
        {
            var teller = 0;

            justRefreshed = false;
            forsteFlytt = null;
            sisteFlytt = null;
            document.getElementById('intro').style.display = 'none';
            document.getElementById('feedback').style.display = 'none';

                //går igjennom alle feltene og nullstiller posisjonene til knappene
            for(x=0;x<maxX;x++)
            {
                for(y=0;y<maxY;y++)
                {
                        //sjekker om det er et av feltene med verdi, dvs ikke det siste, tommme feltet
                    if ( ! ( (x*y) == ( (maxX-1) * (maxY-1) ) ) )
                    {
                        document.getElementById("tallFelt"+x+y).style.left = xOrigo + (offset*y) + "px";
                        document.getElementById("tallFelt"+x+y).style.top = yOrigo + (offset*x) + "px";
                    }
                    else //legger inn hvor det tomme feltet er for sjekke når knappene skal flyttes
                    {
                        emptyX = xOrigo + (offset*y);
                        emptyY = yOrigo + (offset*x);
                    }
                } 
            }

            lagOppgave();     //lager en ny oppgave som brukeren skal løse utifra tallfeltene
            bygger = false;   //spillet er ferdig med å bygge, heretter er det spilleren som flytter knappene

            forsok = -1;        //nullstiller antall forsøk
            updateForsok();
        } //end newGame()

                //starter med det tomme feltet, og flytter så knappene i en tilfeldig rekkefølge
        function lagOppgave()
        {
           var antallFlyttet = 0;
           var retning = 0;
           var nyX = emptyX;   //legger inn koordinat-verdiene til det tomme feltet som man beveger seg utifra
           var nyY = emptyY;
           var flytteFelt = "";
           restarted = false;

           gameOver = false;    //spillet er ikke løst ennå (gjør at man kan flytte knappene)
           bygger = true;

           do{
                  /*Velger en tilfeldig retning helt til man har funnet en lovlig en
                  retningene er 0 = nord, 1 = øst, 2 = sør, 3 = vest*/
               do{
                   retning = Math.floor(Math.random() * 4);
                   switch (retning)
                   {
                       case 0:
                            nyX = emptyX;
                            nyY = emptyY - offset;
                            break;
                       case 1:
                            nyX = emptyX + offset;
                            nyY = emptyY;
                            break;
                       case 2:
                            nyX = emptyX;
                            nyY = emptyY + offset;
                            break;
                       case 3:
                            nyX = emptyX - offset;
                            nyY = emptyY;
                            break;
                   } //switch (retning)
               } while (! lovligRetning(nyX,nyY));

                 //henter ut feltet som har den posisjonen som skal flyttes og flytter det
               flytteFelt = getTallFelt(nyX,nyY);
               selectFelt(document.getElementById(flytteFelt));
               antallFlyttet++;    //flyttet en mer

                   //hvis man ved tilfeldig flytting har løst spillet, kaller lagOppgave seg selv (rekursivt kall)
               if (gameOver)
               {
                   restarted = true;
                   lagOppgave();
               }

               //flytter knappene x ganger, hvis man ikke har startet spillet på nytt
           } while ( (antallFlyttet < antallFeltFlytt) && (!restarted) )
        } 

          //returner feltet som har posisjonen (x,y)
        function getTallFelt( xPixler, yPixler)
        {
            currentFelt = null;
            for(x=0;x<maxX;x++)
            {
                for(y=0;y<maxY;y++)
                {
                    currentFelt = document.getElementById("tallFelt"+x+y);

                    if ( (parseInt(currentFelt.style.left) == xPixler) && (parseInt(currentFelt.style.top) == yPixler) )
                    {
                        return "tallFelt"+x+y;
                    }
                } 
            } 

            return null;    //man har ikke funnet noe i loopen
        }

            //sjekker at det er en knapp som _kan_ ha x,y koordinatene, dvs at den er mellom min og maksverdiene
        function lovligRetning(x, y)
        {
            if ( (x >= xOrigo) && (x <= xStorst) && (y >= yOrigo) && (y <= yStorst) )
            {
               return true;
            }
            else
            {
               return false;
            }
        }

            /*sjekker om alle feltenes gjeldende verdi er den samme som den skal være,
             isåfall er spillet ferdig og brukeren har vunnet*/
        function checkWin()
        {
            var vunnet = true;

            curX = 0;
            curY = 0;

            for(x=0;x<maxX;x++)
            {
                for(y=0;y<maxY;y++)
                {
                        //sjekker om det er et av feltene med verdi, dvs ikke det siste, tommme feltet
                    if ( ! ( (x*y) == ( (maxX-1) * (maxY-1) ) ) )
                    {
                        curX = parseInt(document.getElementById("tallFelt"+x+y).style.left);
                        curY = parseInt(document.getElementById("tallFelt"+x+y).style.top);

                             //sjekker om den gjeldende posisjonen til knappen er der den skal være
                        if ( ( curX == (xOrigo + (offset*y)) ) && (curY == (yOrigo + (offset*x)) ) )
                        {
                            vunnet = true;
                        }
                        else
                        {
                            vunnet = false;
                            break;
                        }
                    } 
                }

                    //hvis en knapp har blitt registrert i en posisjon der man ikke kan vinne, er det ingen vits i å sjekke resten
                if (!vunnet)
                {
                    break;
                }
            }

            if (vunnet)
            {
                gameOver = true;

                if (!bygger)   //hvis det ikke er under byggefasen får brukeren tilbakemelding
                {
                    document.getElementById('feedback').style.display = 'block';
                }

            }
        } 

        function selectFelt(obj)
        {
            selectFelt(obj, false);
        }

        function selectFelt(obj, angrer)
        {
                 //kan ikke bevege knappene med mindre spillet ikke er løst
                 //og enten spillet lager en oppgave eller ingen andre knapper blir flyttet akkurat nå
            if (!gameOver && (bygger || (null == merketFelt) ) )
            {
                var curX = parseInt(obj.style.left);
                var curY = parseInt(obj.style.top);

                var moved = false;

                if ( (emptyX == (curX + offset) ) && (emptyY == curY) )        //høyre
                {
                    merketFelt = obj;
                    merketFeltFlyttX = +1;
                    merketFeltFlyttY = 0;

                    moveFelt(angrer);
                    moved = true;
                }
                else if ( (emptyX == (curX-offset) ) && (emptyY == curY) )     //venstre
                {
                    merketFelt = obj;
                    merketFeltFlyttX = -1;
                    merketFeltFlyttY = 0;

                    moveFelt(angrer);
                    moved = true;
                }
                else if ( (emptyX == curX) && (emptyY == (curY + offset)) )    //ned
                {
                    merketFelt = obj;
                    merketFeltFlyttX = 0;
                    merketFeltFlyttY = +1;

                    moveFelt(angrer);
                    moved = true;
                }
                else if ( (emptyX == curX) && (emptyY == (curY - offset)) )    //opp
                {
                    merketFelt = obj;
                    merketFeltFlyttX = 0;
                    merketFeltFlyttY = -1;

                    moveFelt(angrer);
                    moved = true;
                }

                if (moved)
                {
                    emptyX = curX;
                    emptyY = curY;

                    if(!angrer){
                    updateForsok();
                    }

                    checkWin();
                }
                else     //ble ingen knapp flyttet
                {}
            } 
        } 

          /*legger til en og viser den nye summen av antall forsøk brukeren har gjort
          blir ikke oppdatert når spillet lager en oppgave*/
        function updateForsok()
        {
            if (!bygger)
            {
                forsok++;
                if ("Nor" == sprak)
                {
                    document.getElementById("teller").innerHTML = "Antall&nbsp;forsøk:&nbsp;" + forsok;
                }
                else if ("En" == sprak)
                {
                    document.getElementById("teller").innerHTML = "Attempts:&nbsp;" + forsok;
                }
            }
        }

            //flytter feltet angitt i merketFelt i retningen angitt ved hjelp av merketFeltFlyttX og merketFeltFlyttY
            //Hvis det er når en bruker flytter et felt, vil bevegelsen ikke synes før en viss tid har gått,
            //dette gjelder ikke når spillet selv lager en oppgave, siden bevegelsene da ikke skal vises.
        function moveFelt(angrer)
        {
                 //hvis det ikke er byggefasen, markeres feltet med farge
            if (!bygger)
            {
                merketFelt.style.backgroundColor = "#3333ff";
            }

            for(i = 0; i < offset; i++)
            {
                if ( 0 != merketFeltFlyttX )
                {
                    if (bygger)
                    {merketFelt.style.left = parseInt(merketFelt.style.left) + merketFeltFlyttX + 'px';}
                    else
                    {var t = setTimeout("merketFelt.style.left = parseInt(merketFelt.style.left) + merketFeltFlyttX + 'px'", (venteTid + (delay * i)));}
                }
                else if ( 0 != merketFeltFlyttY)
                {
                    if (bygger)
                    {merketFelt.style.top = parseInt(merketFelt.style.top) + merketFeltFlyttY + 'px';}
                    else
                    {var t = setTimeout("merketFelt.style.top = parseInt(merketFelt.style.top) + merketFeltFlyttY + 'px'", (venteTid + (delay * i)));}
                }
            } 

            if (bygger)
            {sluttFlytt(angrer);}
            else
            {
                if(angrer)
                {var t = setTimeout("sluttFlytt(true)", (venteTid + (delay * (offset+1))));}
                else
                {var t = setTimeout("sluttFlytt(false)", (venteTid + (delay * (offset+1))));}
            }
        } 

          //frigjør/nuller ut informasjon når et felt har blitt flyttet,
          //sjekker også om man har vunnet som følge av dette flyttet
        function sluttFlytt(angrer)
        {
            var forrigeFlytt = null;

            if (!bygger && !angrer)
            {
                if (null == forsteFlytt)
                {
                    forsteFlytt = new flytt(merketFelt.id, null);
                    sisteFlytt = new flytt(merketFelt.id, null);
                }
                else
                {
                    forrigeFlytt = forsteFlytt

                    while(null != forrigeFlytt.neste)
                    {
                        forrigeFlytt = forrigeFlytt.neste;
                    }

                    forrigeFlytt.neste = new flytt(merketFelt.id, forrigeFlytt);
                    sisteFlytt = forrigeFlytt.neste;
                }

                //visAngreInfo();
            }

            merketFelt.style.backgroundColor = "";    //fjerner eventuell merking
            merketFelt = null;
            merketFeltFlyttX = 0;
            merketFeltFlyttY = 0;
            checkWin();
        }

            //funksjon for testing, lister ut alle registrerte flytt
        function visAngreInfo()
        {
            var annen;
            var tekst ="";
            annen = forsteFlytt;

            while(null != annen.neste)
            {
                annen = annen.neste;
                if(annen.neste != null)
                {
                    tekst += "\n nok en: " + annen.felt + ", forrige: " + annen.forrige.felt + ", neste: " + annen.neste.felt;
                }
                else
                    tekst += "\n nok en : " + annen.felt + annen.neste;
            }

            alert("forste : " + forsteFlytt.felt + ", neste: " +  tekst + "\n siste : " + sisteFlytt.felt + ", forrige: ");
        }

            //viser feltet med instuksjoner for spillet, venter 15 sek og skjuler det igjen
        function instruksjoner()
        {
         document.getElementById("info").style.display = "block";
         setTimeout("document.getElementById('info').style.display = 'none'", 15000);
        }

            //endrer hastigheten på brikkeflytting
        function endreHastighet(nyHastighet)
        {
            if ("Rask" == nyHastighet)
            {
                venteTid = 0;
                var delay = 1;
            }
            else if("Vanlig" == nyHastighet)
            {
                venteTid = 500;
                var delay = 5;
            }
        }

            //lagt til pga refresh ville tilbakestille variablene for hastighet og språk,
            //men ikke radiobutton som angir hva bruker har valgt forble det samme
            //setter også opp en nedteller før spillet startes
        function lastSide()
        {
            document.getElementById('speed[0]').checked = true;
            document.getElementById('language[0]').checked = true;
            var t = setTimeout("if (justRefreshed) newGame()", 5000);
            var t = setTimeout("visNedteller(1)", 4000);
            var t = setTimeout("visNedteller(2)", 3000);
            var t = setTimeout("visNedteller(3)", 2000);
            var t = setTimeout("visNedteller(4)", 1000);
        }

        function visNedteller(sekunder)
        {
            var flertall ="";

            if ("Nor" == sprak)
            {
                flertall = (1 == sekunder) ? "sekund..</h4>" : "sekunder...</h4>";

                document.getElementById('intro').innerHTML = "<h3>Velkommen!</h3>" +
                "<h4>Spillet&nbsp;starter&nbsp;om&nbsp;" + sekunder + "&nbsp;" + flertall;
            }
            else if ("En" == sprak)
            {
                flertall = (1 == sekunder) ? "second..</h4>" : "seconds...</h4>";

                document.getElementById('intro').innerHTML = "<h3>Welcome!</h3>" +
                "<h4>The&nbsp;game&nbsp;starts&nbsp;in&nbsp;" + sekunder + "&nbsp;" + flertall;
            }
        }

            /**
            * Et flytt-objekt. Lagrer informasjon om hvilket felt som ble trykket.
            * Er koblet i en lenket liste for angre-mulighet, og vet dermed eventuelle forrige og neste objekter.
            */
        function flytt(_felt, _forrige)
        {
            this.felt = _felt;
            this.forrige = _forrige;
            this.neste = null;
        }

        function angre()
        {
            if ((null != forsteFlytt) && (null == merketFelt))
            {
                if (null != sisteFlytt.forrige)
                {
                    selectFelt(document.getElementById(sisteFlytt.felt), true);
                    sisteFlytt = sisteFlytt.forrige;
                    sisteFlytt.neste = null;
                }
                else
                {
                    selectFelt(document.getElementById(forsteFlytt.felt), true);
                    forsteFlytt = null;
                    sisteFlytt = null;
                }
            }
        }

            //bytter mellom norsk og engelsk språk på teksten presentert for brukeren
        function endreSprak(langTo)
        {
            if ("Nor" == langTo)
            {
                sprak = "Nor";

                document.getElementById("tittel").innerHTML = "Tallklusser av Hans&nbsp;Joachim&nbsp;Desserud";
                document.getElementById("feedback").innerHTML = "<h3>Gratulerer!</h3><h4>Du&nbsp;har&nbsp;vunnet!</h4>";
                document.getElementById("intro").innerHTML = "<h3>Velkommen!</h3><h4>Spillet&nbsp;starter&nbsp;om&nbsp;5&nbsp;sekunder...</h4>";
                document.getElementById("newGame").innerHTML = "Nytt&nbsp;spill";
                document.getElementById("forklaring").innerHTML = "Forklaring";
                document.getElementById("hastighetTittel").innerHTML = "Hastighet:";
                document.getElementById("hastighetVanlig").innerHTML = "Vanlig";
                document.getElementById("hastighetRask").innerHTML = "Rask";
                document.getElementById("sprakTittel").innerHTML = "Språk:";
                document.getElementById("angre").innerHTML = "Angre";
                document.getElementById("teller").innerHTML = "Antall&nbsp;forsøk:&nbsp;" + forsok;
                document.getElementById("info").innerHTML = "Poenget med spillet er å flytte alle knappene med tall til sine opprinnelige plasser.<br />" +
                    "Dette oppnås ved å klikke på den knappen du vil for at den \"skyves\" til det tomme feltet.<br />" +
                    "Når tallene er samlet i stigende rekkefølge fra venstre til høyre, topp til bunn, og det tomme feltet er nederst til høyre, har du vunnet.<br />";
            }
            else if ("En" == langTo)
            {
                sprak = "En";
                document.getElementById("tittel").innerHTML = "Number&nbsp;Scrambler by Hans&nbsp;Joachim&nbsp;Desserud";
                document.getElementById("feedback").innerHTML = "<h3>Congratulations!</h3><h4>You&nbsp;have&nbsp;won!</h4>";
                document.getElementById("intro").innerHTML = "<h3>Welcome!</h3><h4>The&nbsp;game&nbsp;starts&nbsp;in&nbsp;5&nbsp;seconds...</h4>";
                document.getElementById("newGame").innerHTML = "New&nbsp;game";
                document.getElementById("forklaring").innerHTML = "Explanation";
                document.getElementById("hastighetTittel").innerHTML = "Speed:";
                document.getElementById("hastighetVanlig").innerHTML = "Normal";
                document.getElementById("hastighetRask").innerHTML = "Quick";
                document.getElementById("sprakTittel").innerHTML = "Language:";
                document.getElementById("angre").innerHTML = "Undo";
                document.getElementById("teller").innerHTML = "Attempts:&nbsp;" + forsok;
                document.getElementById("info").innerHTML = "The goal of the game is to move all the numbered buttons back to their respectful places.<br />" +
                "This is achieved by pressing the button you want to \"glide\" to the empty space<br />" +
                "When the numbers has been gathered in order from left to right, top to bottom, and the empty space is down in the right corner, you've won. <br/>";
            }
        }
