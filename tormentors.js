var start = new Date(2021,9,22,1,0,0,0);
var interval = 2;
var boss = buildBossArray(interval);

$(document).ready(function(){
    var bosslen = Object.keys(boss).length;

    $('#timezone').append(getTimezone());
    $('#slotselect').append('<option selected>'+bosslen+'</option>');

    for(let i = 0, j = bosslen+1; i+bosslen < bosslen * 2; i++){
        $('#slotselect').append('<option>'+(j+i)+'</option>');
    }

    for(const p in boss){
        $('#boss-select').append("<option value='"+p+"'>"+boss[p]+"</option>");
    }
    //var start = new Date(2021,9,22,1,0,0,0);
    var start = new Date(Date.parse('2021-07-03T13:00:00Z'));
    
    updateTormentors(start, bosslen, boss);

    loadBossCheckboxes(boss);

    $('input[type="checkbox"][id^="boss-cbox-"]').change(function(){
        var id = this.id.match(/.*\-(\d+)/)[1];
        var weeks = $('#slotselect').val();

        localStorage.setItem(id, $(this).prop("checked") ? 'checked' : '');

        updateTormentors(start, parseInt(weeks), boss);
    });

    $('#select-all').change(function(){
        var weeks = $('#slotselect').val();
        var checked = $(this).prop("checked");

        $('input[type="checkbox"][id^="boss-cbox-"]').prop('checked', checked);
        for(let id in boss){
            localStorage.setItem(id, checked ? 'checked' : '');
        }
        
        updateTormentors(start, parseInt(weeks), boss);
    });

    $('#slotselect').change(function(){
        var weeks = $('#slotselect').val();
    
        updateTormentors(start, parseInt(weeks), boss);
    });
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
    //var barray = ['Sentinel Pyrophus', 'Mugrem the Soul Devourer', 'Kazj The Sentinel', 'Promathiz', 'Sentinel Shakorzeth', 'Intercessor Razzra', 'Gruukuuek the Elder', 'Algel the Haunter', 
    //    'Malleus Grakizz', 'Gralebboih', 'The Mass of Souls', 'Manifestation of Pain', 'Versya the Damned', 'Zul\'gath the Flayer', 'Golmak The Monstrosity'];
    var barray = ['Algel the Haunter', 'Malleus Grakizz', 'Gralebboih', 'The Mass of Souls', 'Manifestation of Pain', 'Versya the Damned', 'Zul\'gath the Flayer', 'Golmak The Monstrosity','Sentinel Pyrophus', 'Mugrem the Soul Devourer', 
    'Kazj The Sentinel', 'Promathiz', 'Sentinel Shakorzeth', 'Intercessor Razzra', 'Gruukuuek the Elder']; 
      
    var a = {};
    index = 0;
    for(let i = 0, b = 0 ; i < barray.length; i++, b+=interval){
        a[b] = barray[i];
    }
    return a;
}

function updateTormentors(start, num, boss){
    $('#tormentors tbody').empty();
    var now = new Date();
    now.setUTCHours(now.getUTCHours(), 0, 0,0);

    var next = new Date();
    next.setUTCHours(next.getUTCHours(), 0, 0,0);

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

        let h = nBoss.getUTCHours();
        var options = {month:'numeric', day:'2-digit', year: '2-digit', hour: 'numeric', minute:'numeric'};
        let btime = nBoss.toLocaleString(undefined, options);
        let checked = localStorage.getItem(bindex) === 'checked';

        if(!checked)
            $('#tormentors tbody').append('<tr><td>' + btime + '</td><td>' + boss[bindex] + '</td></tr>');

        nextBoss += 2;
    }
}

function loadBossCheckboxes(boss){
    var blist = $('#boss-list');
    let entries = Object.entries(boss);
    var sorted = entries.sort((a, b) => {
        var nameA = a[1].toUpperCase();
        var nameB = b[1].toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    for (let e of sorted){
        let checked = localStorage.getItem(e[0]);
        blist.append(bossCheckbox(e[0], e[1], checked));
    }
}

function bossCheckbox(id, boss, checked){
    
    var checkbox = '<div class="form-check">';
    checkbox += '<input class="form-check-input" type="checkbox" value="" id="boss-cbox-'+id+'" '+checked+'></input>';
    checkbox += '<label class="form-check-label" for="boss-cbox-'+id+'">';
    checkbox += boss;
    checkbox += '</label></div>';
    return checkbox;
}