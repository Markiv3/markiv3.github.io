var start = new Date(2021,9,22,1,0,0,0);
        var interval = 2;
        var boss = buildBossArray(interval);

        $(document).ready(function(){
            var bosslen = Object.keys(boss).length;

            $('#timezone').append(getTimezone());

            for(let i = 0, j = bosslen+1; i+bosslen < bosslen * 2; i++){
                $('#slotselect').append('<option>'+(j+i)+'</option>');
            }

            for(const p in boss){
                $('#boss-select').append("<option value='"+p+"'>"+boss[p]+"</option>");
            }
            var start = new Date(2021,9,22,1,0,0,0);
            
            updateTormentors(start, bosslen, boss);
        });

        $('#slotselect').change(function(){
            var weeks = $('#slotselect').val();

            $('#tormentors tbody').empty();

            updateTormentors(start, parseInt(weeks), boss);
        });

        function toBossIndex(now, next, totaltime){
            if(now > 0 && next > 0 && next >= now){
                let diff = next.valueOf()-now.valueOf();
                return ((diff/1000)/60)/60 % totaltime;
            } else {
                return false;
            }
        }

        function getTimezone(){
            var tzstring = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
            var tarray = tzstring.split(' ');
            var ts = '';
            for (let z of tarray){
                ts += z.charAt(0);
            }
            return ts;
        }

        function buildBossArray(interval){
            var barray = ['Sentinel Pyrophus', 'Mugrem the Soul Devourer', 'Kazj The Sentinel', 'Promathiz', 'Sentinel Shakorzeth', 'Intercessor Razzra', 'Gruukuuek the Elder', 'Algel the Haunter', 
                'Malleus Grakizz', 'Gralebboih', 'The Mass of Souls', 'Manifestation of Pain', 'Versya the Damned', 'Zul\'gath the Flayer', 'Golmak The Monstrosity'];
            var a = {};
            index = 0;
            for(let i = 0, b = 0 ; i < barray.length; i++, b+=interval){
                a[b] = barray[i];
            }
            return a;
        }
        
        function updateTormentors(start, num, boss){
            var now = new Date();
            now.setHours(now.getHours(), 0, 0,0);

            var next = new Date();
            next.setHours(next.getHours(), 0, 0,0);

            var hour = now.getUTCHours();

            if(hour % 2 == 0){
                hour++;
                next.setUTCHours(hour);
            } else if (hour % 2 == 1){
                hour += 2;
                
                if(hour > 24){
                    next.setUTCDate(next.getUTCDate() + 1);
                    next.setUTCHours(1);
                } else {
                    next.setUTCHours(hour);
                }
            }

            var totaltime = Object.keys(boss).length * 2;
            var nextBoss = toBossIndex(start, next, totaltime);
            var nBoss = next;

            for(let i = 0; i < num; i++){
                let bindex = nextBoss % totaltime;
                if(i > 0){
                    let h = nBoss.getUTCHours();

                    if(h + 2 > 23){
                        nBoss.setUTCDate(nBoss.getUTCDate() + 1);
                        nBoss.setUTCHours((h+2)%24);
                    } else {
                        nBoss.setUTCHours(h+2);
                    }
                }

                let h = nBoss.getHours();
                let btime = (nBoss.getMonth()+1) + '/' + nBoss.getDate() + ' '+ h%12 + ':00 ' + (h/12 < 1 ? 'AM' : 'PM');

                $('#tormentors tbody').append('<tr><td>' + btime + '</td><td>' + boss[bindex] + '</td></tr>');

                nextBoss += 2;
            }
        }